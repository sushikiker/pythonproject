from pydantic import BaseModel, Field
from typing import Optional

class MovieCreate(BaseModel):
    movie_name: str = Field(..., max_length=50)
    movie_description: str = Field(..., max_length=1000)
    movie_duration: str = Field(...)
    movie_censor: str = Field(...)

class MovieUpdate(BaseModel):
    id: int
    movie_name: Optional[str] = None
    movie_description: Optional[str]= None
    movie_duration: Optional[str]= None
    movie_censor: Optional[str]= None

class MovieResponse(BaseModel):
    id: int
    movie_name: str
    movie_description: str
    movie_duration: str
    movie_censor: str

    class Config:
        from_attributes = True
    