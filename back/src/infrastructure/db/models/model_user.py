from __future__ import annotations 
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from typing import List
from sqlalchemy import String

from src.infrastructure.db.models.models import Base
from src.infrastructure.db.models.model_roles import Roles

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(50),unique=True)
    password: Mapped[str] = mapped_column(String(255))
    role: Mapped[Roles]

    cart_items: Mapped[List["CartModel"]] = relationship(back_populates="user", cascade="all, delete-orphan")
