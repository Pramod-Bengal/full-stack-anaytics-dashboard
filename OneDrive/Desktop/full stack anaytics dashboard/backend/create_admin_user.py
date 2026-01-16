
import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy import select
from models import User, UserRole
from database import engine
from auth import get_password_hash

async def create_admin():
    try:
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        async with AsyncSessionLocal() as session:
            # Check if user exists
            email = "admin@example.com"
            result = await session.execute(select(User).where(User.email == email))
            existing_user = result.scalars().first()
            
            pwd = "password123"
            hashed = get_password_hash(pwd)
            
            if existing_user:
                print(f"User {email} already exists. Updating password and role...")
                existing_user.hashed_password = hashed
                existing_user.role = UserRole.ADMIN
            else:
                print(f"Creating new admin user {email}...")
                new_user = User(
                    email=email,
                    hashed_password=hashed,
                    full_name="System Admin",
                    role=UserRole.ADMIN,
                    is_active=True
                )
                session.add(new_user)
            
            await session.commit()
            print(f"Success! Login with:\nEmail: {email}\nPassword: {pwd}")

    except Exception as e:
        print(f"Error creating admin: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    asyncio.run(create_admin())
