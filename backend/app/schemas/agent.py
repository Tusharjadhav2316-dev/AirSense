"""
================================================================================
AIRSENSE — AGENT WORKFLOW SCHEMAS (Sprint 2 — Day 8)
================================================================================
Defines request and response schemas for the /agent/advice endpoint.
================================================================================
"""

from typing import List
from pydantic import BaseModel, Field

class AgentAdviceRequest(BaseModel):
    city: str = Field(..., description="Target city name (e.g., 'Pune', 'Delhi', 'London')")
    health_profile: str = Field("none", description="Health profile ('none', 'asthma', 'elderly', 'child')")

class AgentAdviceResponse(BaseModel):
    recommendation: str = Field(..., description="Actionable personalized recommendation")
    why: str = Field(..., description="WHO/EPA-grounded explanation for the recommendation")
    sources: List[str] = Field(default_factory=list, description="Titles of WHO/EPA guideline sources cited")
    aqi_value: int = Field(..., description="Current US Air Quality Index (AQI) value")
    aqi_category: str = Field(..., description="AQI category ('Good', 'Moderate', 'Unhealthy', etc.)")
    dominant_pollutant: str = Field(..., description="Dominant air pollutant (e.g., 'PM2.5', 'PM10', 'O3')")
    used_ai_generation: bool = Field(..., description="True if RAG + LLM was executed; False if Good-AQI shortcut was taken")
