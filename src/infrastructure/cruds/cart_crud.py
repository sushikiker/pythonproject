from sqlalchemy import select, delete
from src.infrastructure.database import session_fabric
from src.infrastructure.db.models.model_cart import CartModel
from sqlalchemy.exc import IntegrityError

class CartCRUD:

    async def select_cart(self,id: int):
        async with session_fabric() as session:
            request = select(CartModel).where(CartModel.id == id)
            result = await session.execute(request)
            return result.scalar_one_or_none()
        

    async def add_cart(self,user_id: int, seance_id: int, seat_id: int):
        async with session_fabric() as session:
            try:
                new_cart = CartModel(user_id=user_id, seance_id=seance_id, seat_id=seat_id)
                session.add(new_cart)
                await session.commit()
                await session.refresh(new_cart)
                return new_cart
            except IntegrityError:
                await session.rollback()
                return None
            
    async def delete_cart(self,id:int):
        async with session_fabric() as session:
            request = delete(CartModel).where(CartModel.id==id)
            result = await session.execute(request)
            if result.rowcount == 0:
                return False
            await session.commit()
            return True
            