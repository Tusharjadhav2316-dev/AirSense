# 09 — Deployment Guide

See Sprint 4 Day 16 for the executable prompt. This doc is the reference
detail behind it.

## Recommended Free-Tier Setup
- **Frontend:** Vercel (auto-deploys from GitHub, zero-config for Vite
  projects)
- **Backend:** Render (free web service tier; note: free tier may spin
  down after inactivity — mention this as a known limitation, not a bug,
  if demoing live)
- **Database:** Render's free Postgres, or keep SQLite if the free tier
  supports a persistent disk

## Pre-Deployment Checklist
- [ ] `.env` is gitignored, never committed
- [ ] All secrets set as environment variables in the hosting dashboard,
      not in code
- [ ] CORS configured on FastAPI to allow the deployed frontend's exact
      domain
- [ ] Production database URL configured (don't accidentally point
      production at your local SQLite file)
- [ ] Frontend's API base URL points to the deployed backend, not
      localhost

## Post-Deployment
- Smoke test every page on the live URL, not just localhost
- Add the live link to your README and resume
- Keep the deployed version stable — avoid pushing untested changes close
  to submission
