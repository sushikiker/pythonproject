import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from src.main import app
from src.tests.conftest import delete_test_user, async_client

@pytest.mark.asyncio
class TestUserLogin:

    _payload = {"email": "testemail@gmail.com",
            "password": "12345567"}
    
    _url='/users/login'


    async def test_successful_login(self, async_client: AsyncClient):

        response = await async_client.post(url=self._url, json = self._payload)
        assert response.status_code == 200
        data: dict = response.json()
        assert 'access_token' in data
        assert 'token_type' in data
        assert data.get('token_type') == 'bearer'
        assert 'refresh_token' in data

        

    
    @pytest.mark.parametrize('payload, status_code',
                             [
                ({"email": "testemailwrong@gmail.com", "password": "12345567"},401),
                ({"email": "testemail@gmail.com", "password": "12345567wrong"},401),
                             ])
    async def test_wrong_data_login(self, async_client: AsyncClient, payload, status_code):

        response = await async_client.post(url=self._url, json= payload)
        assert response.status_code == status_code
    
    @pytest.mark.parametrize('payload, status_code',
                             [
                                ({}, 422),
                                ({"email": "", "password": "12345567"}, 422),
                                ({"email": "testemail@gmail.com", "password": ""}, 422),
                                ({"password": "12345567"}, 422),
                                ({"email": "testemail@gmail.com"}, 422),
                                ({"email": "testemail@gmail.com"*300, "password": "12345567"}, 422),
                                ({"email": "testemail@gmail.com", "password": "1"}, 422),
                                ({"email": "testemail@gmail.com", "password": "1"*300}, 422),
                                ({"email": "testemailgmail.com", "password": "12345567"}, 422),
                                ({"email": None, "password": "12345567"}, 422),
                                ({"email": "testemailwrong@gmail.com", "password": None}, 422),
                             ])
    
    async def test_invalid_form_login(self, async_client: AsyncClient, payload, status_code):
        
        response = await async_client.post(url=self._url, json = payload)
        assert response.status_code == status_code
