from .ai_engine import ask_ai, ask_ai_json, ask_ai_stream
from .languages import LANGUAGE_NAMES

SUBJECT_SYSTEM_PROMPTS = {
    "science": "You are a friendly, conversational CBSE Science mentor. Break down complex topics into clear, easy-to-understand explanations with smart, relatable analogies.",
    "math": "You are a friendly, conversational CBSE Mathematics mentor. Break down every formula step by step logically. Use clean equations and everyday examples.",
    "history": "You are a friendly, conversational CBSE History mentor. Connect historical events clearly, making them interesting and easy to follow like a great story.",
    "geography": "You are a friendly, conversational CBSE Geography mentor. Explain physical and cultural geography concepts in an informal and engaging way.",
    "economics": "You are a friendly, conversational CBSE Economics mentor. Explain concepts using real-world scenarios that students easily understand.",
    "default": "You are a friendly, conversational CBSE mentor. Use clear, simple language and relatable analogies. Maintain an informal, highly engaging tone.",
}


def simplify_text(
    text: str,
    language: str = "en",
    class_level: int = 10,
    subject: str = "default",
    eli10: bool = False,
) -> str:
    lang_name = LANGUAGE_NAMES.get(language, "English")
    system_prompt = SUBJECT_SYSTEM_PROMPTS.get(subject, SUBJECT_SYSTEM_PROMPTS["default"])

    eli10_instruction = (
        "\n\nIMPORTANT: Use the 'Explain Like I'm 10' mode — use the simplest possible words, "
        "very short sentences, and a fun analogy a child would love."
        if eli10
        else ""
    )
    
    language_rule = ""
    if lang_name.lower() != "english":
        language_rule = f"\nCRITICAL INSTRUCTION: You MUST write your ENTIRE explanation in {lang_name} ONLY! You MUST use the native script/alphabet of {lang_name}. Do NOT use English!"

    prompt = f"""
You are explaining NCERT textbook content to a Class {class_level} CBSE student.{language_rule}{eli10_instruction}

Rewrite the following NCERT content to be highly engaging, informal, and incredibly easy to understand.
1. Speak like a friendly, relatable mentor chatting directly with the student in {lang_name}. The tone should be highly conversational and informal, not academic or stiff.
2. Even though the tone is informal, do NOT use cringe slang, overly cheesy greetings, or unnatural colloquialisms in any language.
3. Break down complex ideas into clear, incredibly simple concepts.
4. Use smart, relatable, and creative real-world analogies (everyday life, nature, common experiences) to explain difficult concepts.
5. Highlight key terms by using double asterisks.
6. Structure the explanation with clear paragraphs separated by blank lines.
7. Use plain bullet points starting with - for lists (never use numbers like 1. 2. 3.).
8. Use emojis sparingly and only when relevant to the educational topic. Do NOT overdo it.
9. End with a "Key Takeaway 🎯" summary in 1-2 short, punchy sentences.

STRICT FORMATTING RULES — follow these exactly:
- NEVER use ## or ### or any markdown headings whatsoever
- NEVER start a heading with # symbols
- For section titles, write them as plain bold text on their own line, e.g. **Introduction** on one line, then a blank line, then the content
- Always put a blank line (empty line) between every paragraph, section, and bullet list
- Always put a blank line before and after every bullet list
- Each bullet point must be on its own line starting with -
- Never run two paragraphs together on the same line

NCERT Content:
\"\"\"
{text}
\"\"\"
"""
    return ask_ai(prompt, system_prompt=system_prompt, max_tokens=3000)

def simplify_text_stream(
    text: str,
    language: str = "en",
    class_level: int = 10,
    subject: str = "default",
    eli10: bool = False,
):
    lang_name = LANGUAGE_NAMES.get(language, "English")
    system_prompt = SUBJECT_SYSTEM_PROMPTS.get(subject, SUBJECT_SYSTEM_PROMPTS["default"])

    eli10_instruction = (
        "\n\nIMPORTANT: Use the 'Explain Like I'm 10' mode — use the simplest possible words, "
        "very short sentences, and a fun analogy a child would love."
        if eli10
        else ""
    )
    
    language_rule = ""
    if lang_name.lower() != "english":
        language_rule = f"\nCRITICAL INSTRUCTION: You MUST write your ENTIRE explanation in {lang_name} ONLY! You MUST use the native script/alphabet of {lang_name}. Do NOT use English!"

    prompt = f"""
You are explaining NCERT textbook content to a Class {class_level} CBSE student.{language_rule}{eli10_instruction}

Rewrite the following NCERT content to be highly engaging, informal, and incredibly easy to understand.
1. Speak like a friendly, relatable mentor chatting directly with the student in {lang_name}. The tone should be highly conversational and informal, not academic or stiff.
2. Even though the tone is informal, do NOT use cringe slang, overly cheesy greetings, or unnatural colloquialisms in any language.
3. Break down complex ideas into clear, incredibly simple concepts.
4. Use smart, relatable, and creative real-world analogies (everyday life, nature, common experiences) to explain difficult concepts.
5. Highlight key terms by using double asterisks.
6. Structure the explanation with clear paragraphs separated by blank lines.
7. Use plain bullet points starting with - for lists (never use numbers like 1. 2. 3.).
8. Use emojis sparingly and only when relevant to the educational topic. Do NOT overdo it.
9. End with a "Key Takeaway 🎯" summary in 1-2 short, punchy sentences.

STRICT FORMATTING RULES — follow these exactly:
- NEVER use ## or ### or any markdown headings whatsoever
- NEVER start a heading with # symbols
- For section titles, write them as plain bold text on their own line, e.g. **Introduction** on one line, then a blank line, then the content
- Always put a blank line (empty line) between every paragraph, section, and bullet list
- Always put a blank line before and after every bullet list
- Each bullet point must be on its own line starting with -
- Never run two paragraphs together on the same line
- **CRITICAL**: Do NOT use overly childish or informal pet names (e.g., 'Chellakutty', 'Darling', 'Sweetheart') in any language. Be professional yet highly encouraging.

NCERT Content:
\"\"\"
{text}
\"\"\"
"""
    return ask_ai_stream(prompt, system_prompt=system_prompt, max_tokens=3000)


