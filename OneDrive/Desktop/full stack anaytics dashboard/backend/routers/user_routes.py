from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import models, schemas, deps, database, auth

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(deps.get_current_active_user)):
    return current_user

@router.put("/me", response_model=schemas.UserOut)
async def update_user_me(
    user_update: schemas.UserUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.email is not None:
        # Check if email is already taken
        if user_update.email != current_user.email:
            result = await db.execute(select(models.User).where(models.User.email == user_update.email))
            if result.scalars().first():
                raise HTTPException(status_code=400, detail="Email already registered")
            current_user.email = user_update.email
    if user_update.password is not None:
        current_user.hashed_password = auth.get_password_hash(user_update.password)
    
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[schemas.UserOut], dependencies=[Depends(deps.get_current_admin_user)])
async def read_users(
    skip: int = 0, 
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(select(models.User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users

