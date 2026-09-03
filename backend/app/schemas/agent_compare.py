from typing import List, Optional
from pydantic import BaseModel, Field

class CityCompareRequest(BaseModel):
    cities: List[str] = Field(..., min_length=2, max_length=3, description="List of 2 to 3 cities to compare")
    health_profile: str = Field("none", description="User health profile")

class CityCompareSummary(BaseModel):
    city: str
    aqi_value: int
    aqi_category: str
    dominant_pollutant: str
    recommendation: str

class CityCompareResponse(BaseModel):
    comparative_insight: str = Field(..., description="Comparative AI health sentence comparing cities side-by-side")
    cities_data: List[CityCompareSummary] = Field(default_factory=list)
