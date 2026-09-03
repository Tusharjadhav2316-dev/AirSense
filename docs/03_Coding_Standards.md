# 03 — Coding Standards

## General
- Clear, descriptive naming over clever abbreviations
- No dead/commented-out code left in commits
- Every function does one thing — if a function needs "and" to describe
  it, split it

## Frontend (React + TypeScript)
- Strict mode TypeScript — no `any` unless truly unavoidable, and comment
  why if used
- Functional components + hooks only, no class components
- One component per file, matching filename
- API calls go through `src/api/`, never inline `fetch` calls in
  components
- Styling via Tailwind utility classes using the design token names (e.g.
  `bg-clearSky`, not raw hex classes)

## Backend (FastAPI + Python)
- Type hints on every function signature
- Pydantic schemas for all request/response bodies — no raw dict returns
- Business logic lives in `app/services/`, routes in `app/api/` stay thin
  (just call services, handle HTTP concerns)
- Async endpoints where they call external APIs (Open-Meteo, LLM) to avoid
  blocking

## RAG/AI Code Specifically
- Never let generation proceed without retrieved context when the
  workflow calls for grounding — fail loudly (return a clear "no guidance
  available" response) rather than let the LLM freewheel
- Log which sources were retrieved for every generated response, even in
  production, for debuggability

## Commit Messages
Format: `[sprint-day] short description`
Example: `[S2-D8] implement agentic advice endpoint with threshold branching`
