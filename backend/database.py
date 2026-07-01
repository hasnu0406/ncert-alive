# pyrefly: ignore [missing-import]
from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore
import asyncio


load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

class LazyCollection:
    def __init__(self, collection_name: str):
        self._name = collection_name
        self._collection = None
        self._loop = None

    def _get_collection(self):
        try:
            current_loop = asyncio.get_running_loop()
        except RuntimeError:
            current_loop = None

        if self._collection is None or (current_loop is not None and self._loop != current_loop):
            self._loop = current_loop
            client = AsyncIOMotorClient(MONGODB_URI)
            db = client["ncert_alive"]
            self._collection = db[self._name]
        return self._collection

    def __getattr__(self, name):
        return getattr(self._get_collection(), name)

users_collection = LazyCollection("users")
progress_collection = LazyCollection("progress")
cached_content_collection = LazyCollection("cached_content")
gamification_collection = LazyCollection("gamification")
assignments_collection = LazyCollection("assignments")
chats_collection = LazyCollection("chats")


async def get_database():
    client = AsyncIOMotorClient(MONGODB_URI)
    return client["ncert_alive"]
