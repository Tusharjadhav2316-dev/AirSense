import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

def get_default_database_url() -> str:
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        return "sqlite:////tmp/airsense.db"
    return "sqlite:///./airsense.db"

def get_default_chroma_dir() -> str:
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        return "/tmp/chroma_db"
    return "./chroma_db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "AirSense AI Health Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = get_default_database_url()
    
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

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
