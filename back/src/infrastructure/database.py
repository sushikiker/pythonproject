import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from src.infrastructure.config import settings_db

async_engine = create_async_engine(
    url= settings_db.DATABASE_URL_asyncpg,
    pool_size=5,
    max_overflow=10
)

session_fabric = async_sessionmaker(async_engine)