def detect_subject(text: str, user_class: int | None = None) -> dict:
    """Auto-detect subject, topic, and class level from NCERT text."""
    user_class_hint = ""
    if user_class:
        user_class_hint = f"\n- The student's current registered grade level is Class {user_class}. If the text fits this grade level or contains complex subject matter (such as nationalism, print culture, globalization, chemical equations, etc. which are advanced Class 9-10 topics), you MUST return {user_class} as the 'class_level'. Do NOT fall back to Class 6 unless the text explicitly states it is for Class 6."

    prompt = f"""
You are an expert at identifying NCERT textbook content for Indian CBSE curriculum across all Indian languages (including English, Hindi, Tamil, Telugu, etc.).

Respond ONLY with a valid JSON object matching this exact structure:
{{
  "subject": "science" or "math" or "history" or "geography" or "economics" or "english" or "default",
  "topic": "The exact name of the specific CBSE/NCERT chapter",
  "class_level": 8,
  "confidence": 0.9
}}

Rules for class_level, subject, and topic detection:
- CRITICAL FOR TOPIC DETECTION: Do NOT extract generic unit headers, theme headers, or section dividers (such as "EVENTS AND PROCESSES", "UNIT I", "THEME 1", "SECTION 1"). Instead, always determine and return the actual, specific CBSE/NCERT Chapter Name (e.g., "The Rise of Nationalism in Europe", "Nationalism in India", "Resources and Development", "Chemical Reactions and Equations", etc.) that this text belongs to.
- If the text is a subtopic or a random page from a chapter, map it to the parent Chapter Name from the CBSE curriculum.
- CRITICAL: If the text explicitly states the class level anywhere (e.g., "कक्षा 8", "Class 8", "Class IX", etc.), you MUST extract and use that exact class level integer.
- CRITICAL: Look for textbook names or subjects explicitly mentioned in headers/footers (e.g., "समाज का अध्ययन" means geography).
- "Natural Resources" is geography for Class 8, but science for Class 9.
- Use context clues to identify the correct class level (6 to 12).{user_class_hint}

CRITICAL: Return ONLY valid JSON. Do not include markdown formatting or explanations. Keep the "topic" value in the exact original language of the text.

Text to analyze:
\"\"\"{text[:4000]}\"\"\"
"""
    import json
    
    raw = ask_ai_json(prompt, fast_mode=False)
    try:
        raw_clean = raw.strip()
        if raw_clean.startswith("```json"):
            raw_clean = raw_clean[7:]
        elif raw_clean.startswith("```"):
            raw_clean = raw_clean[3:]
        if raw_clean.endswith("```"):
            raw_clean = raw_clean[:-3]
        raw_clean = raw_clean.strip()
        
        result = json.loads(raw_clean)
        detected = int(result.get('class_level', 10))
        detected = max(6, min(12, detected))
        
        # Normalize subject string to match one of the 7 supported frontend categories
        subj = result.get('subject', 'default').strip().lower()
        if subj in ['science', 'physics', 'chemistry', 'biology']:
            result['subject'] = 'science'
        elif subj in ['math', 'mathematics']:
            result['subject'] = 'math'
        elif subj in ['history', 'civics', 'political science', 'politics', 'social science', 'social studies']:
            result['subject'] = 'history'
        elif subj in ['geography', 'earth science', 'disaster management']:
            result['subject'] = 'geography'
        elif subj in ['economics', 'economy']:
            result['subject'] = 'economics'
        elif subj in ['english', 'literature', 'english literature']:
            result['subject'] = 'english'
        else:
            result['subject'] = 'default'

        # Trust the AI's syllabus-matching capability for class level detection
        result['class_level'] = detected
        return result
    except Exception as e:
        print(f"[detect_subject ERROR] {e} | RAW OUTPUT: {raw}")
        # Fallback if AI completely fails
        return {"subject": "default", "topic": "Unknown", "class_level": 10, "confidence": 0.5}