import os
from typing import List, Dict, Any
from app.core.config import settings

try:
    import chromadb
    from chromadb.utils import embedding_functions
    HAS_CHROMADB = True
except Exception:
    chromadb = None
    embedding_functions = None
    HAS_CHROMADB = False

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "rag_sources", "vector_store")
COLLECTION_NAME = "airsense_guidelines"

_chroma_client = None
_collection = None

def _get_collection():
    global _chroma_client, _collection
    if not HAS_CHROMADB:
        return None
    if _collection is None:
        try:
            os.makedirs(VECTOR_STORE_DIR, exist_ok=True)
            _chroma_client = chromadb.PersistentClient(path=VECTOR_STORE_DIR)
            embedding_fn = embedding_functions.DefaultEmbeddingFunction()
            _collection = _chroma_client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=embedding_fn
            )
        except BaseException:
            return None
    return _collection

def retrieve_guidelines(query_text: str, top_k: int = 4) -> List[Dict[str, Any]]:
    """
    RAG Retrieval Service:
    Embeds the user query, searches ChromaDB vector store, and returns top_k matching WHO/EPA chunks
    along with source metadata and relevance scores.
    """
    if not query_text or not query_text.strip():
        return []

    collection = _get_collection()
    if collection is None:
        return []

    try:
        results = collection.query(
            query_texts=[query_text.strip()],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        retrieved_chunks = []
        if results and results.get("documents") and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            dists = results["distances"][0]
            ids = results["ids"][0]

            for i in range(len(docs)):
                dist = dists[i]
                sim_score = max(0.0, round((1.0 - dist) * 100, 1))
                retrieved_chunks.append({
                    "id": ids[i],
                    "source_name": metas[i].get("source_name", "WHO/EPA Guideline"),
                    "section_title": metas[i].get("section_title", "Guideline"),
                    "page_number": metas[i].get("page_number", 1),
                    "pollutant": metas[i].get("pollutant", "General"),
                    "content": docs[i],
                    "similarity_score": sim_score
                })

        return retrieved_chunks
    except Exception:
        return []
