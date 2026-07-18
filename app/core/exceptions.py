from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import traceback


class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class FileTooLargeError(AppError):
    def __init__(self, size_mb: float, limit_mb: int):
        super().__init__(
            f"File size {size_mb:.1f} MB exceeds the {limit_mb} MB limit",
            status_code=413,
        )


class InvalidFileTypeError(AppError):
    def __init__(self, received: str):
        super().__init__(
            f"Expected a PDF file, got '{received}'",
            status_code=415,
        )


class PDFExtractionError(AppError):
    def __init__(self, detail: str):
        super().__init__(f"PDF extraction failed: {detail}", status_code=422)


class EmptyDocumentError(AppError):
    def __init__(self):
        super().__init__(
            "No extractable text found.",
            status_code=422,
        )


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.message},
        )

    @app.exception_handler(Exception)
    async def general_error_handler(request: Request, exc: Exception) -> JSONResponse:
        error_detail = traceback.format_exc()
        print("UNHANDLED ERROR:", error_detail)
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc), "traceback": error_detail},
        )
