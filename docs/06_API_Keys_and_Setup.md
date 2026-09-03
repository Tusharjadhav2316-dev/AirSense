# 06 — API Keys & Environment Setup

## Required Environment Variables (`.env` — never commit this file)

```
# Database
DATABASE_URL=sqlite:///./airsense.db  # or postgres URL in production

# Auth
JWT_SECRET=<generate a random 32+ char string>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080  # 7 days

# LLM (for RAG generation + chat)
LLM_API_KEY=<your Anthropic or OpenAI key>
LLM_PROVIDER=anthropic  # or openai

# Open-Meteo
# No API key required — it's free and open, no signup needed
```

## Getting an LLM API Key
- **Anthropic:** console.anthropic.com → create account → API Keys →
  generate key. Free credits available for new accounts, check current
  offer on the console.
- **OpenAI:** platform.openai.com → API Keys → generate key. Requires
  billing setup for most models.

Either works — the architecture doesn't depend on a specific provider,
`app/services/llm_client.py` should be a thin wrapper so swapping
providers later is a one-file change.

## Open-Meteo Setup
No account, no key, no signup. Two free endpoints:
- Air quality: `https://air-quality-api.open-meteo.com/v1/air-quality`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`

Respect reasonable rate limits even though it's free — the caching layer
built in Sprint 1 Day 3 helps with this.

## Security Rules
- `.env` must be in `.gitignore` from Day 1 — verify this before the first
  commit
- Never log API keys, even in debug output
- Rotate the JWT_SECRET before any public deployment if it was ever
  committed by mistake during development
