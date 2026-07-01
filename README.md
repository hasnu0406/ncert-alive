# 🚀 NCERT Alive

**NCERT Alive** is a premium, AI-powered learning companion for CBSE students (Grades 6–12) designed to simplify, translate, and test NCERT textbook contents dynamically.

---

## ✨ Key Features

1. **📚 AI Simplifier & Translator**:
   * Instantly simplifies complex paragraphs, formulas, and diagrams.
   * Seamlessly translates textbook pages across **18+ Indian languages** (including Hindi, Tamil, Telugu, Sanskrit, Assamese, Manipuri, and Konkani).
2. **🗺️ Interactive CBSE Roadmaps**:
   * Dynamic progress roadmaps aligned with CBSE syllabus structures (Math, Science, Social Sciences, etc.) for Grades 6–12.
3. **📝 CBSE Mock Exam Generator & AI Grading**:
   * Generates structured CBSE format exams featuring Section A (MCQs), Section B (Short Answer), and **Section C (Long Answer questions)**.
   * The AI CBSE evaluator scores and grades answer sheets dynamically based on actual marks percentages (Grade A+, A, B, C, D, E) and provides specific rubric-based feedback.
4. **💬 NCERT AI Tutor Chatbot**:
   * A context-aware chatbot that acts as a friendly 1-on-1 personal tutor. Uses the uploaded textbook page context to resolve doubts instantly.
5. **👨‍👩‍👦 Parent-Student Account Linkage**:
   * Seamless account linking to monitor study goals, XP progression, streaks, and assignment completion.
6. **🎯 Ambient Gamification**:
   * Real-time XP tracking, daily study streaks, and unlockable achievements to keep students motivated.

---

## 🛠️ Technology Stack
*   **Frontend**: React (Vite), Framer Motion (for fluid animations), Lucide Icons, Vanilla CSS design tokens.
*   **Backend**: FastAPI (Python 3.10+), PyPDF2 (PDF parsing), EasyOCR / Tesseract (OCR text extraction).
*   **AI Engine**: Groq (Llama-3 models) & OpenRouter API.
*   **Database**: MongoDB.

---

## 💻 Local Setup

### 1. Run Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # On Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8082
```
*Make sure to configure `backend/.env` with your `MONGODB_URI`, `GROQ_API_KEY`, and `OPENROUTER_API_KEY`!*

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Deployment
Build and run the entire stack (Database, Backend, and Frontend SPA Nginx server) in one command:
```bash
docker-compose up -d --build
```

---

## 🚀 Cloud Deployment
*   **Backend**: Deployed on **Render** (Root directory: `backend`, Build: `pip install -r requirements.txt`, Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`).
*   **Frontend**: Deployed on **Vercel** (Root directory: `frontend`, SPA routing configuration managed inside `vercel.json` to proxy API requests to Render seamlessly).
