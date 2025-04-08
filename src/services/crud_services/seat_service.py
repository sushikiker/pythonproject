from src.infrastructure.cruds.seat_crud import SeatCRUD
from src.schemas.seat_scheme import SeatCreate, SeatResponse, SeatUpdate
from fastapi import HTTPException, Depends


class SeatService:

    def __init__(self,model: SeatCRUD = Depends()):
        self.model = model

    async def get_seat(self,id:int):
        seat = await self.model.select_seat(id = id)
        if seat is None:
            raise HTTPException(status_code=404, detail='Seat not found')
        
        return SeatResponse.model_validate(seat)

    async def get_free_seats(self):
        seats = await self.model.select_free_seats()
        if not seats:
            raise HTTPException(status_code=404, detail='Free seats not found')
        
        return [SeatResponse.model_validate(seat) for seat in seats]

    async def delete_seat(self,id: int):
        seats = await self.model.delete_seat(id = id)
        if not seats:
            raise HTTPException(status_code=404, detail='Seat not found')
        return {'message':'Seat deleted successfully'}
    
    async def add_seat(self, seat: SeatCreate):
        new_seat = await self.model.add_seat(**seat.model_dump(exclude_unset=True))
        if new_seat is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        if new_seat == 'hall':
            raise HTTPException(status_code=400, detail='Invalid hall_id')
        return SeatResponse.model_validate(new_seat)
    
    async def update_seat(self, seat: SeatUpdate):
        new_seat = await self.model.update_seat(**seat.model_dump(exclude_unset=True))
        if new_seat is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        if not new_seat:
            raise HTTPException(status_code=404, detail='Seat not found')
        if new_seat == 'hall':
            raise HTTPException(status_code=400, detail='Invalid hall_id')
        return SeatResponse.model_validate(new_seat)


