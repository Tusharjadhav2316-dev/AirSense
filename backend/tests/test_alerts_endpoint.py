import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_alerts():
    """Test GET /alerts returns active list of threshold alerts."""
    response = client.get("/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "alerts" in data
    assert isinstance(data["alerts"], list)
    assert len(data["alerts"]) >= 1

def test_dismiss_alert():
    """Test DELETE /alerts/{id} dismisses specific alert."""
    response = client.delete("/alerts/alt-101")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify it is no longer returned in GET /alerts
    get_res = client.get("/alerts")
    alerts = get_res.json()["alerts"]
    assert not any(a["id"] == "alt-101" for a in alerts)
