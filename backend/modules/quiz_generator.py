import json
from .ai_engine import ask_ai_json

QUIZ_SYSTEM = (
    "You are an expert CBSE exam question setter. You generate highly conceptual, "
    "thought-provoking, and syllabus-aligned multiple choice and text-based questions "
    "that test deep understanding of the content, avoiding trivial recall questions. "
    "Output must be in valid JSON only. No markdown fences, no extra text — pure JSON object."
)


def generate_quiz(text: str, class_level: int = 10, language: str = "en", is_full_doc: bool = False) -> dict:
    from .languages import LANGUAGE_NAMES, get_native_script_instruction
    lang_instruction = get_native_script_instruction(language)

    question_counts = "Generate 8 MCQs, 3 fill-in-the-blanks, and 2 one-liner questions." if is_full_doc else "Generate 3 MCQs, 1 fill-in-the-blank, and 1 one-liner."
    
    text_to_use = text[:40000] if is_full_doc else text[:2000]

    prompt = f"""
Generate a high-quality CBSE conceptual quiz for Class {class_level} students based on the NCERT text below.

Guidelines for meaningful questions:
1. Focus on core concepts, cause-and-effect relationships, and practical applications of the material. Avoid trivial detail questions (e.g. spelling, minor dates, page layout).
2. Options MUST be highly plausible, testing common student misconceptions, making the student think.
3. For each question, provide a detailed, rich 'explanation' explaining the reasoning behind the correct answer to help the student learn.
4. Ensure the vocabulary and difficulty match Class {class_level} level.

{lang_instruction}

Return a JSON object with this exact structure:
{{
  "mcq": [
    {{
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A) ...",
      "explanation": "..."
    }}
  ],
  "fill_blanks": [
    {{
      "question": "The ___ is responsible for ...",
      "answer": "...",
      "explanation": "..."
    }}
  ],
  "one_liners": [
    {{
      "question": "...",
      "answer": "..."
    }}
  ]
}}

CRITICAL: All JSON keys ('mcq', 'question', 'options', 'answer', 'explanation', 'fill_blanks', 'one_liners') MUST remain in English as shown above. Do NOT translate the keys. Only translate the text values inside the quotes to the native script of {LANGUAGE_NAMES.get(language, "English")}.
CRITICAL: If you use quotes inside the JSON string values, you MUST escape them with a backslash (e.g. use \\\" instead of \").

{question_counts}

NCERT Content:
\"\"\"{text_to_use}\"\"\"
"""
    raw = ask_ai_json(prompt, system_prompt=QUIZ_SYSTEM, fast_mode=False, max_tokens=4000)
    try:
        return json.loads(raw)
    except Exception as e:
        try:
            with open("debug_quiz_raw.txt", "w", encoding="utf-8") as f:
                f.write(raw)
        except Exception:
            pass
        print(f"[DEBUG] First JSON load failed: {e}. Raw content written to debug_quiz_raw.txt")
        try:
            import re
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                res_json = json.loads(match.group())
                return res_json
        except Exception as e2:
            print(f"[DEBUG] Regex JSON load failed: {e2}")
            pass
        return {"mcq": [], "fill_blanks": [], "one_liners": [], "error": "Parse failed"}
