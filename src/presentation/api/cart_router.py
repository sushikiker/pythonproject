from src.services.crud_services.cart_service import CartService
from fastapi import APIRouter, Depends
from src.services.jwt_service.jwt_service import JWTToken
from src.services.permissions import Permissions
from typing import Annotated
from src.schemas.cart_scheme import CartCreate, CartResponse

router = APIRouter()
jwt = JWTToken()
per_deps = Annotated[dict, Depends(Permissions.check_permissions)]
jwt_deps = Annotated[dict, Depends(jwt.verify_jwt_token)]

@router.get('/get_cart/{card_id}', response_model=CartResponse, status_code=200)
async def get_cart(card_id: int, token: jwt_deps, service: CartService = Depends()):
    cart = await service.get_cart(id = card_id)
    return cart

@router.post('/add_cart', status_code=201, response_model=CartResponse)
async def add_cart(data: CartCreate, token: per_deps, service: CartService = Depends()):
    new_cart = await service.add_cart(data)
    return new_cart

@router.delete('/delete_cart/{cart_id}', status_code=201)
async def delete_cart(cart_id:int, token: per_deps, service: CartService = Depends()):
    cart = await service.delete_cart(id=cart_id)
    return cart