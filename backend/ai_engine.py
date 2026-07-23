import json
import os
import re

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None
MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
ERROR_PREFIXES = ("Error:", "Groq API Key not configured.")


def _get_response(prompt: str, system_prompt: str = "You are a helpful AI study companion for CBSE students.") -> str:
    if not client:
        return "Groq API Key not configured."

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        return completion.choices[0].message.content
    except Exception as exc:
        return f"Error: {str(exc)}"


def is_ai_error(response: str | None) -> bool:
    if not response or not isinstance(response, str):
        return True
    return response.strip().startswith(ERROR_PREFIXES)


def _compact_text(text: str, limit: int = 720) -> str:
    compact = re.sub(r"\s+", " ", text or "").strip()
    if len(compact) <= limit:
        return compact
    return f"{compact[:limit].rstrip()}..."


def _first_sentence(text: str) -> str:
    compact = _compact_text(text, 360)
    parts = re.split(r"(?<=[.!?])\s+", compact)
    return parts[0] if parts and parts[0] else compact


def _infer_subject(text: str) -> str:
    lower = (text or "").lower()
    subject_terms = {
        "Mathematics": ("equation", "formula", "triangle", "angle", "number", "algebra", "geometry", "graph"),
        "Science": ("photosynthesis", "cell", "atom", "force", "energy", "acid", "base", "chemical", "organism"),
        "Social Science": ("history", "geography", "constitution", "democracy", "economy", "map", "resource"),
        "English": ("poem", "story", "author", "chapter", "grammar", "sentence", "paragraph"),
    }
    for subject, terms in subject_terms.items():
        if any(term in lower for term in terms):
            return subject
    return "General"


def _infer_class_level(text: str) -> str:
    match = re.search(r"\b(?:class|grade)\s*[-:]?\s*(\d{1,2})\b", text or "", re.IGNORECASE)
    if match:
        return f"Class {match.group(1)}"
    return "Unknown"


def _language_template(language_mode: str) -> dict:
    mode = (language_mode or "English").lower()
    templates = {
        "hindi": {
            "offline": "AI model abhi available nahi hai, isliye yeh local starter explanation hai.",
            "main": "Is page ka main idea:",
            "steps": "Kaise padhein:",
            "step_items": [
                "Pehle heading aur bold words identify karein.",
                "Definitions ko apne words mein bolkar dekhein.",
                "Formula, diagram, ya example ko notebook mein alag likhein.",
            ],
            "doubt": "AI model abhi connect nahi hai. Text ka heading, formula, ya confusing line bhej do, main usko simpler steps mein tod dunga.",
        },
        "hinglish": {
            "offline": "AI model abhi available nahi hai, isliye yeh local starter explanation hai.",
            "main": "Is page ka main idea:",
            "steps": "Kaise padhein:",
            "step_items": [
                "Heading aur bold words pehle pakdo.",
                "Definitions ko apni language mein repeat karo.",
                "Formula, diagram, ya example ko notebook mein side se likho.",
            ],
            "doubt": "AI model abhi connect nahi hai. Confusing line bhejo, main usko simpler steps mein tod dunga.",
        },
        "tamil": {
            "offline": "AI model ippodhu available illai; idhu local starter explanation.",
            "main": "Indha page oda main idea:",
            "steps": "Eppadi padikka:",
            "step_items": [
                "Heading matrum bold words-ai mudhalil paarunga.",
                "Definitions-ai unga own words-la solli paarunga.",
                "Formula, diagram, example-ai notebook-la separate-a ezhudhunga.",
            ],
            "doubt": "AI model ippo connect aagala. Confusing line anuppunga; naan simpler steps-a break panniduven.",
        },
        "tanglish": {
            "offline": "AI model ippodhu available illa; idhu local starter explanation.",
            "main": "Indha page oda main idea:",
            "steps": "Eppadi padikka:",
            "step_items": [
                "Heading and bold words first paarunga.",
                "Definitions-a unga own words-la repeat pannunga.",
                "Formula, diagram, example-a notebook-la separate-a ezhudhunga.",
            ],
            "doubt": "AI model ippo connect aagala. Confusing line anuppunga; naan simpler steps-a break panniduven.",
        },
        "simple english": {
            "offline": "The AI model is not available yet, so this is a simple local explanation.",
            "main": "Main idea of this page:",
            "steps": "How to study it:",
            "step_items": [
                "Look at the heading and bold words first.",
                "Say each definition in your own words.",
                "Write any formula, diagram, or example separately.",
            ],
            "doubt": "The AI model is not connected yet. Send the confusing line and I will break it into simple steps.",
        },
    }
    return templates.get(mode, {
        "offline": "The AI model is not available yet, so this is a local starter explanation.",
        "main": "Main idea of this page:",
        "steps": "How to study it:",
        "step_items": [
            "Read the heading and bold words first.",
            "Turn definitions into your own words.",
            "Copy formulas, diagrams, and examples into a small revision note.",
        ],
        "doubt": "The AI model is not connected yet. Send the confusing line and I will break it into simpler steps.",
    })


