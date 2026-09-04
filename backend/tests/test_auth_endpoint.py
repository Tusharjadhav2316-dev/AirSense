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

def test_google_oauth_missing_token():
    """Test /auth/oauth rejects requests without an id_token for google provider."""
    res = client.post(
        "/auth/oauth",
        json={"provider": "google", "id_token": ""}
    )
    assert res.status_code == 400
    assert "Google ID token (id_token) is required" in res.json()["detail"]

def test_google_oauth_success_and_jwt_issue(monkeypatch):
    """Test successful Google OAuth verification creates/finds user and issues valid AirSense JWT."""
    from app.core.config import settings
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_ID", "mock-google-client-id.apps.googleusercontent.com")

    fake_email = f"verified_google_{int(time.time())}@gmail.com"
    fake_sub = "google-sub-123456789"

    def mock_verify(token, client_id=None):
        assert token == "valid-mock-id-token"
        assert client_id == "mock-google-client-id.apps.googleusercontent.com"
        return {
            "iss": "https://accounts.google.com",
            "sub": fake_sub,
            "email": fake_email,
            "email_verified": True,
            "aud": "mock-google-client-id.apps.googleusercontent.com",
        }

    monkeypatch.setattr("app.api.auth.verify_google_id_token", mock_verify)

    res = client.post(
        "/auth/oauth",
        json={
            "provider": "google",
            "id_token": "valid-mock-id-token",
            "health_profile": "elderly",
            "home_location": "Mumbai"
        }
    )
    assert res.status_code == 200, f"Failed: {res.text}"
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == fake_email
    assert data["user"]["health_profile"] == "elderly"
    assert data["user"]["home_location"] == "Mumbai"

    # Verify /auth/me works with the issued token
    me_res = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {data['access_token']}"}
    )
    assert me_res.status_code == 200
    assert me_res.json()["email"] == fake_email

def test_google_oauth_invalid_token_rejection(monkeypatch):
    """Test /auth/oauth rejects invalid or forged Google tokens with 401."""
    from app.core.config import settings
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_ID", "mock-google-client-id.apps.googleusercontent.com")

    def mock_verify_fail(token, client_id=None):
        raise ValueError("Cryptographic verification failed: Signature has expired")

    monkeypatch.setattr("app.api.auth.verify_google_id_token", mock_verify_fail)

    res = client.post(
        "/auth/oauth",
        json={
            "provider": "google",
            "id_token": "invalid-or-expired-token"
        }
    )
    assert res.status_code == 401
    assert "Google authentication failed" in res.json()["detail"]

def test_security_verify_google_id_token_checks(monkeypatch):
    """Test unit validation checks in verify_google_id_token."""
    from app.core.security import verify_google_id_token

    # 1. Missing token
    with pytest.raises(ValueError, match="Google ID token is required"):
        verify_google_id_token("", client_id="test-client-id")

    # 2. Missing client ID
    with pytest.raises(ValueError, match="Server GOOGLE_CLIENT_ID is not configured"):
        verify_google_id_token("some-token", client_id="")
