# AirSense — AI Air Quality Health Assistant

> AirSense is a full-stack AI health assistant that turns real-time air quality data into personalized, WHO/EPA-grounded health guidance using a RAG pipeline and lightweight agentic reasoning — built with React, TypeScript, FastAPI, and pandas.

---

## 🚀 Quick Setup & Local Execution

### Prerequisites
- **Node.js**: v18+ (Node v22 detected)
- **Python**: 3.11+ (Python 3.11.9 detected)

---

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Health Endpoint: `http://localhost:8000/health`
- Interactive Swagger Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup (React + Vite + TypeScript)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
- Frontend App URL: `http://localhost:5173`

---

## 🎨 Design Tokens (Locked Design System v2)

| Token | Hex | Usage |
|---|---|---|
| **Deep Atmosphere** | `#0B1220` | Dark base, background surfaces |
| **Clear Sky** | `#4FA8E0` | Good AQI accent, primary CTA |
| **Hazy Amber** | `#E0A458` | Moderate AQI accent, warning badges |
| **Alert Rust** | `#D64545` | Hazardous AQI, statistical anomaly markers |
| **Mist White** | `#F4F7FA` | Primary typography & card background |
| **Slate Ink** | `#64748B` | Secondary labels & subtle details |

---

## 📁 Repository Structure

```
Air Sense/
├── frontend/             # React 18 + TS + Vite + Tailwind CSS app
│   ├── src/
│   │   ├── api/          # API services
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # 8 Application pages
│   │   └── types/        # TypeScript types
├── backend/              # Python 3.11 + FastAPI app
│   ├── app/
│   │   ├── api/          # Route handlers (/health, /aqi, /agent, etc.)
│   │   ├── core/         # Settings & Config (pydantic-settings)
│   │   ├── models/       # SQLAlchemy database ORM models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   └── services/     # Business logic & external API clients
│   └── requirements.txt  # Backend dependencies
├── docs/                 # Full architecture & sprint documentation
├── .env.example          # Environment variables template
└── README.md             # Project documentation & instructions
```
