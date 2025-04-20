from src.infrastructure.cruds.cart_crud import CartCRUD
from src.schemas.cart_scheme import CartCreate, CartResponse
from fastapi import Depends, HTTPException
from src.infrastructure.redis.redis_pool import get_pool
import json


class CartService:

    def __init__(self,model: CartCRUD = Depends(),redis = Depends(get_pool)):
        self.model = model
        self.redis = redis

    async def _add_cached_carts(self, result: CartResponse):
        pattern_carts = f'carts_list:{result.user_id}'

        cached_carts = await self.redis.get(pattern_carts)
        if cached_carts:
            data = json.loads(cached_carts)
            data.append(result.model_dump())
            await self.redis.set(pattern_carts, json.dumps(data), ex = 300)

    async def get_cart(self,id:int):
        pattern = f'cart:{id}'
        cart = await self.redis.get(pattern)
        if cart:
            data = json.loads(cart)
            output = CartResponse.model_validate(data)
            return output
        
        result = await self.model.select_cart(id=id)
        if result is None:
            raise HTTPException(status_code=404, detail='Cart not found')
        
        validated = CartResponse.model_validate(result)
        await self.redis.set(pattern,json.dumps(validated),ex=300)

        return validated
    
    async def get_carts_by_user_id(self,user_id: int):
        pattern = f'carts_list:{user_id}'
        carts = await self.redis.get(pattern)

        if carts:
            data = json.loads(carts)
            result = [CartResponse.model_validate(cart) for cart in data]
            return result
        
        result = await self.model.select_carts_by_user_id(user_id=user_id)
        if not result:
            raise HTTPException(status_code=404, detail="User's carts not found")
        
        data = [CartResponse.model_validate(cart) for cart in result]
        json_data = [d.model_dump() for d in data]
        
        await self.redis.set(pattern,json.dumps(json_data),ex=300)

        return data
    
    async def add_cart(self,data: CartCreate):
        result = await self.model.add_cart(**data.model_dump())
        if result is None:
            raise HTTPException(status_code=400, detail='Invalid data(seance_id, user_id or seat_id)')
        cart = CartResponse.model_validate(result)

        pattern = f'cart:{cart.id}'
        await self.redis.set(pattern,cart.model_dump_json(),ex=300)
        await self._add_cached_carts(result=cart)

        return cart
    
    async def delete_cart(self,id:int):
        pattern_id = f'cart:{id}'

        cart = await self.model.select_cart(id=id)
        if not cart:
            raise HTTPException(status_code=404, detail='Cart not found')
        
        await self.model.delete_cart(id = id)

        await self.redis.delete(pattern_id)

        pattern_user = f'carts_list:{cart.user_id}'

        data = await self.redis.get(pattern_user)
        if data:
            cached_data = json.loads(data)

            new_carts = [s for s in cached_data if s.get('id') != id]

            await self.redis.set(pattern_user, json.dumps(new_carts), ex = 300)

        return {'message':'Cart deleted successfully'}

    async def delete_cart_by_user_id(self, user_id: int):
        user_carts = await self.model.select_carts_by_user_id(user_id=user_id)

        if not user_carts:
            raise HTTPException(status_code=404, detail="User's cart empty")

        await self.model.delete_cart_by_user_id(user_id=user_id)

        for cart in user_carts:
            redis_key = f"cart:{cart.id}"
            await self.redis.delete(redis_key)

        list_key = f"carts_list:{user_id}"
        await self.redis.delete(list_key)

        return {'message': 'Cart successfully deleted'}

    

    
