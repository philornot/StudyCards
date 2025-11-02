from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class ReviewQuality(enum.Enum):
    AGAIN = 0
    HARD = 3
    GOOD = 4
    EASY = 5


class Set(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    cards = relationship(
        "Card",
        back_populates="set",
        cascade="all, delete-orphan",
        order_by="Card.order"
    )


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    set_id = Column(Integer, ForeignKey("sets.id", ondelete="CASCADE"), nullable=False)
    term = Column(String(500), nullable=False)
    definition = Column(Text, nullable=False)
    order = Column(Integer, nullable=False, default=0)

    set = relationship("Set", back_populates="cards")
    progress = relationship("CardProgress", back_populates="card", uselist=False, cascade="all, delete-orphan")


class CardProgress(Base):
    __tablename__ = "card_progress"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    ease_factor = Column(Float, nullable=False, default=2.5)
    interval_days = Column(Integer, nullable=False, default=0)
    repetitions = Column(Integer, nullable=False, default=0)
    lapses = Column(Integer, nullable=False, default=0)
    last_reviewed = Column(DateTime(timezone=True), nullable=True)
    next_review = Column(DateTime(timezone=True), nullable=True, index=True)

    card = relationship("Card", back_populates="progress")