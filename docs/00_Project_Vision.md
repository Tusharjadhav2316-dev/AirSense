# 00 — Project Vision: AirSense

## What This Is
AirSense is an AI-powered air quality health assistant. It does not just display
AQI numbers — it turns raw atmospheric data into grounded, personalized,
actionable health guidance for the specific user asking.

## The Core Insight (why this isn't "another weather app")
Anyone can display a number. The hard, valuable part is:
1. **Grounding** — advice is retrieved from real WHO/EPA guideline documents
   via RAG, not generated from an LLM's unverified general knowledge.
2. **Personalization** — the same AQI reading produces different advice for
   a healthy adult vs. someone with asthma, a child, or an elderly person.
3. **Pattern detection** — the system notices when today is abnormal for a
   given location (via real statistical analysis), not just reporting a
   snapshot.

If a screen ever shows a big number as the hero with advice as an
afterthought, that screen has drifted back into "weather app" territory.
The AI recommendation is always the headline. The data is the evidence.

## Who It's For
- General urban residents deciding whether to go outside, exercise, or commute
- Vulnerable groups: asthma/respiratory patients, elderly, parents of young
  children, outdoor workers
- Internship reviewers assessing responsible, grounded use of AI (per 1M1B /
  IBM SkillsBuild guidelines)

## SDG Alignment
- **Primary:** SDG 11 — Sustainable Cities and Communities
- **Secondary:** SDG 3 — Good Health and Well-being

## What We Are NOT Building
- No hardware/IoT sensors (out of scope — this is a software + AI internship)
- No social/community features, no payments, no admin panel, no multi-language
  support in v1 — these are explicitly deferred to avoid scope creep in an
  18-day build window

## Success Criteria
1. A working, deployed full-stack app (React+TS frontend, FastAPI backend)
2. A genuine RAG pipeline grounded in real WHO/EPA source documents
3. A lightweight agentic workflow (threshold check → retrieve → generate)
4. A data-analytics layer (rolling averages, anomaly detection) built with
   pandas — not just an API pass-through
5. A completed internship deliverable (PPT/PDF) mapping directly to this
   project
6. A portfolio-ready resume project with a live deployed link + GitHub repo

## One-Line Pitch (for resume / deck)
"AirSense is a full-stack AI health assistant that turns real-time air
quality data into personalized, WHO/EPA-grounded health guidance using a
RAG pipeline and lightweight agentic reasoning — built with React, TypeScript,
FastAPI, and pandas."
