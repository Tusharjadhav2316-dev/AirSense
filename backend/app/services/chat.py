"""
================================================================================
AIRSENSE — CONVERSATIONAL CHAT SERVICE (Sprint 2 — Day 9)
================================================================================
Handles free-text conversational chat queries:
  1. Vector searches ChromaDB guidelines store using the user's free-text message.
  2. Fetches live AQI context for the requested city.
  3. Synthesizes a grounded, conversational response via OpenRouter (anthropic/claude-opus-5)
     or deterministic WHO/EPA fallback engine.
================================================================================
"""

import json
import httpx
from typing import List, Dict, Any
from app.core.config import settings
from app.services.openmeteo import fetch_current_aqi
from app.rag.retriever import _get_collection
from app.schemas.chat import ChatRequest, ChatResponse

CHAT_SYSTEM_PROMPT = (
    "You are AirSense, an empathetic, expert public health AI assistant. "
    "Your job is to answer user questions about air quality, health precautions, and outdoor safety. "
    "STRICT GROUNDING & TONE RULES:\n"
    "1. Base your answer ONLY on the provided WHO/EPA context chunks and live city AQI data.\n"
    "2. Keep your tone direct, conversational, plain-language, and health-focused.\n"
    "3. Never guess numbers or make unsupported medical claims.\n"
    "4. Cite which WHO/EPA sources support your response."
)

def _build_chat_fallback(
    message: str,
    aqi_data: Dict[str, Any],
    health_profile: str,
    retrieved_chunks: List[Dict[str, Any]]
) -> ChatResponse:
    """
    Deterministic grounded fallback generator for chat endpoint.
    """
    city = aqi_data.get("city", "the city")
    aqi = aqi_data.get("aqi", 0)
    cat = aqi_data.get("category", "Good")
    pollutant = aqi_data.get("dominant_pollutant", "PM2.5")
    profile = health_profile.lower()

    sources = []
    seen_sources = set()
    for chunk in retrieved_chunks:
        src = chunk.get("source_name", "WHO/EPA Guideline")
        sec = chunk.get("section_title", "Guideline")
        key = f"{src} — {sec}"
        if key not in seen_sources:
            seen_sources.add(key)
            sources.append(key)

    if not sources:
        sources = ["WHO Global Air Quality Guidelines (2021)"]

    msg_lower = message.lower()

    if "safe" in msg_lower or "exercise" in msg_lower or "run" in msg_lower or "outside" in msg_lower:
        if aqi <= 50:
            resp = f"Yes, it is completely safe to exercise outside in {city} today! The AQI is currently {aqi} (Good), which meets safe WHO targets."
        elif aqi <= 100:
            resp = f"Air quality in {city} is currently Moderate (AQI {aqi}, dominant pollutant {pollutant}). Exercise is acceptable for most people, but sensitive individuals should keep outdoor workouts shorter."
        else:
            resp = f"No, outdoor exercise is not recommended in {city} today. The AQI is currently {aqi} ({cat}) due to elevated {pollutant}. Consider indoor workouts until levels drop."
    elif "asthma" in msg_lower or "precaution" in msg_lower or "sensitive" in msg_lower:
        if aqi <= 50:
            resp = f"In {city}, air quality is Good (AQI {aqi}). Asthmatics can enjoy outdoor activities normally, but always keep your rescue inhaler handy."
        else:
            resp = f"For asthmatics in {city} (AQI {aqi}, {cat}), keep windows closed, use an indoor HEPA air purifier, and avoid strenuous outdoor exercise during peak pollution hours."
    elif "why" in msg_lower or "bad" in msg_lower or "cause" in msg_lower:
        resp = f"The air quality in {city} is currently {cat} with an AQI of {aqi}. The dominant pollutant is {pollutant}, which penetrates into respiratory airways causing acute inflammation as documented by WHO & EPA guidelines."
    else:
        resp = f"Current air quality in {city} is {cat} (AQI {aqi}, dominant pollutant {pollutant}). Based on WHO guidelines, ensure you adjust outdoor activity duration according to your health sensitivity."

    return ChatResponse(response=resp, sources=sources[:3])

