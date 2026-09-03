import asyncio
import httpx
from typing import Dict, Any, Tuple
from fastapi import HTTPException
from app.core.aqi_categories import get_aqi_category, determine_dominant_pollutant

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

async def geocode_city(city_name: str) -> Tuple[float, float, str, str]:
    """
    Converts a city name search into (latitude, longitude, formatted_city_name, country).
    Raises HTTPException 404 if city is not found. Includes retry logic for API resilience.
    """
    clean_city = city_name.strip()
    if not clean_city:
        raise HTTPException(status_code=400, detail="City name parameter cannot be empty.")
    
    last_err = None
    for attempt in range(3):
        async with httpx.AsyncClient(timeout=12.0) as client:
            try:
                response = await client.get(
                    GEOCODING_URL,
                    params={"name": clean_city, "count": 1, "language": "en", "format": "json"}
                )
                response.raise_for_status()
                data = response.json()
                results = data.get("results")
                if not results or len(results) == 0:
                    raise HTTPException(status_code=404, detail=f"Location '{clean_city}' not found.")
                
                loc = results[0]
                lat = loc.get("latitude")
                lon = loc.get("longitude")
                name = loc.get("name", clean_city)
                country = loc.get("country", "")
                admin1 = loc.get("admin1", "")

                display_name = f"{name}, {admin1}" if admin1 and admin1 != name else name
                return float(lat), float(lon), display_name, country
            except HTTPException:
                raise
            except Exception as e:
                last_err = e
                await asyncio.sleep(1.0)

    raise HTTPException(status_code=503, detail=f"Geocoding service unavailable: {str(last_err)}")

async def fetch_current_aqi(city_name: str) -> Dict[str, Any]:
    """
    Fetches real-time AQI and pollutant breakdown for a given city from Open-Meteo with retry resilience.
    """
    lat, lon, display_name, country = await geocode_city(city_name)
    
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["us_aqi", "pm2_5", "pm10", "ozone", "nitrogen_dioxide", "sulphur_dioxide", "carbon_monoxide"],
        "timezone": "auto"
    }

    last_err = None
    for attempt in range(3):
        async with httpx.AsyncClient(timeout=12.0) as client:
            try:
                response = await client.get(AIR_QUALITY_URL, params=params)
                response.raise_for_status()
                data = response.json()
                current = data.get("current", {})
                if not current:
                    raise HTTPException(status_code=404, detail=f"Air quality data unavailable for '{display_name}'.")

                raw_aqi = current.get("us_aqi")
                aqi_val = int(raw_aqi) if raw_aqi is not None else 0

                pollutants = {
                    "pm2_5": current.get("pm2_5"),
                    "pm10": current.get("pm10"),
                    "o3": current.get("ozone"),
                    "no2": current.get("nitrogen_dioxide"),
                    "so2": current.get("sulphur_dioxide"),
                    "co": current.get("carbon_monoxide")
                }

                category_info = get_aqi_category(aqi_val)
                dominant = determine_dominant_pollutant(pollutants)

                return {
                    "city": display_name,
                    "country": country,
                    "latitude": lat,
                    "longitude": lon,
                    "aqi": aqi_val,
                    "category": category_info["category"],
                    "category_color": category_info["color"],
                    "category_description": category_info["description"],
                    "dominant_pollutant": dominant,
                    "pollutants": pollutants,
                    "timestamp": current.get("time", ""),
                    "data_source": "Open-Meteo Air Quality API"
                }
            except HTTPException:
                raise
            except Exception as e:
                last_err = e
                await asyncio.sleep(1.0)

    raise HTTPException(status_code=503, detail=f"Air Quality API unavailable: {str(last_err)}")

async def fetch_forecast_aqi(city_name: str) -> Dict[str, Any]:
    """
    Fetches 24-48 hour hourly forecast of AQI and key pollutants for a city.
    """
    lat, lon, display_name, country = await geocode_city(city_name)

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ["us_aqi", "pm2_5", "pm10", "ozone", "nitrogen_dioxide"],
        "forecast_days": 2,
        "timezone": "auto"
    }

    async with httpx.AsyncClient(timeout=12.0) as client:
        try:
            response = await client.get(AIR_QUALITY_URL, params=params)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=503, detail=f"Air Quality forecast request failed: {str(e)}")

    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    aqis = hourly.get("us_aqi", [])
    pm2_5_list = hourly.get("pm2_5", [])
    pm10_list = hourly.get("pm10", [])
    ozone_list = hourly.get("ozone", [])
    no2_list = hourly.get("nitrogen_dioxide", [])

    forecast_points = []
    for i in range(min(len(times), 48)):
        raw_aqi = aqis[i] if i < len(aqis) else None
        aqi_val = int(raw_aqi) if raw_aqi is not None else 0
        cat_info = get_aqi_category(aqi_val)

        forecast_points.append({
            "timestamp": times[i],
            "aqi": aqi_val,
            "category": cat_info["category"],
            "category_color": cat_info["color"],
            "pm2_5": pm2_5_list[i] if i < len(pm2_5_list) else None,
            "pm10": pm10_list[i] if i < len(pm10_list) else None,
            "o3": ozone_list[i] if i < len(ozone_list) else None,
            "no2": no2_list[i] if i < len(no2_list) else None
        })

    return {
        "city": display_name,
        "country": country,
        "latitude": lat,
        "longitude": lon,
        "forecast": forecast_points,
        "data_source": "Open-Meteo Air Quality API"
    }
