import os
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

def is_serverless_env() -> bool:
    return bool(
        os.environ.get("VERCEL")
        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
        or os.environ.get("LAMBDA_TASK_ROOT")
        or os.environ.get("VERCEL_ENV")
    )

def get_default_database_url() -> str:
    if is_serverless_env():
        return "sqlite:////tmp/airsense.db"
    return "sqlite:///./airsense.db"

def get_default_chroma_dir() -> str:
    if is_serverless_env():
        return "/tmp/chroma_db"
    return "./chroma_db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "AirSense AI Health Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = get_default_database_url()
    
    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if is_serverless_env() and v and v.startswith("sqlite"):
            # Enforce /tmp on serverless environments to prevent read-only filesystem errors
            return "sqlite:////tmp/airsense.db"
        return v or "sqlite:///./airsense.db"

    # Security / Auth
    JWT_SECRET: str = "airsense_dev_jwt_secret_key_32_characters_minimum"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080  # 7 days

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = ""
    GOOGLE_CLIENT_SECRET: Optional[str] = ""
    
    # OpenRouter / LLM Configuration
    OPENROUTER_API_KEY: Optional[str] = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    LLM_MODEL: str = "anthropic/claude-opus-5"
    
    # Backwards compatibility settings
    LLM_API_KEY: Optional[str] = ""
    LLM_PROVIDER: str = "openrouter"
    
    # Vector DB
    CHROMA_PERSIST_DIR: str = get_default_chroma_dir()

    @field_validator("CHROMA_PERSIST_DIR", mode="after")
    @classmethod
    def validate_chroma_dir(cls, v: str) -> str:
        if is_serverless_env():
            return "/tmp/chroma_db"
        return v or "./chroma_db"

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
