from src.schemas.users_scheme import UserValidation, UserResponse, UserLogin
from src.infrastructure.db.models.model_roles import Roles
from src.infrastructure.db.models.model_user import User
from src.infrastructure.database import session_fabric
from sqlalchemy import select, insert
import asyncio
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from src.services.hash_service import Hashes
from src.services.jwt_service.jwt_service import JWTToken
from src.schemas.jwt_scheme import Token_scheme

class UserData:
    async def add_user(self, user: UserValidation):
        try:
           
            async with session_fabric() as session:

                hasher = Hashes()
                hashed = await hasher.generate_hash(password=user.password)
                new_user = User(email=user.email,password=hashed,role=user.role)
                session.add(new_user)
                try:
                    await session.commit()
                    await session.refresh(new_user) 
                    return new_user
                except Exception as e:
                    await session.rollback()
                    raise e
            
        except IntegrityError as i:

            raise HTTPException(status_code=400, detail="User already exists")
    


    async def login_user_by_email(self,user: UserLogin):

        async with session_fabric() as session:

            query = select(User).where(User.email==user.email)
            result = await session.execute(query)
            res = result.scalars().first()

            if res:
                hasher = Hashes()
                verify = await hasher.verify_hash(password=user.password,hashed_password=res.password)
                if verify:
                    token = JWTToken()
                    jwt_token = token.create_jwt_token(user_id=res.id, role = res.role)
                    jwt_refresh = token.refresh_jwt_token(user_id=res.id, role=res.role)
                    return Token_scheme(access_token=jwt_token, refresh_token= jwt_refresh)
                else:
                    raise HTTPException(status_code=401, detail="Invalid password")
            else:               
                raise HTTPException(status_code=401, detail="User not found")
        

    async def get_user_by_id(self,user_id):

        async with session_fabric() as session:
            query = select(User).where(User.id == user_id)
            result = await session.execute(query)
            res = result.scalars().first()
            if res:
                return res
            else:
                raise HTTPException(status_code=404, detail="User not found")

            





# test = UserData()
# user1 = UserValidation(email="andgir07@mail.ru", password="saker961115", role="admin")
# userlog = UserLogin(email="andgir07@mail.ru", password="saker961115")
# a = asyncio.run(test.login_user_by_email(user1))
# print(a)
