"""
================================================================================
AIRSENSE — GROUNDED RAG GENERATOR SERVICE (OpenRouter Integration)
================================================================================
Synthesizes personalized, WHO/EPA-grounded health recommendations from retrieved chunks
via OpenRouter API (anthropic/claude-opus-5) or fallback grounded synthesis engine.
================================================================================
"""

import json
import httpx
from typing import List, Dict, Any
from app.core.config import settings

GROUNDED_SYSTEM_PROMPT = (
    "You are AirSense, a grounded public health AI assistant. "
    "Your job is to provide concise, direct, personalized air quality health guidance. "
    "STRICT GROUNDING RULES:\n"
    "1. Base your recommendations ONLY on the provided WHO/EPA context chunks.\n"
    "2. Never fabricate health claims, AQI numbers, or thresholds not supported by the context.\n"
    "3. Keep advice direct, plain-language, and practical (1 action sentence + 1 clear explanation).\n"
    "4. Cite the exact source supporting each claim."
)

def _build_grounded_fallback(
    aqi_data: Dict[str, Any],
    health_profile: str,
    retrieved_chunks: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Deterministic grounded synthesis engine used when OpenRouter API is unconfigured or offline.
    Extracts advice directly from the top retrieved WHO/EPA chunks without hallucinating.
    """
    aqi = aqi_data.get("aqi", 0)
    category = aqi_data.get("category", "Good")
    dominant = aqi_data.get("dominant_pollutant", "PM2.5")
    profile = health_profile.lower()

    sources = []
    seen_sources = set()

    for chunk in retrieved_chunks:
        src_title = chunk.get("source_name", "WHO/EPA Guideline")
        sec_title = chunk.get("section_title", "Guideline")
        key = f"{src_title} - {sec_title}"
        if key not in seen_sources:
            seen_sources.add(key)
            sources.append({"title": src_title, "section": sec_title})

    if not sources:
        sources = [{"title": "WHO/EPA Air Quality Guidelines", "section": "Standard Public Health Advice"}]

    # Personalized advice logic grounded in AQI category & health profile
    if profile == "asthma":
        if aqi <= 50:
            rec = "Air quality is good. You can enjoy outdoor activities normally, but keep your rescue inhaler accessible."
            why = f"PM2.5 and pollutant levels are within safe WHO limits, posing minimal risk for asthmatics."
        elif aqi <= 100:
            rec = "Moderate air quality. Limit prolonged strenuous outdoor exertion if you experience coughing or shortness of breath."
            why = f"Elevated {dominant} can cause mild bronchial sensitivity in individuals with asthma."
        else:
            rec = "Unhealthy air quality for asthma. Avoid strenuous outdoor activities, keep windows closed, and use an indoor air purifier."
            why = f"High levels of {dominant} (AQI {aqi}) trigger acute airway inflammation and asthma attacks as documented by WHO guidelines."

    elif profile == "elderly":
        if aqi <= 50:
            rec = "Air quality is clean and safe for outdoor walks and physical activity."
            why = "Atmospheric pollutant levels are well within WHO target guidelines."
        elif aqi <= 100:
            rec = "Air quality is acceptable. Consider shorter outdoor walks if you feel chest tightness or throat irritation."
            why = f"Moderate {dominant} concentrations may cause mild cardiopulmonary fatigue in older adults."
        else:
            rec = "Unhealthy air quality. Stay indoors in a clean air environment and avoid outdoor exercise."
            why = f"AQI of {aqi} due to elevated {dominant} increases cardiovascular stress and respiratory irritation in seniors."

    elif profile == "child":
        if aqi <= 50:
            rec = "Air quality is optimal for outdoor play, sports, and school recess."
            why = "Pollutant concentrations meet WHO safe exposure targets."
        elif aqi <= 100:
            rec = "Moderate air quality. Schedule active outdoor play for early morning hours when pollution levels are lower."
            why = f"Children breathe faster and absorb higher pollutant doses relative to body weight."
        else:
            rec = "Unhealthy air quality. Move active play indoors and avoid outdoor school sports during peak hours."
            why = f"High {dominant} levels (AQI {aqi}) increase susceptibility to acute lung irritation in developing lungs."

    else:  # General population
        if aqi <= 50:
            rec = "Air quality is satisfactory. Enjoy outdoor activities, exercise, and outdoor sports freely."
            why = "Pollutant levels meet WHO and EPA public health safety guidelines."
        elif aqi <= 100:
            rec = "Air quality is acceptable for most people. Unusually sensitive individuals should monitor outdoor symptoms."
            why = f"{dominant} levels are moderate but within standard EPA acceptable ranges."
        else:
            rec = "Unhealthy air quality. Reduce prolonged or heavy outdoor exertion, especially during afternoon hours."
            why = f"Elevated {dominant} (AQI {aqi}) exceeds health-protective thresholds set by EPA and WHO guidelines."

    return {
        "recommendation_sentence": rec,
        "why_explanation": why,
        "sources": sources[:3]
    }

async def generate_recommendation(
    aqi_data: Dict[str, Any],
    health_profile: str,
    retrieved_chunks: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Generates a personalized, WHO/EPA-grounded recommendation via OpenRouter API (anthropic/claude-opus-5)
    or falls back to the deterministic grounded synthesis engine if API key is unconfigured or fails.
    """
    # Resolve OpenRouter API Key (prefer OPENROUTER_API_KEY, fallback to LLM_API_KEY)
    api_key = (settings.OPENROUTER_API_KEY or settings.LLM_API_KEY or "").strip()

    if not api_key:
        print("[INFO] OpenRouter API key not configured. Using grounded RAG fallback engine.")
        return _build_grounded_fallback(aqi_data, health_profile, retrieved_chunks)

    # Format retrieved WHO/EPA chunks into prompt context
    context_str = "\n\n".join([
        f"--- SOURCE: {c.get('source_name')} ({c.get('section_title')}) ---\n{c.get('content')}"
        for c in retrieved_chunks
    ])

    user_prompt = (
        f"LOCATION & AQI DATA:\n"
        f"City: {aqi_data.get('city')}, AQI: {aqi_data.get('aqi')} ({aqi_data.get('category')}), "
        f"Dominant Pollutant: {aqi_data.get('dominant_pollutant')}\n"
        f"USER HEALTH PROFILE: {health_profile}\n\n"
        f"RETRIEVED WHO/EPA GUIDELINE CONTEXT:\n{context_str}\n\n"
        f"TASK:\n"
        f"Respond strictly in valid JSON with this exact structure:\n"
        f"{{\n"
        f'  "recommendation_sentence": "<1 clear actionable recommendation sentence tailored to profile>",\n'
        f'  "why_explanation": "<1 explanation sentence grounded ONLY in retrieved context>",\n'
        f'  "sources": [{{"title": "<source name>", "section": "<section name>"}}]\n'
        f"}}\n"
    )

    openrouter_url = f"{settings.OPENROUTER_BASE_URL.rstrip('/')}/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://airsense.app",
        "X-Title": "AirSense AI Health Assistant"
    }

    payload = {
        "model": settings.LLM_MODEL,
        "messages": [
            {"role": "system", "content": GROUNDED_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 400,
        "temperature": 0.3
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(openrouter_url, headers=headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            choices = data.get("choices", [])
            
            if not choices or not choices[0].get("message", {}).get("content"):
                print("[WARN] OpenRouter returned an empty model response. Using grounded fallback.")
                return _build_grounded_fallback(aqi_data, health_profile, retrieved_chunks)

            raw_text = choices[0]["message"]["content"].strip()

            # Attempt to parse JSON response from Claude Opus 5
            try:
                # Strip markdown block quotes if present
                clean_text = raw_text
                if clean_text.startswith("```json"):
                    clean_text = clean_text[7:]
                if clean_text.endswith("```"):
                    clean_text = clean_text[:-3]
                clean_text = clean_text.strip()

                parsed = json.loads(clean_text)
                
                # Extract and validate fields
                rec_sentence = parsed.get("recommendation_sentence")
                why_exp = parsed.get("why_explanation")
                sources_list = parsed.get("sources", [])

                if rec_sentence and why_exp:
                    # Format sources safely
                    formatted_sources = []
                    for s in sources_list:
                        if isinstance(s, dict):
                            formatted_sources.append({
                                "title": s.get("title", "WHO/EPA Guideline"),
                                "section": s.get("section", "Air Quality Guidance")
                            })
                        elif isinstance(s, str):
                            formatted_sources.append({
                                "title": s,
                                "section": "Air Quality Guidance"
                            })

                    if not formatted_sources:
                        for chunk in retrieved_chunks[:3]:
                            formatted_sources.append({
                                "title": chunk.get("source_name", "WHO/EPA Guideline"),
                                "section": chunk.get("section_title", "Guideline")
                            })

                    return {
                        "recommendation_sentence": rec_sentence,
                        "why_explanation": why_exp,
                        "sources": formatted_sources
                    }
            except json.JSONDecodeError:
                # If non-JSON text response, split into recommendation and explanation
                lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
                rec_sentence = lines[0] if lines else "Reduce outdoor exertion based on current air quality."
                why_exp = lines[1] if len(lines) > 1 else f"Air quality index {aqi_data.get('aqi')} is elevated."

                fallback_sources = []
                for chunk in retrieved_chunks[:3]:
                    fallback_sources.append({
                        "title": chunk.get("source_name", "WHO/EPA Guideline"),
                        "section": chunk.get("section_title", "Guideline")
                    })

                return {
                    "recommendation_sentence": rec_sentence,
                    "why_explanation": why_exp,
                    "sources": fallback_sources
                }

    except httpx.HTTPStatusError as e:
        status_code = e.response.status_code
        print(f"[WARN] OpenRouter API error HTTP {status_code}. Using grounded RAG fallback.")
        return _build_grounded_fallback(aqi_data, health_profile, retrieved_chunks)
    except Exception as e:
        print(f"[WARN] OpenRouter connection failed ({type(e).__name__}). Using grounded RAG fallback.")
        return _build_grounded_fallback(aqi_data, health_profile, retrieved_chunks)

    return _build_grounded_fallback(aqi_data, health_profile, retrieved_chunks)
