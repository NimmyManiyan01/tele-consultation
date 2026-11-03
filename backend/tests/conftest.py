import os
import sys

# Ensure all tests execute strictly against an isolated SQLite test database
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test_kaizentrix.db"

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db, engine
from app.seeds import seed_database

@pytest_asyncio.fixture(autouse=True)
async def initialize_test_database():
    """Initializes schema and test fixtures strictly in test_kaizentrix.db."""
    await init_db()
    await seed_database()

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac
