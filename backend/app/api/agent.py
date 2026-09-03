"""
================================================================================
AIRSENSE — AGENT WORKFLOW ROUTE (Sprint 2 — Day 8)
================================================================================
Exposes POST /agent/advice endpoint for the multi-step RAG + Agentic workflow.
================================================================================
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.agent import AgentAdviceRequest, AgentAdviceResponse
from app.schemas.agent_compare import CityCompareRequest, CityCompareResponse, CityCompareSummary
from app.services.agent import execute_agent_workflow

router = APIRouter(prefix="/agent", tags=["Agent Workflow"])

@router.post(
    "/advice",
    response_model=AgentAdviceResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute Multi-Step Agentic Advice Workflow",
    description=(
        "Executes the 5-step agentic workflow: "
        "1. Fetch live AQI for city, 2. Check AQI category, 3. Threshold branch (skip RAG/LLM if Good AQI), "
        "4. Vector search WHO/EPA chunks in ChromaDB, 5. Synthesize grounded recommendation."
    )
)
async def get_agent_advice(payload: AgentAdviceRequest) -> AgentAdviceResponse:
    try:
        if not payload.city or not payload.city.strip():
            raise HTTPException(status_code=400, detail="City name is required")
            
        return await execute_agent_workflow(
            city=payload.city.strip(),
            health_profile=payload.health_profile.strip() if payload.health_profile else "none"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Agent workflow execution failed for '{payload.city}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent workflow execution failed: {str(e)}"
        )

@router.post(
    "/compare",
    response_model=CityCompareResponse,
    status_code=status.HTTP_200_OK,
    summary="Compare 2 to 3 Cities Side-by-Side with AI Comparative Insight",
    description="Fetches live AQI and AI recommendations for 2-3 target cities and generates a comparative health insight sentence."
)
async def compare_cities(payload: CityCompareRequest) -> CityCompareResponse:
    try:
        if not payload.cities or len(payload.cities) < 2:
            raise HTTPException(status_code=400, detail="At least 2 cities are required for comparison.")

        cities = payload.cities[:3]
        summaries = []

        for city in cities:
            advice = await execute_agent_workflow(
                city=city.strip(),
                health_profile=payload.health_profile.strip() if payload.health_profile else "none"
            )
            summaries.append(CityCompareSummary(
                city=advice.city if hasattr(advice, 'city') else city,
                aqi_value=advice.aqi_value,
                aqi_category=advice.aqi_category,
                dominant_pollutant=advice.dominant_pollutant,
                recommendation=advice.recommendation
            ))

        # Sort by AQI to build comparative sentence
        sorted_by_aqi = sorted(summaries, key=lambda c: c.aqi_value)
        best = sorted_by_aqi[0]
        worst = sorted_by_aqi[-1]

        profile_text = f" for {payload.health_profile} individuals" if payload.health_profile and payload.health_profile != "none" else ""

        if best.city == worst.city:
            comparative_sentence = f"Air quality across selected locations is consistent at AQI {best.aqi_value} ({best.aqi_category})."
        elif worst.aqi_value - best.aqi_value > 40:
            comparative_sentence = (
                f"{best.city} currently offers significantly cleaner air than {worst.city} "
                f"(AQI {best.aqi_value} vs {worst.aqi_value}), making outdoor activities substantially safer in {best.city}{profile_text} today."
            )
        else:
            comparative_sentence = (
                f"{best.city} has slightly better air quality than {worst.city} "
                f"(AQI {best.aqi_value} vs {worst.aqi_value}), though both fall in moderate risk ranges."
            )

        return CityCompareResponse(
            comparative_insight=comparative_sentence,
            cities_data=summaries
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Compare endpoint failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compare workflow failed: {str(e)}"
        )
