from fastapi import APIRouter, Depends
from typing import Annotated
from src.services.crud_services.seance_service import SeanceService
from src.schemas.seance_scheme import SeanceCreate, SeanceResponse, SeanceUpdate
from src.services.jwt_service.jwt_service import JWTToken
from src.services.permissions import Permissions

router = APIRouter()
jwt = JWTToken()
jwt_deps = Annotated[dict,Depends(jwt.verify_jwt_token)]
perm_deps = Annotated[dict, Depends(Permissions.check_permissions)]

@router.get('/get_seance/{seance_id}',status_code=200,response_model=SeanceResponse)
async def get_seance(seance_id: int, token: jwt_deps, service: SeanceService = Depends()):
    result = await service.get_seance(id=seance_id)
    return result

@router.get('/get_seances', status_code=200)
async def get_seances(token: jwt_deps, service: SeanceService = Depends()):
    result = await service.get_seances()
    return result

@router.post('/add_seance', status_code=201,response_model=SeanceResponse)
async def add_seance(data: SeanceCreate, perms: perm_deps, service: SeanceService = Depends()):
    result = await service.add_seance(data)
    return result

@router.delete('/delete_seance/{seance_id}', status_code=201)
async def delete_seance(seance_id: int, perms: perm_deps, service: SeanceService = Depends()):
    result = await service.delete_seance(id=seance_id)
    return result

@router.put('/update_seance', status_code=201, response_model=SeanceResponse)
async def update_seance(data: SeanceUpdate, perms: perm_deps, service: SeanceService = Depends()):
    result = await service.update_seance(data)
    return result