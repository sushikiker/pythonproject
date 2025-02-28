from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy import Column, Integer, String, ForeignKey
from enum import Enum

class Base(DeclarativeBase):
    pass

class Roles(Enum):
    admin = 'admin'
    user = 'user'


class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(50),unique=True)
    password: Mapped[str] = mapped_column(String(255))
    role: Mapped[Roles]


class Movie(Base):
    __tablename__ = 'movies'
    id: Mapped[int] = mapped_column(primary_key=True)
    movie_name: Mapped[str] = mapped_column(String(50), unique = True)
    movie_description: Mapped[str] = mapped_column(nullable=True)
    movie_duration: Mapped[str]
    movie_censor: Mapped[str]
    

class Hall(Base):
    __tablename__ = 'halls'
    id: Mapped[int] = mapped_column(primary_key=True)
    hall_name: Mapped[str]


class Seat(Base):
    __tablename__ = 'seats'
    id: Mapped[int] = mapped_column(primary_key=True)
    row: Mapped[int]
    seat: Mapped[int]
    hall_id: Mapped[int] = mapped_column(ForeignKey('halls.id'))

class Seance(Base):
    __tablename__ = 'seances'
    id: Mapped[int] = mapped_column(primary_key=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey('movies.id'))
    hall_id: Mapped[int] = mapped_column(ForeignKey('halls.id'))
    price: Mapped[int]
    time_start: Mapped[str]
    time_end: Mapped[str]
    