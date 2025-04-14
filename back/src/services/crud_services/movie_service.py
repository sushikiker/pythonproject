from src.infrastructure.cruds.movie_crud import Movie_CRUD
from fastapi import HTTPException, Depends
from src.schemas.movie_scheme import MovieResponse, MovieCreate, MovieUpdate
import asyncio
from sqlalchemy.exc import IntegrityError
from src.infrastructure.redis.redis_pool import get_pool
import json

Movies = Movie_CRUD()

class MovieService:
    
    def __init__(self, movie_repository: Movie_CRUD = Depends(), redis = Depends(get_pool)):
        self.movie_repository = movie_repository
        self.redis = redis

    async def _delete_cached_data(self, id: int):
        pattern = 'movies_list'
        movies = await self.redis.get(pattern)
        if movies:
            data = json.loads(movies)
            new_data = [movie for movie in data if movie.get('id') != id]
            await self.redis.set(pattern, json.dumps(new_data), ex = 300)

    async def _update_cached_data(self, movie: MovieResponse):
        pattern = 'movies_list'
        movies = await self.redis.get(pattern)
        if movies:
            data = json.loads(movies)
            new_data = [m for m in data if m.get('id') != movie.id]
            new_data.append(movie.model_dump())
            await self.redis.set(pattern, json.dumps(new_data), ex = 300)

    
    async def get_movie(self, id: int):
        pattern = f'movie:{id}'
        cached_movie = await self.redis.get(pattern)
        if cached_movie:
            result = json.loads(cached_movie)
            return MovieResponse.model_validate(result)
        
        movie = await self.movie_repository.select_movie(id = id)
        if not movie:
            raise HTTPException(status_code=404, detail='Movie not found')
        
        result = MovieResponse.model_validate(movie)
        await self.redis.set(pattern, result.model_dump_json(), ex = 300)

        return result 
    
    
    async def get_movies(self):
        cached_movies = await self.redis.get('movies_list')
        if cached_movies:
            movie_data = json.loads(cached_movies)
            return [MovieResponse.model_validate(movie) for movie in movie_data]
        
        movies = await self.movie_repository.select_movies()
        if not movies:
            raise HTTPException(status_code=404, detail='Movies not found')
        
        result = [MovieResponse.model_validate(movie) for movie in movies]

        data = [movie.model_dump() for movie in result]

        await self.redis.set('movies_list', json.dumps(data), ex= 300)
        
        return result
    
    async def create_movie(self, movie: MovieCreate):
        new_movie = await self.movie_repository.add_movie(**movie.model_dump())
        if not new_movie:
            raise HTTPException(status_code=400, detail = 'Movie name must be unique')
        
        pattern = f'movie:{new_movie.id}'
        result = MovieResponse.model_validate(new_movie)

        await self.redis.set(pattern, result.model_dump_json(), ex = 300)
        await self._update_cached_data(movie=result)
        
        return result
    
    async def update_movie(self, movie: MovieUpdate):
        updated_movie = await self.movie_repository.update_movie(**movie.model_dump(exclude_unset=True))
        if updated_movie is None:
            raise HTTPException(status_code=400, detail = 'Movie name must be unique')
        if not updated_movie:
            raise HTTPException(status_code=404, detail = 'Movie not found')
        
        pattern = f'movie:{movie.id}'
        result = MovieResponse.model_validate(updated_movie)

        await self.redis.set(pattern, result.model_dump_json(), ex = 300)
        await self._update_cached_data(movie=result)

        return result

    
    async def delete_movie(self, id: int):
        deleted_movie = await self.movie_repository.delete_movie(id = id)
        if not deleted_movie:
            raise HTTPException(status_code=404, detail = 'Movie not found')
        pattern_movie = f'movie:{id}'

        await self.redis.delete(pattern_movie)
        await self._delete_cached_data(id=id)

        return {"message": "Movie deleted successfully"}


# test = MovieService(Movie_CRUD())
# a = asyncio.run(test.get_movie('asd'))
# print(a)