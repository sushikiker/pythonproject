import redis.asyncio as redis
from .config import settings
import asyncio

async def get_pool():
    redis_client = await redis.from_url(url=settings.REDIS_URL, decode_responses = True)
    return redis_client
