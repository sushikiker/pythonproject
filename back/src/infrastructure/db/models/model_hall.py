from __future__ import annotations 
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String
from typing import List
from src.infrastructure.db.models.models import Base


class Hall(Base):
    __tablename__ = 'halls'
    id: Mapped[int] = mapped_column(primary_key=True)
    hall_name: Mapped[str] = mapped_column(unique=True)

    many_seats: Mapped[List['Seat']] = relationship('Seat', back_populates='one_hall')

    many_seance: Mapped[List['Seance']] = relationship('Seance', back_populates= 'one_hall')