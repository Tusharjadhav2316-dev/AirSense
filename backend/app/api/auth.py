from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    verify_google_id_token
)
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    OAuthLoginRequest,
    AuthTokenResponse,
    UserOut
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        health_profile=user.health_profile,
        home_location=user.home_location,
        created_at=user.created_at.isoformat() if user.created_at else ""
    )

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user with email, password, health profile, and home location."""
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        health_profile=payload.health_profile.lower(),
        home_location=payload.home_location.strip() or "Pune"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.email)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=format_user_out(user)
    )

@router.post("/login", response_model=AuthTokenResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email and password, returning JWT access token."""
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(subject=user.email)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=format_user_out(user)
    )

@router.post("/oauth", response_model=AuthTokenResponse)
def oauth_login_user(payload: OAuthLoginRequest, db: Session = Depends(get_db)):
    """Authenticate or register user via verified OAuth provider (Google)."""
    provider = payload.provider.lower().strip()

    if provider == "google":
        if not payload.id_token or not payload.id_token.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google ID token (id_token) is required for Google OAuth."
            )

        google_client_id = settings.GOOGLE_CLIENT_ID
        if not google_client_id or not google_client_id.strip():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server GOOGLE_CLIENT_ID environment variable is not configured."
            )

        try:
            google_user_info = verify_google_id_token(
                token=payload.id_token,
                client_id=google_client_id
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Google authentication failed: {str(exc)}"
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google authentication token could not be verified."
            )

        verified_email = google_user_info["email"].lower().strip()
        google_sub = str(google_user_info.get("sub", "")).strip()

        user = db.query(User).filter(User.email == verified_email).first()
        if not user:
            # Auto-create user for first-time verified Google sign-in
            user = User(
                email=verified_email,
                hashed_password=hash_password(f"oauth_google_{google_sub}"),
                health_profile=(payload.health_profile or "none").lower(),
                home_location=(payload.home_location or "Pune").strip()
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token(subject=user.email)
        return AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            user=format_user_out(user)
        )

    if provider == "apple":
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Apple Sign-In is not currently enabled on the server."
        )

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Unsupported OAuth provider: {payload.provider}"
    )

@router.get("/me", response_model=UserOut)
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Retrieve current logged in user from Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header."
        )

    token = authorization.split(" ")[1]
    email = decode_access_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token."
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    return format_user_out(user)
