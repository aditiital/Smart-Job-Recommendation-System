import logging
import math
import re
from fastapi import APIRouter, File, UploadFile, status
from pydantic import BaseModel
from app.services.pdf_service import pdf_service

logger = logging.getLogger("job_rec.api.resume")
router = APIRouter(prefix="/resume", tags=["Resume"])

SKILLS_DB = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
    "Kotlin", "Swift", "Ruby", "PHP", "Scala", "R", "MATLAB", "Bash",
    "React", "Vue", "Angular", "FastAPI", "Django", "Flask", "Node.js",
    "Express", "Spring Boot", "Next.js", "Nuxt", "Laravel",
    "PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "Spark",
    "Kafka", "Tableau", "Power BI", "Matplotlib",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite",
    "DynamoDB", "Firebase", "SQL", "NoSQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Linux",
    "Jenkins", "Git", "GitHub", "GitLab", "CI/CD",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "MLOps",
    "REST APIs", "GraphQL", "Microservices", "DevOps", "Agile", "Scrum",
    "HTML", "CSS", "Bootstrap", "Tailwind", "jQuery", "Redux",
    "Android", "iOS", "Flutter", "React Native",
    "Keras", "OpenCV", "NLTK", "Hugging Face",
    "Selenium", "Pytest", "Jest", "JUnit", "Excel", "Jira",
]


def extract_skills(text):
    if not text:
        return []
    found = set()
    tl = text.lower()
    for skill in SKILLS_DB:
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', tl):
            found.add(skill)
    return sorted(found)


def extract_education(text):
    if not text:
        return ""
    lines = text.splitlines()
    edu = []
    cap = False
    for line in lines:
        ll = line.lower().strip()
        if any(h in ll for h in ["education", "academic", "qualification", "degree"]):
            cap = True
            edu.append(line)
            continue
        if cap:
            if any(h in ll for h in ["experience", "skill", "project", "certification"]):
                break
            if line.strip():
                edu.append(line)
    if not edu:
        kw = ["b.tech", "m.tech", "btech", "mtech", "bachelor", "master",
              "phd", "mba", "diploma", "university", "college", "institute", "gpa"]
        for line in lines:
            if any(k in line.lower() for k in kw) and len(line.strip()) > 5:
                edu.append(line.strip())
    return "\n".join(edu).strip()


def extract_experience(text):
    if not text:
        return ""
    lines = text.splitlines()
    exp = []
    cap = False
    for line in lines:
        ll = line.lower().strip()
        if any(h in ll for h in ["experience", "employment", "work history"]):
            cap = True
            exp.append(line)
            continue
        if cap:
            if any(h in ll for h in ["education", "skill", "project", "certification"]):
                break
            if line.strip():
                exp.append(line)
    return "\n".join(exp).strip()


class ResumeFullResponse(BaseModel):
    filename: str
    char_count: int
    page_hint: str
    raw_text: str
    skills: list[str] = []
    education: str = ""
    experience: str = ""


@router.post("/upload", response_model=ResumeFullResponse, status_code=status.HTTP_200_OK)
async def upload_resume(
    file: UploadFile = File(..., description="PDF resume — max 5 MB"),
) -> ResumeFullResponse:
    raw_bytes = await file.read()
    text = pdf_service.validate_and_extract(raw_bytes, file.content_type or "")
    char_count = len(text)
    page_estimate = max(1, math.ceil(char_count / 2500))
    return ResumeFullResponse(
        filename=file.filename or "resume.pdf",
        char_count=char_count,
        page_hint=f"~{page_estimate} page{'s' if page_estimate > 1 else ''}",
        raw_text=text,
        skills=extract_skills(text),
        education=extract_education(text),
        experience=extract_experience(text),
    )


@router.post("/parse", response_model=ResumeFullResponse, status_code=status.HTTP_200_OK)
async def parse_resume(
    file: UploadFile = File(..., description="PDF resume — max 5 MB"),
) -> ResumeFullResponse:
    raw_bytes = await file.read()
    text = pdf_service.validate_and_extract(raw_bytes, file.content_type or "")
    char_count = len(text)
    page_estimate = max(1, math.ceil(char_count / 2500))
    return ResumeFullResponse(
        filename=file.filename or "resume.pdf",
        char_count=char_count,
        page_hint=f"~{page_estimate} page{'s' if page_estimate > 1 else ''}",
        raw_text=text,
        skills=extract_skills(text),
        education=extract_education(text),
        experience=extract_experience(text),
    )