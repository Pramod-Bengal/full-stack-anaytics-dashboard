
import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy import select
from models import User, UserRole
from database import engine
from auth import get_password_hash

async def set_primary_admin():
    try:
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        async with AsyncSessionLocal() as session:
            target_email = "pramodbenagal@gmail.com"
            raw_password = "Pramod@2004"
            
            # Find the target user
            result = await session.execute(select(User).where(User.email == target_email))
            user = result.scalars().first()
            
            if user:
                print(f"Found user {target_email}. Updating credentials...")
                user.hashed_password = get_password_hash(raw_password)
                user.role = UserRole.ADMIN
                user.is_active = True
                print("Updated password and role to ADMIN.")
            else:
                print(f"User {target_email} not found. Creating new admin account...")
                user = User(
                    email=target_email,
                    hashed_password=get_password_hash(raw_password),
                    full_name="Pramod Admin",
                    role=UserRole.ADMIN,
                    is_active=True
                )
                session.add(user)
                print("Created new admin account.")
            
            # Commit changes
            await session.commit()
            print(f"Successfully configured {target_email} as ADMIN.")

    except Exception as e:
        print(f"Error setting admin: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    asyncio.run(set_primary_admin())
