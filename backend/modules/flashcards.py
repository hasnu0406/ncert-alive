import json
import re
from .ai_engine import ask_ai_json

FLASHCARD_SYSTEM = (
    "You are an expert at creating concise, highly conceptual study flashcards for CBSE students. "
    "Respond with valid JSON only — no markdown, no extra text."
)


def _build_fallback_flashcards(text: str, class_level: int = 10) -> list:
    text_clean = (text or "").strip()
    words = [w for w in re.findall(r'\b[A-Za-z]{4,}\b', text_clean) if w.lower() not in ('this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'which')]
    
    first_sentence = "Review the key concepts in this NCERT chapter."
    if text_clean:
        sentences = [s.strip() for s in re.split(r'[.!?]', text_clean) if len(s.strip()) > 15]
        if sentences:
            first_sentence = sentences[0]

    keyword1 = words[0].capitalize() if len(words) > 0 else "Concept"
    keyword2 = words[1].capitalize() if len(words) > 1 else "Process"
    keyword3 = words[2].capitalize() if len(words) > 2 else "Definition"

    return [
        {
            "id": 1,
            "type": "concept",
            "front": f"What is the significance of {keyword1} in Class {class_level}?",
            "back": first_sentence,
            "emoji": "💡"
        },
        {
            "id": 2,
            "type": "fact",
            "front": f"How is {keyword2} related to {keyword1}?",
            "back": f"{keyword2} works alongside {keyword1} to form the basis of this topic.",
            "emoji": "🔬"
        },
        {
            "id": 3,
            "type": "term",
            "front": f"Key Term: {keyword3}",
            "back": f"Essential concept in the Class {class_level} NCERT syllabus.",
            "emoji": "📖"
        }
    ]


def generate_flashcards(text: str, class_level: int = 10, language: str = "en", is_full_doc: bool = False) -> list:
    from .languages import LANGUAGE_NAMES, get_native_script_instruction
    lang_instruction = get_native_script_instruction(language)

    card_count = "Generate 8-10 flashcards covering all the key concepts from across the entire document." if is_full_doc else "Generate 3-4 flashcards covering the most important key terms and concepts."
    text_to_use = text[:40000] if is_full_doc else text[:2000]

    prompt = f"""
Create conceptual study flashcards for Class {class_level} CBSE students from the content below.

Guidelines for meaningful flashcards:
1. Focus on core conceptual definitions, formula usage, logical processes, and cause-and-effect relationships.
2. Structure the 'front' as an active recall question or prompt.
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

CRITICAL: All JSON keys ('flashcards', 'id', 'type', 'front', 'back', 'emoji') MUST remain in English as shown above.
CRITICAL: If you use quotes inside the JSON string values, escape them with a backslash (e.g. \\").

{card_count}

NCERT Content:
\"\"\"{text_to_use}\"\"\"
"""
    try:
        raw = ask_ai_json(prompt, system_prompt=FLASHCARD_SYSTEM, fast_mode=False, max_tokens=3000)
        try:
            data = json.loads(raw)
            return data.get("flashcards", [])
        except Exception:
            import re
            match = re.search(r'\[.*\]', raw, re.DOTALL)
            if match:
                return json.loads(match.group())
            return _build_fallback_flashcards(text, class_level)
    except Exception as e:
        print(f"[flashcards] AI call failed: {e}. Using smart fallback flashcards.")
        return _build_fallback_flashcards(text, class_level)
