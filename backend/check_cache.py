import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.ncert
    count = await db.cache_pages.count_documents({})
    print("CACHE COUNT:", count)

asyncio.run(main())
