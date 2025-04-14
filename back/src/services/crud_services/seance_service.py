from src.infrastructure.cruds.seance_crud import Seance_CRUD
from src.schemas.seance_scheme import SeanceCreate, SeanceResponse, SeanceUpdate
from fastapi import Depends, HTTPException
from src.infrastructure.redis.redis_pool import get_pool
import json

class SeanceService:
    
    def __init__(self,model: Seance_CRUD = Depends(), redis = Depends(get_pool)):
        self.model = model
        self.redis = redis


    async def _add_cached_seances(self, result: SeanceResponse):
        pattern_seances = f'seances_list:{result.movie_id}'

        cached_seances = await self.redis.get(pattern_seances)

        if cached_seances:
            data = json.loads(cached_seances)
            data.append(result.model_dump())

            await self.redis.set(pattern_seances, json.dumps(data), ex = 300)


    async def _update_cached_seances(self, result: SeanceResponse):       
        pattern_seances = f'seances_list:{result.movie_id}'
        cached_seances = await self.redis.get(pattern_seances)

        if cached_seances:

            data = json.loads(cached_seances)
            new_data = [m for m in data if m.get('id') != result.id]
            new_data.append(result.model_dump())

            await self.redis.set(pattern_seances, json.dumps(new_data), ex = 300)


    async def add_seance(self, seance: SeanceCreate):
        new_seance = await self.model.add_seance(**seance.model_dump())
        if new_seance is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        
        result = SeanceResponse.model_validate(new_seance)

        pattern = f'seance:{result.id}'
        data = result.model_dump_json()
        await self.redis.set(pattern,data,ex=300)
        await self._add_cached_seances(result)

        return result
    
    
    async def get_seance(self,id: int):
        pattern = f'seance:{id}'
        cached_seance = await self.redis.get(pattern)
        if cached_seance:
            data = json.loads(cached_seance)
            return SeanceResponse.model_validate(data)
        
        seance = await self.model.select_seance(id=id)
        if seance is None:
            raise HTTPException(status_code = 404, detail='Seance not found')
        
        result = SeanceResponse.model_validate(seance)

        await self.redis.set(pattern,result.model_dump_json(),ex=300)

        return result
    

    async def get_seances_by_movie(self,movie_id):
        pattern = f'seances_list:{movie_id}'
        seances_list = await self.redis.get(pattern)

        if seances_list:
            data = json.loads(seances_list)
            return [SeanceResponse.model_validate(seance) for seance in data]

        seances = await self.model.select_seances_by_movie_id(movie_id=movie_id)
        if not seances:
            raise HTTPException(status_code=404, detail='Seances not found')
        result = [SeanceResponse.model_validate(seance) for seance in seances]

        data = [s.model_dump() for s in result]

        await self.redis.set(pattern,json.dumps(data),ex=300)

        return result
    

    async def delete_seance(self,id: int):
        
        pattern_id = f'seance:{id}'

        seance = await self.model.select_seance(id=id)
        if not seance:
            raise HTTPException(status_code=404, detail='Seance not found')
        
        await self.model.delete_seance(id = id)

        await self.redis.delete(pattern_id)

        pattern_seance = f'seances_list:{seance.movie_id}'

        data = await self.redis.get(pattern_seance)
        if data:
            cached_data = json.loads(data)

            new_seances = [s for s in cached_data if s.get('id') != id]

            await self.redis.set(pattern_seance, json.dumps(new_seances), ex = 300)

        return {'message':'Seance deleted successfully'}
    

    async def update_seance(self, seance: SeanceUpdate):

        old_seance = await self.model.select_seance(id=seance.id)
        if not old_seance:
            raise HTTPException(status_code=404, detail='Seance not found')
        
        old_movie_id = old_seance.movie_id

        updated_seance = await self.model.update_seance(**seance.model_dump(exclude_unset=True))
        if updated_seance is None:
            raise HTTPException(status_code=400, detail='Invalid data')
        if not updated_seance:
            raise HTTPException(status_code=404, detail='Seance not found')
        if updated_seance == 'hall':
            raise HTTPException(status_code=404, detail='Invalid hall_id or movie_id')
        
        result = SeanceResponse.model_validate(updated_seance)

        pattern = f'seance:{result.id}'
        json_seance = result.model_dump_json()
        await self.redis.set(pattern, json_seance, ex=300)
        

        if hasattr(seance, 'movie_id') and old_movie_id != result.movie_id:

            old_pattern = f'seances_list:{old_movie_id}'
            old_cached_seances = await self.redis.get(old_pattern)
            
            if old_cached_seances:
                old_data = json.loads(old_cached_seances)
                new_old_data = [m for m in old_data if m.get('id') != result.id]
                
                if new_old_data:

                    await self.redis.set(old_pattern, json.dumps(new_old_data), ex=300)
                else:

                    await self.redis.delete(old_pattern)

            await self._add_cached_seances(result)
        else:

            await self._update_cached_seances(result)
        
        return result


