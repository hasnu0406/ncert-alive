from datetime import datetime, date, timedelta
from bson import ObjectId
from database import gamification_collection, users_collection

POINTS = {
    "page_completed": 10,
    "quiz_correct": 5,
    "quiz_perfect": 20,
    "daily_login": 5,
    "streak_bonus": 15,
    "flashcard_reviewed": 2,
}

BADGES = {
    "first_quiz": {"name": "Quiz Starter 🎯", "threshold": 1},
    "streak_7": {"name": "Week Warrior 🔥", "threshold": 7},
    "streak_30": {"name": "Month Master 🏆", "threshold": 30},
    "points_100": {"name": "Century Club 💯", "threshold": 100},
    "points_500": {"name": "Knowledge King 👑", "threshold": 500},
}


async def get_or_create_gamification(user_id: str) -> dict:
    doc = await gamification_collection.find_one({"userId": ObjectId(user_id)})
    if not doc:
        doc = {
            "userId": ObjectId(user_id),
            "points": 0,
            "streakCount": 0,
            "lastActiveDate": None,
            "badges": [],
            "totalQuizzes": 0,
        }
        await gamification_collection.insert_one(doc)
    return doc


async def award_points(user_id: str, action: str, count: int = 1) -> dict:
    pts = POINTS.get(action, 0) * count
    doc = await get_or_create_gamification(user_id)

    # Streak logic
    today = date.today().isoformat()
    last_active = doc.get("lastActiveDate")
    streak = doc.get("streakCount", 0)

    if last_active != today:
        if last_active == (date.today() - timedelta(days=1)).isoformat():
            streak += 1
        else:
            streak = 1
        pts += POINTS["daily_login"]
        if streak % 7 == 0:
            pts += POINTS["streak_bonus"]

    new_points = doc.get("points", 0) + pts
    new_total_quizzes = doc.get("totalQuizzes", 0) + (1 if "quiz" in action else 0)

    # Badge check
    badges = doc.get("badges", [])
    if new_total_quizzes >= 1 and "first_quiz" not in badges:
        badges.append("first_quiz")
    if streak >= 7 and "streak_7" not in badges:
        badges.append("streak_7")
    if streak >= 30 and "streak_30" not in badges:
        badges.append("streak_30")
    if new_points >= 100 and "points_100" not in badges:
        badges.append("points_100")
    if new_points >= 500 and "points_500" not in badges:
        badges.append("points_500")

    await gamification_collection.update_one(
        {"userId": ObjectId(user_id)},
        {"$set": {
            "points": new_points,
            "streakCount": streak,
            "lastActiveDate": today,
            "badges": badges,
            "totalQuizzes": new_total_quizzes,
        }},
    )

    try:
        from modules.goals import check_and_update_goals
        await check_and_update_goals(user_id, new_points)
    except Exception as e:
        print(f"[goals] Error checking goals for {user_id}: {e}")

    return {
        "pointsAwarded": pts,
        "totalPoints": new_points,
        "streakCount": streak,
        "badges": badges,
        "newBadge": [b for b in badges if b not in doc.get("badges", [])],
    }


async def get_leaderboard(limit: int = 10, class_level: int | None = None) -> list:
    pipeline = [
        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": "$user"},
    ]
    if class_level is not None:
        pipeline.append({"$match": {"user.class": int(class_level)}})

    pipeline.extend([
        {"$sort": {"points": -1}},
        {"$limit": limit},
        {"$project": {
            "name": "$user.name",
            "class": "$user.class",
            "points": 1,
            "streakCount": 1,
            "badges": 1,
        }}
    ])
    cursor = gamification_collection.aggregate(pipeline)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results
