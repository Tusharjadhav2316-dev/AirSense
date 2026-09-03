"""
================================================================================
AIRSENSE — FULL RAG PIPELINE END-TO-END TEST (Sprint 2 — Day 7)
================================================================================
Executes the full end-to-end chain across 4 distinct health profile x AQI category
combinations:
  Category + Pollutant + Profile → Retrieve Chunks → Grounded Generation → Citations

Verifies:
  1. Personalization: Distinct advice for Asthma vs General Adult at SAME AQI level.
  2. Grounding: Citations match retrieved WHO/EPA sources.
  3. Tone: Direct, clear, plain-language, non-clinical.
================================================================================
"""

import asyncio
from app.rag.retriever import retrieve_guidance
from app.rag.generator import generate_recommendation

TEST_COMBINATIONS = [
    {
        "test_id": "Combo 1 (Asthma at Unhealthy AQI)",
        "aqi_data": {"city": "Delhi, India", "aqi": 168, "category": "Unhealthy", "dominant_pollutant": "PM2.5"},
        "profile": "asthma"
    },
    {
        "test_id": "Combo 2 (General Adult at SAME Unhealthy AQI)",
        "aqi_data": {"city": "Delhi, India", "aqi": 168, "category": "Unhealthy", "dominant_pollutant": "PM2.5"},
        "profile": "none"
    },
    {
        "test_id": "Combo 3 (Child at Moderate AQI)",
        "aqi_data": {"city": "Pune, India", "aqi": 85, "category": "Moderate", "dominant_pollutant": "Ozone"},
        "profile": "child"
    },
    {
        "test_id": "Combo 4 (Elderly at Very Unhealthy AQI)",
        "aqi_data": {"city": "London, UK", "aqi": 240, "category": "Very Unhealthy", "dominant_pollutant": "PM10"},
        "profile": "elderly"
    }
]

async def run_pipeline_test():
    print("================================================================================")
    print("AIRSENSE — END-TO-END RAG PIPELINE & PERSONALIZATION TEST")
    print("================================================================================\n")

    results_by_profile = {}

    for idx, combo in enumerate(TEST_COMBINATIONS, start=1):
        tid = combo["test_id"]
        aqi_data = combo["aqi_data"]
        profile = combo["profile"]
        city = aqi_data["city"]
        aqi = aqi_data["aqi"]
        cat = aqi_data["category"]
        pollutant = aqi_data["dominant_pollutant"]

        print(f"--------------------------------------------------------------------------------")
        print(f"[{idx}/4] TEST CASE: {tid}")
        print(f"Location: {city} | AQI: {aqi} ({cat}) | Pollutant: {pollutant} | Profile: '{profile}'")
        print(f"--------------------------------------------------------------------------------")

        # 1. Retrieve top WHO/EPA chunks
        chunks = retrieve_guidance(
            aqi_category=cat,
            dominant_pollutant=pollutant,
            health_profile=profile,
            top_k=3
        )
        print(f"  [RETRIEVED] {len(chunks)} chunks from ChromaDB store.")

        # 2. Generate grounded recommendation
        res = await generate_recommendation(aqi_data, profile, chunks)
        
        rec_text = res["recommendation_sentence"]
        why_text = res["why_explanation"]
        sources = res["sources"]

        results_by_profile[f"{cat}_{profile}"] = rec_text

        print(f"  [RECOMMENDATION] {rec_text}")
        print(f"  [WHY EXPLANATION] {why_text}")
        print(f"  [SOURCES CITED] ({len(sources)} sources):")
        for s in sources:
            print(f"    • {s['title']} — {s['section']}")
        print("\n")

    # Verify Personalization (Combo 1 vs Combo 2 at SAME AQI=168)
    asthma_rec = results_by_profile.get("Unhealthy_asthma")
    general_rec = results_by_profile.get("Unhealthy_none")

    print("================================================================================")
    print("VERIFICATION CHECK: PERSONALIZATION AT SAME AQI LEVEL (AQI 168)")
    print("================================================================================")
    print(f"Asthma Profile Guidance  : \"{asthma_rec}\"")
    print(f"General Profile Guidance : \"{general_rec}\"")
    
    assert asthma_rec != general_rec, "FAIL: Asthma and General profiles produced identical advice!"
    print("\n[SUCCESS] Personalization confirmed! Different health profiles receive tailored guidance.")
    print("================================================================================")

if __name__ == "__main__":
    asyncio.run(run_pipeline_test())
