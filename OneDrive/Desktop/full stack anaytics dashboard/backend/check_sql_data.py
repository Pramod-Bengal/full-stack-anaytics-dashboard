import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from models import AnalyticsData
from database import engine

async def check_data():
    try:
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(AnalyticsData))
            data = result.scalars().all()
            print(f"Found {len(data)} analytics records in database.")
            for row in data:
                print(f"- {row.metric_name}: {row.value} ({row.category})")
    except Exception as e:
        print(f"Error checking data: {e}")

if __name__ == "__main__":
    # Ensure we are in the backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    asyncio.run(check_data())
