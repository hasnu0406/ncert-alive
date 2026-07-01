import io
import base64
import os
import tempfile
from pathlib import Path

LANG_CODE_MAP = {
    "en": "en",
    "hi": "hi",
    "ta": "ta",
    "te": "te",
    "kn": "kn",
    "ml": "ml",
    "mr": "mr",
    "bn": "bn",
    "gu": "gu",
    "pa": "pa",
    "ne": "ne",
    "ur": "ur",
    # gTTS does not support these, fall back to Hindi / English
    "or": "hi",
    "as": "hi",
    "mai": "hi",
    "kok": "hi",
    "doi": "hi",
    "mni": "hi",
    "san": "hi",
}


def text_to_speech_b64(text: str, language: str = "en") -> str:
    """Convert text to speech and return base64-encoded MP3."""
    try:
        from gtts import gTTS
        lang_code = LANG_CODE_MAP.get(language, "en")
        tts = gTTS(text=text[:3000], lang=lang_code, slow=False)
        buffer = io.BytesIO()
        tts.write_to_fp(buffer)
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode("utf-8")
    except Exception as e:
        raise RuntimeError(f"TTS generation failed: {e}") from e


def text_to_speech_bytes(text: str, language: str = "en") -> bytes:
    """Convert text to speech and return raw MP3 bytes."""
    try:
        from gtts import gTTS
        lang_code = LANG_CODE_MAP.get(language, "en")
        tts = gTTS(text=text[:3000], lang=lang_code, slow=False)
        buffer = io.BytesIO()
        tts.write_to_fp(buffer)
        buffer.seek(0)
        return buffer.read()
    except Exception as e:
        raise RuntimeError(f"TTS generation failed: {e}") from e
