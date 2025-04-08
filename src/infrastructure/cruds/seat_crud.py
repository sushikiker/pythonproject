from src.infrastructure.db.models import Seat
from src.infrastructure.database import session_fabric
from sqlalchemy import select, delete, update
from sqlalchemy.exc import IntegrityError
from typing import Optional
import asyncio

class SeatCRUD:

    async def select_seat(self,id:int):
        async with session_fabric() as session:
            query = select(Seat).where(Seat.id == id)
            result = await session.execute(query)
            return result.scalar_one_or_none()
    
    async def select_free_seats(self):
        async with session_fabric() as session:
            query = select(Seat).where(Seat.status == False)
            result = await session.execute(query)
            return result.scalars().all()
    
    async def delete_seat(self,id:int):
        async with session_fabric() as session:
            query = delete(Seat).where(Seat.id == id)
            result = await session.execute(query)
            if result.rowcount == 0:
                return False
            await session.commit()
            return True
    
    async def add_seat(self,row: int,seat: int, hall_id : int,status: Optional[bool] = False):
        async with session_fabric() as session:
            try:
                new_seat = Seat(row=row,seat=seat,status=status,hall_id=hall_id)
                session.add(new_seat)
                await session.commit()
                await session.refresh(new_seat)
                return new_seat
            except IntegrityError:
                await session.rollback()
                return 'hall'
        
    async def update_seat(self, id: int, row: Optional[int]= None, seat: Optional[int]= None,
                          status: Optional[bool]= None, hall_id: Optional[int]= None):
        async with session_fabric() as session:
            updated_data = {
                "row": row,
                "seat": seat,
                "status": status,
                "hall_id": hall_id
            }

            updated_data = {k: v for k, v in updated_data.items() if v is not None}

            if not updated_data:
                return None
            try:
                stmt = update(Seat).where(Seat.id == id).values(**updated_data)
                result = await session.execute(stmt)
                if result.rowcount == 0:
                    return False
                await session.commit()
                new_seat = await self.select_seat(id=id)
                return new_seat
            except IntegrityError:
                await session.rollback()
                return 'hall'


# test = SeatCRUD()
# # b = asyncio.run(test.add_seat(row=3,seat=5,hall_id=1))
# a = asyncio.run(test.select_free_seats())
# print(a)