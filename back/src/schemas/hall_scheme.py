from pydantic import BaseModel, Field
from typing import Optional

class HallCreate(BaseModel):
    hall_name: str = Field(...)

class HallResponse(BaseModel):  
    id: int
    hall_name: str
    
    class Config:
        from_attributes = True