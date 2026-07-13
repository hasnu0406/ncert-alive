import hashlib
import io
import os
import sys
import asyncio
import uuid
from datetime import datetime, timedelta
from typing import Optional

# Add the backend directory to Python sys.path so Vercel can resolve relative module imports
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)


# pyrefly: ignore [missing-import]
from bson import ObjectId
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, BackgroundTasks
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse, JSONResponse
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
# pyrefly: ignore [missing-import]
from passlib.context import CryptContext
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

from database import users_collection, assignments_collection, cached_content_collection, chats_collection
from modules.audio import text_to_speech_bytes
from modules.doubt_chat import chat as doubt_chat, clear_session, get_session_history
from modules.flashcards import generate_flashcards
from modules.gamification import award_points, get_leaderboard
from modules.offline_cache import get_cached, save_cache, get_cached_simplified
from modules.progress import log_progress, get_student_progress, get_children_progress
from modules.quiz_generator import generate_quiz
from modules.simplifier import simplify_text, simplify_text_stream, detect_subject

load_dotenv()

# JWT

SECRET_KEY = os.getenv("SECRET_KEY", "ncert_alive_dev_secret_change_me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

root_path = "/api" if os.getenv("VERCEL") else ""
app = FastAPI(
    title="NCERT Alive API",
    version="1.0.0",
    description="AI-powered NCERT study companion",
    root_path=root_path
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    exc_str = str(exc)
    # Detect API key / authentication errors
    if (
        "API Key" in exc_str or "api_key" in exc_str.lower()
        or "AuthenticationError" in exc_str
        or "invalid_api_key" in exc_str
        or "OPENROUTER_API_KEY" in exc_str
        or ("401" in exc_str and "openrouter" in exc_str.lower())
    ):
        return JSONResponse(
            status_code=401,
            content={
                "detail": (
                    "⚠️ Could not authenticate with OpenRouter AI. "
                    "Please add your OPENROUTER_API_KEY in backend/.env and restart the backend server. "
                    "Get a free key at: openrouter.ai"
                )
            }
        )
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {exc_str}"}
    )


# ─── Helper functions ───────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "class": user.get("class"),
    }

async def simplify_all_pages_background(
    pages_data: list[dict],
    language: str,
    class_level: int,
    subject: str,
    eli10: bool,
):
    import asyncio
    from modules.simplifier import simplify_text, detect_subject
    from modules.offline_cache import get_cached, save_cache, get_cached_simplified

    for p in pages_data:
        page_id = p["page_id"]
        text = p["text"]

        # Check if already simplified in this language
        cached_val = await get_cached_simplified(page_id, language)
        if cached_val:
            continue

        try:
            # Auto-detect subject if default
            page_subject = subject
            detected_class = None
            if page_subject == "default":
                meta = detect_subject(text, class_level)
                page_subject = meta.get("subject", "default")
                detected_class = meta.get("class_level")

            simplified = simplify_text(text, language, class_level, page_subject, eli10)

            existing = await get_cached(page_id)
            if existing:
                simplified_map = existing.get("simplifiedText", {})
                simplified_map[language] = simplified
                await save_cache(
                    page_id=page_id,
                    original_text=text,
                    simplified=simplified_map,
                    quiz=existing.get("quiz", {}),
                    flashcards=existing.get("flashcards", []),
                    subject=page_subject,
                    class_level=class_level,
                    detected_class_level=detected_class
                )
            await asyncio.sleep(1.0)
        except Exception as e:
            print(f"[background] Error simplifying page {page_id} in {language}: {e}")


async def simplify_document_in_new_language_background(
    doc_id: str,
    language: str,
    class_level: int,
    subject: str,
    eli10: bool,
):
    import asyncio
    from modules.simplifier import simplify_text
    from modules.offline_cache import get_cached, save_cache
    from database import cached_content_collection

    cursor = cached_content_collection.find({"pageId": {"$regex": f"^{doc_id}-p"}})
    pages_to_simplify = []
    async for doc in cursor:
        page_id = doc["pageId"]
        if "simplifiedText" in doc and doc["simplifiedText"].get(language):
            continue
        pages_to_simplify.append({
            "page_id": page_id,
            "text": doc["originalText"]
        })

    for p in pages_to_simplify:
        try:
            simplified = simplify_text(p["text"], language, class_level, subject, eli10)

            existing = await get_cached(p["page_id"])
            if existing:
                simplified_map = existing.get("simplifiedText", {})
                simplified_map[language] = simplified
                await save_cache(
                    page_id=p["page_id"],
                    original_text=p["text"],
                    simplified=simplified_map,
                    quiz=existing.get("quiz", {}),
                    flashcards=existing.get("flashcards", []),
                    subject=subject,
                    class_level=class_level
                )
            await asyncio.sleep(1.0)
        except Exception as e:
            print(f"[background-lang] Error simplifying page {p['page_id']} in {language}: {e}")


