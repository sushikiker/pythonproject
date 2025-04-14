from fastapi import APIRouter,Depends
from src.services.crud_services.hall_service import HallService
from src.schemas.hall_scheme import HallResponse, HallCreate
from src.services.jwt_service.jwt_service import JWTToken
from typing import Annotated
from src.services.permissions import Permissions

jwt = JWTToken()
router = APIRouter()
token_deps = Annotated[dict, Depends(Permissions.check_permissions)]
verify_deps = Annotated[dict, Depends(jwt.verify_jwt_token)]

@router.get('/get_hall/{hall_id}', status_code=200, response_model=HallResponse)
async def get_hall(hall_id: int, token: verify_deps, service: HallService = Depends()):
    result = await service.get_hall(hall_id)
    return result

@router.get('/get_halls', status_code=200)
async def get_halls(token: verify_deps, service: HallService = Depends()):
    result = await service.get_halls()
    return result

@router.post('/add_hall', status_code=201, response_model=HallResponse)
async def add_hall(hall_name: HallCreate , token: token_deps, service: HallService = Depends()):
    result = await service.add_hall(hall_name=hall_name)
    return result

@router.delete('/delete_hall/{hall_id}',status_code=201)
async def delete_hall(hall_id: int, token: token_deps, service: HallService = Depends()):
    result = await service.delete_hall(id=hall_id)
    return result