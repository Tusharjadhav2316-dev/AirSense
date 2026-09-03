# 20 — Decision Log

Keep this updated as you build — a running record of key decisions and
why. Useful for interview prep later ("why did you choose X over Y?") and
for Sprint 2 Day 9's note-taking task.

## Format
```
[Date/Sprint-Day] Decision: ...
Reason: ...
Alternative considered: ...
```

## Pre-Filled Entries (decisions already made in planning)

**[Planning] Decision: Use Open-Meteo instead of AQICN/WAQI**
Reason: Zero-friction, no API key required, includes forecast data useful
for the analytics/trend features.
Alternative considered: AQICN — real ground-station data, but requires a
free token and doesn't include the same forecast depth.

**[Planning] Decision: Use ChromaDB instead of FAISS**
Reason: Simpler setup, built-in metadata storage, sufficient for this
knowledge base's small scale (a few hundred chunks, not millions).
Alternative considered: FAISS — faster at scale, but adds complexity not
needed here.

**[Planning] Decision: Recommendation-first UI hierarchy**
Reason: Direct response to feedback that the app "looked like a weather
app" — the fix needed to be structural (what's visually largest/first),
not cosmetic.
Alternative considered: Keep AQI number as hero with AI advice as a
caption — rejected, this is exactly the pattern that reads as generic.

**[Planning] Decision: Rule-based skip for "Good" AQI category**
Reason: Avoids unnecessary LLM calls/cost when there's nothing meaningful
to say, and makes the agent's branching logic genuinely visible/
demonstrable (not just always calling the LLM regardless of need).

## Add your own entries below as you build:
