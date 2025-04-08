from src.schemas.hall_scheme import HallCreate, HallResponse
from src.infrastructure.cruds.hall_crud import HallCRUD
from fastapi import Depends, HTTPException
from src.infrastructure.redis.redis_pool import get_pool
import json

class HallService:

    def __init__(self, model: HallCRUD = Depends(), redis = Depends(get_pool)):
        self.model = model
        self.redis = redis

    async def _delete_cached_data(self, id: int):
        pattern = 'halls_list'
        halls = await self.redis.get(pattern)
        if halls:
            data = json.loads(halls)
            new_data = [hall for hall in data if hall.get('id') != id]
            await self.redis.set(pattern, json.dumps(new_data), ex = 300)

    async def _update_cached_data(self, hall: HallResponse):
        pattern = 'halls_list'
        movies = await self.redis.get(pattern)
        if movies:
            data = json.loads(movies)
            new_data = [m for m in data if m.get('id') != hall.id]
            new_data.append(hall.model_dump())
            await self.redis.set(pattern, json.dumps(new_data), ex = 300)
    
    async def get_hall(self,id: int):
        pattern = f'hall{id}'
        cached_hall = await self.redis.get(pattern)
        if cached_hall:
            return HallResponse.model_validate_json(cached_hall)
        
        result = await self.model.select_hall(id=id)
        if result is None:
            raise HTTPException(status_code=404, detail='Hall not found')
        
        hall = HallResponse.model_validate(result)

        await self.redis.set(pattern, hall.model_dump_json(), ex = 300)

        return hall
    
    async def get_halls(self):
        cached_data = await self.redis.get('halls_list')
        if cached_data:
            cache = json.loads(cached_data)
            return [HallResponse.model_validate(c) for c in cache] 
        
        result = await self.model.select_all_halls()
        if not result:
            raise HTTPException(status_code=404, detail='Hall not found')
        
        halls = [HallResponse.model_validate(hall) for hall in result]
    
        data = [hall.model_dump() for hall in halls]
        
        await self.redis.set('halls_list', json.dumps(data), ex = 300)

        return halls
    
    async def delete_hall(self,id : int):
        pattern = f'hall{id}'
        result = await self.model.delete_hall(id=id)
        if not result:
            raise HTTPException(status_code=404, detail='Hall not found')
        
        await self.redis.delete(pattern)    
        await self._delete_cached_data(id=id)
        
        return {'message':'hall successfully deleted'}
    
    async def add_hall(self, hall_name: HallCreate):
        result = await self.model.add_hall(**hall_name.model_dump(exclude_unset=True))
        if result is None:
            raise HTTPException(status_code=400, detail='Hall name must be unique') 
        pattern = f'hall{result.id}'
        hall = HallResponse.model_validate(result)
        data = hall.model_dump()
        await self.redis.set(pattern,json.dumps(data),ex=300)
        await self._update_cached_data(hall = hall)

        return hall
