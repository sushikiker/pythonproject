import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from src.main import app
from src.tests.conftest import delete_test_user, async_client
from src.services.jwt_service.jwt_service import JWTToken
from datetime import datetime,timedelta, timezone
import jwt
from src.services.jwt_service.config_jwt import SECRET_KEY, ALGORITHM

token = JWTToken

@pytest.mark.asyncio
class TestJWTToken:

    _payload = {"email": "testemail@gmail.com",
            "password": "12345567",
            "role": "admin",}
    
    _url_login = '/users/login'
    _url_profile = '/users/profile'
    _url_refresh = '/users/refresh'

    async def test_successful_jwt(self,async_client: AsyncClient):
        response_login = await async_client.post(url= self._url_login, json = self._payload)
        data: dict = response_login.json()
        jwt_access = data.get('access_token')
        headers = {"Authorization": f"Bearer {jwt_access}"}
        response_profile = await async_client.get(url= self._url_profile, headers= headers)

        assert response_profile.status_code == 200


    async def test_successful_refresh_jwt(self,async_client: AsyncClient):
        response_login = await async_client.post(url= self._url_login, json = self._payload)
        data: dict = response_login.json()
        jwt_refresh = data.get('refresh_token')
        headers = {"Authorization": f"Bearer {jwt_refresh}"}
        response_refresh = await async_client.post(url = self._url_refresh, headers=headers)
        assert response_refresh.status_code == 200

        
    async def test_expired_access_jwt(self, async_client: AsyncClient):
        response_login = await async_client.post(url=self._url_login, json=self._payload)
        data: dict = response_login.json()
        jwt_access = data.get("access_token")

        decoded_token = jwt.decode(jwt_access, options={"verify_signature": False})
        decoded_token["exp"] = datetime.now(timezone.utc) - timedelta(days=1) 
        expired_token = jwt.encode(decoded_token, SECRET_KEY, algorithm=ALGORITHM)

        headers = {"Authorization": f"Bearer {expired_token}"}
        response_profile = await async_client.get(url=self._url_profile, headers=headers)
        assert response_profile.status_code == 401

    async def test_expired_refresh_jwt(self,async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_refresh = data.get('refresh_token')
        
        decoded_token = jwt.decode(jwt=jwt_refresh, options={'verify_signature': False})
        decoded_token['exp'] = datetime.now(timezone.utc) - timedelta(days=1)
        expired_token = jwt.encode(payload=decoded_token, algorithm= ALGORITHM, key= SECRET_KEY)

        headers = {"Authorization": f"Bearer {expired_token}"}
        response = await async_client.post(url= self._url_refresh, headers= headers)
        assert response.status_code == 401

    async def test_access_as_refresh(self,async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_access = data.get('access_token')
        headers = {"Authorization": f"Bearer {jwt_access}"}
        response = await async_client.post(url= self._url_refresh, headers= headers)
        assert response.status_code == 401

    async def test_refresh_as_access(self,async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_refresh = data.get('refresh_token')
        headers = {'Authorization': f'Bearer {jwt_refresh}'}
        response = await async_client.get(url=self._url_profile, headers = headers)
        assert response.status_code == 401

    async def test_invalid_signature_access(self,async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_access = data.get('access_token')
        decoded_token = jwt.decode(jwt= jwt_access,options={'verify_signature': False})
        fake_token = jwt.encode(decoded_token,'wrong-key',ALGORITHM)
        headers = {'Authorization': f'Bearer {fake_token}'}
        response = await async_client.get(url=self._url_profile, headers = headers)
        assert response.status_code == 400

    async def test_invalid_signature_refresh(self,async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_refresh = data.get('refresh_token')
        decoded_token = jwt.decode(jwt= jwt_refresh,options={'verify_signature': False})
        fake_token = jwt.encode(decoded_token,'wrong-key',ALGORITHM)
        headers = {'Authorization': f'Bearer {fake_token}'}
        response = await async_client.get(url=self._url_profile, headers = headers)
        assert response.status_code == 400
    
    async def test_invalid_header_access(self, async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_access = data.get('access_token')
        decoded_token = jwt.decode(jwt= jwt_access,options={'verify_signature': False})
        fake_token = jwt.encode(decoded_token,SECRET_KEY,algorithm="HS512")
        headers = {'Authorization': f'Bearer {fake_token}'}
        response = await async_client.get(url=self._url_profile, headers = headers)
        assert response.status_code == 400
    
    async def test_invalid_header_refresh(self, async_client: AsyncClient):
        response_login = await async_client.post(url = self._url_login, json= self._payload)
        data: dict = response_login.json()
        jwt_refresh = data.get('refresh_token')
        decoded_token = jwt.decode(jwt= jwt_refresh,options={'verify_signature': False})
        fake_token = jwt.encode(decoded_token,SECRET_KEY,algorithm="HS512")
        headers = {'Authorization': f'Bearer {fake_token}'}
        response = await async_client.post(url=self._url_refresh, headers = headers)
        assert response.status_code == 400
    
    async def test_invalid_tokens(self, async_client: AsyncClient):
        headers = {"Authorization": "Bearer this.is.not.a.valid.token"}
        response = await async_client.get(url=self._url_profile, headers=headers)
        assert response.status_code == 401
        response = await async_client.post(url=self._url_refresh, headers=headers)
        assert response.status_code == 401
    
    @pytest.mark.parametrize('headers,status',
            [
                ({'Authorization':''},401),
                ({"Authorization": "Bearer"},401),
                ({"Authorization": "InvalidToken"},401),
            ]
    )
    async def test_forms_tokens(self, async_client: AsyncClient, headers, status):
        response = await async_client.get(url=self._url_profile, headers=headers)
        assert response.status_code == status
        response = await async_client.post(url=self._url_refresh, headers=headers)
        assert response.status_code == status 