async def process_chat_message(payload: ChatRequest) -> ChatResponse:
    """
    Executes the conversational RAG chat pipeline.
    """
    city = payload.city.strip() if payload.city else "Pune"
    health_profile = payload.health_profile.strip() if payload.health_profile else "none"
    message = payload.message.strip()

    # 1. Fetch live AQI context for the city
    try:
        raw_aqi = await fetch_current_aqi(city)
        aqi_data = {
            "city": raw_aqi.get("city", city),
            "aqi": raw_aqi.get("aqi", 0),
            "category": raw_aqi.get("category", "Good"),
            "dominant_pollutant": raw_aqi.get("dominant_pollutant", "PM2.5")
        }
    except Exception:
        aqi_data = {"city": city, "aqi": 80, "category": "Moderate", "dominant_pollutant": "PM2.5"}

    # 2. Vector search ChromaDB using the free-text user message
    collection = _get_collection()
    search_query = f"{message} (Health profile: {health_profile}, AQI Category: {aqi_data['category']})"
    
    results = collection.query(
        query_texts=[search_query],
        n_results=3,
        include=["documents", "metadatas", "distances"]
    )

    retrieved_chunks = []
    if results and results.get("documents") and len(results["documents"]) > 0:
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        for i in range(len(docs)):
            retrieved_chunks.append({
                "source_name": metas[i].get("source_name", "WHO/EPA Guideline"),
                "section_title": metas[i].get("section_title", "Guideline"),
                "content": docs[i]
            })

    # 3. Check OpenRouter API key
    api_key = (settings.OPENROUTER_API_KEY or settings.LLM_API_KEY or "").strip()
    if not api_key:
        print("[INFO] OpenRouter API key not set. Using chat fallback generator.")
        return _build_chat_fallback(message, aqi_data, health_profile, retrieved_chunks)

    # Build conversation context string
    context_str = "\n\n".join([
        f"--- SOURCE: {c['source_name']} ({c['section_title']}) ---\n{c['content']}"
        for c in retrieved_chunks
    ])

    history_msgs = []
    if payload.conversation_history:
        for m in payload.conversation_history[-4:]:
            role = "user" if m.role == "user" else "assistant"
            history_msgs.append({"role": role, "content": m.content})

    user_prompt = (
        f"CURRENT ENVIRONMENT:\n"
        f"City: {aqi_data['city']}, AQI: {aqi_data['aqi']} ({aqi_data['category']}), "
        f"Dominant Pollutant: {aqi_data['dominant_pollutant']}\n"
        f"User Health Profile: {health_profile}\n\n"
        f"RETRIEVED WHO/EPA GUIDELINE CONTEXT:\n{context_str}\n\n"
        f"USER QUESTION: \"{message}\"\n\n"
        f"TASK:\n"
        f"Respond in valid JSON with this format:\n"
        f"{{\n"
        f'  "response": "<direct conversational answer>",\n'
        f'  "sources": ["<source title 1>", "<source title 2>"]\n'
        f"}}\n"
    )

    messages_payload = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
    messages_payload.extend(history_msgs)
    messages_payload.append({"role": "user", "content": user_prompt})

    openrouter_url = f"{settings.OPENROUTER_BASE_URL.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://airsense.app",
        "X-Title": "AirSense Conversational Health Chat"
    }
    body = {
        "model": settings.LLM_MODEL,
        "messages": messages_payload,
        "max_tokens": 400,
        "temperature": 0.4
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(openrouter_url, headers=headers, json=body)
            res.raise_for_status()
            data = res.json()
            choices = data.get("choices", [])
            if choices and choices[0].get("message", {}).get("content"):
                raw_text = choices[0]["message"]["content"].strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                raw_text = raw_text.strip()
                
                parsed = json.loads(raw_text)
                return ChatResponse(
                    response=parsed.get("response", raw_text),
                    sources=parsed.get("sources", ["WHO Global Air Quality Guidelines (2021)"])
                )
    except Exception as e:
        print(f"[WARN] OpenRouter chat call failed ({e}). Using grounded chat fallback.")
        return _build_chat_fallback(message, aqi_data, health_profile, retrieved_chunks)

    return _build_chat_fallback(message, aqi_data, health_profile, retrieved_chunks)
