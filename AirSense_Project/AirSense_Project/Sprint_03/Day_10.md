# Sprint 3 — Day 10: Design Tokens & Shared Components

## Prompt for Antigravity

```
Start frontend build for AirSense. Backend is fully working (Sprints 1-2).
Reference 14_UI_UX_Guide.md — this is the LOCKED design spec, implement
exactly as written, especially the "recommendation-first hierarchy" rule.

TASK:
1. Confirm Tailwind config has all design tokens from Day 1 setup:
   deepAtmosphere, clearSky, hazyAmber, alertRust, mistWhite, slateInk.
   Add font-family utilities for Space Grotesk (display), Inter (body),
   IBM Plex Mono (data).

2. Build shared components in `src/components/`:
   - `Button` (primary/secondary variants, Clear Sky primary)
   - `Card` (12-16px rounded, subtle shadow, Mist White surface)
   - `AQIBadge` (small, color-coded by category — this must always render
     SMALL, never full-width hero-sized, per the design rule)
   - `RecommendationHero` (the large AI recommendation component — Space
     Grotesk headline + "why" text + Sources pill row — THIS is always the
     visual hero wherever it's used)
   - `PollutantCard` (small data card, IBM Plex Mono values)
   - `TrendChart` (Recharts wrapper, accepts data + anomaly markers)
   - `SourcesPill` (expandable citation row, reusable across dashboard +
     chat)
   - `BottomNav` (Home/Trends/Chat/Alerts/Settings — mobile-style tab bar
     that also works on desktop as a sidebar or top bar, but same
     component/tokens)

3. Set up `src/api/client.ts` — a typed API client wrapping fetch calls to
   the FastAPI backend (all endpoints built in Sprints 1-2), using
   React Query hooks (e.g. `useAQICurrent(city)`, `useAgentAdvice(city,
   profile)`, `useTrend(city, days)`).

4. Set up `src/types/` with TypeScript interfaces matching the backend
   Pydantic schemas exactly (keep these in sync manually for now).

Do not build full pages yet — today is purely the reusable component
library + typed API layer everything else will be built from.
```
