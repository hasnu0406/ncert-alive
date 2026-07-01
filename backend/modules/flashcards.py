import json
from .ai_engine import ask_ai_json

FLASHCARD_SYSTEM = (
    "You are an expert at creating concise, highly conceptual study flashcards for CBSE students. "
    "Respond with valid JSON only — no markdown, no extra text."
)


def generate_flashcards(text: str, class_level: int = 10, language: str = "en", is_full_doc: bool = False) -> list:
    from .languages import LANGUAGE_NAMES, get_native_script_instruction
    lang_instruction = get_native_script_instruction(language)

    card_count = "Generate 8-10 flashcards covering all the key concepts from across the entire document." if is_full_doc else "Generate 3-4 flashcards covering the most important key terms and concepts."
    
    text_to_use = text[:40000] if is_full_doc else text[:2000]

    prompt = f"""
Create conceptual study flashcards for Class {class_level} CBSE students from the content below.

Guidelines for meaningful flashcards:
1. Focus on core conceptual definitions, formula usage, logical processes, and cause-and-effect relationships.
2. Structure the 'front' as an active recall question or prompt (e.g., 'What is the relationship between...?', 'Why does... happen?').
3. Keep the 'back' concise yet clear and informative.
4. Ensure the difficulty matches Class {class_level} level.

{lang_instruction}

Return a JSON object:
{{
  "flashcards": [
    {{
      "id": 1,
      "type": "term|formula|concept|fact",
      "front": "Term or Question",
      "back": "Definition or Answer",
      "emoji": "relevant emoji"
    }}
  ]
}}

CRITICAL: All JSON keys ('flashcards', 'id', 'type', 'front', 'back', 'emoji') MUST remain in English as shown above. Do NOT translate the keys. Only translate the text values inside the quotes to the native script of {LANGUAGE_NAMES.get(language, "English")}.
CRITICAL: If you use quotes inside the JSON string values, you MUST escape them with a backslash (e.g. use \\\" instead of \").

{card_count}

NCERT Content:
\"\"\"{text_to_use}\"\"\"
"""
    raw = ask_ai_json(prompt, system_prompt=FLASHCARD_SYSTEM, fast_mode=False, max_tokens=3000)
    try:
        data = json.loads(raw)
        return data.get("flashcards", [])
    except Exception:
        try:
            import re
            match = re.search(r'\[.*\]', raw, re.DOTALL)
            if match:
                return json.loads(match.group())
        except Exception:
            pass
        return []
