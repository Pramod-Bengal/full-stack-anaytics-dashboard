from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import models, schemas, deps, database

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(deps.get_current_active_user)):
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

