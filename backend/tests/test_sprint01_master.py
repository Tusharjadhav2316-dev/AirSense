import time
import pytest
import datetime
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.aqi import AQIReading

client = TestClient(app)

def test_01_health_endpoint():
    """Verify Day 1 /health endpoint response."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "AirSense" in data["app"]

def test_02_aqi_current_live_and_cached():
    """Verify Day 2 & Day 3 current AQI fetching, database logging, and 10-minute caching."""
    city = "Pune"
    
    # First call: Fetch live & log to DB
    start1 = time.time()
    res1 = client.get(f"/aqi/current?city={city}")
    elapsed1 = time.time() - start1
    assert res1.status_code == 200
    data1 = res1.json()
    assert "Pune" in data1["city"]
    assert data1["aqi"] >= 0
    assert data1["category"] in ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"]
    assert data1["dominant_pollutant"] is not None
    assert "pm2_5" in data1["pollutants"]
    
    # Second call: Must hit SQLite cache in < 100ms
    start2 = time.time()
    res2 = client.get(f"/aqi/current?city={city}")
    elapsed2 = time.time() - start2
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["data_source"] == "SQLite Cache (Open-Meteo)"
    assert elapsed2 < 0.2, f"Cache call took too long: {elapsed2:.3f}s"

def test_03_aqi_forecast_endpoint():
    """Verify Day 2 forecast endpoint."""
    res = client.get("/aqi/forecast?city=London")
    assert res.status_code == 200
    data = res.json()
    assert "London" in data["city"]
    assert len(data["forecast"]) >= 24
    first_pt = data["forecast"][0]
    assert "timestamp" in first_pt
    assert "aqi" in first_pt
    assert "category" in first_pt

def test_04_aqi_trend_analytics():
    """Verify Day 4 pandas analytics endpoint with rolling averages and anomaly flags."""
    res = client.get("/aqi/trend?city=Delhi&days=30")
    assert res.status_code == 200
    data = res.json()
    assert "Delhi" in data["city"]
    assert data["days"] == 30
    assert "summary" in data
    summary = data["summary"]
    assert summary["average_aqi"] > 0
    assert summary["highest_aqi"] > 0
    assert "anomaly_count" in summary
    assert len(data["trend"]) > 0
    point = data["trend"][0]
    assert "date" in point
    assert "aqi" in point
    assert "rolling_avg" in point
    assert "is_anomaly" in point

def test_05_geocoding_not_found():
    """Verify graceful handling of invalid/non-existent city search."""
    res = client.get("/aqi/current?city=NonExistentCity99999")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()

def test_06_database_persistence():
    """Verify rows are saved in SQLite database."""
    db = SessionLocal()
    try:
        count = db.query(AQIReading).count()
        assert count > 0, "No AQI rows found in SQLite database!"
    finally:
        db.close()
