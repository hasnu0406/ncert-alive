from datetime import datetime
from bson import ObjectId
from database import LazyCollection

# Lazy load the goals collection
goals_collection = LazyCollection("goals")

async def set_goal(parent_id: str, student_id: str, target_xp: int, reward_name: str) -> dict:
    doc = {
        "parentId": ObjectId(parent_id),
        "studentId": ObjectId(student_id),
        "targetXp": int(target_xp),
        "rewardName": reward_name,
        "status": "active",  # active | completed
        "createdAt": datetime.utcnow()
    }
    res = await goals_collection.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    doc["parentId"] = str(doc["parentId"])
    doc["studentId"] = str(doc["studentId"])
    return doc

async def get_goals_for_parent(parent_id: str) -> list:
    cursor = goals_collection.find({"parentId": ObjectId(parent_id)})
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["parentId"] = str(doc["parentId"])
        doc["studentId"] = str(doc["studentId"])
        results.append(doc)
    return results

async def get_goals_for_student(student_id: str) -> list:
    cursor = goals_collection.find({"studentId": ObjectId(student_id)})
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["parentId"] = str(doc["parentId"])
        doc["studentId"] = str(doc["studentId"])
        results.append(doc)
    return results

async def check_and_update_goals(student_id: str, current_xp: int):
    # Update active goals where targetXp <= current_xp to 'completed'
    await goals_collection.update_many(
        {
            "studentId": ObjectId(student_id),
            "status": "active",
            "targetXp": {"$lte": int(current_xp)}
        },
        {
            "$set": {"status": "completed", "completedAt": datetime.utcnow()}
        }
    )
