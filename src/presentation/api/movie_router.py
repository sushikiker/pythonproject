from src.infrastructure.cruds.movie_crud import Movie_CRUD
from fastapi import FastAPI, Depends, APIRouter
from src.schemas.movie_scheme import MovieCreate, MovieResponse, MovieUpdate
from typing import Annotated
from src.services.crud_services.movie_service import MovieService
from src.services.jwt_service.jwt_service import JWTToken
from src.services.permissions import Permissions

router = APIRouter()
jwt = JWTToken()
perms_deps = Annotated[dict, Depends(Permissions.check_permissions)]

@router.get('/get_movie/{movie_id}', response_model= MovieResponse,status_code=200)
async def get_movie(movie_id: int, movie_service: MovieService = Depends(),
                    token: dict = Depends(jwt.verify_jwt_token)):
    movie = await movie_service.get_movie(id = movie_id)
    return movie

@router.get('/get_movies',status_code=200)
async def get_movie(movie_service: MovieService = Depends(),
                    token: dict = Depends(jwt.verify_jwt_token)):
    movie = await movie_service.get_movies()
    return movie


@router.post('/add_movie',response_model=MovieResponse, status_code=201)
async def add_movie(token: perms_deps,movie: MovieCreate, movie_service: MovieService = Depends()):
    new_movie = await movie_service.create_movie(movie)
    return new_movie


@router.put('/update_movie',response_model = MovieResponse,status_code=201)
async def update_movie(token: perms_deps, movie_body: MovieUpdate, movie_service: MovieService = Depends()):
    updated_movie = await movie_service.update_movie(movie_body)
    return updated_movie


@router.delete('/delete_movie/{movie_id}',status_code=200)
async def delete_movie(token: perms_deps, movie_id: int, movie_service: MovieService = Depends()):
    movie = await movie_service.delete_movie(id = movie_id)
    return movie
