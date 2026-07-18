import re

SKILLS_DB = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
    "Kotlin", "Swift", "Ruby", "PHP", "Scala", "R", "MATLAB", "Perl", "Bash",
    "React", "Vue", "Angular", "FastAPI", "Django", "Flask", "Node.js",
    "Express", "Spring Boot", "Next.js", "Nuxt", "Laravel",
    "PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "Spark",
    "Kafka", "Airflow", "Tableau", "Power BI", "Matplotlib",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite",
    "DynamoDB", "Cassandra", "Firebase", "SQL", "NoSQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Linux",
    "Jenkins", "Git", "GitHub", "GitLab", "CI/CD",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "MLOps",
    "REST APIs", "GraphQL", "Microservices", "DevOps", "Agile", "Scrum",
    "HTML", "CSS", "Bootstrap", "Tailwind", "jQuery", "Redux",
    "Android", "iOS", "Flutter", "React Native",
    "Keras", "OpenCV", "NLTK", "Hugging Face",
    "Selenium", "Pytest", "Jest", "JUnit",
    "Excel", "PowerPoint", "Jira",
]


def extract_skills(text):
    if not text:
        return []
    found = set()
    text_lower = text.lower()
    for skill in SKILLS_DB:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found.add(skill)
    return sorted(found)


def extract_education(text):
    if not text:
        return ""
    lines = text.splitlines()
    edu_lines = []
    capture = False
    for line in lines:
        ll = line.lower().strip()
        if any(h in ll for h in ["education", "academic", "qualification", "degree"]):
            capture = True
            edu_lines.append(line)
            continue
        if capture:
            if any(h in ll for h in ["experience", "skill", "project", "certification"]):
                break
            if line.strip():
                edu_lines.append(line)
    if not edu_lines:
        kw = ["b.tech", "m.tech", "btech", "mtech", "bachelor", "master",
              "phd", "mba", "diploma", "university", "college", "institute", "gpa"]
        for line in lines:
            if any(k in line.lower() for k in kw) and len(line.strip()) > 5:
                edu_lines.append(line.strip())
    return "\n".join(edu_lines).strip()


def extract_experience(text):
    if not text:
        return ""
    lines = text.splitlines()
    exp_lines = []
    capture = False
    for line in lines:
        ll = line.lower().strip()
        if any(h in ll for h in ["experience", "employment", "work history"]):
            capture = True
            exp_lines.append(line)
            continue
        if capture:
            if any(h in ll for h in ["education", "skill", "project", "certification"]):
                break
            if line.strip():
                exp_lines.append(line)
    if not exp_lines:
        job_titles = ["engineer", "developer", "analyst", "manager", "intern", "lead"]
        date_pattern = re.compile(r'\b(20\d{2}|19\d{2}|present|current)\b', re.IGNORECASE)
        for line in lines:
            if any(t in line.lower() for t in job_titles) and date_pattern.search(line):
                exp_lines.append(line.strip())
    return "\n".join(exp_lines).strip()


def extract_all(text):
    return {
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
    }
