import datetime
import hashlib
from typing import Optional, Any
from jose import jwt, JWTError
from app.core.config import settings

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt."""
    salt = settings.JWT_SECRET[:16]
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    return hash_password(plain_password) == hashed_password

def create_access_token(subject: Any, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Create JWT access token with expiration."""
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[str]:
    """Decode JWT access token and return subject (email/user_id)."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

def verify_google_id_token(token: str, client_id: Optional[str] = None) -> dict:
    """
    Cryptographically verify a Google OAuth ID token using Google's official library.
    
    Validates:
      - Token signature against Google's public keys
      - Issuer ('accounts.google.com' or 'https://accounts.google.com')
      - Expiration timestamp
      - Audience (must equal expected GOOGLE_CLIENT_ID)
      - Subject (sub)
      - Email existence
      - Email verified status (email_verified == True)

    Returns the verified token payload dictionary.
    Raises ValueError on any verification failure.
    """
    if not token or not isinstance(token, str) or not token.strip():
        raise ValueError("Google ID token is required and cannot be empty.")

    target_client_id = client_id if client_id is not None else settings.GOOGLE_CLIENT_ID
    if not target_client_id or not target_client_id.strip():
        raise ValueError("Server GOOGLE_CLIENT_ID is not configured.")

    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests

    try:
        request = google_requests.Request()
        id_info = id_token.verify_oauth2_token(
            id_token=token.strip(),
            request=request,
            audience=target_client_id.strip()
        )
    except Exception as exc:
        raise ValueError(f"Cryptographic verification failed: {str(exc)}")

    # Validate Issuer
    issuer = id_info.get("iss")
    if issuer not in ("accounts.google.com", "https://accounts.google.com"):
        raise ValueError(f"Invalid token issuer: {issuer}")

    # Validate Subject
    sub = id_info.get("sub")
    if not sub or not str(sub).strip():
        raise ValueError("Google token is missing a valid subject identifier ('sub').")

    # Validate Email
    email = id_info.get("email")
    if not email or not str(email).strip():
        raise ValueError("Google token does not contain an email claim.")

    # Validate Email Verification
    email_verified = id_info.get("email_verified")
    if email_verified is not True:
        raise ValueError("Google account email is not verified.")

    return id_info
