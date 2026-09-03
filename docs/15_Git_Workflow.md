# 15 — Git Workflow

## Branching
Given the solo, tight-timeline nature of this project, keep it simple:
- `main` branch always deployable
- Work directly on `main` for most days, OR use short-lived feature
  branches per sprint-day if you want cleaner history (`sprint2-day8-agent`)
  — either is fine, don't over-engineer process for a solo 18-day project

## Commit Message Format
`[sprint-day] short description`
Example: `[S1-D2] add Open-Meteo current + forecast endpoints`

## Commit Frequency
Commit at the end of each sprint-day at minimum — this gives you a clean,
demonstrable history for your GitHub profile, and a rollback point if a
day's work breaks something.

## .gitignore Essentials
```
.env
*.db
/backend/rag_sources/raw/
/backend/rag_sources/vector_store/
node_modules/
__pycache__/
.venv/
```
(Vector store and raw PDFs are typically excluded due to size — regenerate
via the ingest/build_index scripts rather than committing large binary
artifacts.)

## README Quality
Since this becomes a resume artifact, keep the README genuinely good:
project description, live link, tech stack, architecture diagram, setup
instructions, screenshots.
