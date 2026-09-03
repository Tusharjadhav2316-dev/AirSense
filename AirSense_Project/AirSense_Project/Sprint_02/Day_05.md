# Sprint 2 — Day 5: RAG Source Collection & Chunking

## Prompt for Antigravity

```
Start building the RAG knowledge base for AirSense. Reference
28_RAG_Resources_Guide.md for full detail — follow it exactly.

TASK:
1. Download these two source PDFs into `backend/rag_sources/raw/`
   (gitignore this raw folder — don't commit large PDFs to git):
   - WHO Global Air Quality Guidelines (2021):
     https://www.who.int/publications/i/item/9789240034228
   - AirNow/EPA AQI Technical Assistance Document:
     https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf

2. Write an ingestion script `app/rag/ingest.py` that:
   - Extracts text from both PDFs using pdfplumber
   - Splits text into chunks by logical section (target 200-400 words per
     chunk) — do NOT just split by fixed character count blindly, try to
     respect section/paragraph boundaries
   - Attaches metadata to every chunk: {source_name, section_title (best
     guess from headers), page_number}
   - Saves the chunked output as a JSON file
     `backend/rag_sources/processed/chunks.json` for inspection before
     embedding

3. Manually review chunks.json after generation — confirm:
   - Chunks contain real, coherent guideline text (not garbled PDF
     extraction artifacts)
   - Metadata (source, page) looks correct
   - No duplicate or near-duplicate chunks

4. If extraction quality is poor for either PDF (common with complex
   tables), note which sections needed manual cleanup in a comment at the
   top of ingest.py, and manually clean those specific sections in the
   JSON output — don't let bad extraction silently produce bad chunks.

Do not build embeddings or the vector store yet — that's tomorrow. Today's
deliverable is a clean, reviewed chunks.json file.
```
