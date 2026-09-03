import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.aqi import AQIReading
from app.models.user import User
from app.models.location import SavedLocation
from app.models.alert import AlertThreshold

def get_cached_aqi_reading(db: Session, city_name: str, cache_minutes: int = 10) -> Optional[AQIReading]:
    """
    Checks if an AQIReading for this city was logged in the database within the last `cache_minutes`.
    Returns the cached AQIReading if valid, otherwise None.
    """
    cutoff_time = datetime.datetime.utcnow() - datetime.timedelta(minutes=cache_minutes)
    
    # Query for most recent reading matching city_name
    reading = (
        db.query(AQIReading)
        .filter(AQIReading.city_name.ilike(f"%{city_name.strip()}%"))
        .filter(AQIReading.fetched_at >= cutoff_time)
        .order_by(AQIReading.fetched_at.desc())
        .first()
    )
    return reading

def log_aqi_reading(db: Session, data: Dict[str, Any]) -> AQIReading:
    """
    Logs an AQI data payload into the database to build historical datasets over time.
    """
    pollutants = data.get("pollutants", {})
    
    reading = AQIReading(
        city_name=data.get("city", ""),
        lat=data.get("latitude", 0.0),
        lon=data.get("longitude", 0.0),
        timestamp=str(data.get("timestamp", "")),
        aqi_value=int(data.get("aqi", 0)),
        category=data.get("category", "Good"),
        dominant_pollutant=data.get("dominant_pollutant", "PM2.5"),
        pm25=pollutants.get("pm2_5"),
        pm10=pollutants.get("pm10"),
        o3=pollutants.get("o3"),
        no2=pollutants.get("no2"),
        so2=pollutants.get("so2"),
        co=pollutants.get("co"),
        fetched_at=datetime.datetime.utcnow()
    )
    
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading

def get_historical_aqi_readings(db: Session, city_name: str, limit: int = 100) -> List[AQIReading]:
    """
    Retrieves past recorded AQI readings for a specific city.
    """
    return (
        db.query(AQIReading)
        .filter(AQIReading.city_name.ilike(f"%{city_name.strip()}%"))
        .order_by(AQIReading.fetched_at.desc())
        .limit(limit)
        .all()
    )

# --- User & Location CRUD Placeholders ---

def create_user(db: Session, email: str, hashed_pw: str, health_profile: str = "none") -> User:
    user = User(email=email, hashed_password=hashed_pw, health_profile=health_profile)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def add_saved_location(db: Session, user_id: int, city_name: str, lat: float, lon: float, is_primary: bool = False) -> SavedLocation:
    loc = SavedLocation(user_id=user_id, city_name=city_name, lat=lat, lon=lon, is_primary=is_primary)
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc

def get_user_saved_locations(db: Session, user_id: int) -> List[SavedLocation]:
    return db.query(SavedLocation).filter(SavedLocation.user_id == user_id).all()
