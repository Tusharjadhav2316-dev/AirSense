# Sprint 1 — Day 2: Open-Meteo Integration

## Prompt for Antigravity

```
Continue building AirSense backend. Yesterday's scaffolding is in place.
Today: wire up real live air quality data.

TASK:
1. Create a service module `app/services/openmeteo.py` that:
   - Calls Open-Meteo's Air Quality API (https://air-quality-api.open-meteo.com)
     with lat/lon parameters
   - Fetches: current PM2.5, PM10, O3, NO2, SO2, CO, and the computed
     US AQI value
   - Also fetches the hourly forecast for the next 48 hours
   - Handles the case where a location has no data gracefully (return a
     clear "unavailable" response, never fake a number)

2. Create a geocoding helper (Open-Meteo also has a free geocoding API at
   https://geocoding-api.open-meteo.com) to convert a city name search
   into lat/lon — needed since users will search by city name, not
   coordinates.

3. Create two API routes in `app/api/aqi.py`:
   - `GET /aqi/current?city={name}` → returns current AQI + pollutant
     breakdown + dominant pollutant + category label (Good/Moderate/
     Unhealthy for Sensitive Groups/Unhealthy/Very Unhealthy/Hazardous)
   - `GET /aqi/forecast?city={name}` → returns 24-48h forecast array

4. Define the AQI category thresholds as a constants file
   `app/core/aqi_categories.py` — use standard US AQI breakpoints (0-50
   Good, 51-100 Moderate, 101-150 Unhealthy for Sensitive Groups, 151-200
   Unhealthy, 201-300 Very Unhealthy, 301+ Hazardous)

5. Write Pydantic response schemas for both endpoints in
   `app/schemas/aqi.py` — strongly typed, not raw dicts

6. Test both endpoints manually with 3 real cities (e.g., Pune, Delhi,
   London) and confirm real data comes back, not errors.

Do not touch the frontend today. Do not build the RAG/agent layer yet —
that's Sprint 2. Today is purely: reliable, real, typed data from
Open-Meteo, exposed through two clean endpoints.
```
