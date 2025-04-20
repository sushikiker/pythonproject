from pydantic import BaseModel, Field
from typing import Optional

class SeanceCreate(BaseModel):
    movie_id: int = Field(...,gt = 0)
    hall_id: int = Field(...,gt = 0)
    price: int = Field(...,ge = 0)
    time_start: str = Field(...)
    time_end: str = Field(...)

class SeanceUpdate(BaseModel):
    id: int
    movie_id: Optional[int] = Field(None,gt = 0)
    hall_id: Optional[int]= Field(None,gt = 0)
    price: Optional[int]= Field(None,ge = 0)
    time_start: Optional[str]= None
    time_end: Optional[str] = None

class SeanceResponse(BaseModel):
    id: int 
    movie_id: int
    hall_id: int
    price: int
    time_start: str
    time_end: str

    class Config:
        from_attributes = True



