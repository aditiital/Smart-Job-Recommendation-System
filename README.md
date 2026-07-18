# 🤖 AI-Powered Job Recommendation System

## 🌐 Live Demo
A full-stack web application that extracts skills from your resume using NLP and matches you with personalised job recommendations.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, HTML, CSS, JavaScript, Vite |
| Backend | FastAPI (Python) |
| Database | SQLite (via SQLAlchemy + aiosqlite) |
| PDF Extraction | PyMuPDF (fitz) |
| NLP | Regex-based skill extraction |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| API Docs | Swagger UI |

---

## 📁 Project Structure

```
job-recommendation pbl/
├── main.py                          # FastAPI app factory
├── requirements.txt                 # Python dependencies
├── .env                             # Environment variables
├── jobdb.sqlite                     # SQLite database (auto-created)
├── fix.py                           # Utility fix script
│
├── app/
│   ├── api/v1/
│   │   ├── router.py                # Combines all routers
│   │   ├── auth.py                  # Register + Login endpoints
│   │   ├── resume.py                # PDF upload + NLP extraction
│   │   └── jobs.py                  # Job recommendations
│   ├── core/
│   │   ├── config.py                # App settings
│   │   ├── security.py              # JWT + bcrypt
│   │   ├── deps.py                  # FastAPI dependencies
│   │   ├── exceptions.py            # Error handlers
│   │   └── logging.py               # Logging setup
│   ├── db/
│   │   ├── models.py                # User, Resume, Job tables
│   │   └── session.py               # Database engine
│   ├── nlp/
│   │   └── extractor.py             # Skill/education/experience extraction
│   ├── services/
│   │   ├── pdf_service.py           # PyMuPDF text extraction
│   │   └── recommendation_service.py
│   └── schemas/
│       ├── resume.py                # Pydantic models
│       └── job.py
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx            # Login page
        │   ├── Register.jsx         # Register page
        │   ├── Dashboard.jsx        # Dashboard with NLP metrics
        │   ├── Upload.jsx           # Resume upload page
        │   └── Jobs.jsx             # Job matches page
        ├── components/
        │   └── Navbar.jsx           # Navigation bar
        ├── api/
        │   └── axios.js             # HTTP client config
        ├── App.jsx                  # Routes
        ├── main.jsx                 # Entry point
        └── index.css                # Global styles
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js v20+
- VS Code (recommended)

### 1. Clone or download the project

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Install spaCy model
```bash
python -m spacy download en_core_web_md
```

### 4. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### 5. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set your `SECRET_KEY`.

---

## ▶️ Running the Project

You need **two terminals open at the same time.**

### Terminal 1 — Start Backend
```bash
uvicorn main:app --reload
```
Backend runs at: `http://127.0.0.1:8000`

### Terminal 2 — Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Quick Start (Windows)
Double-click `start.bat` to start both servers automatically.

---

## 🌐 Pages & Features

| Page | URL | Description |
|---|---|---|
| Login | `/login` | JWT-secured login |
| Register | `/register` | Create new account |
| Dashboard | `/` | NLP metrics, skills, applied jobs |
| Upload Resume | `/upload` | PDF upload + skill extraction |
| Job Matches | `/jobs` | 24 jobs sorted by skill match |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login, get JWT token |
| POST | `/api/v1/resume/upload` | No | Upload PDF, extract skills |
| POST | `/api/v1/resume/parse` | No | Parse resume for NLP data |
| GET | `/api/v1/jobs/recommendations` | Yes | Get job recommendations |
| GET | `/health` | No | Health check |

### API Documentation
Visit `http://127.0.0.1:8000/docs` for interactive Swagger UI.

---

## 📊 NLP Metrics (Dashboard)

After uploading your resume, the dashboard shows:

| Metric | Description |
|---|---|
| **F1 Score** | Harmonic mean of Precision and Recall |
| **Precision** | % of your skills that are relevant to jobs |
| **Recall** | % of required job skills you have |
| **Accuracy** | Overall skill coverage score |
| **True Positive** | Skills you have that jobs need |
| **False Positive** | Skills you have but jobs don't need |
| **False Negative** | Skills jobs need but you're missing |
| **True Negative** | Skills neither in resume nor required |

---

## 🔒 Security

- Passwords hashed with **bcrypt**
- JWT tokens expire after **30 minutes**
- PDF files validated for type, size and magic bytes
- CORS configured for frontend origin only
- SQLAlchemy ORM prevents SQL injection

---

## 🗄️ Database

Uses **SQLite** — no installation required. Database file `jobdb.sqlite` is created automatically on first run.

To upgrade to PostgreSQL, change one line in `app/core/config.py`:
```python
DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/jobdb"
```

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|---|---|
| `ModuleNotFoundError: pydantic_settings` | Run `pip install -r requirements.txt` |
| `ModuleNotFoundError: fitz` | Run `pip install PyMuPDF` |
| `ModuleNotFoundError: aiosqlite` | Run `pip install aiosqlite` |
| `Application startup failed` | Check `.env` file exists |
| Frontend shows blank page | Make sure `npm run dev` is running |
| `Failed to fetch` | Make sure `uvicorn main:app --reload` is running |
| Skills showing 0 | Upload resume on the Upload page first |

---

## 👨‍💻 Development Notes

- All NLP extraction is inside `app/api/v1/resume.py` — no external dependencies
- Skills are saved to `localStorage` in the browser after upload
- Job matching uses client-side skill comparison for speed
- The particle animation on dashboard uses HTML5 Canvas API

---

## 📝 Future Improvements

- PostgreSQL for production database
- Sentence transformer embeddings for better matching
- Email notifications for new job matches
- Admin panel for managing job listings
- Resume scoring and feedback
- OAuth2 social login (Google, GitHub)

---

## 👥 Team

PBL Project — Academic Year 2025-2026


**Frontend:** https://YOUR-VERCEL-URL.vercel.app

**Backend API:** https://smart-job-recommendation-system-oesr.onrender.com

**Swagger API Docs:** https://smart-job-recommendation-system-oesr.onrender.com/docs
