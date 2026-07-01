import io
import base64
from pathlib import Path

try:
    import easyocr
    _reader = None

    def _get_reader():
        global _reader
        if _reader is None:
            print("[ocr] Loading EasyOCR model (first run may take a moment)...")
            _reader = easyocr.Reader(["en", "hi"], gpu=False)
        return _reader

    def extract_text_from_image(image_bytes: bytes) -> str:
        reader = _get_reader()
        results = reader.readtext(image_bytes, detail=0, paragraph=True)
        return "\n".join(results).strip()

    OCR_ENGINE = "easyocr"

except ImportError:
    print("[ocr] EasyOCR not available, falling back to Tesseract")
    OCR_ENGINE = "tesseract"

    def extract_text_from_image(image_bytes: bytes) -> str:
        try:
            import pytesseract
            from PIL import Image
            img = Image.open(io.BytesIO(image_bytes))
            return pytesseract.image_to_string(img).strip()
        except ImportError:
            return "[OCR not available — please install EasyOCR or Tesseract]"


def extract_text_from_base64(b64_string: str) -> str:
    """Accept base64-encoded image from frontend."""
    # Strip data URL prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_string)
    return extract_text_from_image(image_bytes)


def get_ocr_engine() -> str:
    return OCR_ENGINE
