# Sprint 4 — Day 15: End-to-End Testing & Bug Fixes

## Prompt for Antigravity

```
AirSense is fully built (Sprints 1-3). Today: harden it. No new features.

TASK:
1. Full manual click-through of all 8 pages, testing:
   - Signup → login → dashboard flow with a real new account
   - Every page with at least 3 different cities (include one that Open-
     Meteo might not have great data for, to test the error state)
   - Every health profile variant (None/Asthma/Elderly/Child) on the
     dashboard — confirm recommendations genuinely differ
   - Compare page with 2 and 3 cities
   - Chat with at least 5 different realistic questions
   - Alerts triggering correctly when AQI crosses a configured threshold
   - Settings changes (health profile, locations) actually affecting
     other pages afterward

2. Fix any broken states found: missing loading indicators, unhandled API
   errors, layout breaking on narrow (mobile) viewport widths, broken
   navigation.

3. Add or confirm empty states for: no saved locations yet, no alerts yet,
   no chat history yet, city search with no results — each should have a
   clear, on-brand message (not a blank page or console error visible to
   the user).

4. Check responsive behavior at mobile width (375px) for all 8 pages —
   this matters both for grading and for the "future mobile app" framing
   in the docs.

5. Remove any leftover mock/dummy/hardcoded data anywhere in the frontend
   (a common issue if placeholders were used early in Sprint 3) — replace
   with real API-backed data.

Deliverable: a punch-list of bugs found + fixed, kept in
20_Decision_Log.md, and a working app with no obvious broken paths through
any of the 8 pages.
```
