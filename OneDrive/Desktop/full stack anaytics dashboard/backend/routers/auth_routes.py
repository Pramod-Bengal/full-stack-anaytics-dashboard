from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import models, schemas, auth, database
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserOut)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    try:
        logger.info(f"Registration attempt for {user.email}")
        
        # Check existing user
        result = await db.execute(select(models.User).where(models.User.email == user.email))
        existing_user = result.scalars().first()
        
        if existing_user:
            logger.info(f"Email {user.email} already exists")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        password = user.password        
        if not password:
            raise HTTPException(status_code=400, detail="Password cannot be empty")

        hashed_password = auth.get_password_hash(password)

        new_user = models.User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            role=user.role, 
            is_active=True
        )
        
        logger.info("Saving to database...")
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        logger.info(f"User {user.email} registered successfully")
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(select(models.User).where(models.User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

