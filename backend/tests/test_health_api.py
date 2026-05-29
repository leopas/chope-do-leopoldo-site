from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_basic() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_db_skipped_without_database() -> None:
    response = client.get("/api/health/db")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "skipped"
    assert body["database"] == "not_configured"
