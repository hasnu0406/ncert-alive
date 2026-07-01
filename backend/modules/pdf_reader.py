from typing import Generator

try:
    import fitz  # PyMuPDF

    def extract_pages_from_pdf(pdf_bytes: bytes) -> list[dict]:
        """Extract text from all pages of a PDF. Returns list of {page_num, text}."""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages = []
        for i, page in enumerate(doc):
            text = page.get_text("text").strip()
            if text:
                pages.append({"page_num": i + 1, "text": text})
        doc.close()
        return pages

    def extract_page_from_pdf(pdf_bytes: bytes, page_num: int = 1) -> str:
        """Extract text from a specific page (1-indexed)."""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if page_num < 1 or page_num > len(doc):
            doc.close()
            return ""
        page = doc[page_num - 1]
        text = page.get_text("text").strip()
        doc.close()
        return text

    def get_pdf_page_count(pdf_bytes: bytes) -> int:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        count = len(doc)
        doc.close()
        return count

    PDF_ENGINE = "pymupdf"

except ImportError:
    print("[pdf_reader] PyMuPDF not available")
    PDF_ENGINE = "unavailable"

    def extract_pages_from_pdf(pdf_bytes: bytes) -> list[dict]:
        return [{"page_num": 1, "text": "[PDF parsing not available — install PyMuPDF]"}]

    def extract_page_from_pdf(pdf_bytes: bytes, page_num: int = 1) -> str:
        return "[PDF parsing not available — install PyMuPDF]"

    def get_pdf_page_count(pdf_bytes: bytes) -> int:
        return 0
