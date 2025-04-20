from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from src.services.jwt_service.jwt_service import JWTToken
from src.infrastructure.db.repositories.user import UserData
import asyncio

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login", scheme_name="JWT")

class JWT_User:
    
    async def get_user_by_jwt(self,token: str = Depends(oauth2_scheme)):
        hasher = JWTToken()
        verified: dict = hasher.verify_jwt_token(token=token)
        user_id = verified.get('id')
        find_user = UserData()
        result = await find_user.get_user_by_id(user_id=user_id)
        return result




# test = JWT_User()

# test1 = JWTToken()
# a = asyncio.run(test.get_user_by_jwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwicm9sZSI6IlJvbGVzLnVzZXIiLCJleHAiOjE3NDE1MTg0MDd9.v1sS65A6lEW4RvTNctPJfloUqmPqNY9T0eNJs2OwTiw"))
# print(a)
