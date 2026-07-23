import os
# pyrefly: ignore [missing-import]
from openai import OpenAI, AuthenticationError
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

_GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
_client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=_GROQ_API_KEY,
    max_retries=1
)

PRIMARY_MODEL = "qwen/qwen3.6-27b"
FAST_MODEL = "llama-3.1-8b-instant"  # For quiz/flashcard JSON — 5x faster
FALLBACK_MODEL = "llama-3.3-70b-versatile"

_API_KEY_ERROR_MSG = (
    "Invalid or missing GROQ_API_KEY. "
    "Please set a valid key in backend/.env and restart the server."
)


def _is_auth_error(exc: Exception) -> bool:
    """Return True for any Groq authentication / key error."""
    msg = str(exc).lower()
    return (
        isinstance(exc, AuthenticationError)
        or "invalid_api_key" in msg
        or "invalid api key" in msg
        or "401" in msg
    )


def ask_ai(
    prompt: str,
    system_prompt: str = "You are a helpful AI assistant.",
    use_fallback: bool = False,
    temperature: float = 0.0,
    max_tokens: int = 2000,
):
    """Ask OpenRouter/Groq and return the full text response."""
    model = FALLBACK_MODEL if use_fallback else PRIMARY_MODEL
    try:
        response = _client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=0.9,
        )
        return response.choices[0].message.content
    except Exception as e:
        if _is_auth_error(e):
            return f"[Error: {_API_KEY_ERROR_MSG}]"
        
        if not use_fallback:
            return ask_ai(prompt, system_prompt, use_fallback=True, temperature=temperature, max_tokens=max_tokens)
        return f"[Groq API Error: {str(e)}]"

def ask_ai_stream(
    prompt: str,
    system_prompt: str = "You are a helpful AI assistant.",
    use_fallback: bool = False,
    temperature: float = 0.0,
    max_tokens: int = 2000,
):
    """Ask OpenRouter/Groq and yield chunks of the response as they arrive."""
    model = FALLBACK_MODEL if use_fallback else PRIMARY_MODEL
    try:
        response = _client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=0.9,
            stream=True,
        )
        for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except Exception as e:
        if _is_auth_error(e):
            yield f"\n\n[Error: {_API_KEY_ERROR_MSG}]"
            return
        
        yield f"\n\n[Groq API Error: {str(e)}]"


import re

def ask_ai_json(
    prompt: str,
    system_prompt: str = "You are a helpful assistant. Always respond with valid JSON only, no markdown, no explanation.",
    use_fallback: bool = False,
    fast_mode: bool = True,
    max_tokens: int = 300,
) -> str:
    """Ask OpenRouter and expect a JSON string back. Uses fast 3B model by default for instant detection."""
    model = FAST_MODEL if fast_mode else PRIMARY_MODEL
    try:
        response = _client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=max_tokens,
        )
        content = response.choices[0].message.content or ""
        # Strip markdown code blocks in case the model wraps it
        content = re.sub(r'```json\s*', '', content)
        content = re.sub(r'```', '', content)
        return content.strip()
    except Exception as e:
        if _is_auth_error(e):
            raise RuntimeError(_API_KEY_ERROR_MSG) from e
        if fast_mode:
            # Fall back to primary model if the fast model fails
            return ask_ai_json(prompt, system_prompt, use_fallback=False, fast_mode=False)
        if not use_fallback:
            print(f"PRIMARY_MODEL failed in ask_ai_json with error: {e}")
        raise RuntimeError(f"OpenRouter JSON API error: {e}") from e
