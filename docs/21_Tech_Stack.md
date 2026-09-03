# 21 — Tech Stack

## Frontend
- **React 18 + TypeScript** — core framework
- **Vite** — build tool (fast dev server, simpler than CRA)
- **Tailwind CSS** — utility-first styling, maps directly to design tokens
- **Recharts** — trend charts, forecast graphs (AQI over time)
- **React Query (TanStack Query)** — API data fetching, caching, loading states
- **React Router** — page navigation (8 pages)
- **Lucide React** — icon set (thin-line icons matching design system)

## Backend
- **Python 3.11+**
- **FastAPI** — REST API framework
- **Pydantic** — request/response validation
- **pandas** — data analytics layer (rolling averages, anomaly detection)
- **httpx** — async HTTP client for calling Open-Meteo
- **SQLAlchemy** — ORM
- **SQLite** (dev) → **PostgreSQL** (production, if deployed) — user data,
  saved locations, historical AQI cache

## AI / RAG Layer
- **sentence-transformers** (`all-MiniLM-L6-v2`) — free, local embeddings,
  no API cost, good enough quality for this scale of knowledge base
- **FAISS** or **ChromaDB** — vector store (Chroma is simpler to set up,
  recommended default)
- **Anthropic Claude API** (or OpenAI, either works) — final generation step,
  grounded by retrieved chunks
- **PyPDF / pdfplumber** — extracting text from WHO/EPA source PDFs during
  ingestion

## Data Source
- **Open-Meteo Air Quality API** — free, no API key required, provides
  current + forecast AQI and pollutant breakdowns globally

## Auth
- **JWT-based auth** via FastAPI (simple, no need for a heavy auth provider
  at this scale) — `python-jose` + `passlib` for password hashing

## Deployment (free-tier friendly)
- **Frontend:** Vercel or Netlify (free tier, auto-deploy from GitHub)
- **Backend:** Render or Railway (free tier, FastAPI-friendly)
- **Database:** Render/Railway managed Postgres free tier, or Supabase

## Dev Tooling
- **Antigravity** — primary AI coding agent for sprint execution
- **Git + GitHub** — version control (see 15_Git_Workflow.md)
- **Postman / Thunder Client** — manual API testing during backend dev

## Why These Choices (for your resume story)
Every tool here is either free-tier or zero-cost, chosen deliberately so
the project is fully reproducible and deployable without budget — worth
stating explicitly in interviews as a constraint you designed around.
