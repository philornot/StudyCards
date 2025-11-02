from app.database import get_db
from app.models import Set as SetModel, Card as CardModel, CardProgress, ReviewQuality
from app.schemas import (
    Set, SetCreate, SetListItem, Card,
    StudySessionResponse, CardWithProgress, StudySessionStats,
    ReviewInput, CardProgressResponse
)
from app.services import SpacedRepetitionService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, date
import random

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


@router.get("/sets/{set_id}/study", response_model=list[Card])
async def get_study_cards(set_id: int, db: Session = Depends(get_db)):
    """Get cards from a set in random order for studying"""
    # Check if set exists
    set_obj = db.query(SetModel).filter(SetModel.id == set_id).first()

    if not set_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Set with id {set_id} not found"
        )

    # Get all cards from the set
    cards = db.query(CardModel).filter(CardModel.set_id == set_id).all()

    # Shuffle cards randomly
    cards_list = list(cards)
    random.shuffle(cards_list)

    return cards_list


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


@router.get("/sets/{set_id}/study-sr", response_model=StudySessionResponse)
async def get_study_sr_cards(set_id: int, db: Session = Depends(get_db)):
    """
    Get cards for spaced repetition study session.
    Returns cards due for review today plus new cards (up to limit).
    """
    # Check if set exists
    set_obj = db.query(SetModel).filter(SetModel.id == set_id).first()

    if not set_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Set with id {set_id} not found"
        )

    today = datetime.now().date()
    new_cards_limit = 20

    # Get all cards with their progress
    cards = db.query(CardModel).filter(CardModel.set_id == set_id).all()

    # Categorize cards
    overdue_cards = []
    due_today_cards = []
    new_cards = []

    for card in cards:
        if card.progress is None:
            # New card (never reviewed)
            new_cards.append(card)
        else:
            next_review_date = card.progress.next_review.date() if card.progress.next_review else None

            if next_review_date is None:
                new_cards.append(card)
            elif next_review_date < today:
                # Overdue
                overdue_cards.append(card)
            elif next_review_date == today:
                # Due today
                due_today_cards.append(card)

    # Sort overdue by how overdue they are (most overdue first)
    overdue_cards.sort(
        key=lambda c: (today - c.progress.next_review.date()).days if c.progress and c.progress.next_review else 0,
        reverse=True
    )

    # Combine: overdue + due today + new (limited)
    study_cards = overdue_cards + due_today_cards + new_cards[:new_cards_limit]

    # Convert to response format
    cards_with_progress = []
    for card in study_cards:
        card_dict = {
            "id": card.id,
            "set_id": card.set_id,
            "term": card.term,
            "definition": card.definition,
            "order": card.order,
            "progress": None
        }

        if card.progress:
            card_dict["progress"] = {
                "id": card.progress.id,
                "card_id": card.progress.card_id,
                "ease_factor": card.progress.ease_factor,
                "interval_days": card.progress.interval_days,
                "repetitions": card.progress.repetitions,
                "lapses": card.progress.lapses,
                "last_reviewed": card.progress.last_reviewed,
                "next_review": card.progress.next_review
            }

        cards_with_progress.append(CardWithProgress(**card_dict))

    # Calculate stats
    stats = StudySessionStats(
        total_cards=len(study_cards),
        new_cards=len([c for c in study_cards if c.progress is None]),
        review_cards=len(overdue_cards) + len(due_today_cards),
        overdue_cards=len(overdue_cards)
    )

    return StudySessionResponse(cards=cards_with_progress, stats=stats)


@router.post("/review", response_model=CardProgressResponse)
async def submit_review(review: ReviewInput, db: Session = Depends(get_db)):
    """
    Submit a review for a card and update its progress using SM-2 algorithm.
    """
    # Check if card exists
    card = db.query(CardModel).filter(CardModel.id == review.card_id).first()

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {review.card_id} not found"
        )

    # Get or create progress
    progress = card.progress
    if progress is None:
        progress = CardProgress(
            card_id=card.id,
            ease_factor=2.5,
            interval_days=0,
            repetitions=0,
            lapses=0
        )
        db.add(progress)
        db.flush()

    # Convert quality string to enum
    quality_map = {
        "again": ReviewQuality.AGAIN,
        "hard": ReviewQuality.HARD,
        "good": ReviewQuality.GOOD,
        "easy": ReviewQuality.EASY
    }
    quality_enum = quality_map[review.quality.value]

    # Calculate next review using SM-2 algorithm
    updated_progress = SpacedRepetitionService.calculate_next_review(progress, quality_enum)

    db.commit()
    db.refresh(updated_progress)

    return updated_progress