# Sprint 2 — Day 7: Retrieval Function & Generation

## Prompt for Antigravity

```
Continue AirSense RAG pipeline. Vector store is built and tested. Today:
wrap retrieval into a reusable function and add the LLM generation step.

TASK:
1. Write `app/rag/retriever.py` with a function
   `retrieve_guidance(aqi_category: str, dominant_pollutant: str,
   health_profile: str) -> list[Chunk]` that:
   - Builds a natural-language query from these inputs (e.g., "Unhealthy
     air quality, PM2.5 dominant, asthma health profile — precautions and
     guidance")
   - Returns the top 3-5 relevant chunks with their metadata

2. Write `app/rag/generator.py` with a function
   `generate_recommendation(aqi_data, health_profile, retrieved_chunks) ->
   dict` that:
   - Constructs an LLM prompt using ONLY the retrieved chunks as source
     material — explicitly instruct the model: "Base your answer only on
     the provided guidance. Cite which source supports each claim. If the
     guidance doesn't cover something, say so rather than guessing."
   - Calls the LLM API (Claude or GPT — use whichever key is configured in
     .env, see 06_API_Keys_and_Setup.md)
   - Returns: {recommendation_sentence, why_explanation, sources: [list of
     source names used]}

3. Write a combined test in `app/rag/test_full_pipeline.py` that runs the
   full chain end to end: category+pollutant+profile → retrieve →
   generate → print the final grounded recommendation with sources.

4. Test with at least 4 different combinations (different AQI categories x
   different health profiles) and manually verify:
   - The recommendation is genuinely different for different health
     profiles at the same AQI level (this proves personalization works)
   - Sources cited are ones that were actually retrieved (not fabricated)
   - The tone matches AirSense's voice: direct, plain-language, not overly
     clinical or vague

Do not wire this into a live API endpoint yet — that's Day 8, alongside
the full agentic workflow with threshold branching.
```
