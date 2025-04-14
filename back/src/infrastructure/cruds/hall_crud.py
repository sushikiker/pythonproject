from src.infrastructure.db.models import Hall
from src.infrastructure.database import session_fabric
from src.schemas.hall_scheme import HallCreate
from sqlalchemy import select, delete, update
from sqlalchemy.exc import IntegrityError
from typing import Optional
import asyncio

class HallCRUD:

    async def select_hall(self,id:int):
        async with session_fabric() as session:
            query = select(Hall).where(Hall.id == id)
            result = await session.execute(query)
            return result.scalar_one_or_none()
    
    async def select_all_halls(self):
        async with session_fabric() as session:
            query = select(Hall)
            result = await session.execute(query)
            return result.scalars().all()
    
    async def add_hall(self, hall_name: HallCreate):
        async with session_fabric() as session:
            try:
                new_hall = Hall(hall_name = hall_name)
                session.add(new_hall)
                await session.commit()
                await session.refresh(new_hall)
                return new_hall
            except IntegrityError:
                await session.rollback()
                return None


    async def delete_hall(self, id: int):
        async with session_fabric() as session:
            query = delete(Hall).where(Hall.id == id)
            result = await session.execute(query)
            if result.rowcount == 0:
                return False
            await session.commit()
            return True
        
# test = HallCRUD()
# a = asyncio.run(test.select_hall(1))
# print(a.hall_name)