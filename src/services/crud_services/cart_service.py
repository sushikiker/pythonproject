from src.infrastructure.cruds.cart_crud import CartCRUD
from src.schemas.cart_scheme import CartCreate, CartResponse
from fastapi import Depends, HTTPException

class CartService:

    def __init__(self,model: CartCRUD = Depends()):
        self.model = model

    async def get_cart(self,id:int):
        result = await self.model.select_cart(id=id)
        if result is None:
            raise HTTPException(status_code=404, detail='Cart not found')
        
        return CartResponse.model_validate(result)
    
    async def add_cart(self,data: CartCreate):
        result = await self.model.add_cart(**data.model_dump())
        if result is None:
            raise HTTPException(status_code=400, detail='Invalid data(seance_id, user_id or seat_id)')
        return CartResponse.model_validate(result)
    
    async def delete_cart(self,id:int):
        result = await self.model.delete_cart(id = id)
        if not result:
            raise HTTPException(status_code=404, detail='Cart not found')
        return {'message': 'cart successfully deleted'}

    
