from src.infrastructure.cruds.seance_crud import Seance_CRUD
from src.schemas.seance_scheme import SeanceCreate, SeanceResponse, SeanceUpdate
from fastapi import Depends, HTTPException

class SeanceService:
    
    def __init__(self, model: Seance_CRUD = Depends()):
        self.model = model

    async def add_seance(self, seance: SeanceCreate):
        new_seance = await self.model.add_seance(**seance.model_dump())
        if new_seance is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        return SeanceResponse.model_validate(new_seance)
    
    async def get_seance(self,id: int):
        seance = await self.model.select_seance(id=id)
        if seance is None:
            raise HTTPException(status_code = 404, detail='Seance not found')
        return SeanceResponse.model_validate(seance)
    
    async def get_seances(self):
        seances = await self.model.select_seances()
        if not seances:
            raise HTTPException(status_code=404, detail='Seances not found')
        return [SeanceResponse.model_validate(seance) for seance in seances]
    
    async def delete_seance(self,id):
        seance = await self.model.delete_seance(id=id)
        if not seance:
            raise HTTPException(status_code=404, detail='Seance not found')
        return {'message':'seance successfully deleted'}
    
    async def update_seance(self, seance: SeanceUpdate):
        updated_seance = await self.model.update_seance(**seance.model_dump(exclude_unset=True))
        if updated_seance is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        if not updated_seance:
            raise HTTPException(status_code=404, detail='Seance not found')
        if updated_seance == 'hall':
            raise HTTPException(status_code=404, detail='Invalid hall_id or movie_id')
        return SeanceResponse.model_validate(updated_seance)


