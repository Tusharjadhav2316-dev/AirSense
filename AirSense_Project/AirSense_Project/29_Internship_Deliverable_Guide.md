# 29 — Internship Deliverable Guide (1M1B / IBM SkillsBuild Mapping)

This maps AirSense directly onto the official Project Creation & Guideline
requirements so nothing is missed in the final submission.

## Required Deliverable: PPT or PDF

### 1. Project Description
- **Title:** AirSense — AI-Powered Air Quality Health Assistant
- **Your Name and College Name:** [fill in]
- **SDG Alignment:** Primary — SDG 11 (Sustainable Cities and Communities).
  Secondary — SDG 3 (Good Health and Well-being)
- **Problem Statement:** "How might we use AI to translate raw air quality
  data into grounded, personalized health guidance so that urban residents
  — especially vulnerable groups — can make safer daily decisions?"
- **AI Solution Overview:** A RAG pipeline grounded in WHO/EPA guidelines,
  combined with a lightweight agentic workflow (fetch → check threshold →
  branch → retrieve → generate) that produces personalized, cited health
  recommendations, plus a pandas-based analytics layer for anomaly
  detection and trend insight.
- **Target Users:** General urban residents; vulnerable groups (asthma/
  respiratory patients, elderly, children, outdoor workers)
- **Responsible AI Considerations:**
  - *Fairness:* Advice generation avoids assumptions beyond the disclosed
    health profile; no demographic profiling beyond user-provided data
  - *Transparency:* Every AI-generated recommendation shows its source
    (WHO/EPA); the agent's decision steps are logged and explainable, not
    a black box
  - *Ethics:* Explicit disclaimer that AI advice is informational, not a
    substitute for medical care; conservative guidance when data is
    ambiguous
  - *Privacy:* Health profile data used only to personalize responses,
    never sold/shared, not sent to any third party beyond the LLM call
    needed to generate the response
- **Expected Impact:** Faster, clearer, more actionable understanding of
  air quality risk — especially for people who don't know how to interpret
  raw pollutant numbers or aren't aware they're in a sensitive group.

### 2. Prototype or Demo (pick one — recommend using BOTH since you built a
real app)
- Screenshots of the live deployed app (Dashboard, Chat, Trends pages)
- Flow diagram of the agentic workflow (from 02_Architecture.md)
- Optional: short screen-recording/GIF of the live demo

### 3. Impact Statement
- What changes if implemented: residents get proactive, personalized
  guidance instead of raw numbers they must interpret themselves;
  vulnerable groups get tailored precautions instead of generic advice
- Who benefits and how: general public (awareness + convenience),
  vulnerable groups (health protection), potentially city health
  departments (aggregate anomaly data could highlight problem areas/times)

## What Makes This Submission Strong
- It's not conceptual — it's a real, deployed, working system
- RAG and agentic workflow are both genuinely implemented, not just
  described
- The Responsible AI section is backed by actual design decisions (source
  citations visible in the UI), not just a written promise

## Reminder from the Guidelines Document
"You are not expected to solve the entire world's problem. You are
expected to: think critically, apply AI responsibly, design with purpose,
build for impact." — keep the deck's tone matched to this: confident but
not overstated.
