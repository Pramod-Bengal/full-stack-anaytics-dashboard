
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from models import User
from database import engine

async def check_users():
    try:
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User))
            users = result.scalars().all()
            print(f"Found {len(users)} users in database.")
            for user in users:
                print(f"- Email: {user.email}, Role: {user.role}, Name: {user.full_name}")
    except Exception as e:
        print(f"Error checking users: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    asyncio.run(check_users())
