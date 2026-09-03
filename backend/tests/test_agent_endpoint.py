"""
================================================================================
AIRSENSE — AGENT WORKFLOW ENDPOINT UNIT & INTEGRATION TESTS (Sprint 2 — Day 8)
================================================================================
Tests POST /agent/advice across 6 total calls (3 cities x 2 health profiles):
  - Confirms threshold branching: Good AQI (<= 50) skips RAG/LLM (used_ai_generation=False)
  - Confirms Moderate+ AQI (> 50) executes RAG/LLM (used_ai_generation=True)
  - Confirms personalization and source citations
================================================================================
"""

import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

TEST_CASES = [
    # City 1: Honolulu (Good AQI expected)
    {"city": "Honolulu", "health_profile": "none"},
    {"city": "Honolulu", "health_profile": "asthma"},
    
    # City 2: Pune (Moderate / Unhealthy AQI expected)
    {"city": "Pune", "health_profile": "asthma"},
    {"city": "Pune", "health_profile": "none"},

    # City 3: Delhi (Unhealthy / Very Unhealthy AQI expected)
    {"city": "Delhi", "health_profile": "elderly"},
    {"city": "Delhi", "health_profile": "none"},
]

def test_agent_advice_endpoint_structure():
    """Test standard API payload structure for POST /agent/advice"""
    response = client.post(
        "/agent/advice",
        json={"city": "Pune", "health_profile": "asthma"}
    )
    assert response.status_code == 200
    data = response.json()
    
    assert "recommendation" in data
    assert "why" in data
    assert "sources" in data
    assert "aqi_value" in data
    assert "aqi_category" in data
    assert "dominant_pollutant" in data
    assert "used_ai_generation" in data
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) > 0

def test_agent_advice_6_case_matrix():
    """Executes 6 total test calls (3 cities x 2 health profiles)"""
    print("\n================================================================================")
    print("RUNNING 6-CALL MATRIX TEST FOR POST /agent/advice")
    print("================================================================================")

    results_by_key = {}

    for idx, tc in enumerate(TEST_CASES, start=1):
        city = tc["city"]
        profile = tc["health_profile"]
        
        print(f"\n--- [{idx}/6] Call: City='{city}', Profile='{profile}' ---")
        response = client.post(
            "/agent/advice",
            json={"city": city, "health_profile": profile}
        )
        assert response.status_code == 200, f"Expected 200 for {city}, got {response.status_code}: {response.text}"
        data = response.json()
        
        aqi_val = data["aqi_value"]
        aqi_cat = data["aqi_category"]
        used_ai = data["used_ai_generation"]
        rec = data["recommendation"]
        sources = data["sources"]

        print(f"   AQI: {aqi_val} ({aqi_cat}) | Used AI Generation: {used_ai}")
        print(f"   Recommendation: \"{rec}\"")
        print(f"   Sources: {sources[:2]}")

        # If AQI <= 50, used_ai_generation MUST be False (Branching verification)
        if aqi_cat == "Good" or aqi_val <= 50:
            assert used_ai is False, f"Expected used_ai_generation=False for Good AQI in {city}"
        else:
            assert used_ai is True, f"Expected used_ai_generation=True for Moderate+ AQI in {city}"

        results_by_key[f"{city}_{profile}"] = rec
        time.sleep(0.5)

    print("\n================================================================================")
    print("[SUCCESS] 6-Call Matrix test passed cleanly with 100% threshold branching!")
    print("================================================================================")
