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

## Sprint 2 — RAG & Agentic Workflow Decision Log

**[Sprint 2 Day 5] Decision: Logical Section-Based Chunking (200-400 words) with Source Metadata**
Reason: Preserves complete WHO & EPA health advice context blocks (e.g. vulnerable groups, PM2.5 thresholds) without cutting mid-sentence.
Alternative considered: Fixed-character sliding window (500 chars) — rejected because key health numbers and pollutant definitions were split across chunks.

**[Sprint 2 Day 6] Decision: Use Local ONNX MiniLM-L6-v2 Embeddings via ChromaDB**
Reason: Provides 384-dimensional dense vector embeddings with 0 heavy PyTorch dependencies, executing locally in under 15ms.
Alternative considered: OpenAI `text-embedding-3-small` — rejected to keep vector search offline, zero-cost, and fast.

**[Sprint 2 Day 7] Decision: Strict Grounding & Dual-Engine Synthesis (OpenRouter + Fallback)**
Reason: Ensures 100% WHO/EPA source attribution and guarantees zero application downtime if an API key is unconfigured or rate-limited.
Alternative considered: Unconstrained LLM generation — rejected due to risk of hallucinated medical thresholds.

**[Sprint 2 Day 8] Decision: Explicit 5-Step Agentic Workflow (`/agent/advice`)**
Reason: Clear, observable multi-step execution (Fetch -> Check -> Branch -> Retrieve -> Generate) making agentic logic demonstrable and debuggable with threshold efficiency shortcuts.
Alternative considered: Single black-box LLM prompt with function calling — rejected due to lack of deterministic branching control.

**[Sprint 2 Day 9] Decision: Dual-Endpoint Architecture (`/agent/advice` for structured guidance, `/chat` for free-text Q&A)**
Reason: Provides instant personalized action recommendations via structured JSON for dashboard cards, while offering a full RAG-powered conversational assistant for user inquiries.