async def generate_doc_assets_background(
    doc_id: str,
    full_text: str,
    class_level: int,
    language: str
):
    from modules.quiz_generator import generate_quiz
    from modules.flashcards import generate_flashcards
    from modules.offline_cache import save_cache, get_cached
    
    try:
        quiz_task = asyncio.to_thread(generate_quiz, full_text, class_level, language, True)
        flashcards_task = asyncio.to_thread(generate_flashcards, full_text, class_level, language, True)
        
        quiz, flashcards = await asyncio.gather(quiz_task, flashcards_task)
        
        existing = await get_cached(doc_id)
        
        quiz_map = existing.get("quiz", {}) if existing else {}
        if not isinstance(quiz_map, dict) or "mcq" in quiz_map:
            quiz_map = {}
        quiz_map[language] = quiz
        
        cards_map = existing.get("flashcards", {}) if existing else {}
        if not isinstance(cards_map, dict):
            cards_map = {}
        cards_map[language] = flashcards
        
        await save_cache(
            page_id=doc_id,
            original_text=full_text[:5000],
            simplified=existing.get("simplifiedText", {}) if existing else {},
            quiz=quiz_map,
            flashcards=cards_map,
            subject=existing.get("subject", "default") if existing else "default",
            class_level=class_level,
            detected_class_level=existing.get("detectedClassLevel") if existing else None
        )
    except Exception as e:
        print(f"[background] Error generating doc assets for {doc_id}: {e}")



# ─── Auth Router ────────────────────────────────────────────────

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    class_level: Optional[int] = None
    linked_parent_email: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@auth_router.post("/register")
async def register(req: RegisterRequest):
    if req.role == "student":
        if req.class_level is None or req.class_level < 6 or req.class_level > 12:
            raise HTTPException(status_code=400, detail="Only students in Class 6 to 12 are supported.")

    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    linked_parent_id = None
    if req.linked_parent_email:
        parent = await users_collection.find_one({"email": req.linked_parent_email, "role": "parent"})
        if parent:
            linked_parent_id = parent["_id"]

    user_doc = {
        "name": req.name,
        "email": req.email,
        "password_hash": hash_password(req.password),
        "role": req.role,
        "class": req.class_level,
        "linkedParentId": linked_parent_id,
        "linkedParentEmail": req.linked_parent_email,
        "createdAt": datetime.utcnow(),
    }
    result = await users_collection.insert_one(user_doc)
    
    # If a parent is registering, link any existing students who specified this parent email!
    if req.role == "parent":
        await users_collection.update_many(
            {"linkedParentEmail": req.email},
            {"$set": {"linkedParentId": result.inserted_id}}
        )

    token = create_access_token({"sub": str(result.inserted_id), "role": req.role})
    user_doc["_id"] = result.inserted_id
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user_doc)}

@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    user_data = serialize_user(user)
    
    linked_parent_id = user.get("linkedParentId")
    if not linked_parent_id and user.get("linkedParentEmail"):
        parent = await users_collection.find_one({"email": user["linkedParentEmail"], "role": "parent"})
        if parent:
            linked_parent_id = parent["_id"]
            await users_collection.update_one({"_id": user["_id"]}, {"$set": {"linkedParentId": linked_parent_id}})
            
    if linked_parent_id:
        parent = await users_collection.find_one({"_id": linked_parent_id})
        if parent:
            user_data["linkedParent"] = {
                "name": parent["name"],
                "email": parent["email"]
            }
    return {"access_token": token, "token_type": "bearer", "user": user_data}

@auth_router.get("/me")
async def me(current_user=Depends(get_current_user)):
    user_data = serialize_user(current_user)
    
    linked_parent_id = current_user.get("linkedParentId")
    if not linked_parent_id and current_user.get("linkedParentEmail"):
        parent = await users_collection.find_one({"email": current_user["linkedParentEmail"], "role": "parent"})
        if parent:
            linked_parent_id = parent["_id"]
            await users_collection.update_one({"_id": current_user["_id"]}, {"$set": {"linkedParentId": linked_parent_id}})
            
    if linked_parent_id:
        parent = await users_collection.find_one({"_id": linked_parent_id})
        if parent:
            user_data["linkedParent"] = {
                "name": parent["name"],
                "email": parent["email"]
            }
    return user_data

class LinkStudentRequest(BaseModel):
    student_email: str

