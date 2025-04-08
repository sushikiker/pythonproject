import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from src.main import app
from src.tests.conftest import delete_test_user, async_client


@pytest.mark.asyncio
class TestUserRegistration:

    _payload = {"email": "testemail@gmail.com",
            "password": "12345567",
            "role": "admin",}
    
    _url='/users/registration'

    async def test_successful_registration(self,async_client: AsyncClient, delete_test_user):

        response = await async_client.post(url=self._url, json=self._payload)
        
        assert response.status_code == 201
        data: dict = response.json()
        assert data.get('email') == "testemail@gmail.com"
        assert 'password' not in data
        assert data.get('role') == "admin"

            
    async def test_duplicate_registraion(self,async_client: AsyncClient):
        response = await async_client.post(url=self._url, json=self._payload)
        assert response.status_code == 400


    @pytest.mark.parametrize(
            'data, status',
            [
                ({}, 422),
                ({"email": "testemail-gmailcom", "password": "12345567", "role": "admin"}, 422),
                ({"email": "testemail@gmailcom", "password": "12345567", "role": "admin"},422),
                ({"email": "testemail@gmail.", "password": "12345567", "role": "admin"},422),
                ({"email": "testemail@gmail.com", "password": "1", "role": "admin"},422),
             ])
    async def test_invalid_email_registration(self,async_client: AsyncClient, data, status):
        response = await async_client.post(url=self._url, json=data)
        assert response.status_code == status


    @pytest.mark.parametrize(
            'data, status',
            [
                ({"password": "12345567", "role": "admin"},422),
                ({"email": "testemail@gmail.com","role": "admin"},422),
                ({"email": "testemail@gmail.com", "password": "12345567"},422),
                ({"email": "testemail@gmail.com", "password": "12345567", "role": "aboba1"},422),
             ])
    async def test_invalid_form_registration(self,async_client: AsyncClient, data, status):
        response = await async_client.post(url=self._url, json=data)
        assert response.status_code == status

    @pytest.mark.parametrize(
            'data, status',
            [
                ({"email": "testemail@gmail.com", "password": "1", "role": "admin"},422),
                ({"email": "testemail@gmail.com"* 300, "password": "12345567", "role": "admin"},422),
                ({"email": "testemail@gmail.com", "password": "12345567" * 300, "role": "admin"},422),
             ])
    async def test_invalid_limits_registration(self,async_client: AsyncClient, data, status):
        response = await async_client.post(url=self._url, json=data)
        assert response.status_code == status

