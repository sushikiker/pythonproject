from src.infrastructure.db.models.model_movie import Movie
from src.infrastructure.database import session_fabric
from sqlalchemy import update, select, delete
from sqlalchemy.exc import IntegrityError
from typing import Optional
import asyncio

class Movie_CRUD:

    async def add_movie(self,movie_name: str,movie_description: str,movie_duration: str,movie_censor: str):
        async with session_fabric() as session:
            try:
                new_movie = Movie(movie_name=movie_name,movie_description=movie_description,
                                movie_duration = movie_duration, movie_censor = movie_censor)
                session.add(new_movie)
                await session.commit()
                await session.refresh(new_movie)
                return new_movie
            except IntegrityError:
                await session.rollback()
                return None

    async def select_movie(self,id: int):
        async with session_fabric() as session:
            query = select(Movie).where(Movie.id == id)
            result = await session.execute(query)
            return result.scalar_one_or_none()
        
        
    async def select_movies(self):
        async with session_fabric() as session:
            query = select(Movie)
            result = await session.execute(query)
            return result.scalars().all()
            
    
    async def update_movie(self,id: int, movie_name: Optional[str] = None,movie_description: Optional[str]= None
                           ,movie_duration: Optional[str]= None,movie_censor: Optional[str]= None):
        async with session_fabric() as session:

            updated_data = {
                "movie_name": movie_name,
                "movie_description": movie_description,
                "movie_duration": movie_duration,
                "movie_censor": movie_censor
            }

            updated_data = {k: v for k, v in updated_data.items() if v is not None}

            if not updated_data:
                return False
            try:
                stmt = update(Movie).where(Movie.id == id).values(**updated_data)
                result = await session.execute(stmt)
            

                if result.rowcount == 0:
                    return False
                await session.commit()
                new_movie = await self.select_movie(id=id)
                return new_movie
            except IntegrityError:
                await session.rollback()
                return None

    async def delete_movie(self,id: int):
        async with session_fabric() as session:
            query = delete(Movie).where(Movie.id == id)
            result = await session.execute(query)
            if result.rowcount == 0:
                return False
            await session.commit()
            return True
        
# test = Movie_CRUD()
# # a = asyncio.run(test.add_movie(name='forest gump 2', description='top', duration='2:30', censor = '16+'))
# # # a = asyncio.run(test.select_movie(id=2))
# # # a = asyncio.run(test.update_movie(id = 2, movie_description='good film'))
# a = asyncio.run(test.delete_movie(id = 3))
# print(a)