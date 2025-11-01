from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class CardBase(BaseModel):
    term: str = Field(..., min_length=1, max_length=500)
    definition: str = Field(..., min_length=1)
    order: int = Field(default=0, ge=0)


class CardCreate(CardBase):
    pass


class Card(CardBase):
    id: int
    set_id: int

    model_config = ConfigDict(from_attributes=True)


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