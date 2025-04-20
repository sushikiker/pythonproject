from pydantic import BaseModel, Field
from typing import Optional

class SeatCreate(BaseModel):
    row: int = Field(..., gt = 0)
    seat: int = Field(..., gt = 0)
    status: Optional[bool] = False
    hall_id: int = Field(...)

class SeatUpdate(BaseModel):
    id: int
    row: Optional[int] = None
    seat: Optional[int] = None
    status: Optional[bool] = False
    hall_id: Optional[int] = None

class SeatResponse(BaseModel):
    id: int
    row: int
    seat: int
    status: bool
    hall_id: int
    
    class Config:
        from_attributes = True