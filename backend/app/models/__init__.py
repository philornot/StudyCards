from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


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