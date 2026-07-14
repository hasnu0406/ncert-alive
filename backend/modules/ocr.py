import io
import base64
from pathlib import Path
from PIL import Image
from .ai_engine import _client

def compress_image(image_bytes: bytes, max_dim: int = 1024, quality: int = 80) -> bytes:
    """Resize image to max dimensions of 1024px and compress to JPEG under 150KB."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Calculate new dimensions preserving aspect ratio
        width, height = img.size
        if width > max_dim or height > max_dim:
            if width > height:
                new_width = max_dim
                new_height = int(height * (max_dim / width))
            else:
                new_height = max_dim
                new_width = int(width * (max_dim / height))
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        out_bytes = io.BytesIO()
        img.save(out_bytes, format='JPEG', quality=quality)
        return out_bytes.getvalue()
    except Exception as e:
        print(f"[ocr compress error] Failed to compress image: {e}")
        return image_bytes

def extract_text_from_image(image_bytes: bytes) -> str:
    """Extract text from image using Groq/OpenRouter Vision API with local fallback."""
    try:
        # Compress image first to bypass API payload size limits (Groq max 4MB)
        compressed_bytes = compress_image(image_bytes)
        
        # Encode image to base64 data URL
        b64_data = base64.b64encode(compressed_bytes).decode('utf-8')
        data_url = f"data:image/jpeg;base64,{b64_data}"
        
        # Call Groq Vision API
        response = _client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "You are a precise OCR tool. Transcribe all text from this CBSE/NCERT textbook page. "
                                "Output ONLY the transcribed text. Maintain paragraphs and lists. "
                                "Do NOT add any greetings, headers, explanations, markdown formatting, or notes. "
                                "Just output the text content of the page."
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.0,
            max_tokens=4000
        )
        text = response.choices[0].message.content.strip()
        print(f"[ocr success] Extracted text length: {len(text)}. Content preview: {text[:150]}")
        if text:
            return text
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[ocr API error] Failed to call Vision API: {e}. Falling back to local OCR...")

    # Fallback to local OCR engines
    try:
        import easyocr
        reader = easyocr.Reader(["en", "hi"], gpu=False)
        results = reader.readtext(image_bytes, detail=0, paragraph=True)
        return "\n".join(results).strip()
    except ImportError:
        try:
            import pytesseract
            img = Image.open(io.BytesIO(image_bytes))
            return pytesseract.image_to_string(img).strip()
        except ImportError:
            return "[OCR not available — please set a valid Groq API Key for Cloud Vision OCR]"

def extract_text_from_base64(b64_string: str) -> str:
    """Accept base64-encoded image from frontend."""
    # Strip data URL prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_string)
    return extract_text_from_image(image_bytes)

def get_ocr_engine() -> str:
    return "cloud-vision-llama"
