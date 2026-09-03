# 02 — Architecture

## System Overview

```
┌─────────────────────────┐
│   React + TypeScript     │
│   Frontend (8 pages)     │
│                           │
│  Landing / Login /       │
│  Dashboard / Compare /    │
│  Trends / Chat / Alerts / │
│  Settings                 │
└───────────┬──────────────┘
            │ REST (JSON)
            ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                  │
│                                                 │
│  /aqi/current      → live AQI by location       │
│  /aqi/forecast     → 24-48h forecast            │
│  /aqi/trend        → historical + rolling avg + │
│                       anomaly flags (pandas)     │
│  /agent/advice      → the agentic reasoning      │
│                       pipeline (see below)        │
│  /chat              → conversational RAG endpoint │
│  /alerts            → threshold-based notifications │
│  /auth/*            → login/signup                 │
└──────┬───────────────┬───────────────┬────────────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────┐  ┌──────────────┐  ┌────────────────┐
│ Open-Meteo   │  │  Postgres/    │  │  Vector Store   │
│ Air Quality  │  │  SQLite DB    │  │  (FAISS/Chroma) │
│ API          │  │  (users,      │  │  ← embedded WHO/│
│ (live data)  │  │  history,     │  │    EPA guideline │
│              │  │  saved cities)│  │    chunks         │
└─────────────┘  └──────────────┘  └────────┬────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │   LLM API          │
                                     │   (Claude/GPT)      │
                                     │   generates final   │
                                     │   grounded advice    │
                                     └──────────────────┘
```

## The Agentic Workflow (`/agent/advice`)
This is the core "why AI is needed" piece. It's a simple, explainable
multi-step chain — not a heavy agent framework, but genuinely conditional
and multi-step, which satisfies the "Agentic AI workflows" component:

1. **Fetch** — get current AQI + dominant pollutant for the location
2. **Check** — rule-based threshold classification (Good/Moderate/
   Unhealthy for Sensitive Groups/Unhealthy/Hazardous)
3. **Branch** —
   - If Good → return a short, low-key status, skip heavy generation
   - If Moderate+ → proceed to retrieval + generation
4. **Retrieve** — vector search over the WHO/EPA knowledge base using the
   AQI category + dominant pollutant + user's health profile as the query
5. **Generate** — LLM call with retrieved chunks + live data + user profile
   in the prompt, producing a grounded, cited recommendation sentence
6. **Return** — recommendation + short "why" + source citations to the
   frontend

## Data Analytics Layer (pandas, inside `/aqi/trend`)
- Rolling 7-day average per location
- Anomaly flag: today's AQI vs. 7-day rolling average, flagged if it
  exceeds a defined threshold (e.g., >25% above rolling average — matches
  the anomaly logic already shown in the locked UI mockup)
- Calendar heatmap data (daily severity buckets for the past 30 days)

## Frontend State/Data Flow
- React Query (or SWR) for API data fetching + caching
- Global auth/user context for health profile (drives personalization
  across every page, not just settings)
- Shared design token file (colors, spacing, type) — see
  14_UI_UX_Guide.md — consumed by every component so the mobile
  conversion later only changes layout, not tokens

## Why This Architecture Maps to the Grading Criteria
| 1M1B Requirement | Where it lives |
|---|---|
| RAG | Vector store + retrieval step in `/agent/advice` and `/chat` |
| Agentic workflows | The fetch→check→branch→retrieve→generate chain |
| Prediction/pattern detection | `/aqi/trend` anomaly detection (pandas) |
| Responsible AI | Transparent sourcing, cited advice, Settings page section |
