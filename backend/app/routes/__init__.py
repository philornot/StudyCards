from app.database import get_db
from app.models import Set as SetModel, Card as CardModel
from app.schemas import Set, SetCreate, SetListItem
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

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
    ).outerjoin(CardModel).group_by(SetModel.id).order_by(SetModel.id.desc()).all()

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


@router.post("/sets", response_model=Set, status_code=status.HTTP_201_CREATED)
async def create_set(set_data: SetCreate, db: Session = Depends(get_db)):
    """Create a new set with cards"""
    new_set = SetModel(
        title=set_data.title,
        description=set_data.description
    )
    db.add(new_set)
    db.flush()

    for idx, card_data in enumerate(set_data.cards):
        card = CardModel(
            set_id=new_set.id,
            term=card_data.term,
            definition=card_data.definition,
            order=card_data.order if card_data.order >= 0 else idx
        )
        db.add(card)

    db.commit()
    db.refresh(new_set)

    return new_set


@router.get("/sets/{set_id}", response_model=Set)
async def get_set(set_id: int, db: Session = Depends(get_db)):
    """Get a specific set with all its cards"""
    set_obj = db.query(SetModel).filter(SetModel.id == set_id).first()

    if not set_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Set with id {set_id} not found"
        )

    return set_obj


@router.put("/sets/{set_id}", response_model=Set)
async def update_set(set_id: int, set_data: SetCreate, db: Session = Depends(get_db)):
    """Update an existing set with cards"""
    # Check if set exists
    set_obj = db.query(SetModel).filter(SetModel.id == set_id).first()

    if not set_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Set with id {set_id} not found"
        )

    # Update set fields
    set_obj.title = set_data.title
    set_obj.description = set_data.description

    # Delete all existing cards (cascade will handle this)
    db.query(CardModel).filter(CardModel.set_id == set_id).delete()

    # Add new cards
    for idx, card_data in enumerate(set_data.cards):
        card = CardModel(
            set_id=set_id,
            term=card_data.term,
            definition=card_data.definition,
            order=card_data.order if card_data.order >= 0 else idx
        )
        db.add(card)

    db.commit()
    db.refresh(set_obj)

    return set_obj


@router.delete("/sets/{set_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_set(set_id: int, db: Session = Depends(get_db)):
    """Delete a set and all its cards"""
    set_obj = db.query(SetModel).filter(SetModel.id == set_id).first()

    if not set_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Set with id {set_id} not found"
        )

    db.delete(set_obj)
    db.commit()

    return None