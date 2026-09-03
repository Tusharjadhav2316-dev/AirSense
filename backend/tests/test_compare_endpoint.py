import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_compare_endpoint_two_cities():
    """Verify POST /agent/compare with 2 cities (Pune & Delhi)."""
    response = client.post(
        "/agent/compare",
        json={
            "cities": ["Pune", "Delhi"],
            "health_profile": "asthma"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "comparative_insight" in data
    assert "cities_data" in data
    assert len(data["cities_data"]) == 2
    assert isinstance(data["comparative_insight"], str)
    assert len(data["comparative_insight"]) > 10

def test_compare_endpoint_three_cities():
    """Verify POST /agent/compare with 3 cities (Pune, Delhi, Honolulu)."""
    response = client.post(
        "/agent/compare",
        json={
            "cities": ["Honolulu", "Pune", "Delhi"],
            "health_profile": "elderly"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["cities_data"]) == 3
    assert any(c["city"] == "Honolulu" for c in data["cities_data"])
