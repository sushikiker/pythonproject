from pydantic import BaseModel, Field, EmailStr
from src.infrastructure.db.models.model_roles import Roles

class Base(BaseModel):
    pass


class UserValidation(Base):
    email: EmailStr = Field(max_length=50)
    password: str = Field(min_length=6, max_length=255)
    role: Roles

class UserResponse(Base):
    id: int
    email: EmailStr
    role: Roles

class UserLogin(Base):
    email: EmailStr = Field(max_length=50)
    password: str = Field(min_length=6, max_length=255)





