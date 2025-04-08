from fastapi import FastAPI, Depends, APIRouter, HTTPException
from src.schemas.users_scheme import UserResponse, UserValidation, UserLogin
from src.infrastructure.db.repositories.user import UserData
from typing import Annotated
from src.schemas.jwt_scheme import Token_scheme
from src.services.jwt_service.jwt_get_user import JWT_User
from src.infrastructure.db.models.model_user import User
from src.services.jwt_service.jwt_service import JWTToken
import asyncio
router = APIRouter()

user_service = UserData()
jwt_service = JWT_User()
jwt_refresh = JWTToken()

@router.post('/registration', response_model= UserResponse, status_code= 201)
async def register(user: Annotated[UserValidation , Depends(user_service.add_user)]):
    return user


@router.post('/login', response_model = Token_scheme)
async def login(user: Annotated[UserLogin,Depends(user_service.login_user_by_email)]):
    return user

@router.get('/profile', response_model= UserResponse)
async def profile(user = Depends(jwt_service.get_user_by_jwt)):
    return user

@router.post('/refresh')
async def refresh(jwt_refresh: str = Depends(jwt_refresh.verify_refresh_token)):
    return jwt_refresh