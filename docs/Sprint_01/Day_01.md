# Sprint 1 — Day 1: Project Setup

## Prompt for Antigravity

```
You are setting up the foundation for "AirSense," a full-stack AI air
quality health assistant. Read the project context below, then execute.

PROJECT CONTEXT:
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Python 3.11 + FastAPI
- Database: SQLite for now (will migrate to Postgres later)
- This is NOT a simple weather display app — it's a health reasoning
  assistant. Keep that framing in mind for later sprints, but today is
  pure scaffolding.

TASK — DO THE FOLLOWING:
1. Create a monorepo structure:
   /airsense
     /frontend   (Vite + React + TS app)
     /backend    (FastAPI app)
     /docs       (copy of this documentation set)

2. Frontend setup:
   - Initialize with `npm create vite@latest frontend -- --template react-ts`
   - Install: tailwindcss, react-router-dom, @tanstack/react-query, recharts,
     lucide-react
   - Configure Tailwind with a `theme.extend.colors` block using these exact
     tokens: deepAtmosphere #0B1220, clearSky #4FA8E0, hazyAmber #E0A458,
     alertRust #D64545, mistWhite #F4F7FA, slateInk #64748B
   - Set up font imports for Space Grotesk, Inter, and IBM Plex Mono
     (Google Fonts)
   - Create a basic folder structure: /src/pages, /src/components,
     /src/api, /src/hooks, /src/types

3. Backend setup:
   - Initialize FastAPI app with a basic /health endpoint
   - Install: fastapi, uvicorn, httpx, sqlalchemy, pydantic, python-jose,
     passlib, pandas
   - Create folder structure: /app/api (routes), /app/models (SQLAlchemy),
     /app/schemas (Pydantic), /app/services (business logic), /app/core
     (config)
   - Set up a config.py that reads environment variables (no hardcoded
     secrets) — see 06_API_Keys_and_Setup.md for what's needed

4. Create a root .env.example file listing every environment variable
   needed (even if not all are used yet): DATABASE_URL, LLM_API_KEY,
   JWT_SECRET

5. Create a root README.md with project name, one-line description, and
   setup instructions for both frontend and backend

DO NOT build any actual features yet (no AQI calls, no pages beyond
scaffolding). Today is purely: does `npm run dev` and `uvicorn main:app
--reload` both start cleanly with no errors.

Confirm at the end: both servers running, folder structure matches above,
README exists.
```
