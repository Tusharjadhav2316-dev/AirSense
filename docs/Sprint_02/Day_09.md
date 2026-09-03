# Sprint 2 — Day 9: Anomaly Detection Polish + Chat Endpoint

## Prompt for Antigravity

```
Wrap up Sprint 2 for AirSense. Today: finish the analytics layer properly
and add the conversational chat endpoint (reuses the RAG pipeline from
Day 6-7).

TASK:
1. Enhance the /aqi/trend endpoint from Sprint 1 Day 4 to also return:
   - A 30-day calendar heatmap dataset: {date, severity_category} for each
     day (used by the Trends page heatmap)
   - Insights summary: {anomaly_count_30d, highest_aqi, highest_aqi_date,
     average_aqi_30d, days_in_good_range_30d} — plain pandas aggregations,
     reference 27_Data_Analytics_Guide.md section 6

2. Build `POST /chat` endpoint that accepts {city, health_profile,
   message: str, conversation_history: list} and:
   - Uses the SAME retrieval function from Day 7 (retrieve_guidance),
     adapted to take the free-text user message as the query instead of a
     fixed category+pollutant string
   - Generates a conversational response using retrieved chunks + current
     AQI context + conversation history for continuity
   - Returns {response: str, sources: list[str]}

3. Test the chat endpoint with realistic questions:
   - "Is it safe to run outside today in [city]?"
   - "What precautions should asthmatics take?"
   - "Why is the air quality bad today?"
   Confirm responses are grounded (cite real retrieved sources) and stay
   in character (direct, plain-language, health-focused).

4. Write a short internal note in 20_Decision_Log.md summarizing: what
   worked well in the RAG pipeline, what didn't (chunking issues, retrieval
   misses, etc.), and any threshold/prompt tweaks made along the way —
   this becomes useful material for your internship deck's "lessons
   learned" framing if needed.

Sprint 2 exit check: /agent/advice and /chat both work end-to-end with
real grounded, cited, personalized output. /aqi/trend returns full
analytics (rolling avg, anomalies, heatmap, insights). This is the
substance of the whole project — Sprint 3 is "just" building the UI on
top of what now works.
```
