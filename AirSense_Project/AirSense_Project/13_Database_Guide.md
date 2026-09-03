# 13 — Database Guide

## Schema Overview

**User**
- id, email, hashed_password, health_profile (enum: none/asthma/elderly/
  child), created_at

**SavedLocation**
- id, user_id (FK), city_name, lat, lon, is_primary

**AQIReading**
- id, city_name, lat, lon, timestamp, aqi_value, dominant_pollutant, pm25,
  pm10, o3, no2, so2, co
- This table is the historical dataset the analytics layer runs on — it
  grows every time `/aqi/current` is called (with a 10-minute cache
  window to avoid redundant writes)

**AlertThreshold**
- id, user_id (FK), location_id (FK), threshold_aqi, is_active

**Alert** (added Sprint 3 Day 14 if needed)
- id, user_id (FK), location_id (FK), aqi_value, timestamp, is_dismissed

## Migration Approach
SQLAlchemy `create_all()` is sufficient for this timeline — Alembic adds
process overhead not justified at this scale/solo-project speed. If moving
to Postgres for production deployment, just re-run create_all against the
new database.

## Indexing Notes
Index `AQIReading` on `(city_name, timestamp)` — this is the query pattern
every trend/analytics call uses, and it matters once historical data
grows past a trivial size.

## Seed Data
`app/scripts/seed_historical_data.py` (Sprint 1 Day 4) backfills 30 days
of plausible data for 2-3 test cities so the analytics layer has something
to compute on before real usage accumulates. Keep this clearly separate
from production data — never run it against a production database.
