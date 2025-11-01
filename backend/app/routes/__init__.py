from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Set as SetModel, Card as CardModel
from app.schemas import Set, SetCreate, SetListItem

router = APIRouter(prefix="/api", tags=["sets"])


@router.get("/sets", response_model=list[SetListItem])
async def get_sets(db: Session = Depends(get_db)):
    """Get all sets with card count"""
    sets = db.query(
        SetModel.id,
        SetModel.title,
        SetModel.description,
        SetModel.created_at,
        func.count(CardModel.id).label("card_count")
    ).outerjoin(CardModel).group_by(SetModel.id).order_by(SetModel.created_at.desc()).all()

    return [
        SetListItem(
            id=s.id,
            title=s.title,
            description=s.description,
            created_at=s.created_at,
            card_count=s.card_count
        )
        for s in sets
    ]