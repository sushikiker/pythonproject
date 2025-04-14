from src.services.crud_services.seat_service import SeatService
from src.infrastructure.cruds.seat_crud import SeatCRUD
from fastapi import APIRouter, Depends
from src.schemas.seat_scheme import SeatCreate, SeatResponse, SeatUpdate
from typing import Annotated
from src.services.jwt_service.jwt_service import JWTToken
from src.services.permissions import Permissions
from src.infrastructure.db.models.model_roles import Roles

router = APIRouter()
jwt = JWTToken()

@router.get('/get_seat/{seat_id}', response_model = SeatResponse, status_code=200)
async def get_seat(seat_id:int, token: dict = Depends(jwt.verify_jwt_token),
                    service: SeatService = Depends()):
    seat = await service.get_seat(id=seat_id)
    return seat


@router.get('/get_free_seats/{hall_id}',status_code=200)
async def get_free_seats(hall_id: int, service: SeatService = Depends(), token: dict = Depends(jwt.verify_jwt_token)):
    seats = await service.get_free_seats_by_hall_id(hall_id)
    return seats


@router.post('/add_seat', response_model= SeatResponse,status_code=201)
async def add_seat(seat: SeatCreate, token: dict = Depends(Permissions.check_permissions),
                    service: SeatService = Depends()):
    new_seat = await service.add_seat(seat)
    return new_seat


@router.put('/update_seat', response_model = SeatResponse,status_code=201)
async def update_seat(seat: SeatUpdate, service: SeatService = Depends(),
                      token: dict = Depends(Permissions.check_permissions)):
    updated_seat = await service.update_seat(seat)
    return updated_seat


@router.delete('/delete_seat/{seat_id}', status_code=200)
async def delete_seat(seat_id: int, service: SeatService = Depends(),
                      token: dict = Depends(Permissions.check_permissions)):
    deleted_seat = await service.delete_seat(seat_id)
    return deleted_seat