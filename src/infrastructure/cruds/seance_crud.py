from src.infrastructure.db.models import Seance
from src.infrastructure.database import session_fabric
from sqlalchemy import update, select, delete
from typing import Optional
import asyncio
from sqlalchemy.exc import IntegrityError
class Seance_CRUD:

    async def add_seance(self,movie_id: int,hall_id: int,price: int,time_end: str,time_start: str):
        async with session_fabric() as session:
            try:
                new_seance = Seance(movie_id = movie_id, hall_id = hall_id,price = price,
                                    time_start = time_start, time_end = time_end)
                session.add(new_seance)
                await session.commit()
                await session.refresh(new_seance)
                return new_seance
            except IntegrityError:
                await session.rollback()
                return None

    
    async def select_seance(self,id: int):
        async with session_fabric() as session:
            query = select(Seance).where(Seance.id == id)
            result = await session.execute(query)
            return result.scalar_one_or_none()
            
    async def select_seances(self):
        async with session_fabric() as session:
            query = select(Seance)
            result = await session.execute(query)
            return result.scalars().all()
    
    async def update_seance(self,id: int, movie_id: Optional[int] = None,hall_id: Optional[int]= None
                           ,price: Optional[int]= None,time_start: Optional[str]= None, time_end: Optional[str] = None):
        async with session_fabric() as session:
            try:
                    
                updated_data = {
                    "movie_id": movie_id,
                    "hall_id": hall_id,
                    "price": price,
                    "time_start": time_start,
                    "time_end": time_end
                }

                updated_data = {k: v for k, v in updated_data.items() if v is not None}

                if not updated_data:
                    return None
                
                stmt = update(Seance).where(Seance.id == id).values(**updated_data)
                result = await session.execute(stmt)
                if result.rowcount == 0:
                    return False
                await session.commit()
                new_result = await self.select_seance(id=id)
                return new_result
            except IntegrityError:
                await session.rollback()
                return 'hall'

    async def delete_seance(self,id: int):
        async with session_fabric() as session:
            query = delete(Seance).where(Seance.id == id)
            result = await session.execute(query)
            if result.rowcount == 0:
                return False
            await session.commit()
            return True
        
