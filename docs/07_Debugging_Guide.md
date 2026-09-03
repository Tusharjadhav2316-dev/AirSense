# 07 — Debugging Guide

## Common Issues & Fixes

**Open-Meteo returns no data for a city**
Check the geocoding step first — a bad city name search returning wrong/no
coordinates is the most common cause, not the air-quality API itself.

**RAG retrieval returns irrelevant chunks**
Check chunk quality first (Sprint 2 Day 5) before assuming the embedding
model is at fault — bad chunking is the more common root cause. Re-run
`test_retrieval.py` with the 5 standard test queries.

**LLM generation ignores retrieved context / hallucinates**
Check the prompt template (05_Prompt_Library.md) — make sure retrieved
chunks are actually being interpolated into the prompt, not silently
dropped due to a formatting bug.

**Frontend shows stale data after Settings change**
Likely a React Query cache invalidation issue — make sure mutations
(health profile update, location changes) invalidate the relevant query
keys.

**CORS errors after deployment**
FastAPI's CORS middleware must explicitly list the deployed frontend
domain — wildcard `*` won't work once cookies/auth headers are involved.

**Anomaly detection flags everything (or nothing) as anomalous**
Check the rolling average window has enough data points — with too little
history, the rolling average is unstable and produces false positives/
negatives. Confirm seed data (Sprint 1 Day 4) ran correctly.

## General Debugging Approach
1. Reproduce with the simplest possible input (one city, one profile)
2. Check the layer closest to the data source first (API call → DB →
   analytics → RAG → generation → frontend), don't assume it's the AI
   layer by default
3. Add temporary print/log statements at each step of the agentic workflow
   (Sprint 2 Day 8 already logs each step) rather than guessing
