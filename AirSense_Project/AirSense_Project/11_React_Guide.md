# 11 — React Guide (Project-Specific Notes)

## Structure
```
frontend/src/
  pages/          (8 pages: Landing, Auth, Dashboard, Compare, Trends,
                    Chat, Alerts, Settings)
  components/     (shared: Button, Card, AQIBadge, RecommendationHero,
                    PollutantCard, TrendChart, SourcesPill, BottomNav,
                    CalendarHeatmap)
  api/            (typed API client + React Query hooks)
  context/        (AuthContext — user, JWT, health profile)
  types/          (TS interfaces matching backend Pydantic schemas)
  hooks/          (custom hooks beyond React Query, if needed)
```

## Key Patterns
- Data fetching: React Query hooks per endpoint (`useAQICurrent`,
  `useAgentAdvice`, `useTrend`, `useChat`), never raw `useEffect` + fetch
- Auth state: React Context + JWT stored appropriately (localStorage is
  fine at this scope; note the XSS tradeoff in a comment if used)
- Protected routes: wrapper component checking AuthContext, redirect to
  `/login` if unauthenticated

## The One Rule That Matters Most
`RecommendationHero` must always render larger/more prominent than
`AQIBadge` wherever both appear together. If a future component reorders
this, it breaks the whole design thesis — treat this as close to a hard
constraint as CSS allows.

## Component Reuse for Future Mobile
Every component should accept props for content, not hardcode layout
assumptions specific to desktop web — this is what lets the same
components later work in a React Native shell with only container/layout
changes.
