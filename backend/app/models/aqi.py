import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class AQIReading(Base):
    __tablename__ = "aqi_readings"

    id = Column(Integer, primary_key=True, index=True)
    city_name = Column(String, index=True, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    timestamp = Column(String, nullable=False)  # ISO string from Open-Meteo
    aqi_value = Column(Integer, nullable=False, index=True)
    category = Column(String, nullable=False)
    dominant_pollutant = Column(String, nullable=False)
    pm25 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    o3 = Column(Float, nullable=True)
    no2 = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    co = Column(Float, nullable=True)
    fetched_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)
