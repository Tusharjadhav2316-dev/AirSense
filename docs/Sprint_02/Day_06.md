# Sprint 2 — Day 6: Embeddings & Vector Store

## Prompt for Antigravity

```
Continue the RAG pipeline for AirSense. Yesterday produced
chunks.json. Today: embed and store it for retrieval.

TASK:
1. Install `sentence-transformers` and `chromadb`.

2. Write `app/rag/build_index.py` that:
   - Loads chunks.json
   - Embeds every chunk using `all-MiniLM-L6-v2` (free, local model, no
     API key needed)
   - Stores each chunk + its embedding + metadata in a persistent ChromaDB
     collection called `airsense_guidelines`, saved to
     `backend/rag_sources/vector_store/`

3. Write a simple retrieval test script `app/rag/test_retrieval.py` that:
   - Takes a plain-text query (e.g., "unhealthy PM2.5 asthma precautions")
   - Embeds it with the same model
   - Retrieves the top 5 most similar chunks from the ChromaDB collection
   - Prints each result with its similarity score and source metadata

4. Run test_retrieval.py with these 5 test queries and manually verify the
   results are actually relevant (not just similar-sounding but off-topic):
   - "unhealthy PM2.5 levels precautions for asthma"
   - "safe outdoor exercise moderate air quality"
   - "elderly health effects ozone exposure"
   - "hazardous air quality children guidance"
   - "PM10 threshold general population"

If any of these return poor/irrelevant results, that's a signal the
chunking from Day 5 needs revisiting — flag it rather than proceeding with
bad retrieval quality.

Do not build the full agent workflow or LLM generation yet — that's
tomorrow/day after. Today's deliverable is: a working, tested vector store
that reliably returns relevant guideline chunks for realistic queries.
```
