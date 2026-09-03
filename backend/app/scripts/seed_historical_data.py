"""
================================================================================
AIRSENSE — SEED HISTORICAL DATA SCRIPT (DEVELOPMENT & DEMO ONLY)
================================================================================
IMPORTANT NOTE:
This script backfills 30 days of plausible synthetic historical AQI data for
3 benchmark cities (Pune, Delhi, London) into the SQLite database.
This allows pandas rolling-average calculations and anomaly detection algorithms
to be demonstrated and tested immediately before real production logs accumulate over time.
THIS DATA IS FOR SEED/TESTING PURPOSES ONLY — DO NOT CONFUSE WITH LIVE READINGS.
================================================================================
"""

import random
import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.aqi import AQIReading
from app.core.aqi_categories import get_aqi_category

# Seed dataset specifications per city
CITY_PROFILES = [
    {
        "city_name": "Pune, Maharashtra",
        "lat": 18.51957,
        "lon": 73.85535,
        "base_aqi": 42,
        "variance": 12,
        # Introduce deliberate artificial spike anomalies on days 12 and 24
        "spikes": {12: 110, 24: 135}
    },
    {
        "city_name": "Delhi, National Capital Territory of Delhi",
        "lat": 28.65195,
        "lon": 77.23149,
        "base_aqi": 155,
        "variance": 25,
        # Artificial spike anomalies on days 8, 19, and 28
        "spikes": {8: 260, 19: 295, 28: 310}
    },
    {
        "city_name": "London, England",
        "lat": 51.50853,
        "lon": -0.12574,
        "base_aqi": 32,
        "variance": 8,
        # Artificial spike anomaly on day 15
        "spikes": {15: 88}
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    try:
        print("Starting historical data seeding...")
        now = datetime.datetime.utcnow()
        total_seeded = 0

        for profile in CITY_PROFILES:
            city_name = profile["city_name"]
            lat = profile["lat"]
            lon = profile["lon"]
            base = profile["base_aqi"]
            var = profile["variance"]
            spikes = profile["spikes"]

            # Remove prior seed rows for this city to prevent duplicate test runs
            existing_deleted = db.query(AQIReading).filter(AQIReading.city_name == city_name).delete()
            print(f"Cleared {existing_deleted} old rows for '{city_name}'")

            for day_offset in range(30, 0, -1):
                timestamp_date = now - datetime.timedelta(days=day_offset)
                
                # Check for explicit spike day
                if day_offset in spikes:
                    aqi_val = spikes[day_offset]
                else:
                    aqi_val = max(10, int(base + random.uniform(-var, var)))

                cat_info = get_aqi_category(aqi_val)
                
                # Estimate pollutants proportional to AQI
                pm25 = round(aqi_val * 0.45, 1)
                pm10 = round(aqi_val * 0.75, 1)
                o3 = round(random.uniform(20, 50), 1)
                no2 = round(random.uniform(15, 40), 1)
                so2 = round(random.uniform(2, 10), 1)
                co = round(random.uniform(150, 450), 1)

                reading = AQIReading(
                    city_name=city_name,
                    lat=lat,
                    lon=lon,
                    timestamp=timestamp_date.strftime("%Y-%m-%dT%H:00"),
                    aqi_value=aqi_val,
                    category=cat_info["category"],
                    dominant_pollutant="PM2.5" if aqi_val > 50 else "Carbon Monoxide (CO)",
                    pm25=pm25,
                    pm10=pm10,
                    o3=o3,
                    no2=no2,
                    so2=so2,
                    co=co,
                    fetched_at=timestamp_date
                )
                db.add(reading)
                total_seeded += 1

        db.commit()
        print(f"SUCCESS: Seeded {total_seeded} historical AQI records into airsense.db across 3 cities!")
    except Exception as e:
        db.rollback()
        print(f"ERROR seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
