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

# Safe startup database tables initialization
try:
    Base.metadata.create_all(bind=engine)
except Exception as exc:
    # Log notice for serverless environments
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI air quality health assistant with WHO/EPA grounded RAG advice, agentic workflow, and chat."
)

# Configure CORS for frontend access
ALLOWED_ORIGINS = [
    "https://frontend-bice-xi-29.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)

@app.middleware("http")
async def fix_vercel_path_middleware(request, call_next):
    # Vercel rewrites may set path to /api/index.py; restore from headers if present
    matched_path = request.headers.get("x-matched-path") or request.headers.get("x-vercel-matched-path")
    if matched_path and request.scope.get("path", "").startswith("/api/index"):
        request.scope["path"] = matched_path
    elif request.scope.get("path", "").startswith("/api/index.py"):
        sub = request.scope["path"][len("/api/index.py"):]
        request.scope["path"] = sub if sub.startswith("/") else ("/" + sub if sub else "/")
    elif request.scope.get("path", "").startswith("/api/index"):
        sub = request.scope["path"][len("/api/index"):]
        request.scope["path"] = sub if sub.startswith("/") else ("/" + sub if sub else "/")

    return await call_next(request)

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
