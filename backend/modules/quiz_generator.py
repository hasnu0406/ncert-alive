import json
import re
from .ai_engine import ask_ai_json

QUIZ_SYSTEM = (
    "You are an expert CBSE exam question setter. You generate highly conceptual, "
    "thought-provoking, and syllabus-aligned multiple choice and text-based questions "
    "that test deep understanding of the content, avoiding trivial recall questions. "
    "Output must be in valid JSON only. No markdown fences, no extra text — pure JSON object."
)


def _build_fallback_quiz(text: str, class_level: int = 10) -> dict:
    text_clean = (text or "").strip()
    words = [w for w in re.findall(r'\b[A-Za-z]{4,}\b', text_clean) if w.lower() not in ('this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'which', 'there', 'about', 'would', 'other')]
    
    first_sentence = "understanding the core concepts of the chapter"
    if text_clean:
        sentences = [s.strip() for s in re.split(r'[.!?]', text_clean) if len(s.strip()) > 15]
        if sentences:
            first_sentence = sentences[0]

    keyword1 = words[0].capitalize() if len(words) > 0 else "Concept"
    keyword2 = words[1].capitalize() if len(words) > 1 else "Process"
    keyword3 = words[2].capitalize() if len(words) > 2 else "Definition"

    return {
        "mcq": [
            {
                "question": f"Based on the NCERT textbook, what is the primary idea behind {keyword1}?",
                "options": [
                    f"A) {first_sentence[:80]}",
                    "B) Measuring static pressure only",
                    "C) Calculating atomic mass units",
                    "D) Ignoring environmental variables"
                ],
                "answer": f"A) {first_sentence[:80]}",
                "explanation": f"According to Class {class_level} NCERT curriculum, this topic focuses on understanding fundamental principles."
            },
            {
                "question": f"Which of the following best describes the significance of {keyword2}?",
                "options": [
                    f"A) Facilitating the core functional mechanism of {keyword1}",
                    "B) Completely stopping chemical or physical change",
                    "C) Only useful for historical reference",
                    "D) Disregarding energy conservation"
                ],
                "answer": f"A) Facilitating the core functional mechanism of {keyword1}",
                "explanation": f"In Class {class_level} science/social studies, {keyword2} serves as a key building block."
            },
            {
                "question": f"Why is {keyword3} essential when studying this section?",
                "options": [
                    f"A) It establishes the core relationship between key terms",
                    "B) It is optional for CBSE examination preparation",
                    "C) It contradicts standard scientific laws",
                    "D) It applies exclusively to zero gravity"
                ],
                "answer": f"A) It establishes the core relationship between key terms",
                "explanation": f"Mastering {keyword3} ensures strong performance in conceptual CBSE exam questions."
            }
        ],
        "fill_blanks": [
            {
                "question": f"The process of {keyword1} is fundamentally linked with ___.",
                "answer": keyword2,
                "explanation": f"Both {keyword1} and {keyword2} work together in the Class {class_level} syllabus."
            }
        ],
        "one_liners": [
            {
                "question": f"What is the main takeaway regarding {keyword1}?",
                "answer": first_sentence
            }
        ]
    }


def generate_quiz(text: str, class_level: int = 10, language: str = "en", is_full_doc: bool = False) -> dict:
    from .languages import LANGUAGE_NAMES, get_native_script_instruction
    lang_instruction = get_native_script_instruction(language)

    question_counts = "Generate 8 MCQs, 3 fill-in-the-blanks, and 2 one-liner questions." if is_full_doc else "Generate 3 MCQs, 1 fill-in-the-blank, and 1 one-liner."
    text_to_use = text[:40000] if is_full_doc else text[:2000]

    prompt = f"""
Generate a high-quality CBSE conceptual quiz for Class {class_level} students based on the NCERT text below.

Guidelines for meaningful questions:
1. Focus on core concepts, cause-and-effect relationships, and practical applications of the material. Avoid trivial detail questions.
2. Options MUST be highly plausible, testing common student misconceptions.
3. For each question, provide a detailed, rich 'explanation' explaining the reasoning behind the correct answer.
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

CRITICAL: All JSON keys ('mcq', 'question', 'options', 'answer', 'explanation', 'fill_blanks', 'one_liners') MUST remain in English as shown above.
CRITICAL: If you use quotes inside the JSON string values, escape them with a backslash (e.g. \\").

{question_counts}

NCERT Content:
\"\"\"{text_to_use}\"\"\"
"""
    try:
        raw = ask_ai_json(prompt, system_prompt=QUIZ_SYSTEM, fast_mode=False, max_tokens=4000)
        try:
            return json.loads(raw)
        except Exception:
            import re
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                return json.loads(match.group())
            return _build_fallback_quiz(text, class_level)
    except Exception as e:
        print(f"[quiz_generator] AI call failed: {e}. Using smart fallback quiz.")
        return _build_fallback_quiz(text, class_level)