@auth_router.post("/link-student")
async def link_student(req: LinkStudentRequest, current_user=Depends(get_current_user)):
    if current_user["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents can link student accounts")
    student = await users_collection.find_one({"email": req.student_email, "role": "student"})
    if not student:
        raise HTTPException(status_code=404, detail="Student email not found. Please make sure the student is registered.")
    await users_collection.update_one(
        {"_id": student["_id"]},
        {"$set": {"linkedParentId": current_user["_id"]}}
    )
    return {"message": f"Successfully linked student {student['name']}"}

class LinkParentRequest(BaseModel):
    parent_email: str

@auth_router.post("/link-parent")
async def link_parent(req: LinkParentRequest, current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can link parent accounts")
    parent = await users_collection.find_one({"email": req.parent_email, "role": "parent"})
    if not parent:
        raise HTTPException(status_code=404, detail="Parent email not found. Please make sure the parent has registered.")
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"linkedParentId": parent["_id"]}}
    )
    return {"message": f"Successfully linked to parent {parent['name']}"}

# ─── Simplify Router ────────────────────────────────────────────

simplify_router = APIRouter(prefix="/simplify", tags=["Simplify"])

class SimplifyRequest(BaseModel):
    text: str
    language: str = "en"
    class_level: int = 10
    subject: str = "default"
    eli10: bool = False
    page_id: Optional[str] = None

@simplify_router.post("")
async def simplify(req: SimplifyRequest, background_tasks: BackgroundTasks, current_user=Depends(get_current_user)):
    if req.class_level < 6 or req.class_level > 12:
        raise HTTPException(status_code=400, detail="Only grade levels between Class 6 and 12 are supported.")

    page_id = req.page_id or hashlib.md5(req.text[:200].encode()).hexdigest()

    # Cache check
    cached = await get_cached_simplified(page_id, req.language)
    if cached:
        # Associate user with the existing cache
        user_id = str(current_user["_id"])
        await cached_content_collection.update_one(
            {"pageId": page_id},
            {"$addToSet": {"userIds": user_id}}
        )
        if "-p" in page_id:
            doc_id = page_id.split("-p")[0]
            await cached_content_collection.update_many(
                {"pageId": {"$regex": f"^{doc_id}-p"}},
                {"$addToSet": {"userIds": user_id}}
            )

        cached_doc = await get_cached(page_id)
        meta = {}
        if cached_doc:
            meta = {
                "subject": cached_doc.get("subject", req.subject),
                "class_level": cached_doc.get("detectedClassLevel") or cached_doc.get("classLevel", req.class_level),
                "topic": cached_doc.get("topic", "Unknown")
            }
        return {"simplified": cached, "from_cache": True, "page_id": page_id, "detected": meta}

    # Auto-detect subject if default
    meta = {}
    detected_class_level = None
    if req.subject == "default":
        meta = detect_subject(req.text, req.class_level)
        detected_class_level = meta.get("class_level")

    subject = meta.get("subject", req.subject)
    # Always use the user's registered class_level — never override with AI-detected class
    class_level = req.class_level

    simplified = simplify_text(req.text, req.language, class_level, subject, req.eli10)

    # Update cache
    existing = await get_cached(page_id)
    if existing:
        simplified_map = existing.get("simplifiedText", {})
        simplified_map[req.language] = simplified
        await save_cache(page_id, req.text, simplified_map, existing.get("quiz", {}),
                         existing.get("flashcards", []), subject, class_level, detected_class_level, meta.get("topic"), user_id=str(current_user["_id"]))
    else:
        await save_cache(page_id, req.text, {req.language: simplified}, {}, [], subject, class_level, detected_class_level, meta.get("topic"), user_id=str(current_user["_id"]))

    # Removed background tasks to respect OpenRouter concurrency limits

    return {
        "simplified": simplified,
        "from_cache": False,
        "page_id": page_id,
        "detected": meta,
    }

