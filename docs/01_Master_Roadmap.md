# 01 — Master Roadmap (18 Days)

## Overview
4 sprints. Each sprint has daily prompts (see /Sprint_0X folders) written to
hand directly to Antigravity. Adjust days if something runs long — RAG setup
(Sprint 2) is the highest-risk area for delay, so buffer is built into Sprint 4.

---

## Sprint 1 — Foundation (Days 1–4)
**Goal:** Working backend skeleton + real live data flowing in.
- Day 1: Repo setup, FastAPI skeleton, project structure, env config
- Day 2: Open-Meteo integration (current + forecast AQI endpoints)
- Day 3: Database schema + persistence (store historical AQI pulls)
- Day 4: Basic data analytics endpoint (rolling average, raw trend)

**Exit check:** Can hit `/aqi/current?city=X` and `/aqi/trend?city=X` and get
real data back.

---

## Sprint 2 — RAG + Agent + Analytics Core (Days 5–9)
**Goal:** The actual "AI" substance of the project — this is the highest-value
sprint for the internship grading criteria.
- Day 5: Collect + chunk WHO/EPA source documents
- Day 6: Build embeddings + vector store (FAISS/Chroma)
- Day 7: Build retrieval function + test grounded retrieval quality
- Day 8: Build the agentic workflow (threshold check → retrieve → generate →
  personalize by health profile)
- Day 9: Anomaly detection (statistical, pandas-based) + integrate into
  `/aqi/trend`

**Exit check:** Given an AQI + health profile, the system returns a grounded,
cited, personalized recommendation sentence — not a generic LLM response.

---

## Sprint 3 — Frontend Build (Days 10–14)
**Goal:** All 8 pages built and wired to the real backend, matching the
locked design system.
- Day 10: Design tokens/theme setup + shared components (buttons, cards, nav)
- Day 11: Landing + Login/Signup pages
- Day 12: Main Dashboard (AI recommendation hero + supporting data)
- Day 13: City Detail/Compare + Trends/Analytics pages
- Day 14: AI Chat, Alerts, Settings pages

**Exit check:** Full click-through of all 8 pages using real backend data, no
mock/dummy data left in the UI.

---

## Sprint 4 — Integration, Polish, Deliverables (Days 15–18)
**Goal:** Ship it — both the working app and the internship submission.
- Day 15: End-to-end testing, bug fixes, error/empty states
- Day 16: Deploy (frontend + backend), Responsible AI section content
  finalized, README + GitHub polish
- Day 17: Build the internship PPT/PDF deliverable (see
  29_Internship_Deliverable_Guide.md)
- Day 18: Buffer day — fix whatever broke, rehearse any presentation, submit

---

## Risk Buffer
If Sprint 2 (RAG) overruns, borrow from Sprint 4's buffer day, not from
Sprint 3 (frontend) — a working, honestly-scoped RAG pipeline matters more
for grading than a fully polished UI on all 8 pages.
