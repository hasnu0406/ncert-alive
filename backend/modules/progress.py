from datetime import datetime
from bson import ObjectId
from database import users_collection, progress_collection

async def log_progress(user_id: str, page_id: str, status: str, quiz_score: float = 0, time_spent: int = 0):
    existing = await progress_collection.find_one({"userId": ObjectId(user_id), "pageId": page_id})
    doc = {
        "userId": ObjectId(user_id),
        "pageId": page_id,
        "status": status,
        "quizScore": quiz_score,
        "timeSpent": time_spent,
        "date": datetime.utcnow(),
    }
    if existing:
        await progress_collection.update_one(
            {"userId": ObjectId(user_id), "pageId": page_id},
            {"$set": doc}
        )
    else:
        await progress_collection.insert_one(doc)

async def get_student_progress(user_id: str) -> list:
    pipeline = [
        {"$match": {"userId": ObjectId(user_id)}},
        {"$lookup": {
            "from": "cached_content",
            "localField": "pageId",
            "foreignField": "pageId",
            "as": "page_info"
        }},
        {"$unwind": {
            "path": "$page_info",
            "preserveNullAndEmptyArrays": True
        }},
        {"$project": {
            "userId": {"$toString": "$userId"},
            "pageId": 1,
            "status": 1,
            "quizScore": 1,
            "timeSpent": 1,
            "date": 1,
            "topic": {"$ifNull": ["$page_info.topic", "Study Session"]},
            "subject": {"$ifNull": ["$page_info.subject", "default"]}
        }}
    ]
    cursor = progress_collection.aggregate(pipeline)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

async def get_children_progress(parent_id: str) -> list:
    # Find children linked to this parent
    children_cursor = users_collection.find({"linkedParentId": ObjectId(parent_id)})
    all_progress = []
    for child in await children_cursor.to_list(length=100):
        child_id = str(child["_id"])
        progress = await get_student_progress(child_id)
        
        # Get student's current points
        from modules.gamification import get_or_create_gamification
        g_doc = await get_or_create_gamification(child_id)
        points = g_doc.get("points", 0)
        
        all_progress.append({
            "child": {"id": child_id, "name": child["name"], "class": child.get("class", ""), "points": points},
            "progress": progress,
        })
    return all_progress
