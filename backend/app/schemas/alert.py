from pydantic import BaseModel, Field
from typing import List

class AlertItem(BaseModel):
    id: str = Field(..., description="Unique alert identifier")
    city: str = Field(..., description="Target location name")
    aqi: int = Field(..., description="Air Quality Index value at trigger time")
    category: str = Field(..., description="AQI category ('Good', 'Moderate', 'Unhealthy', etc.)")
    message: str = Field(..., description="Personalized threshold alert warning message")
    timestamp: str = Field(..., description="ISO timestamp when alert was triggered")
    dismissed: bool = Field(False, description="Whether alert has been dismissed")

class AlertListResponse(BaseModel):
    alerts: List[AlertItem] = Field(default_factory=list)
