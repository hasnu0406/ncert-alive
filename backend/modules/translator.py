from .ai_engine import ask_ai

LANG_PROMPTS = {
    "hi": "Translate the following text to Hindi. Keep technical/NCERT terms in English but explain them in Hindi.",
    "ta": "Translate the following text to Tamil. Keep technical/NCERT terms in English but explain them in Tamil.",
    "te": "Translate the following text to Telugu. Keep technical/NCERT terms in English but explain them in Telugu.",
}


def translate(text: str, target_language: str) -> str:
    if target_language == "en":
        return text  # Already in English

    instruction = LANG_PROMPTS.get(
        target_language,
        f"Translate the following text to {target_language}."
    )

    prompt = f"{instruction}\n\nText:\n\"\"\"\n{text}\n\"\"\""
    system = "You are a professional translator specializing in Indian regional languages and educational content for CBSE students."

    return ask_ai(prompt, system_prompt=system, max_tokens=2000)
