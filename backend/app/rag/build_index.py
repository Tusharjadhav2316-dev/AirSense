"""
================================================================================
AIRSENSE — CHROMADB VECTOR STORE BUILD INDEX (Sprint 2 — Day 6)
================================================================================
Loads processed chunks from chunks.json, generates embeddings via ONNX all-MiniLM-L6-v2,
and persists chunks + metadata into a persistent ChromaDB vector store.

Vector store directory: backend/rag_sources/vector_store/
Collection name: airsense_guidelines
================================================================================
"""

import os
import json
import chromadb
from chromadb.utils import embedding_functions

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PROCESSED_JSON = os.path.join(BASE_DIR, "rag_sources", "processed", "chunks.json")
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "rag_sources", "vector_store")
COLLECTION_NAME = "airsense_guidelines"

def build_vector_store():
    print("==========================================")
    print("AIRSENSE — BUILDING RAG VECTOR STORE")
    print("==========================================")

    if not os.path.exists(PROCESSED_JSON):
        raise FileNotFoundError(f"Missing processed chunks file at {PROCESSED_JSON}. Run ingest.py first!")

    with open(PROCESSED_JSON, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    print(f"[LOADED] {len(chunks)} processed chunks from chunks.json")

    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=VECTOR_STORE_DIR)

    # Use ChromaDB's default ONNX all-MiniLM-L6-v2 embedding function
    embedding_fn = embedding_functions.DefaultEmbeddingFunction()

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn,
        metadata={"description": "WHO & EPA official air quality and health guidance chunks"}
    )

    ids = []
    documents = []
    metadatas = []

    for chunk in chunks:
        ids.append(chunk["id"])
        documents.append(chunk["content"])
        metadatas.append({
            "source_name": str(chunk.get("source_name", "WHO/EPA Guideline")),
            "section_title": str(chunk.get("section_title", "Guideline Section")),
            "page_number": int(chunk.get("page_number", 1)),
            "pollutant": str(chunk.get("pollutant", "General"))
        })

    print(f"[EMBEDDING] Vectorizing and upserting {len(ids)} chunks into ChromaDB...")
    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

    print(f"\n[SUCCESS] Successfully indexed {len(ids)} chunks into ChromaDB collection '{COLLECTION_NAME}'!")
    print(f"[STORE LOCATION] {VECTOR_STORE_DIR}")

if __name__ == "__main__":
    build_vector_store()
