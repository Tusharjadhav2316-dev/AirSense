# 23 — Glossary

- **AQI** — Air Quality Index, a standardized 0-500+ scale representing
  pollution severity, computed from pollutant concentrations
- **RAG (Retrieval-Augmented Generation)** — an AI pattern where relevant
  documents are retrieved from a knowledge base and given to an LLM as
  context, so it generates answers grounded in real sources rather than
  its own unverified training data
- **Agentic workflow** — a multi-step, conditional process (here: fetch →
  check → branch → retrieve → generate) rather than a single prompt-in/
  response-out call
- **Dominant pollutant** — whichever pollutant (PM2.5, PM10, O3, NO2, SO2,
  CO) is contributing most to the current AQI reading
- **Rolling average** — the average of a value over a moving window (here:
  7 days) used as a baseline for "normal"
- **Anomaly** — a reading that significantly deviates (here: >25%) from
  its rolling average baseline
- **Chunk** — a segment of a source document, sized to be retrievable and
  coherent on its own, with attached metadata (source, section, page)
- **Embedding** — a numeric vector representation of text, used to measure
  semantic similarity for retrieval
- **Vector store** — a database optimized for storing and searching
  embeddings by similarity (ChromaDB, FAISS)
- **Health profile** — the user's self-disclosed vulnerability category
  (None/Asthma/Elderly/Child) used to personalize advice
