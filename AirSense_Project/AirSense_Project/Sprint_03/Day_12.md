# Sprint 3 — Day 12: Main Dashboard

## Prompt for Antigravity

```
Build the Main Dashboard — the most important page in AirSense, and the
one that must most clearly prove the "recommendation-first" design rule.
Reference 14_UI_UX_Guide.md page 3.

TASK:
1. Build `src/pages/Dashboard.tsx`:
   - Location selector at top (search or pick from saved locations)
   - On load/location change: call `/agent/advice` (the Day 8 endpoint)
     with the user's health profile from AuthContext
   - Render the `RecommendationHero` component with the returned
     recommendation, why-text, and sources — THIS must be the largest,
     first-read element on the page, full width, prominent background
     (use the ambient gradient tied to the returned aqi_category)
   - Below the hero: `AQIBadge` (small, not full-width) + row of
     `PollutantCard` components (PM2.5, PM10, O3, NO2, SO2, CO) from the
     /aqi/current data
   - Below that: `TrendChart` showing 7-day trend + 48h forecast, calling
     `/aqi/trend` and `/aqi/forecast`
   - Bottom: `BottomNav`

2. Handle the "Good" air quality case distinctly (per the agent's branch
   logic from Day 8) — when `used_ai_generation` is false, show a calmer,
   less alarming hero styling (still prominent, just visually "all clear"
   rather than "warning") — the ambient gradient should reflect this too.

3. Add loading states (skeleton or spinner) for the /agent/advice call
   specifically, since it can take a moment (LLM generation) — don't let
   the page look broken while waiting.

4. Add a basic error state: if a searched city returns no data, show a
   clear message, not a blank/broken page.

Self-check before moving on: screenshot this page and compare it side by
side with a generic weather app. If the AQI number is more visually
prominent than the recommendation sentence, that's wrong — fix the layout
before proceeding to Day 13.
```
