from pydantic import BaseModel, Field
from typing import List, Optional

class PollutantBreakdown(BaseModel):
    pm2_5: Optional[float] = Field(None, description="Particulate Matter < 2.5 µm (µg/m³)")
    pm10: Optional[float] = Field(None, description="Particulate Matter < 10 µm (µg/m³)")
    o3: Optional[float] = Field(None, description="Ozone (µg/m³)")
    no2: Optional[float] = Field(None, description="Nitrogen Dioxide (µg/m³)")
    so2: Optional[float] = Field(None, description="Sulfur Dioxide (µg/m³)")
    co: Optional[float] = Field(None, description="Carbon Monoxide (µg/m³)")

class AQICurrentResponse(BaseModel):
    city: str
    country: Optional[str] = None
    latitude: float
    longitude: float
    aqi: int
    category: str
    category_color: str
    category_description: str
    dominant_pollutant: str
    pollutants: PollutantBreakdown
    timestamp: str
    data_source: str = "Open-Meteo Air Quality API"

class HourlyForecastPoint(BaseModel):
    timestamp: str
    aqi: int
    category: str
    category_color: str
    pm2_5: Optional[float] = None
    pm10: Optional[float] = None
    o3: Optional[float] = None
    no2: Optional[float] = None

class AQIForecastResponse(BaseModel):
    city: str
    country: Optional[str] = None
    latitude: float
    longitude: float
    forecast: List[HourlyForecastPoint]
    data_source: str = "Open-Meteo Air Quality API"
