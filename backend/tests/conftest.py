"""Test configuration and fixtures."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def sample_sector_data():
    return {
        "name": "Mining & Quarrying",
        "code": "MIN",
        "avg_return_rate": 0.18,
        "risk_score": 65.0,
        "growth_rate_5yr": 0.082,
        "contribution_to_gdp": 0.125,
        "employment_multiplier": 4.2,
        "priority_sector": True,
    }


@pytest.fixture
def sample_investment_data():
    return {
        "project_name": "Karo Platinum Mining Project",
        "investor_name": "Karo Holdings",
        "investor_country": "Cyprus",
        "investment_amount_usd": 4200000000.0,
        "jobs_created": 0,
        "jobs_projected": 15000,
        "licence_type": "investment_licence",
        "status": "active",
        "province": "Mashonaland West",
        "district": "Chegutu",
        "local_content_percentage": 25.0,
        "technology_transfer": True,
        "export_oriented": True,
    }
