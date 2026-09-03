import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_full_lifecycle():
    """Test user registration, duplicate prevention, login, and /auth/me retrieval."""
    test_email = f"testuser_day11_{int(time.time())}@example.com"
    test_pass = "securepassword123"
    
    # 1. Register new user
    reg_res = client.post(
        "/auth/register",
        json={
            "email": test_email,
            "password": test_pass,
            "health_profile": "asthma",
            "home_location": "Pune"
        }
    )
    assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == test_email
    assert reg_data["user"]["health_profile"] == "asthma"
    assert reg_data["user"]["home_location"] == "Pune"
    
    # 2. Duplicate registration attempt must fail with 400
    dup_res = client.post(
        "/auth/register",
        json={
            "email": test_email,
            "password": test_pass,
            "health_profile": "none",
            "home_location": "Delhi"
        }
    )
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]

    # 3. Login with wrong password must fail with 401
    bad_login = client.post(
        "/auth/login",
        json={"email": test_email, "password": "wrongpassword"}
    )
    assert bad_login.status_code == 401

    # 4. Login with correct password must succeed
    login_res = client.post(
        "/auth/login",
        json={"email": test_email, "password": test_pass}
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    token = login_data["access_token"]
    assert len(token) > 20

    # 5. Fetch /auth/me with Bearer token
    me_res = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == test_email
    assert me_data["health_profile"] == "asthma"
    assert me_data["home_location"] == "Pune"
