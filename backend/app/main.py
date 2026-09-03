from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine
from app.models import Base
from app.api.health import router as health_router
from app.api.aqi import router as aqi_router
from app.api.agent import router as agent_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.alerts import router as alerts_router

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI air quality health assistant with WHO/EPA grounded RAG advice, agentic workflow, and chat."
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(aqi_router, prefix=settings.API_V1_STR)
app.include_router(agent_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)

# Also expose at root level for developer convenience
app.include_router(health_router)
app.include_router(aqi_router)
app.include_router(agent_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(alerts_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AirSense AI Health Assistant API",
        "docs": "/docs",
        "health": "/health",
        "aqi_current": "/aqi/current?city=Pune",
        "aqi_forecast": "/aqi/forecast?city=Pune",
        "agent_advice": "POST /agent/advice",
        "chat": "POST /chat"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
