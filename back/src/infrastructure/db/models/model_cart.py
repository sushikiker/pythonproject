from __future__ import annotations 
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.infrastructure.db.models.models import Base

class CartModel(Base):
    __tablename__ = "cart"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    seance_id: Mapped[int] = mapped_column(ForeignKey("seances.id", ondelete="CASCADE"))
    seat_id: Mapped[int] = mapped_column(ForeignKey("seats.id", ondelete="CASCADE"))

    user: Mapped["User"] = relationship(back_populates="cart_items")
    seance: Mapped["Seance"] = relationship(back_populates="cart_items")
    seat: Mapped["Seat"] = relationship(back_populates="cart_items")