from __future__ import annotations
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String
from typing import List
from src.infrastructure.db.models.models import Base



class Movie(Base):
    __tablename__ = 'movies'
    id: Mapped[int] = mapped_column(primary_key=True)
    movie_name: Mapped[str] = mapped_column(String(50), unique = True)
    movie_description: Mapped[str] = mapped_column(nullable=True)
    movie_duration: Mapped[str]
    movie_censor: Mapped[str]
    
    many_seance: Mapped[List['Seance']] = relationship('Seance', back_populates='one_movie')
