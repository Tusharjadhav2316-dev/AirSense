import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
import enum
from app.core.database import Base

class HealthProfileEnum(str, enum.Enum):
    NONE = "none"
    ASTHMA = "asthma"
    ELDERLY = "elderly"
    CHILD = "child"
    OUTDOOR_WORKER = "outdoor_worker"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    health_profile = Column(String, default="none", nullable=False)
    home_location = Column(String, default="Pune", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
