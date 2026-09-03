# Sprint 1 — Day 3: Database Schema & Persistence

## Prompt for Antigravity

```
Continue AirSense backend. Today: database schema and starting to persist
historical AQI data (needed for Sprint 1 Day 4's analytics and Sprint 2's
anomaly detection).

TASK:
1. Set up SQLAlchemy models in `app/models/`:
   - `User` — id, email, hashed_password, created_at, health_profile
     (enum: none/asthma/elderly/child)
   - `SavedLocation` — id, user_id (FK), city_name, lat, lon, is_primary
   - `AQIReading` — id, city_name, lat, lon, timestamp, aqi_value,
     dominant_pollutant, pm25, pm10, o3, no2, so2, co
   - `AlertThreshold` — id, user_id (FK), location_id (FK), threshold_aqi,
     is_active

2. Set up Alembic (or simple SQLAlchemy create_all for now, Alembic is
   nicer but not required at this stage) for migrations.

3. Modify the `/aqi/current` endpoint from Day 2: every time it's called,
   log the reading into the `AQIReading` table (this builds your own
   historical dataset over time — cite this in interviews as "designed
   the system to build its own training/analytics data over time rather
   than depend entirely on a third party").

4. Add a simple caching check: if an `AQIReading` for this city was logged
   in the last 10 minutes, return that cached row instead of calling
   Open-Meteo again (reduces redundant API calls, matches the "cache
   Open-Meteo responses" non-functional requirement in
   22_Product_Requirements.md).

5. Create basic CRUD service functions in `app/services/db_service.py` for
   all four models — nothing fancy, just clean create/read functions
   other endpoints will use.

Do NOT build auth endpoints yet, do NOT build the frontend yet. Today is
purely: schema + persistence + caching working correctly, verified by
checking the SQLite file has real rows after calling /aqi/current a few
times for different cities.
```
