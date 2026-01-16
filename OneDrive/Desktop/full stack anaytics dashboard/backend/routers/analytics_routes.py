from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
import models, schemas, deps, database

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

# ============================================
# CREATE - Store New Analytics Data
# ============================================
@router.post("/data", response_model=schemas.AnalyticsOut)
async def create_analytics_data(
    data: schemas.AnalyticsCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Store new analytics data in the database.
    """
    # Create new analytics record
    new_data = models.AnalyticsData(
        metric_name=data.metric_name,
        value=data.value,
        category=data.category
    )
    
    # Save to database
    db.add(new_data)
    await db.commit()
    await db.refresh(new_data)
    
    return new_data


# ============================================
# READ - Get All Analytics Data
# ============================================
@router.get("/data", response_model=List[schemas.AnalyticsOut])
async def get_analytics_data(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Retrieve analytics data from the database.
    """
    stmt = select(models.AnalyticsData)
    if category:
        stmt = stmt.where(models.AnalyticsData.category == category)
    stmt = stmt.offset(skip).limit(limit)
    
    result = await db.execute(stmt)
    return result.scalars().all()


# ============================================
# READ - Get Single Analytics Record by ID
# ============================================
@router.get("/data/{data_id}", response_model=dict)
async def get_analytics_by_id(
    data_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Get a specific analytics record by ID.
    """
    result = await db.execute(select(models.AnalyticsData).where(models.AnalyticsData.id == data_id))
    data = result.scalars().first()
    
    if not data:
        raise HTTPException(status_code=404, detail="Analytics data not found")
    
    return {
        "id": data.id,
        "metric_name": data.metric_name,
        "value": data.value,
        "category": data.category,
        "recorded_at": data.recorded_at
    }


# ============================================
# UPDATE - Update Analytics Data
# ============================================
@router.put("/data/{data_id}", response_model=dict)
async def update_analytics_data(
    data_id: int,
    metric_name: str = None,
    value: int = None,
    category: str = None,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    """
    Update existing analytics data (Admin only).
    """
    # Find the record
    result = await db.execute(select(models.AnalyticsData).where(models.AnalyticsData.id == data_id))
    data = result.scalars().first()
    
    if not data:
        raise HTTPException(status_code=404, detail="Analytics data not found")
    
    # Update fields if provided
    if metric_name is not None:
        data.metric_name = metric_name
    if value is not None:
        data.value = value
    if category is not None:
        data.category = category
    
    # Save changes
    await db.commit()
    await db.refresh(data)
    
    return {
        "message": "Analytics data updated successfully",
        "id": data.id,
        "metric_name": data.metric_name,
        "value": data.value,
        "category": data.category
    }


# ============================================
# DELETE - Delete Analytics Data
# ============================================
@router.delete("/data/{data_id}", response_model=dict)
async def delete_analytics_data(
    data_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    """
    Delete analytics data (Admin only).
    """
    # Find the record
    result = await db.execute(select(models.AnalyticsData).where(models.AnalyticsData.id == data_id))
    data = result.scalars().first()
    
    if not data:
        raise HTTPException(status_code=404, detail="Analytics data not found")
    
    # Delete the record
    await db.delete(data)
    await db.commit()
    
    return {
        "message": "Analytics data deleted successfully",
        "id": data_id
    }


# ============================================
# BULK INSERT - Store Multiple Records
# ============================================
@router.post("/data/bulk", response_model=dict)
async def create_bulk_analytics_data(
    data_list: List[schemas.AnalyticsCreate],
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Store multiple analytics records at once.
    """
    new_records = [
        models.AnalyticsData(
            metric_name=item.metric_name,
            value=item.value,
            category=item.category
        )
        for item in data_list
    ]
    
    if new_records:
        db.add_all(new_records)
        await db.commit()
    
    return {
        "message": f"{len(new_records)} analytics records stored successfully",
        "count": len(new_records)
    }