def _local_explanation(text: str, language_mode: str, reason: str | None = None) -> dict:
    subject = _infer_subject(text)
    class_level = _infer_class_level(text)
    template = _language_template(language_mode)
    page_idea = _first_sentence(text) or "The scanned page has text, but it needs a clearer crop for a stronger explanation."
    reason_line = f"\n\n> Backend note: {reason}" if reason else ""
    steps = "\n".join(f"- {item}" for item in template["step_items"])

    explanation = (
        f"Subject: {subject}, Class: {class_level}\n\n"
        f"**{template['offline']}**{reason_line}\n\n"
        f"## {template['main']}\n"
        f"{page_idea}\n\n"
        f"## {template['steps']}\n"
        f"{steps}\n\n"
        "## Quick revision\n"
        f"- Key text: {_compact_text(text, 260)}\n"
        "- Ask a doubt with the exact line you want explained."
    )

    return {
        "explanation": explanation,
        "subject": subject,
        "class_level": class_level,
        "is_fallback": True,
    }


def _fallback_quiz(text: str, language_mode: str) -> str:
    template = _language_template(language_mode)
    page_idea = _first_sentence(text) or "the uploaded page"
    quiz = [
        {
            "question": f"{template['main']} {page_idea}",
            "options": [
                page_idea,
                "Only the page number",
                "Only the file name",
                "Only the upload date",
            ],
            "answer": page_idea,
            "explanation": "This question checks whether the main idea was identified from the scanned text.",
        },
        {
            "question": "What should you do first while revising this page?",
            "options": template["step_items"] + ["Ignore all headings"],
            "answer": template["step_items"][0],
            "explanation": "Headings and highlighted words usually show what the page is about.",
        },
    ]
    return json.dumps(quiz, ensure_ascii=False)


def _fallback_flashcards(text: str) -> str:
    subject = _infer_subject(text)
    cards = [
        {"front": "Main idea", "back": _first_sentence(text) or "Review the clearest sentence from the page."},
        {"front": "Subject", "back": subject},
        {"front": "Revision tip", "back": "Write the heading, key terms, and one example in your own words."},
    ]
    return json.dumps(cards, ensure_ascii=False)


def generate_explanation(text: str, language_mode: str) -> dict:
    system_prompt = (
        "You are an expert CBSE teacher who explains complex concepts in a simple, friendly manner. "
        f"You MUST respond in {language_mode}. Use relatable Indian examples."
    )
    mode = language_mode.lower()
    if mode == "hindi":
        system_prompt += " Write fully in Hindi using Devanagari script."
    elif mode == "tamil":
        system_prompt += " Write fully in Tamil using Tamil script."
    elif mode == "simple english":
        system_prompt += " Use very short sentences and easy words for younger students."
    elif mode == "hinglish":
        system_prompt += " Blend Hindi and English naturally."
    elif mode == "tanglish":
        system_prompt += " Blend Tamil and English naturally."

    prompt = (
        "Explain the following textbook page content simply:\n\n"
        f"{text}\n\n"
        "Include any formula breakdowns or diagram descriptions if present. "
        "Also identify the subject and likely class level at the very beginning in this format: "
        "Subject: [Subject], Class: [Class Level]."
    )

    response = _get_response(prompt, system_prompt)
    if is_ai_error(response):
        return _local_explanation(text, language_mode, response)

    subject = "Unknown"
    class_level = "Unknown"

    for line in response.split("\n")[:5]:
        if line.startswith("Subject:"):
            parts = line.split(",")
            subject = parts[0].replace("Subject:", "").strip() or subject
            if len(parts) > 1 and "Class:" in parts[1]:
                class_level = parts[1].replace("Class:", "").strip() or class_level

    return {
        "explanation": response,
        "subject": subject,
        "class_level": class_level,
        "is_fallback": False,
    }


def generate_quiz(text: str, language_mode: str = "English") -> str:
    system_prompt = (
        "You are an AI that generates educational JSON data. "
        f"Output ONLY raw JSON, without markdown blocks. Write student-facing text in {language_mode}."
    )
    prompt = f"""Generate a 5-question multiple choice quiz based on the following text.
Format as JSON array of objects with keys: "question", "options" (array of 4 strings), "answer" (string matching one option), "explanation" (short reason).
Text:
{text}
"""
    response = _get_response(prompt, system_prompt)
    return _fallback_quiz(text, language_mode) if is_ai_error(response) else response


def generate_flashcards(text: str, language_mode: str = "English") -> str:
    system_prompt = (
        "You are an AI that generates educational JSON data. "
        f"Output ONLY raw JSON, without markdown blocks. Write student-facing text in {language_mode}."
    )
    prompt = f"""Generate 5 to 10 flashcards for key terms, definitions, or formulas from the following text.
Format as JSON array of objects with keys: "front" (term), "back" (definition).
Text:
{text}
"""
    response = _get_response(prompt, system_prompt)
    return _fallback_flashcards(text) if is_ai_error(response) else response


def doubt_chat(context: str, query: str, language_mode: str) -> str:
    system_prompt = f"You are a friendly senior student helping a younger student. You must respond in {language_mode}. Context: {context}"
    mode = language_mode.lower()
    if mode == "hindi":
        system_prompt += " Write fully in Hindi using Devanagari script."
    elif mode == "tamil":
        system_prompt += " Write fully in Tamil using Tamil script."
    elif mode == "simple english":
        system_prompt += " Use very short sentences and easy words."
    elif mode == "hinglish":
        system_prompt += " Blend Hindi and English naturally."
    elif mode == "tanglish":
        system_prompt += " Blend Tamil and English naturally."

    response = _get_response(query, system_prompt)
    if is_ai_error(response):
        return _language_template(language_mode)["doubt"]
    return response
