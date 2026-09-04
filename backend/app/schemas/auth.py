from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class UserRegisterRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="Password (minimum 6 characters)")
    health_profile: str = Field("none", description="Health profile ('none', 'asthma', 'elderly', 'child', 'outdoor_worker')")
    home_location: str = Field("Pune", description="Default home location city")

class UserLoginRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")

class OAuthLoginRequest(BaseModel):
    provider: str = Field(..., description="OAuth provider e.g. 'google' or 'apple'")
    email: Optional[str] = Field(None, description="User email address (optional; server verifies identity from id_token for Google)")
    id_token: Optional[str] = Field(None, description="OAuth ID token for cryptographic verification")
    health_profile: Optional[str] = Field("none", description="Health profile")
    home_location: Optional[str] = Field("Pune", description="Home location")

class UserOut(BaseModel):
    id: int
    email: str
    health_profile: str
    home_location: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
