# Sprint 3 — Day 13: Compare & Trends/Analytics Pages

## Prompt for Antigravity

```
Build two more AirSense pages. Reference 14_UI_UX_Guide.md pages 4-5.

TASK:

1. Build `src/pages/Compare.tsx`:
   - Support comparing 2-3 cities side by side
   - For each city, call `/agent/advice` and `/aqi/current`, and display
     each as a vertical card
   - Above the cards (or as the top element), show a short AI-generated
     comparative insight sentence — this requires a small addition to the
     backend: either a new lightweight endpoint `/agent/compare` that
     takes 2-3 cities + health profile and asks the LLM to write one
     comparative sentence using the already-fetched AQI data for each
     (no need for a new RAG retrieval here, just a simple comparison
     prompt) — build this backend addition today if not already present
   - "Add another city to compare" action (up to 3 total)

2. Build `src/pages/Trends.tsx`:
   - AI-generated pattern insight at the top (can reuse a simple
     "insight" LLM call summarizing the /aqi/trend anomaly data, or
     derive it with a simple rule-based sentence generator if you want
     to avoid an extra LLM call here — either is acceptable, note which
     approach was used)
   - Tabbed sections: AQI Trend / Pollutants / Anomalies / Insights
   - Trend chart with 7/30/90 day range toggle, anomalies marked in Alert
     Rust
   - Calendar heatmap component (30 days, color-coded by severity
     category) — build as a new component `src/components/
     CalendarHeatmap.tsx`
   - Insights panel showing the summary stats from /aqi/trend (anomaly
     count, highest/average AQI, days in Good range)

Test both pages with real backend data for at least 2-3 real cities.
```
