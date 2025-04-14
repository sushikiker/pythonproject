import pytest_asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from httpx import AsyncClient, ASGITransport
from src.infrastructure.database import session_fabric
from sqlalchemy import delete
from src.infrastructure.db.models.model_user import User
from src.main import app
import pytest
import asyncio

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="function")
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app),
                           base_url = "http://test") as ac:
        yield ac

@pytest_asyncio.fixture(scope='function')
async def delete_test_user():
    async with session_fabric() as session:
        request = delete(User).where(User.email == 'testemail@gmail.com')
        await session.execute(request)
        await session.commit()
    yield

# @pytest_asyncio.fixture(scope='function')
# async def login_user():
#     response = await async_client.post(url=self._url, json = self._payload)