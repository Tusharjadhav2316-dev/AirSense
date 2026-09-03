# Sprint 2 — Day 8: The Agentic Workflow Endpoint

## Prompt for Antigravity

```
Build the full agentic workflow for AirSense — the centerpiece endpoint of
the whole project. Reference 02_Architecture.md's "Agentic Workflow"
section exactly.

TASK:
1. Create `POST /agent/advice` endpoint that accepts:
   {city: str, health_profile: str}

2. Implement the workflow in `app/services/agent.py` as a clear, explicit
   multi-step function (not a black box — each step should be a named,
   readable function call):

   Step 1 — FETCH: call the existing /aqi/current logic to get live AQI +
   dominant pollutant for the city

   Step 2 — CHECK: classify into AQI category using the thresholds from
   Day 2's aqi_categories.py

   Step 3 — BRANCH:
   - If category is "Good" → skip retrieval/generation, return a short
     templated status ("Air quality is good — no special precautions
     needed today.") — this saves an unnecessary LLM call and matches the
     architecture doc's efficiency design
   - If category is "Moderate" or worse → proceed to steps 4-5

   Step 4 — RETRIEVE: call retrieve_guidance() from Day 7

   Step 5 — GENERATE: call generate_recommendation() from Day 7

3. Response schema (Pydantic):
   {
     recommendation: str,
     why: str,
     sources: list[str],
     aqi_value: int,
     aqi_category: str,
     dominant_pollutant: str,
     used_ai_generation: bool  # false when Good-category shortcut was used
   }

4. Log each step's execution (fetch/check/branch decision/retrieve/
   generate) to the console during development — this makes the "agentic"
   nature visible and debuggable, and gives you real console output you
   can screenshot for your internship deck's "Prototype/Demo" section.

5. Test the full endpoint with 3 different cities at different AQI levels
   and 2 different health profiles each (6 total test calls) — confirm
   the branch logic correctly skips generation for Good air quality and
   correctly personalizes for Moderate+ air quality.

This endpoint is the single most important deliverable for the internship
grading criteria (RAG + Agentic workflows both live here). Do not rush it.
```
