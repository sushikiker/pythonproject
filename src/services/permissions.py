from src.infrastructure.db.models.model_roles import Roles
from src.services.jwt_service.jwt_service import JWTToken
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

jwt = JWTToken()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


class Permissions:
    @staticmethod
    async def check_permissions(token: str = Depends(oauth2_scheme)):
        result = jwt.verify_jwt_token(token)
        user = result.get('role')
        if user != str(Roles.admin):
            raise HTTPException(status_code=403, detail='Access forbidden')
        return result