@simplify_router.post("/stream")
async def simplify_stream(req: SimplifyRequest, background_tasks: BackgroundTasks, current_user=Depends(get_current_user)):
    if req.class_level < 6 or req.class_level > 12:
        raise HTTPException(status_code=400, detail="Only grade levels between Class 6 and 12 are supported.")

    # Determine page_id for caching later
    page_id = req.page_id
    if not page_id and req.text:
        h = hashlib.md5(req.text.encode("utf-8")).hexdigest()
        page_id = f"custom-{h}"

    subject = req.subject
    class_level = req.class_level
    user_id_str = str(current_user["_id"])

    text_box = [""]
    
    def event_generator():
        stream = simplify_text_stream(req.text, req.language, class_level, subject, req.eli10)
        for chunk in stream:
            text_box[0] += chunk
            yield chunk

    async def save_after_stream():
        if not text_box[0]: return
        
        # Detect subject and topic if default
        meta = {}
        detected_class = None
        if subject == "default":
            try:
                meta = detect_subject(req.text, class_level)
            except Exception as e:
                print(f"[detect] Subject detection failed in save_after_stream: {e}")
                meta = {}
            final_subject = meta.get("subject", "default")
            detected_class = meta.get("class_level")
            final_topic = meta.get("topic")
        else:
            final_subject = subject
            final_topic = None

        existing = await get_cached(page_id)
        if existing:
            simplified_map = existing.get("simplifiedText", {})
            simplified_map[req.language] = text_box[0]
            
            saved_topic = final_topic
            if not saved_topic or saved_topic == "Unknown":
                saved_topic = existing.get("topic")
                
            await save_cache(
                page_id=page_id,
                original_text=req.text,
                simplified=simplified_map,
                quiz=existing.get("quiz", {}),
                flashcards=existing.get("flashcards", []),
                subject=final_subject,
                class_level=class_level,
                detected_class_level=detected_class,
                topic=saved_topic,
                user_id=user_id_str
            )
        else:
            await save_cache(
                page_id=page_id,
                original_text=req.text,
                simplified={req.language: text_box[0]},
                quiz={},
                flashcards=[],
                subject=final_subject,
                class_level=class_level,
                detected_class_level=detected_class,
                topic=final_topic,
                user_id=user_id_str
            )
            
    background_tasks.add_task(save_after_stream)
    return StreamingResponse(event_generator(), media_type="text/plain")

@simplify_router.post("/detect")
async def detect(req: SimplifyRequest):
    return detect_subject(req.text, req.class_level)

