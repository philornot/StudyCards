from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ReviewQualityEnum(str, Enum):
    AGAIN = "again"
    HARD = "hard"
    GOOD = "good"
    EASY = "easy"


class CardBase(BaseModel):
    term: str = Field(..., min_length=1, max_length=500)
    definition: str = Field(..., min_length=1)
    order: int = Field(default=0, ge=0)


class CardCreate(CardBase):
    pass


class CardProgressResponse(BaseModel):
    id: int
    card_id: int
    ease_factor: float
    interval_days: int
    repetitions: int
    lapses: int
    last_reviewed: Optional[datetime]
    next_review: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class Card(CardBase): 
    id: int
    set_id: int
    progress: Optional[CardProgressResponse] = None

    model_config = ConfigDict(from_attributes=True)


class CardWithProgress(Card):
    progress: Optional[CardProgressResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ReviewInput(BaseModel):
    card_id: int
    quality: ReviewQualityEnum


class StudySessionStats(BaseModel):
    total_cards: int
    new_cards: int
    review_cards: int
    overdue_cards: int


class StudySessionResponse(BaseModel):
    cards: list[CardWithProgress]
    stats: StudySessionStats


class SetBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class SetCreate(SetBase):
    cards: list[CardCreate] = Field(..., min_length=1)


class SetListItem(SetBase):
    id: int
    card_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Set(SetBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    cards: list[Card]

    model_config = ConfigDict(from_attributes=True)


class SetStats(BaseModel):
    total_cards: int
    new_cards: int
    learning_cards: int
    mature_cards: int
    average_ease_factor: float
    reviews_today: int
    reviews_this_week: int
    reviews_total: int
    current_streak: int
    accuracy: float
