from typing import Dict, Any

AQI_BREAKPOINTS = [
    {
        "min": 0,
        "max": 50,
        "category": "Good",
        "color": "#4FA8E0",  # Clear Sky
        "severity": "low",
        "description": "Air quality is satisfactory, and air pollution poses little or no risk."
    },
    {
        "min": 51,
        "max": 100,
        "category": "Moderate",
        "color": "#E0A458",  # Hazy Amber
        "severity": "moderate",
        "description": "Air quality is acceptable; however, sensitive individuals may experience minor health effects."
    },
    {
        "min": 101,
        "max": 150,
        "category": "Unhealthy for Sensitive Groups",
        "color": "#F97316",  # Amber/Orange
        "severity": "high_sensitive",
        "description": "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
    },
    {
        "min": 151,
        "max": 200,
        "category": "Unhealthy",
        "color": "#D64545",  # Alert Rust
        "severity": "high",
        "description": "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects."
    },
    {
        "min": 201,
        "max": 300,
        "category": "Very Unhealthy",
        "color": "#A855F7",  # Purple
        "severity": "very_high",
        "description": "Health alert: The risk of health effects is increased for everyone in the population."
    },
    {
        "min": 301,
        "max": 1000,
        "category": "Hazardous",
        "color": "#881337",  # Maroon
        "severity": "extreme",
        "description": "Health warning of emergency conditions: The entire population is more likely to be affected."
    }
]

def get_aqi_category(aqi: int) -> Dict[str, Any]:
    """Returns the US AQI category metadata for a given AQI integer value."""
    clamped_aqi = max(0, int(aqi))
    for bp in AQI_BREAKPOINTS:
        if bp["min"] <= clamped_aqi <= bp["max"]:
            return bp
    
    # Fallback for extreme values > 1000
    return AQI_BREAKPOINTS[-1]

def determine_dominant_pollutant(pollutants: Dict[str, float]) -> str:
    """
    Determines the dominant pollutant based on pollutant concentrations.
    Normalizes by typical standard thresholds (PM2.5: 35.4, PM10: 154, O3: 0.07, NO2: 53, SO2: 75, CO: 9.4).
    """
    if not pollutants:
        return "PM2.5"
    
    weights = {
        "pm2_5": 35.4,
        "pm10": 154.0,
        "o3": 70.0,
        "no2": 100.0,
        "so2": 75.0,
        "co": 10.0
    }

    pollutant_names_map = {
        "pm2_5": "PM2.5",
        "pm10": "PM10",
        "o3": "Ozone (O3)",
        "no2": "Nitrogen Dioxide (NO2)",
        "so2": "Sulfur Dioxide (SO2)",
        "co": "Carbon Monoxide (CO)"
    }

    max_ratio = -1.0
    dominant_key = "pm2_5"

    for key, val in pollutants.items():
        if val is not None and val >= 0:
            weight = weights.get(key, 50.0)
            ratio = val / weight
            if ratio > max_ratio:
                max_ratio = ratio
                dominant_key = key

    return pollutant_names_map.get(dominant_key, "PM2.5")
