import datetime
import pandas as pd
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.aqi import AQIReading

# Named constant for anomaly detection threshold (25% above rolling average)
ANOMALY_THRESHOLD_RATIO = 1.25

def compute_rolling_and_anomalies(df: pd.DataFrame, window: int = 7) -> pd.DataFrame:
    """
    Pure pandas data processing function:
    1. Sorts readings chronologically
    2. Calculates rolling N-day average AQI
    3. Flags statistical anomalies where AQI > 25% above rolling average
    """
    if df.empty:
        return df

    # Ensure chronological order
    df = df.sort_values(by="fetched_at", ascending=True).copy()
    
    # Calculate rolling average (min_periods=1 to support initial days)
    df["rolling_avg"] = df["aqi_value"].rolling(window=window, min_periods=1).mean().round(1)
    
    # Flag anomaly if actual AQI exceeds rolling average by > 25%
    df["is_anomaly"] = df["aqi_value"] > (df["rolling_avg"] * ANOMALY_THRESHOLD_RATIO)
    
    return df

def get_aqi_trend_analysis(db: Session, city_name: str, days: int = 7) -> Dict[str, Any]:
    """
    Pulls historical AQI log entries for a city from SQLite, converts to pandas DataFrame,
    runs statistical rolling averages, anomaly detection, calendar heatmap, and insights summary.
    """
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=days)
    
    # Query database
    readings = (
        db.query(AQIReading)
        .filter(AQIReading.city_name.ilike(f"%{city_name.strip()}%"))
        .filter(AQIReading.fetched_at >= cutoff)
        .order_by(AQIReading.fetched_at.asc())
        .all()
    )
    
    if not readings:
        # Fallback: check all readings without strict date cutoff if range is sparse
        readings = (
            db.query(AQIReading)
            .filter(AQIReading.city_name.ilike(f"%{city_name.strip()}%"))
            .order_by(AQIReading.fetched_at.asc())
            .limit(300)
            .all()
        )

    if not readings:
        raise HTTPException(
            status_code=404,
            detail=f"No historical data logged yet for city '{city_name}'. Call /aqi/current first or run seed script."
        )

    # Convert SQLAlchemy objects to pandas DataFrame
    data_dicts = [
        {
            "id": r.id,
            "city_name": r.city_name,
            "fetched_at": r.fetched_at,
            "date_day": r.fetched_at.strftime("%Y-%m-%d") if r.fetched_at else "2026-08-01",
            "date_str": r.fetched_at.strftime("%Y-%m-%d %H:%M") if r.fetched_at else str(r.timestamp),
            "aqi_value": r.aqi_value,
            "category": r.category,
            "dominant_pollutant": r.dominant_pollutant
        }
        for r in readings
    ]
    
    df = pd.DataFrame(data_dicts)
    
    # Compute pandas rolling averages & anomaly flags
    df = compute_rolling_and_anomalies(df, window=min(days, 7))
    
    # Summary Statistics via Pandas aggregations
    avg_aqi = round(float(df["aqi_value"].mean()), 1)
    max_idx = df["aqi_value"].idxmax()
    max_row = df.loc[max_idx]
    highest_aqi = int(max_row["aqi_value"])
    highest_aqi_date = str(max_row["date_day"])
    anomaly_count = int(df["is_anomaly"].sum())

    # Days in Good range (AQI <= 50)
    good_days_count = int((df["aqi_value"] <= 50).sum())

    # Build 30-day calendar heatmap dataset grouped by day
    heatmap_df = df.groupby("date_day").agg({
        "aqi_value": "mean",
        "category": "last"
    }).reset_index()

    calendar_heatmap = []
    for _, hrow in heatmap_df.iterrows():
        calendar_heatmap.append({
            "date": str(hrow["date_day"]),
            "aqi": int(round(hrow["aqi_value"])),
            "severity_category": str(hrow["category"])
        })

    # Build trend points array
    trend_points: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        trend_points.append({
            "date": str(row["date_str"]),
            "aqi": int(row["aqi_value"]),
            "rolling_avg": float(row["rolling_avg"]),
            "is_anomaly": bool(row["is_anomaly"])
        })

    return {
        "city": readings[0].city_name,
        "days": days,
        "trend": trend_points,
        "calendar_heatmap": calendar_heatmap,
        "summary": {
            "average_aqi": avg_aqi,
            "highest_aqi": highest_aqi,
            "highest_aqi_date": highest_aqi_date,
            "anomaly_count": anomaly_count,
            "average_aqi_30d": avg_aqi,
            "anomaly_count_30d": anomaly_count,
            "days_in_good_range_30d": good_days_count
        }
    }
