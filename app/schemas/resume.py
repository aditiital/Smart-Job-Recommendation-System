from pydantic import BaseModel, Field


class ResumeUploadResponse(BaseModel):
    filename: str
    char_count: int
    page_hint: str
    raw_text: str


class ResumeParsedResponse(BaseModel):
    skills: list[str] = Field(default_factory=list)
    education: str = Field(default="")
    experience: str = Field(default="")
