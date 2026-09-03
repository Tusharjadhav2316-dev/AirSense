import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.alert import AlertItem, AlertListResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

# In-memory alerts store initialized with realistic threshold alert triggers
MOCK_ALERTS: List[AlertItem] = [
    AlertItem(
        id="alt-101",
        city="Delhi",
        aqi=210,
        category="Unhealthy",
        message="AQI in Delhi has crossed 200 (Unhealthy). High PM2.5 levels detected. Sensitive groups should avoid outdoor activity.",
        timestamp=datetime.datetime.now().isoformat(),
        dismissed=False,
    ),
    AlertItem(
        id="alt-102",
        city="Pune",
        aqi=84,
        category="Moderate",
        message="Daily AQI update for Pune: Air quality is Moderate (84). Asthmatic individuals should limit prolonged exertion.",
        timestamp=(datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat(),
        dismissed=False,
    ),
]

@router.get(
    "",
    response_model=AlertListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Active Air Quality Threshold Alerts",
    description="Returns a list of active alerts triggered when AQI exceeds user-configured threshold limits."
)
async def get_alerts() -> AlertListResponse:
    active_alerts = [a for a in MOCK_ALERTS if not a.dismissed]
    return AlertListResponse(alerts=active_alerts)

@router.delete(
    "/{alert_id}",
    status_code=status.HTTP_200_OK,
    summary="Dismiss Specific Alert",
    description="Marks an alert as dismissed so it no longer appears in the active list."
)
async def dismiss_alert(alert_id: str):
    for alert in MOCK_ALERTS:
        if alert.id == alert_id:
            alert.dismissed = True
            return {"status": "success", "message": f"Alert {alert_id} dismissed."}
    raise HTTPException(status_code=404, detail="Alert not found.")
