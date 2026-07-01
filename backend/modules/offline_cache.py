from datetime import datetime
from database import cached_content_collection


async def get_cached(page_id: str) -> dict | None:
    return await cached_content_collection.find_one({"pageId": page_id})


async def save_cache(
    page_id: str,
    original_text: str,
    simplified: dict,
    quiz: dict,
    flashcards: list,
    subject: str,
    class_level: int,
    detected_class_level: int | None = None,
    topic: str | None = None,
    user_id: str | None = None,
) -> None:
    existing = await cached_content_collection.find_one({"pageId": page_id})
    user_ids = []
    if existing and "userIds" in existing:
        user_ids = existing["userIds"]
    if user_id and user_id not in user_ids:
        user_ids.append(user_id)

    doc = {
        "pageId": page_id,
        "originalText": original_text,
        "simplifiedText": simplified,  # {"en": ..., "hi": ..., etc.}
        "quiz": quiz,
        "flashcards": flashcards,
        "subject": subject,
        "classLevel": class_level,
        "userIds": user_ids,
        "updatedAt": datetime.utcnow(),
    }
    if detected_class_level is not None:
        doc["detectedClassLevel"] = detected_class_level
    elif existing and "detectedClassLevel" in existing:
        doc["detectedClassLevel"] = existing["detectedClassLevel"]
        
    if topic is not None:
        doc["topic"] = topic
    elif existing and "topic" in existing:
        doc["topic"] = existing["topic"]

    if existing:
        await cached_content_collection.update_one({"pageId": page_id}, {"$set": doc})
    else:
        doc["createdAt"] = datetime.utcnow()
        await cached_content_collection.insert_one(doc)

    # Propagate subject, topic, and detectedClassLevel to all sister pages of the document
    if "-p" in page_id:
        doc_id = page_id.split("-p")[0]
        update_fields = {}
        if subject and subject != "default":
            update_fields["subject"] = subject
        if topic and topic != "Unknown" and topic != "default":
            update_fields["topic"] = topic
        if detected_class_level is not None:
            update_fields["detectedClassLevel"] = detected_class_level

        if update_fields:
            if user_id:
                await cached_content_collection.update_many(
                    {"pageId": {"$regex": f"^{doc_id}-p"}},
                    {"$addToSet": {"userIds": user_id}}
                )
            await cached_content_collection.update_many(
                {"pageId": {"$regex": f"^{doc_id}-p"}},
                {"$set": update_fields}
            )


async def get_cached_simplified(page_id: str, language: str) -> str | None:
    doc = await get_cached(page_id)
    if doc and "simplifiedText" in doc:
        return doc["simplifiedText"].get(language)
    return None
