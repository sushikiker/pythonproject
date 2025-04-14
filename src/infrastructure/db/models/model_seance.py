from __future__ import annotations
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey
from src.infrastructure.db.models.models import Base
from typing import List

class Seance(Base):
    __tablename__ = 'seances'
    id: Mapped[int] = mapped_column(primary_key=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey('movies.id', ondelete= 'CASCADE'))
    hall_id: Mapped[int] = mapped_column(ForeignKey('halls.id', ondelete = 'CASCADE'))
    price: Mapped[int]
    time_start: Mapped[str]
    time_end: Mapped[str]
    
    one_movie: Mapped['Movie'] = relationship('Movie', back_populates= 'many_seance')
    
    one_hall: Mapped['Hall'] = relationship('Hall', back_populates= 'many_seance')

    cart_items: Mapped[List["CartModel"]] = relationship(back_populates="seance", cascade="all, delete-orphan")