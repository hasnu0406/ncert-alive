import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    await client['ncert_alive']['cache_pages'].drop()
    print('Dropped cache_pages')

asyncio.run(main())
