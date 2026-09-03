# 28 — RAG Resources Guide

## Why RAG (not just prompting)
If we just tell an LLM "AQI is 180, give health advice," it answers from
general training — no citation, no guarantee of accuracy, and it's a
Responsible AI risk (unverifiable, could hallucinate thresholds). RAG fixes
this by grounding every answer in real documents we control.

## Source Documents to Collect

### 1. WHO Global Air Quality Guidelines (2021)
- URL: https://www.who.int/publications/i/item/9789240034228
- Official WHO PDF (~7MB), covers PM2.5, PM10, ozone, NO2, SO2, CO
  thresholds and health effects
- Use for: pollutant threshold science, health effect explanations

### 2. AirNow / EPA AQI Technical Assistance Document
- URL: https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf
- Defines AQI color categories, breakpoint tables, sensitive-group cautionary
  statements per pollutant
- Use for: category-to-action mapping ("if AQI is X, sensitive groups should
  do Y")

### 3. EPA Wildfire/Exposure Reduction Guidance (supplementary)
- Practical dose-reduction advice: reduce concentration (be active when air
  is better), reduce breathing rate (walk not jog), reduce duration (less
  time outdoors)
- Use for: giving genuinely actionable, non-generic advice text

## Collection Steps
1. Download all 3 PDFs to `/backend/rag_sources/raw/`
2. Do NOT redistribute these publicly in your repo if licensing is unclear —
   keep raw PDFs in a gitignored folder, only commit the processed/chunked
   text + citation metadata
3. Extract text using `pdfplumber` or `PyPDF2` (page by page, preserve
   section headers where possible)

## Chunking Strategy
- Chunk by logical section, not fixed character count — e.g., one chunk per
  pollutant threshold table, one chunk per AQI category's health advisory
  text, one chunk per sensitive-group guidance block
- Target chunk size: ~200-400 words — small enough for precise retrieval,
  large enough to keep context coherent
- Attach metadata to every chunk: `{source: "WHO AQG 2021", section:
  "PM2.5 thresholds", page: 12}` — this metadata is what powers the visible
  "Sources" citation pills in the UI

## Embedding + Vector Store
1. Use `sentence-transformers/all-MiniLM-L6-v2` (free, runs locally, no API
   cost) to embed each chunk
2. Store in ChromaDB (simplest to set up) with metadata attached
3. At query time: embed the query (AQI category + dominant pollutant +
   health profile, e.g. "unhealthy PM2.5 asthma precautions") → retrieve
   top 3-5 chunks by similarity

## Implementation Flow (ties to 02_Architecture.md)
```
User request (AQI=168, PM2.5 dominant, profile=asthma)
        │
        ▼
Build retrieval query: "unhealthy air quality PM2.5 asthma precautions"
        │
        ▼
Vector search → top-k chunks + their source metadata
        │
        ▼
Construct LLM prompt:
  "Given this AQI reading [data] and this user profile [asthma],
   using ONLY the following retrieved guidance [chunks], write a
   short, personalized recommendation. Cite which source each claim
   comes from."
        │
        ▼
LLM generates grounded response
        │
        ▼
Frontend displays: recommendation sentence + "Sources: WHO AQG 2021,
EPA AQI Guide" (matches locked UI mockup)
```

## Quality Check (Day 7 of Sprint 2)
Before moving on, manually test 5-10 realistic queries (different AQI
levels x different health profiles) and confirm:
- Retrieved chunks are actually relevant to the query
- Generated advice doesn't contradict the retrieved source
- Citations shown match what was actually retrieved (no fabricated sources)

## Responsible AI Note (for your deck)
State clearly: the knowledge base is built from two authoritative public
health sources (WHO, EPA), advice is always retrieval-grounded rather than
freely generated, and the system defaults to conservative/cautious guidance
when data is ambiguous.
