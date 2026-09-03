"""
================================================================================
AIRSENSE — CHAT ENDPOINT UNIT & INTEGRATION TESTS (Sprint 2 — Day 9)
================================================================================
Tests POST /chat across 3 realistic conversational user questions:
  1. "Is it safe to run outside today in Pune?"
  2. "What precautions should asthmatics take?"
  3. "Why is the air quality bad today?"
================================================================================
"""

import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

TEST_QUESTIONS = [
    {
        "test_id": "Question 1 (Outdoor Safety)",
        "city": "Pune",
        "health_profile": "none",
        "message": "Is it safe to run outside today in Pune?"
    },
    {
        "test_id": "Question 2 (Asthma Precautions)",
        "city": "Delhi",
        "health_profile": "asthma",
        "message": "What precautions should asthmatics take?"
    },
    {
        "test_id": "Question 3 (Air Pollution Causes)",
        "city": "London",
        "health_profile": "none",
        "message": "Why is the air quality bad today?"
    }
]

def test_chat_endpoint_structure():
    """Test standard API payload response structure for POST /chat"""
    response = client.post(
        "/chat",
        json={
            "city": "Pune",
            "health_profile": "asthma",
            "message": "What precautions should I take today?"
        }
    )
    assert response.status_code == 200
    data = response.json()
    
    assert "response" in data
    assert "sources" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) > 0

def test_chat_realistic_questions_matrix():
    """Executes 3 realistic conversational questions through POST /chat"""
    print("\n================================================================================")
    print("RUNNING CHAT CONVERSATIONAL TEST MATRIX FOR POST /chat")
    print("================================================================================")

    for idx, q in enumerate(TEST_QUESTIONS, start=1):
        tid = q["test_id"]
        city = q["city"]
        profile = q["health_profile"]
        msg = q["message"]

        print(f"\n--- [{idx}/3] {tid} ---")
        print(f"User Question: \"{msg}\" (City: {city}, Profile: {profile})")
        
        response = client.post(
            "/chat",
            json={"city": city, "health_profile": profile, "message": msg}
        )
        assert response.status_code == 200
        data = response.json()
        
        resp_text = data["response"]
        sources = data["sources"]

        print(f"  AI Response: \"{resp_text}\"")
        print(f"  Sources Cited: {sources[:2]}")

        assert len(resp_text) > 10, "Response text too short!"
        assert len(sources) > 0, "No sources cited!"
        time.sleep(0.5)

    print("\n================================================================================")
    print("[SUCCESS] All 3 conversational chat questions passed cleanly!")
    print("================================================================================")
