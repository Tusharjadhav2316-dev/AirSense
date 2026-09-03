from pydantic import BaseModel, Field
from typing import List, Optional

class TrendPoint(BaseModel):
    date: str = Field(..., description="Date or timestamp string (YYYY-MM-DD)")
    aqi: int = Field(..., description="Raw US AQI value")
    rolling_avg: float = Field(..., description="7-day rolling average AQI")
    is_anomaly: bool = Field(..., description="True if AQI exceeds rolling avg by > 25%")

class TrendSummary(BaseModel):
    average_aqi: float = Field(..., description="Average AQI over requested time range")
    highest_aqi: int = Field(..., description="Peak AQI recorded in range")
    highest_aqi_date: Optional[str] = Field(None, description="Date of peak AQI recording")
    anomaly_count: int = Field(..., description="Total number of anomaly flags in range")

class AQITrendResponse(BaseModel):
    city: str
    days: int
    trend: List[TrendPoint]
    summary: TrendSummary
