# Sprint 4 — Day 16: Deployment

## Prompt for Antigravity

```
Deploy AirSense so it has a live, shareable link. Reference
09_Deployment_Guide.md and 21_Tech_Stack.md for the chosen free-tier
services.

TASK:
1. Backend deployment (Render or Railway, free tier):
   - Set up a production requirements.txt / pyproject.toml
   - Configure environment variables in the hosting dashboard (never
     commit secrets): DATABASE_URL, LLM_API_KEY, JWT_SECRET
   - Switch database to the platform's managed Postgres if using Render/
     Railway's free Postgres, or keep SQLite if deploying to a
     persistent-disk-supporting free tier (note the tradeoff either way)
   - Deploy and confirm /health returns 200 from the public URL

2. Frontend deployment (Vercel or Netlify, free tier):
   - Set the production API base URL as an environment variable, pointing
     to the deployed backend
   - Deploy and confirm the live site loads and can reach the backend
     (check CORS is configured correctly on the FastAPI side for the
     deployed frontend's domain)

3. Full smoke test on the LIVE deployed app (not localhost): signup,
   dashboard, chat, trends — confirm everything that worked locally also
   works on the deployed version.

4. Update the root README.md with:
   - Live demo link
   - Short setup instructions for running locally
   - Screenshot(s) of the dashboard

5. Finalize the "Data Sources & Responsible AI" content on the Settings
   page and in the README — make sure it's accurate to what's actually
   built (don't overstate capabilities).

Deliverable: a live, public URL for both frontend and backend, working
end to end, ready to link on your resume/GitHub.
```
