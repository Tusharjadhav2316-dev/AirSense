import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AirSense AI Health Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./airsense.db"
    
    # Security / Auth
    JWT_SECRET: str = "airsense_dev_jwt_secret_key_32_characters_minimum"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # OpenRouter / LLM Configuration
    OPENROUTER_API_KEY: Optional[str] = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    LLM_MODEL: str = "anthropic/claude-opus-5"
    
    # Backwards compatibility settings
    LLM_API_KEY: Optional[str] = ""
    LLM_PROVIDER: str = "openrouter"
    
    # Vector DB
    CHROMA_PERSIST_DIR: str = "./chroma_db"

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
