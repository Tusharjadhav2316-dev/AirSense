from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# For SQLite, check_same_thread=False allows multi-threaded async FastAPI requests
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

_tables_initialized = False

def init_db():
    """Ensure database schema is created across all environments."""
    global _tables_initialized
    if not _tables_initialized:
        try:
            from app.models import Base
            Base.metadata.create_all(bind=engine)
            _tables_initialized = True
        except Exception as e:
            print(f"[WARN] Database schema creation notice: {e}")

def get_db():
    """FastAPI Dependency for providing DB session per request."""
    init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
