"""
================================================================================
AIRSENSE — MULTI-STEP AGENTIC WORKFLOW SERVICE (Sprint 2 — Day 8)
================================================================================
Implements the centerpiece multi-step agentic decision workflow:
  Step 1 — FETCH    : Call live Open-Meteo API for target city
  Step 2 — CHECK    : Classify into US AQI category
  Step 3 — BRANCH   : If Good (AQI <= 50) -> Skip RAG/LLM (save compute)
  Step 4 — RETRIEVE : If Moderate+ -> Vector search WHO/EPA chunks in ChromaDB
  Step 5 — GENERATE : Synthesize personalized guidance via OpenRouter / RAG Engine
================================================================================
"""

from typing import Dict, Any
from app.services.openmeteo import fetch_current_aqi
from app.rag.retriever import retrieve_guidance
from app.rag.generator import generate_recommendation
from app.schemas.agent import AgentAdviceResponse

async def execute_agent_workflow(city: str, health_profile: str = "none") -> AgentAdviceResponse:
    """
    Executes the 5-step explicit agentic workflow for AirSense.
    """
    print("\n================================================================================")
    print(f"[AIRSENSE AGENT WORKFLOW STARTED] City: '{city}' | Profile: '{health_profile}'")
    print("================================================================================")

    # --------------------------------------------------------------------------
    # STEP 1 — FETCH: Live Air Quality Data
    # --------------------------------------------------------------------------
    print(f"[AGENT STEP 1 - FETCH] Fetching live AQI & pollutant data for '{city}'...")
    raw_data = await fetch_current_aqi(city)
    
    aqi_value = raw_data.get("aqi", 0)
    dominant_pollutant = raw_data.get("dominant_pollutant", "PM2.5")
    city_name = raw_data.get("city", city)
    print(f"   -> Result: City='{city_name}', AQI={aqi_value}, Dominant Pollutant='{dominant_pollutant}'")

    # --------------------------------------------------------------------------
    # STEP 2 — CHECK: Classify AQI Severity
    # --------------------------------------------------------------------------
    print(f"[AGENT STEP 2 - CHECK] Classifying AQI value {aqi_value} into US AQI Category...")
    aqi_category = raw_data.get("category", "Good")
    print(f"   -> Result: Category='{aqi_category}'")

    # Construct standard AQI dict for downstream processing
    aqi_data = {
        "city": city_name,
        "aqi": aqi_value,
        "category": aqi_category,
        "dominant_pollutant": dominant_pollutant
    }

    # --------------------------------------------------------------------------
    # STEP 3 — BRANCH: Good Air Quality Efficiency Shortcut
    # --------------------------------------------------------------------------
    print(f"[AGENT STEP 3 - BRANCH] Evaluating threshold branching logic...")
    
    if aqi_category == "Good" or aqi_value <= 50:
        print("   -> BRANCH DECISION: AQI is 'Good' (<= 50). Skipping RAG retrieval & LLM generation!")
        print("   -> Returning immediate efficiency shortcut response (used_ai_generation=False).")
        
        return AgentAdviceResponse(
            recommendation="Air quality is good — no special precautions needed today.",
            why="Pollutant concentrations meet WHO and EPA safe long-term exposure limits.",
            sources=["WHO Global Air Quality Guidelines (2021)"],
            aqi_value=aqi_value,
            aqi_category=aqi_category,
            dominant_pollutant=dominant_pollutant,
            used_ai_generation=False
        )

    print("   -> BRANCH DECISION: AQI is 'Moderate' or worse (> 50). Proceeding to RAG & LLM Pipeline!")

    # --------------------------------------------------------------------------
    # STEP 4 — RETRIEVE: Vector Search WHO/EPA Chunks
    # --------------------------------------------------------------------------
    print(f"[AGENT STEP 4 - RETRIEVE] Performing ChromaDB vector search for context...")
    retrieved_chunks = retrieve_guidance(
        aqi_category=aqi_category,
        dominant_pollutant=dominant_pollutant,
        health_profile=health_profile,
        top_k=3
    )
    print(f"   -> Result: Retrieved {len(retrieved_chunks)} grounded WHO/EPA chunks from ChromaDB.")

    # --------------------------------------------------------------------------
    # STEP 5 — GENERATE: Grounded Recommendation & Citations
    # --------------------------------------------------------------------------
    print(f"[AGENT STEP 5 - GENERATE] Synthesizing grounded recommendation via OpenRouter/RAG engine...")
    gen_result = await generate_recommendation(
        aqi_data=aqi_data,
        health_profile=health_profile,
        retrieved_chunks=retrieved_chunks
    )

    recommendation = gen_result.get("recommendation_sentence", "Reduce prolonged outdoor exertion.")
    why = gen_result.get("why_explanation", "Air quality index is elevated.")
    raw_sources = gen_result.get("sources", [])

    # Format sources into clean string list
    source_titles = []
    for s in raw_sources:
        if isinstance(s, dict):
            stitle = f"{s.get('title', 'WHO/EPA Guideline')} — {s.get('section', 'Guideline')}"
            source_titles.append(stitle)
        elif isinstance(s, str):
            source_titles.append(s)

    if not source_titles:
        source_titles = ["WHO Global Air Quality Guidelines (2021)"]

    print(f"   -> Recommendation: \"{recommendation}\"")
    print(f"   -> Explanation   : \"{why}\"")
    print(f"   -> Sources Cited : {source_titles}")
    print("================================================================ liquid\n")

    return AgentAdviceResponse(
        recommendation=recommendation,
        why=why,
        sources=source_titles,
        aqi_value=aqi_value,
        aqi_category=aqi_category,
        dominant_pollutant=dominant_pollutant,
        used_ai_generation=True
    )
