from src.infrastructure.cruds.seat_crud import SeatCRUD
from src.schemas.seat_scheme import SeatCreate, SeatResponse, SeatUpdate
from fastapi import HTTPException, Depends
import json
from src.infrastructure.redis.redis_pool import get_pool

class SeatService:

    def __init__(self,model: SeatCRUD = Depends(), redis = Depends(get_pool)):
        self.model = model
        self.redis = redis

    async def _add_cached_seats(self, result: SeatResponse):
        pattern_seats = f'seats_list:{result.hall_id}'

        cached_seats = await self.redis.get(pattern_seats)
        if cached_seats:
            data = json.loads(cached_seats)
            data.append(result.model_dump())
            await self.redis.set(pattern_seats, json.dumps(data), ex = 300)

    async def _update_cached_seats(self, result: SeatResponse):
        pattern_seats = f'seats_list:{result.hall_id}'
        cached_seats = await self.redis.get(pattern_seats)
        if cached_seats:
            data = json.loads(cached_seats)
            new_data = [m for m in data if m.get('id') != result.id]
            if not result.status:
                new_data.append(result.model_dump())
            await self.redis.set(pattern_seats, json.dumps(new_data), ex = 300)



    async def get_seat(self,id:int):
        pattern = f'seat:{id}'
        cached_seat = await self.redis.get(pattern)
        if cached_seat:
            seat = json.loads(cached_seat)
            return SeatResponse.model_validate(seat)
        
        seat = await self.model.select_seat(id = id)
        if seat is None:
            raise HTTPException(status_code=404, detail='Seat not found')
        
        result = SeatResponse.model_validate(seat)
        data = result.model_dump_json()
        await self.redis.set(pattern, data, ex = 300)

        return result

    async def get_free_seats_by_hall_id(self, hall_id):
        pattern = f'seats_list:{hall_id}'
        cached_seats = await self.redis.get(pattern)
        if cached_seats:
            data = json.loads(cached_seats)
            return [SeatResponse.model_validate(seat) for seat in data]

        seats = await self.model.select_free_seats(hall_id=hall_id)
        if not seats:
            raise HTTPException(status_code=404, detail='Free seats not found')
        if seats == 'hall':
            raise HTTPException(status_code=400, detail='Invalid hall_id')
        
        result = [SeatResponse.model_validate(seat) for seat in seats]
        
        data = [seat.model_dump() for seat in result]

        await self.redis.set(pattern, json.dumps(data), ex = 300)

        return result
    
    async def delete_seat(self,id: int):
        pattern_id = f'seat:{id}'

        seat = await self.model.select_seat(id=id)
        if not seat:
            raise HTTPException(status_code=404, detail='Seat not found')
        
        await self.model.delete_seat(id = id)

        await self.redis.delete(pattern_id)

        pattern_hall = f'seats_list:{seat.hall_id}'

        data = await self.redis.get(pattern_hall)
        if data:
            cached_data = json.loads(data)

            new_seats = [s for s in cached_data if s.get('id') != id]

            await self.redis.set(pattern_hall, json.dumps(new_seats), ex = 300)

        return {'message':'Seat deleted successfully'}
    
    async def add_seat(self, seat: SeatCreate):
        new_seat = await self.model.add_seat(**seat.model_dump(exclude_unset=True))
        if new_seat is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        if new_seat == 'hall':
            raise HTTPException(status_code=400, detail='Invalid hall_id')
        result = SeatResponse.model_validate(new_seat)

        pattern = f'seat:{result.id}'
        cached_seat = result.model_dump_json()

        await self.redis.set(pattern,cached_seat,ex = 300)
        await self._add_cached_seats(result)

        return result
    
    async def update_seat(self, seat: SeatUpdate):
        new_seat = await self.model.update_seat(**seat.model_dump(exclude_unset=True))
        if new_seat is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        if not new_seat:
            raise HTTPException(status_code=404, detail='Seat not found')
        if new_seat == 'hall':
            raise HTTPException(status_code=400, detail='Invalid hall_id')
        
        result = SeatResponse.model_validate(new_seat)

        pattern = f'seat:{seat.id}'
        json_seat = result.model_dump_json()

        await self.redis.set(pattern,json_seat, ex = 300)
        await self._update_cached_seats(result)

        return result


