import logging
import fitz
from app.core.config import settings
from app.core.exceptions import (
    EmptyDocumentError, FileTooLargeError,
    InvalidFileTypeError, PDFExtractionError,
)

logger = logging.getLogger("job_rec.pdf")
ALLOWED_CONTENT_TYPES = {"application/pdf", "application/octet-stream"}
PDF_MAGIC_BYTES = b"%PDF"

class PDFService:
    def validate(self, data: bytes, content_type: str) -> None:
        self._check_content_type(content_type)
        self._check_size(data)
        self._check_magic_bytes(data)

    def _check_content_type(self, content_type: str) -> None:
        mime = content_type.split(";")[0].strip().lower()
        if mime not in ALLOWED_CONTENT_TYPES:
            raise InvalidFileTypeError(received=content_type)

    def _check_size(self, data: bytes) -> None:
        size_mb = len(data) / (1024 * 1024)
        if len(data) > settings.max_upload_bytes:
            raise FileTooLargeError(size_mb=size_mb, limit_mb=settings.MAX_UPLOAD_SIZE_MB)

    def _check_magic_bytes(self, data: bytes) -> None:
        if not data.startswith(PDF_MAGIC_BYTES):
            raise InvalidFileTypeError(received="non-PDF binary")

    def extract_text(self, data: bytes) -> str:
        try:
            with fitz.open(stream=data, filetype="pdf") as doc:
                if doc.is_encrypted:
                    raise PDFExtractionError("Encrypted PDFs are not supported")
                pages = []
                for page in doc:
                    page_text = page.get_text("text")
                    if page_text.strip():
                        pages.append(page_text.strip())
        except PDFExtractionError:
            raise
        except Exception as exc:
            raise PDFExtractionError(str(exc)) from exc

        full_text = "\n\n".join(pages)
        if not full_text.strip():
            raise EmptyDocumentError()
        return full_text

    def validate_and_extract(self, data: bytes, content_type: str) -> str:
        self.validate(data, content_type)
        return self.extract_text(data)

pdf_service = PDFService()