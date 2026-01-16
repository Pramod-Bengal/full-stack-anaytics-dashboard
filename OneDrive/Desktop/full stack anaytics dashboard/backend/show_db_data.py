
import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy import select
from models import User, AnalyticsData
from database import engine
import logging

# Reduce noise from sqlalchemy
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

async def show_data():
    try:
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        
        async with AsyncSessionLocal() as session:
            # 1. Show Users
            print("\n" + "="*60)
            print("USERS LIST")
            print("="*60)
            result = await session.execute(select(User))
            users = result.scalars().all()
            for u in users:
                # Handle Role enum which might be an object or string
                role_str = str(u.role.value if hasattr(u.role, 'value') else u.role)
                print(f"ID: {u.id:<3} | Role: {role_str:<10} | Email: {u.email}")

            # 2. Show Analytics (Last 50)
            print("\n" + "="*60)
            print("ANALYTICS DATA (Last 50 Records)")
            print("="*60)
            result_data = await session.execute(
                select(AnalyticsData).order_by(AnalyticsData.id.desc()).limit(50)
            )
            data = result_data.scalars().all()
            
            print(f"{'ID':<5} | {'Category':<15} | {'Metric':<20} | {'Value'}")
            print("-" * 60)
            for d in data:
                print(f"{d.id:<5} | {d.category:<15} | {d.metric_name:<20} | {d.value}")
            
            print("\nDone.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    asyncio.run(show_data())
