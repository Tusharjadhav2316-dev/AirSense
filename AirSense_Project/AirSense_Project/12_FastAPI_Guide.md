# 12 — FastAPI Guide (Project-Specific Notes)

## Structure
```
backend/app/
  api/            (routes: aqi.py, agent.py, chat.py, auth.py, alerts.py)
  models/         (SQLAlchemy: User, SavedLocation, AQIReading,
                    AlertThreshold)
  schemas/        (Pydantic request/response models)
  services/       (openmeteo.py, analytics.py, agent.py, db_service.py,
                    llm_client.py)
  rag/            (ingest.py, build_index.py, retriever.py, generator.py)
  core/           (config.py, aqi_categories.py)
  scripts/        (seed_historical_data.py)
```

## Key Endpoints (full list, for reference)
| Endpoint | Method | Purpose |
|---|---|---|
| /health | GET | Health check |
| /auth/signup | POST | Create account |
| /auth/login | POST | Login, returns JWT |
| /aqi/current | GET | Live AQI by city |
| /aqi/forecast | GET | 24-48h forecast |
| /aqi/trend | GET | Historical + rolling avg + anomalies + heatmap |
| /agent/advice | POST | Full agentic RAG-grounded recommendation |
| /agent/compare | POST | Comparative insight for 2-3 cities |
| /chat | POST | Conversational RAG endpoint |
| /alerts | GET | List triggered alerts |

## Async Usage
Use `async def` for any endpoint calling Open-Meteo or the LLM API (both
are I/O-bound external calls) — use `httpx.AsyncClient`, not `requests`.

## Error Handling
Return clear HTTP error codes with a consistent error schema
`{detail: str}` — never return a 200 with a fabricated/placeholder value
when an upstream call fails.

## Config
All secrets/URLs via `app/core/config.py` reading from environment
variables (see 06_API_Keys_and_Setup.md) — never hardcoded.
