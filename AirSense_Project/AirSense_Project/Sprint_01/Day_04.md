# Sprint 1 — Day 4: Basic Data Analytics Endpoint

## Prompt for Antigravity

```
Continue AirSense backend. Today: the first real data-analytics endpoint,
using pandas. Reference 27_Data_Analytics_Guide.md for the exact logic.

TASK:
1. Create `app/services/analytics.py` with a function that:
   - Pulls all `AQIReading` rows for a given city from the database
   - Loads them into a pandas DataFrame
   - Computes a 7-day rolling average of the AQI value
   - Flags anomalies: any reading >25% above its rolling average at that
     point in time (make the 25% threshold a named constant, not a magic
     number)

2. Create `GET /aqi/trend?city={name}&days={n}` endpoint that returns:
   - Array of {date, aqi, rolling_avg, is_anomaly} for the requested range
     (default 7 days)
   - Summary stats: average AQI, highest AQI + date, count of anomalies in
     range

3. Since real historical data won't exist yet (we just started logging
   yesterday), also write a small seed script
   `app/scripts/seed_historical_data.py` that backfills 30 days of
   plausible historical data for 2-3 test cities (Pune, Delhi, London) —
   CLEARLY marked as seed/test data in a comment, never confuse this with
   real production data.

4. Write a basic unit test for the anomaly detection logic using a small
   hardcoded pandas DataFrame with a known expected outcome — confirm the
   math is correct before building UI on top of it.

Exit check for Sprint 1: you should now be able to call /aqi/current,
/aqi/forecast, and /aqi/trend for a real city and get back real, typed,
persisted, analyzed data. This is the foundation Sprint 2 (RAG + agent)
builds on.
```
