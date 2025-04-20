import pytest
from httpx import AsyncClient
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from src.tests.conftest import delete_test_user, async_client

@pytest.mark.asyncio
class TestMovieCRUD:
    
    # Test user credentials for authentication
    _user_payload = {
        "email": "testemail@gmail.com",
        "password": "12345567",
        "role": "admin",
    }
    
    # Test movie data
    _movie_payload = {
        "movie_name": "Test Movie 4",
        "movie_description": "This is a test movie",
        "movie_duration": "2:30",
        "movie_censor": "16+"
    }
    
    # API endpoints
    _url_login = '/users/login'
    _url_movies = '/movies'
    
    async def _get_token(self, async_client: AsyncClient):
        """Helper method to authenticate and get access token"""
        response = await async_client.post(url=self._url_login, json=self._user_payload)
        return response.json()['access_token']
    
    async def test_create_movie(self, async_client: AsyncClient):
        # Get authentication token
        token = await self._get_token(async_client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a movie
        response = await async_client.post(
            url=f"{self._url_movies}/add_movie", 
            json=self._movie_payload,
            headers=headers
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["movie_name"] == self._movie_payload["movie_name"]
        assert data["movie_description"] == self._movie_payload["movie_description"]
        assert data["movie_duration"] == self._movie_payload["movie_duration"]
        assert data["movie_censor"] == self._movie_payload["movie_censor"]
        assert "id" in data
        
        # Save movie ID for other tests
        TestMovieCRUD._created_movie_id = data["id"]  # Store in class-level variable
        
    async def test_get_movie(self, async_client: AsyncClient):
        # Get authentication token
        token = await self._get_token(async_client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a movie first if it doesn't exist
        if not hasattr(TestMovieCRUD, '_created_movie_id'):
            await self.test_create_movie(async_client)
        
        # Get the movie by ID
        response = await async_client.get(
            url=f"{self._url_movies}/get_movie/{TestMovieCRUD._created_movie_id}",
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == TestMovieCRUD._created_movie_id
        assert data["movie_name"] == self._movie_payload["movie_name"]
        
    async def test_get_all_movies(self, async_client: AsyncClient):
        # Get authentication token
        token = await self._get_token(async_client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a movie first if it doesn't exist
        if not hasattr(TestMovieCRUD, '_created_movie_id'):
            await self.test_create_movie(async_client)
        
        # Get all movies
        response = await async_client.get(
            url=f"{self._url_movies}/get_movies",
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Check if our test movie is in the list
        movie_exists = any(movie["id"] == TestMovieCRUD._created_movie_id for movie in data)
        assert movie_exists
        
    async def test_update_movie(self, async_client: AsyncClient):
        # Get authentication token
        token = await self._get_token(async_client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a movie first if it doesn't exist
        if not hasattr(TestMovieCRUD, '_created_movie_id'):
            await self.test_create_movie(async_client)
        
        # Update data
        update_payload = {
            "id": TestMovieCRUD._created_movie_id,
            "movie_name": "Updated Test Movie",
            "movie_description": "This is an updated test movie"
        }
        
        # Update the movie
        response = await async_client.put(
            url=f"{self._url_movies}/update_movie",
            json=update_payload,
            headers=headers
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["id"] == TestMovieCRUD._created_movie_id
        assert data["movie_name"] == update_payload["movie_name"]
        assert data["movie_description"] == update_payload["movie_description"]
        # Fields not included in update should remain unchanged
        assert data["movie_duration"] == self._movie_payload["movie_duration"]
        assert data["movie_censor"] == self._movie_payload["movie_censor"]
        
    async def test_delete_movie(self, async_client: AsyncClient):
        # Get authentication token
        token = await self._get_token(async_client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a movie first if it doesn't exist
        if not hasattr(TestMovieCRUD, '_created_movie_id'):
            await self.test_create_movie(async_client)
        
        # Delete the movie
        response = await async_client.delete(
            url=f"{self._url_movies}/delete_movie/{TestMovieCRUD._created_movie_id}",
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "successfully" in data["message"].lower()
        
        # Verify movie is deleted by trying to fetch it
        response = await async_client.get(
            url=f"{self._url_movies}/get_movie/{TestMovieCRUD._created_movie_id}",
            headers=headers
        )
        assert response.status_code == 404
        
    @pytest.mark.parametrize('invalid_payload, expected_status',
        [
            # Missing required fields
            ({"movie_description": "Test", "movie_duration": "2:30", "movie_censor": "16+"}, 422),
            ({"movie_name": "Test", "movie_duration": "2:30", "movie_censor": "16+"}, 422),
            ({"movie_name": "Test", "movie_description": "Test", "movie_censor": "16+"}, 422),
            ({"movie_name": "Test", "movie_description": "Test", "movie_duration": "2:30"}, 422),
            # Empty fields
            ({"movie_name": "", "movie_description": "Test", "movie_duration": "2:30", "movie_censor": "16+"}, 422),
            # Extremely long name (should exceed max_length)
            ({"movie_name": "A" * 100, "movie_description": "Test", "movie_duration": "2:30", "movie_censor": "16+"}, 422),
        ]
    )
    async def test_create_movie_validation(self, async_client: AsyncClient, invalid_payload, expected_status):
        # Get authentication token
        token = await self._get_token(async_client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Try to create a movie with invalid payload
        response = await async_client.post(
            url=f"{self._url_movies}/add_movie",
            json=invalid_payload,
            headers=headers
        )
        
        assert response.status_code == expected_status
        
    async def test_unauthorized_access(self, async_client: AsyncClient):
        # Try to access endpoints without authorization
        endpoints = [
            (async_client.get, f"{self._url_movies}/get_movies"),
            (async_client.get, f"{self._url_movies}/get_movie/1"),
            (async_client.post, f"{self._url_movies}/add_movie"),
            (async_client.put, f"{self._url_movies}/update_movie"),
            (async_client.delete, f"{self._url_movies}/delete_movie/1")
        ]
        
        for method, url in endpoints:
            response = await method(url)
            assert response.status_code == 401