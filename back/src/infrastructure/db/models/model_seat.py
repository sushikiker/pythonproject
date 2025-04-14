from __future__ import annotations 
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey
from src.infrastructure.db.models.models import Base
from typing import List


class Seat(Base):
    __tablename__ = 'seats'
    id: Mapped[int] = mapped_column(primary_key=True)
    row: Mapped[int]
    seat: Mapped[int]
    status: Mapped[bool] = mapped_column(default=False) 
    hall_id: Mapped[int] = mapped_column(ForeignKey('halls.id', ondelete= 'CASCADE'))

    one_hall: Mapped['Hall'] = relationship('Hall', back_populates= 'many_seats')
    cart_items: Mapped[List["CartModel"]] = relationship(back_populates="seat", cascade="all, delete-orphan")