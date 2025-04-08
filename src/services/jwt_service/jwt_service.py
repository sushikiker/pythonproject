from src.services.jwt_service.config_jwt import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, REFRESH_TOKEN_EXPIRE_DAYS
from datetime import datetime, timedelta, UTC
import jwt
from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError, InvalidAlgorithmError
from fastapi import HTTPException, Header, Depends
from fastapi.security import OAuth2PasswordBearer
from src.infrastructure.db.models.model_roles import Roles

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
class JWTToken:

    def create_jwt_token(self, user_id: int, role: Roles):
        expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {'id': user_id,
                    'role': str(role),
                    'exp' : expire,
                    'token_type': 'access'}
        token = jwt.encode(payload=payload, key= SECRET_KEY, algorithm= ALGORITHM)
        return token
    

    def verify_jwt_token(self,token: str = Depends(oauth2_scheme)):
        try:
            result: dict = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
            if result.get('token_type') != 'access':
                raise HTTPException(status_code=401, detail="Invalid token type") 
            return result
        except InvalidSignatureError:
            raise HTTPException(status_code=400, detail="Invalid token signature")
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except DecodeError:
            raise HTTPException(status_code=401, detail="Invalid header string")
        except InvalidAlgorithmError:
            raise HTTPException(status_code=400, detail="Invalid algorithm")
        except NotImplementedError:
            raise HTTPException(status_code=400, detail="Algorithm not supported")
    
    def refresh_jwt_token(self,user_id: int, role: Roles):
        expire = datetime.now(UTC) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        payload = {'id': user_id,
                    'role': str(role),
                    'exp' : expire,
                    'token_type': 'refresh'}
        token = jwt.encode(payload=payload, key= SECRET_KEY, algorithm= ALGORITHM)
        return token
    
    def verify_refresh_token(self,refresh_token: str = Depends(oauth2_scheme)):
        try:
            result : dict = jwt.decode(refresh_token,SECRET_KEY,algorithms=[ALGORITHM])
            if result.get('token_type') != 'refresh':
                raise HTTPException(status_code=401, detail="Invalid token type") 
            id = result.get('id')
            role = result.get('role')
            expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            payload = {'id': id,
                    'role': str(role),
                    'exp' : expire,
                    'token_type': 'access'}
            token = jwt.encode(payload=payload, key= SECRET_KEY, algorithm= ALGORITHM)
            return token
        except InvalidSignatureError:
            raise HTTPException(status_code=400, detail="Invalid token signature")
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Refresh token expired')
        except DecodeError:
            raise HTTPException(status_code=401, detail="Invalid header string")
        except InvalidAlgorithmError:
            raise HTTPException(status_code=400, detail="Invalid algorithm")
        except NotImplementedError:
            raise HTTPException(status_code=400, detail="Algorithm not supported")
    
