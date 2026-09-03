from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.aqi_categories import get_aqi_category
from app.schemas.aqi import AQICurrentResponse, AQIForecastResponse
from app.schemas.analytics import AQITrendResponse
from app.services.openmeteo import fetch_current_aqi, fetch_forecast_aqi
from app.services.db_service import get_cached_aqi_reading, log_aqi_reading
from app.services.analytics import get_aqi_trend_analysis

router = APIRouter(prefix="/aqi", tags=["Air Quality Data & Analytics"])

@router.get("/current", response_model=AQICurrentResponse, summary="Get Live AQI & Pollutants (Cached 10m)")
async def get_current_aqi(
    city: str = Query(..., description="Name of the city to search for (e.g. Pune, Delhi, London)", examples=["Pune"]),
    db: Session = Depends(get_db)
):
    """
    Returns current US AQI, pollutant breakdown, and category metadata for a city.
    - If fetched within the last 10 minutes, serves instantly from local SQLite cache.
    - Otherwise, queries Open-Meteo live API and persists the reading to the database.
    """
    cached_row = get_cached_aqi_reading(db, city_name=city, cache_minutes=10)
    if cached_row:
        cat_info = get_aqi_category(cached_row.aqi_value)
        return AQICurrentResponse(
            city=cached_row.city_name,
            country="",
            latitude=cached_row.lat,
            longitude=cached_row.lon,
            aqi=cached_row.aqi_value,
            category=cached_row.category,
            category_color=cat_info["color"],
            category_description=cat_info["description"],
            dominant_pollutant=cached_row.dominant_pollutant,
            pollutants={
                "pm2_5": cached_row.pm25,
                "pm10": cached_row.pm10,
                "o3": cached_row.o3,
                "no2": cached_row.no2,
                "so2": cached_row.so2,
                "co": cached_row.co
            },
            timestamp=cached_row.timestamp,
            data_source="SQLite Cache (Open-Meteo)"
        )
    
    live_data = await fetch_current_aqi(city)
    log_aqi_reading(db, live_data)
    return live_data

@router.get("/forecast", response_model=AQIForecastResponse, summary="Get 24-48h AQI Forecast for a City")
async def get_forecast_aqi(
    city: str = Query(..., description="Name of the city to search for (e.g. Pune, Delhi, London)", examples=["Pune"])
):
    """
    Fetches 24-48 hour hourly forecast data of US AQI and key pollutants from Open-Meteo.
    """
    return await fetch_forecast_aqi(city)

@router.get("/trend", response_model=AQITrendResponse, summary="Get Historical Trend & Anomaly Analytics (pandas)")
async def get_trend_analytics(
    city: str = Query(..., description="Name of the city to analyze", examples=["Pune"]),
    days: int = Query(7, ge=1, le=90, description="Number of days range for rolling analytics (default 7 days)"),
    db: Session = Depends(get_db)
):
    """
    Data Analytics Endpoint (pandas-powered):
    1. Loads historical DB logs for requested city into a pandas DataFrame.
    2. Calculates 7-day rolling average AQI.
    3. Flags statistical anomalies (>25% spike over rolling average).
    4. Returns trend series and statistical summary (average AQI, peak AQI, anomaly count).
    """
    return get_aqi_trend_analysis(db, city_name=city, days=days)
