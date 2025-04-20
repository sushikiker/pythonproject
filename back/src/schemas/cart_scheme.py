from pydantic import BaseModel, Field

class CartCreate(BaseModel):
    user_id: int = Field(...)
    seance_id: int = Field(...)
    seat_id: int = Field(...)

class CartResponse(BaseModel):
    id: int
    user_id: int
    seance_id: int
    seat_id: int

    class Config:
        from_attributes = True