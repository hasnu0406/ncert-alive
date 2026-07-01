LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "or": "Odia (Oriya script)",
    "ur": "Urdu",
    "as": "Assamese",
    "ne": "Nepali (Devanagari script)",
    "mai": "Maithili (Devanagari script)",
    "kok": "Konkani (Devanagari script)",
    "doi": "Dogri (Devanagari script)",
    "mni": "Manipuri / Meiteilon (Meitei Mayek or Bengali script)",
    "san": "Sanskrit (Devanagari script)",
}


def get_native_script_instruction(language: str) -> str:
    lang_name = LANGUAGE_NAMES.get(language, "English")
    if language == "en":
        return "Respond entirely in English."
    else:
        return (
            f"You MUST respond entirely in the {lang_name} language.\n"
            f"CRITICAL: Write using the native script/character set of {lang_name} "
            f"(for example, use Devanagari script for Hindi, Kannada script for Kannada, Tamil script for Tamil, Telugu script for Telugu, Bengali script for Bengali, Malayalam script for Malayalam, Marathi script for Marathi, etc.). "
            f"Do NOT write or transliterate the words using English/Latin alphabets (e.g., do not write Hindi or Kannada using Roman characters like 'Paridrishya ek aisi...'). "
            f"Every single word, including headings, explanations, definitions, and questions/answers, must be written in the native script of {lang_name}."
        )

