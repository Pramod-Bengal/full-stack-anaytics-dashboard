
import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy import select
from models import User, AnalyticsData
from database import engine

async def view_all_data():
    output = []
    try:
        output.append("="*50)
        output.append("CONNECTING TO DATABASE (Reporting to File)...")
        output.append("="*50)
        
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        
        async with AsyncSessionLocal() as session:
            # 1. Fetch Users
            output.append("\n[ USERS TABLE ]")
            result_users = await session.execute(select(User))
            users = result_users.scalars().all()
            
            if not users:
                output.append("No users found.")
            else:
                output.append(f"Total Users: {len(users)}\n")
                output.append(f"{'ID':<5} | {'Role':<10} | {'Email':<30} | {'Name'}")
                output.append("-" * 60)
                for u in users:
                    output.append(f"{u.id:<5} | {str(u.role.value if hasattr(u.role, 'value') else u.role):<10} | {u.email:<30} | {u.full_name}")

            # 2. Fetch Analytics Data
            output.append("\n" + "="*50)
            output.append("\n[ ANALYTICS DATA TABLE (Last 20) ]")
            result_analytics = await session.execute(select(AnalyticsData).limit(20))
            data = result_analytics.scalars().all()
            
            if not data:
                output.append("No analytics data found.")
            else:
                output.append(f"Total Records Displayed: {len(data)}\n")
                output.append(f"{'ID':<5} | {'Category':<15} | {'Metric':<20} | {'Value':<10} | {'Recorded At'}")
                output.append("-" * 80)
                for d in data:
                    output.append(f"{d.id:<5} | {d.category:<15} | {d.metric_name:<20} | {d.value:<10} | {d.recorded_at}")
        
        output.append("\n" + "="*50)
        output.append("DONE")

        with open("final_data.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(output))
        
        print("Data written to final_data.txt")

    except Exception as e:
        print(f"Error viewing data: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    asyncio.run(view_all_data())