@simplify_router.get("/history")
async def get_simplified_history(current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    cursor = cached_content_collection.find({"userIds": user_id}, {"pageId": 1, "subject": 1, "classLevel": 1, "topic": 1, "updatedAt": 1})
    grouped = {}
    async for doc in cursor:
        page_id = doc["pageId"]
        if "-p" in page_id:
            parts = page_id.split("-p")
            doc_id = parts[0]
            try:
                page_num = int(parts[-1])
            except:
                page_num = 1
        else:
            doc_id = page_id
            page_num = 1

        if doc_id not in grouped:
            grouped[doc_id] = []
        grouped[doc_id].append({
            "pageId": page_id,
            "pageNum": page_num,
            "subject": doc.get("subject", "default"),
            "classLevel": doc.get("classLevel", 10),
            "topic": doc.get("topic", "Unknown"),
            "updatedAt": doc.get("updatedAt") or datetime.min
        })

    docs = []
    for doc_id, pages in grouped.items():
        pages.sort(key=lambda x: x["pageNum"])
        first_page = pages[0]
        latest_updated = max((p["updatedAt"] for p in pages), default=datetime.min)
        
        topic_name = first_page["topic"]
        if topic_name == "Unknown" or not topic_name:
            if len(pages) > 1:
                topic_name = f"Document ({len(pages)} pages)"
            else:
                topic_name = "Pasted Text"

        docs.append({
            "pageId": first_page["pageId"],
            "docId": doc_id,
            "subject": first_page["subject"],
            "classLevel": first_page["classLevel"],
            "topic": topic_name,
            "updatedAt": latest_updated if latest_updated != datetime.min else None,
            "totalPages": len(pages),
        })

    docs.sort(key=lambda x: x.get("updatedAt") or datetime.min, reverse=True)
    return {"history": docs}

@simplify_router.get("/page/{page_id}")
async def get_cached_page(page_id: str):
    doc = await cached_content_collection.find_one({"pageId": page_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found in cache")
    
    total_pages = 1
    pages_list = []
    if "-p" in page_id:
        doc_id = page_id.split("-p")[0]
        cursor = cached_content_collection.find(
            {"pageId": {"$regex": f"^{doc_id}-p"}},
            {"pageId": 1, "originalText": 1}
        )
        async for p_doc in cursor:
            pid = p_doc["pageId"]
            try:
                p_num = int(pid.split("-p")[-1])
                pages_list.append({
                    "page_id": pid,
                    "page_num": p_num,
                    "text": p_doc["originalText"]
                })
            except:
                pass
        pages_list.sort(key=lambda x: x["page_num"])
        total_pages = len(pages_list)

    return {
        "pageId": doc["pageId"],
        "originalText": doc["originalText"],
        "simplifiedText": doc.get("simplifiedText", {}),
        "quiz": doc.get("quiz", {}),
        "flashcards": doc.get("flashcards", []),
        "subject": doc.get("subject", "default"),
        "classLevel": doc.get("classLevel", 10),
        "topic": doc.get("topic", "Unknown"),
        "totalPages": total_pages,
        "pages": pages_list
    }

@simplify_router.delete("/page")
async def delete_all_cached_pages(current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    await cached_content_collection.update_many(
        {"userIds": user_id},
        {"$pull": {"userIds": user_id}}
    )
    await cached_content_collection.delete_many({"userIds": {"$size": 0}})
    await chats_collection.delete_many({"userId": user_id})
    return {"message": "All pages and associated doubts deleted successfully for this user"}

@simplify_router.delete("/page/{page_id}")
async def delete_cached_page(page_id: str, current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    if "-p" in page_id:
        doc_id = page_id.split("-p")[0]
        await cached_content_collection.update_many(
            {"pageId": {"$regex": f"^{doc_id}-p"}, "userIds": user_id},
            {"$pull": {"userIds": user_id}}
        )
        await cached_content_collection.delete_many({"userIds": {"$size": 0}})
        await chats_collection.delete_many({"pageId": {"$regex": f"^{doc_id}-p"}, "userId": user_id})
        return {"message": "Document pages deleted successfully for this user"}
    else:
        await cached_content_collection.update_one(
            {"pageId": page_id},
            {"$pull": {"userIds": user_id}}
        )
        await cached_content_collection.delete_many({"userIds": {"$size": 0}})
        await chats_collection.delete_many({"pageId": page_id, "userId": user_id})
        return {"message": "Page deleted successfully for this user"}

# ─── Doubt Chat Router ──────────────────────────────────────────

doubt_router = APIRouter(prefix="/doubt", tags=["Doubt Chat"])

class DoubtRequest(BaseModel):
    question: str
    context: str = ""
    language: str = "en"
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    page_id: Optional[str] = None

@doubt_router.post("")
async def ask_doubt(req: DoubtRequest):
    session_id = req.session_id or str(uuid.uuid4())
    answer = await doubt_chat(session_id, req.question, req.context, req.language, req.user_id, req.page_id)
    return {"answer": answer, "session_id": session_id}

@doubt_router.delete("/{session_id}")
async def clear_doubt_session(session_id: str):
    await clear_session(session_id)
    return {"message": "Session cleared"}

@doubt_router.get("/sessions/{user_id}")
async def get_chat_sessions(user_id: str):
    cursor = chats_collection.find({"userId": user_id}, {"sessionId": 1, "title": 1, "updatedAt": 1, "pageId": 1})
    sessions = []
    async for doc in cursor:
        sessions.append({
            "sessionId": doc["sessionId"],
            "title": doc.get("title", "New Chat"),
            "pageId": doc.get("pageId"),
            "updatedAt": doc.get("updatedAt"),
        })
    sessions.sort(key=lambda x: x.get("updatedAt") or datetime.min, reverse=True)
    return {"sessions": sessions}

@doubt_router.get("/history/{session_id}")
async def get_doubt_history(session_id: str, context: Optional[str] = None, user_id: Optional[str] = None, page_id: Optional[str] = None):
    history = await get_session_history(session_id, context or "", user_id or "", page_id or "")
    filtered = [
        {"role": m["role"], "content": m["content"], "id": idx}
        for idx, m in enumerate(history)
        if m["role"] in ("user", "assistant")
    ]
    return {"history": filtered}

# ─── Quiz Router ────────────────────────────────────────────────

quiz_router = APIRouter(prefix="/quiz", tags=["Quiz"])

class QuizRequest(BaseModel):
    text: str = ""
    class_level: int = 10
    language: str = "en"
    page_id: Optional[str] = None
    doc_id: Optional[str] = None

@quiz_router.post("/generate")
async def generate(req: QuizRequest, current_user=Depends(get_current_user)):
    if req.doc_id and not req.page_id:
        cached = await get_cached(req.doc_id)
        if cached and cached.get("quiz") and isinstance(cached["quiz"], dict) and cached["quiz"].get(req.language) and cached["quiz"][req.language].get("mcq"):
            return {"quiz": cached["quiz"][req.language], "from_cache": True, "page_id": req.doc_id}
        else:
            return {"status": "processing"}

    page_id = req.page_id or hashlib.md5(req.text[:200].encode()).hexdigest()

    # Cache check
    cached = await get_cached(page_id)
    if cached and cached.get("quiz") and isinstance(cached["quiz"], dict) and cached["quiz"].get(req.language) and cached["quiz"][req.language].get("mcq"):
        return {"quiz": cached["quiz"][req.language], "from_cache": True}

    quiz = await asyncio.to_thread(generate_quiz, req.text, req.class_level, req.language)

    # Update cache
    if cached:
        quiz_map = cached.get("quiz", {})
        if not isinstance(quiz_map, dict) or "mcq" in quiz_map:
            quiz_map = {} # handle legacy schema
        quiz_map[req.language] = quiz
        
        await save_cache(page_id, cached["originalText"],
                         cached.get("simplifiedText", {}), quiz_map,
                         cached.get("flashcards", {}),
                         cached.get("subject", "default"), cached.get("classLevel", req.class_level),
                         cached.get("detectedClassLevel"))
    else:
        # Create a new cache entry for non-PDF content (photos, webcam, pasted text)
        await save_cache(page_id, req.text,
                         {}, {req.language: quiz},
                         [],
                         "default", req.class_level,
                         None, None, str(current_user["_id"]))

    return {"quiz": quiz, "from_cache": False, "page_id": page_id}

class ScoreRequest(BaseModel):
    user_id: str
    page_id: str
    correct: int
    total: int

@quiz_router.post("/score")
async def submit_score(req: ScoreRequest):
    score_pct = (req.correct / req.total * 100) if req.total > 0 else 0
    action = "quiz_perfect" if req.correct == req.total else "quiz_correct"
    result = await award_points(req.user_id, action, req.correct)
    await log_progress(req.user_id, req.page_id, "completed", score_pct)
    return {"score": score_pct, "gamification": result}

# ─── Flashcard Router ───────────────────────────────────────────

flashcard_router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

class FlashcardRequest(BaseModel):
    text: str = ""
    class_level: int = 10
    language: str = "en"
    page_id: Optional[str] = None
    doc_id: Optional[str] = None

@flashcard_router.post("/generate")
async def generate_fc(req: FlashcardRequest, current_user=Depends(get_current_user)):
    if req.doc_id and not req.page_id:
        cached = await get_cached(req.doc_id)
        if cached and cached.get("flashcards") and isinstance(cached["flashcards"], dict) and cached["flashcards"].get(req.language):
            return {"flashcards": cached["flashcards"][req.language], "from_cache": True, "page_id": req.doc_id}
        else:
            return {"status": "processing"}

    page_id = req.page_id or hashlib.md5(req.text[:200].encode()).hexdigest()

    cached = await get_cached(page_id)
    if cached and cached.get("flashcards") and isinstance(cached["flashcards"], dict) and cached["flashcards"].get(req.language):
        return {"flashcards": cached["flashcards"][req.language], "from_cache": True}

    cards = await asyncio.to_thread(generate_flashcards, req.text, req.class_level, req.language)

    # Update cache
    if cached:
        cards_map = cached.get("flashcards", {})
        if not isinstance(cards_map, dict):
            cards_map = {} # handle legacy schema
        cards_map[req.language] = cards
        
        await save_cache(page_id, cached["originalText"],
                         cached.get("simplifiedText", {}), cached.get("quiz", {}),
                         cards_map,
                         cached.get("subject", "default"), cached.get("classLevel", req.class_level),
                         cached.get("detectedClassLevel"))
    else:
        # Create a new cache entry for non-PDF content (photos, webcam, pasted text)
        await save_cache(page_id, req.text,
                         {}, {},
                         {req.language: cards},
                         "default", req.class_level,
                         None, None, str(current_user["_id"]))

    return {"flashcards": cards, "from_cache": False, "page_id": page_id}

# ─── Audio Router ───────────────────────────────────────────────

audio_router = APIRouter(prefix="/audio", tags=["Audio"])

class AudioRequest(BaseModel):
    text: str
    language: str = "en"

@audio_router.post("/generate")
async def generate_audio(req: AudioRequest):
    try:
        audio_bytes = text_to_speech_bytes(req.text, req.language)
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=explanation.mp3"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Upload Router ──────────────────────────────────────────────

upload_router = APIRouter(prefix="/upload", tags=["Upload"])

@upload_router.post("/pdf")
async def upload_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: str = Form("en"),
    class_level: int = Form(10),
    subject: str = Form("default"),
    eli10: bool = Form(False),
    current_user=Depends(get_current_user),
):
    if class_level < 6 or class_level > 12:
        raise HTTPException(status_code=400, detail="Only grade levels between Class 6 and 12 are supported.")

    from modules.pdf_reader import extract_pages_from_pdf
    content = await file.read()
    pages = extract_pages_from_pdf(content)
    total_pages = len(pages)
    if total_pages == 0:
        raise HTTPException(status_code=422, detail="No readable text found in this PDF")

    # Generate a unique doc ID
    doc_id = hashlib.md5(content).hexdigest()

    pages_data = []
    full_text_list = []
    for p in pages:
        full_text_list.append(p["text"])
    
    # AI detection: detect subject and topic immediately on upload
    doc_subject = subject
    doc_class = class_level
    doc_topic = file.filename if file.filename else "Unknown"
    
    if doc_subject == "default" and pages:
        try:
            meta = await asyncio.to_thread(detect_subject, pages[0]["text"], class_level)
            if meta:
                doc_subject = meta.get("subject", doc_subject)
                doc_topic = meta.get("topic", doc_topic)
                if meta.get("class_level"):
                    doc_class = meta.get("class_level")
        except Exception as e:
            print(f"[detect] Subject detection on upload failed: {e}")

    for p in pages:
        page_num = p["page_num"]
        page_text = p["text"]
        page_id = f"{doc_id}-p{page_num}"
        pages_data.append({
            "page_num": page_num,
            "page_id": page_id,
            "text": page_text
        })

        # Save original text to cache if not exists
        existing = await get_cached(page_id)
        if not existing:
            await save_cache(
                page_id=page_id,
                original_text=page_text,
                simplified={},
                quiz={},
                flashcards=[],
                subject=doc_subject,
                class_level=class_level,
                detected_class_level=doc_class,
                topic=doc_topic,
                user_id=str(current_user["_id"])
            )
        else:
            # Associate this user with the existing page cache
            await cached_content_collection.update_one(
                {"pageId": page_id},
                {"$addToSet": {"userIds": str(current_user["_id"])}}
            )
            # Propagate user_id to all sibling pages
            await cached_content_collection.update_many(
                {"pageId": {"$regex": f"^{doc_id}-p"}},
                {"$addToSet": {"userIds": str(current_user["_id"])}}
            )
            
            curr_subject = existing.get("subject", "default")
            curr_topic = existing.get("topic", "Unknown")
            needs_update = False
            update_data = {}
            
            if curr_subject == "default" and doc_subject != "default":
                update_data["subject"] = doc_subject
                needs_update = True
            if (curr_topic == "Unknown" or curr_topic.lower().endswith(".pdf")) and doc_topic and not doc_topic.lower().endswith(".pdf") and doc_topic != "Unknown":
                update_data["topic"] = doc_topic
                needs_update = True
                
            if needs_update:
                await cached_content_collection.update_one({"pageId": page_id}, {"$set": update_data})
            
    return {
        "text": pages_data[0]["text"] if pages_data else "",
        "page_num": 1,
        "total_pages": total_pages,
        "doc_id": doc_id,
        "pages": pages_data
    }

@upload_router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    from modules.ocr import extract_text_from_image, get_ocr_engine
    content = await file.read()
    text = extract_text_from_image(content)
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from image")
    return {"text": text, "ocr_engine": get_ocr_engine()}

@upload_router.post("/image-base64")
async def upload_image_b64(payload: dict):
    from modules.ocr import extract_text_from_base64
    b64 = payload.get("image_base64", "")
    text = extract_text_from_base64(b64)
    return {"text": text}

# ─── Progress Router ────────────────────────────────────────────

progress_router = APIRouter(prefix="/progress", tags=["Progress"])

class ProgressRequest(BaseModel):
    page_id: str
    status: str = "completed"
    quiz_score: float = 0
    time_spent: int = 0

@progress_router.post("")
async def save_progress(req: ProgressRequest, current_user=Depends(get_current_user)):
    await log_progress(str(current_user["_id"]), req.page_id, req.status, req.quiz_score, req.time_spent)
    pts = await award_points(str(current_user["_id"]), "page_completed")
    return {"message": "Progress saved", "gamification": pts}

@progress_router.get("/me")
async def my_progress(current_user=Depends(get_current_user)):
    return await get_student_progress(str(current_user["_id"]))

# ─── Curriculum Router ──────────────────────────────────────────

curriculum_router = APIRouter(prefix="/curriculum", tags=["Curriculum"])

@curriculum_router.get("/roadmap")
async def get_roadmap(subject: str = "science", current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view syllabus roadmaps")
    from modules.curriculum import get_roadmap_progress
    class_level = current_user.get("class", 10)
    return await get_roadmap_progress(str(current_user["_id"]), class_level, subject)

@curriculum_router.get("/subjects")
async def get_class_subjects(current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view subjects")
    from modules.curriculum import get_subjects_for_class
    class_level = current_user.get("class", 10)
    return get_subjects_for_class(class_level)

@progress_router.get("/children")
async def children_progress(current_user=Depends(get_current_user)):
    if current_user["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents can view children progress")
    return await get_children_progress(str(current_user["_id"]))

# ─── Gamification Router ────────────────────────────────────────

gamification_router = APIRouter(prefix="/gamification", tags=["Gamification"])

@gamification_router.get("/me")
async def my_gamification(current_user=Depends(get_current_user)):
    from modules.gamification import get_or_create_gamification
    doc = await get_or_create_gamification(str(current_user["_id"]))
    doc["_id"] = str(doc["_id"])
    doc["userId"] = str(doc["userId"])
    return doc

@gamification_router.get("/leaderboard")
async def leaderboard(current_user=Depends(get_current_user)):
    user_class = current_user.get("class")
    return await get_leaderboard(10, class_level=user_class)

# ─── Goals Router ───────────────────────────────────────────────

goals_router = APIRouter(prefix="/goals", tags=["Goals"])

class GoalCreateRequest(BaseModel):
    student_id: str
    target_xp: int
    reward_name: str

@goals_router.post("")
async def create_goal(req: GoalCreateRequest, current_user=Depends(get_current_user)):
    if current_user["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents can set goals")
    from modules.goals import set_goal
    # Verify child is indeed linked to this parent
    student = await users_collection.find_one({"_id": ObjectId(req.student_id), "linkedParentId": current_user["_id"]})
    if not student:
        raise HTTPException(status_code=400, detail="Student not found or not linked to your account")
    
    return await set_goal(
        parent_id=str(current_user["_id"]),
        student_id=req.student_id,
        target_xp=req.target_xp,
        reward_name=req.reward_name
    )

@goals_router.get("/parent")
async def get_parent_goals(current_user=Depends(get_current_user)):
    if current_user["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents can view set goals")
    from modules.goals import get_goals_for_parent
    return await get_goals_for_parent(str(current_user["_id"]))

@goals_router.get("/student")
async def get_student_goals(current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view active milestones")
    from modules.goals import get_goals_for_student
    return await get_goals_for_student(str(current_user["_id"]))

# ─── Assignments Router ─────────────────────────────────────────

assignments_router = APIRouter(prefix="/assignments", tags=["Assignments"])

class AssignmentRequest(BaseModel):
    student_id: str
    page_id: str
    description: Optional[str] = None

@assignments_router.post("")
async def create_assignment(req: AssignmentRequest, current_user=Depends(get_current_user)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can assign content")
    doc = {
        "teacherId": current_user["_id"],
        "studentId": ObjectId(req.student_id),
        "pageId": req.page_id,
        "description": req.description,
        "status": "assigned",
        "assignedDate": datetime.utcnow(),
    }
    result = await assignments_collection.insert_one(doc)
    return {"assignment_id": str(result.inserted_id), "message": "Assignment created"}

@assignments_router.get("/my")
async def my_assignments(current_user=Depends(get_current_user)):
    if current_user["role"] == "student":
        cursor = assignments_collection.find({"studentId": current_user["_id"]})
    else:
        cursor = assignments_collection.find({"teacherId": current_user["_id"]})
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["teacherId"] = str(doc["teacherId"])
        doc["studentId"] = str(doc["studentId"])
        results.append(doc)
    return results

@assignments_router.get("/students")
async def list_students(current_user=Depends(get_current_user)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can list students")
    cursor = users_collection.find({"role": "student"})
    students = []
    async for s in cursor:
        students.append({"id": str(s["_id"]), "name": s["name"], "class": s.get("class"), "email": s["email"]})
    return students

# ─── CBSE Mock Exam Router ───────────────────────────────────────

exams_router = APIRouter(prefix="/exams", tags=["Mock Exam"])

class ExamGenerateRequest(BaseModel):
    page_id: str
    language: Optional[str] = "en"

class ExamEvaluateRequest(BaseModel):
    exam_id: str
    answers: dict

@exams_router.post("/generate")
async def generate_exam(req: ExamGenerateRequest, current_user=Depends(get_current_user)):
    from modules.offline_cache import get_cached
    doc = await get_cached(req.page_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Page content not cached. Please upload the PDF page first.")
        
    from modules.mock_exam import generate_mock_exam
    return await generate_mock_exam(
        page_id=req.page_id,
        text=doc["originalText"],
        class_level=doc.get("classLevel", 10),
        subject=doc.get("subject", "science"),
        language=req.language
    )

@exams_router.post("/evaluate")
async def evaluate_exam(req: ExamEvaluateRequest, current_user=Depends(get_current_user)):
    from modules.mock_exam import evaluate_mock_exam
    return await evaluate_mock_exam(
        exam_id=req.exam_id,
        student_id=str(current_user["_id"]),
        answers=req.answers
    )

# ─── Register all routers ────────────────────────────────────────

app.include_router(auth_router)
app.include_router(simplify_router)
app.include_router(doubt_router)
app.include_router(quiz_router)
app.include_router(flashcard_router)
app.include_router(audio_router)
app.include_router(upload_router)
app.include_router(progress_router)
app.include_router(gamification_router)
app.include_router(assignments_router)
app.include_router(goals_router)
app.include_router(curriculum_router)
app.include_router(exams_router)

@app.get("/")
async def root():
    return {"message": "NCERT Alive API is running 🚀", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
