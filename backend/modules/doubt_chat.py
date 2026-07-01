from .ai_engine import ask_ai
from database import chats_collection
from datetime import datetime
from .languages import LANGUAGE_NAMES, get_native_script_instruction

SYSTEM_PROMPT = """You are NCERT AI, a friendly and encouraging CBSE tutor bot for students (Class 6–12).
- You have access to the text content extracted from the student's uploaded document/PDF in the system message.
- If the student asks you to analyze their uploaded content, file, or PDF, analyze the text provided in the system message, summarize or explain it as requested, and confirm you have analyzed it (e.g. say 'Done! I have analyzed the uploaded content.').
- Answer doubts clearly, warmly, and without judgment.
- Use simple, direct, and professional language (strictly avoid silly, forced analogies like cricket, chai, auto-rickshaws, or festivals).
- Use clear, intuitive, and universal real-world examples (like gravity pulling an apple, magnetism, or earth orbiting the sun).
- Keep answers concise but complete — avoid walls of text.
- If a student seems confused, offer to explain differently.
- Use emojis occasionally to be friendly 😊.
- Respond in the language specified by the user.
"""


def generate_chat_title(question: str) -> str:
    from openai import OpenAI
    import os
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY", "")
    )
    prompt = f"Generate a short, concise title (max 4 words) for a chat conversation that starts with this question. Do not include quotes or punctuation:\n\n{question}"
    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=20,
        )
        return response.choices[0].message.content.strip().replace('"', '')
    except Exception:
        return question[:25] + "..."


async def get_session_history(session_id: str, context: str = "", user_id: str = "", page_id: str = "") -> list:
    doc = await chats_collection.find_one({"sessionId": session_id})
    if doc:
        history = doc.get("history", [])
        update_doc = {}
        if user_id and doc.get("userId") != user_id:
            update_doc["userId"] = user_id
        if page_id and doc.get("pageId") != page_id:
            update_doc["pageId"] = page_id

        if context:
            context_msg = f"This is the text content from the document/PDF uploaded by the user. Use this as your knowledge base to answer the user's questions:\n\n{context[:25000]}"
            system_idx = -1
            for idx, msg in enumerate(history):
                if msg["role"] == "system" and "uploaded by the user" in msg["content"]:
                    system_idx = idx
                    break
            if system_idx != -1:
                history[system_idx]["content"] = context_msg
            else:
                history.insert(0, {"role": "system", "content": context_msg})
            update_doc["history"] = history

        if update_doc:
            update_doc["updatedAt"] = datetime.utcnow()
            await chats_collection.update_one({"sessionId": session_id}, {"$set": update_doc})
        return history

    history = []
    if context:
        context_msg = f"This is the text content from the document/PDF uploaded by the user. Use this as your knowledge base to answer the user's questions:\n\n{context[:25000]}"
        history.append({
            "role": "system",
            "content": context_msg
        })

    await chats_collection.insert_one({
        "sessionId": session_id,
        "userId": user_id,
        "pageId": page_id,
        "title": "New Chat",
        "history": history,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    })
    return history


async def save_session_history(session_id: str, history: list):
    await chats_collection.update_one(
        {"sessionId": session_id},
        {
            "$set": {
                "history": history,
                "updatedAt": datetime.utcnow()
            }
        }
    )


async def chat(session_id: str, question: str, context: str = "", language: str = "en", user_id: str = "", page_id: str = "") -> str:
    history = await get_session_history(session_id, context, user_id, page_id)
    lang_instruction = get_native_script_instruction(language)

    system = SYSTEM_PROMPT + f"\n{lang_instruction}"

    messages = [{"role": "system", "content": system}]
    
    # Extract and append the PDF context message if present in history or parameters
    pdf_context = context
    if not pdf_context:
        for msg in history:
            if msg["role"] == "system" and "uploaded by the user" in msg["content"]:
                pdf_context = msg["content"]
                break
    if pdf_context:
        if "uploaded by the user" not in pdf_context:
            pdf_context = f"This is the text content from the document/PDF uploaded by the user. Use this as your knowledge base to answer the user's questions:\n\n{pdf_context[:25000]}"
        messages.append({"role": "system", "content": pdf_context})

    convo = [m for m in history if m["role"] != "system"][-10:]
    messages.extend(convo)
    messages.append({"role": "user", "content": question})

    from openai import OpenAI
    import os
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY", "")
    )
    response = client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=messages,
        temperature=0.7,
        max_tokens=800,
    )
    answer = response.choices[0].message.content

    history.append({"role": "user", "content": question})
    history.append({"role": "assistant", "content": answer})
    
    update_data = {
        "history": history,
        "updatedAt": datetime.utcnow()
    }
    
    doc = await chats_collection.find_one({"sessionId": session_id})
    if doc and (doc.get("title") == "New Chat" or not doc.get("title")):
        title = generate_chat_title(question)
        update_data["title"] = title
        
    await chats_collection.update_one({"sessionId": session_id}, {"$set": update_data})

    return answer


async def clear_session(session_id: str):
    await chats_collection.delete_one({"sessionId": session_id})


