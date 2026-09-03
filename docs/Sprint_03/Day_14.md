# Sprint 3 — Day 14: Chat, Alerts & Settings Pages

## Prompt for Antigravity

```
Build the final three AirSense pages, completing all 8. Reference
14_UI_UX_Guide.md pages 6-8.

TASK:

1. Build `src/pages/Chat.tsx`:
   - Conversational UI: message list (user messages right-aligned, AI
     messages left-aligned with distinct styling), input bar at bottom
   - Calls the `/chat` endpoint (built Sprint 2 Day 9), passing the
     conversation history for context
   - AI responses render `SourcesPill` components below them showing
     retrieved sources
   - Persistent disclaimer text near the input: "AI advice is for
     informational purposes and not a substitute for medical care."
   - "New Chat" and "History" tabs (history can be a simple list of past
     conversations stored client-side or in a new lightweight
     ChatHistory DB table — your call based on remaining time budget)

2. Build `src/pages/Alerts.tsx`:
   - List of triggered alerts per saved location (requires a backend
     addition if not present: a simple check — on each /aqi/current call
     for a saved location, if AQI crosses the user's configured
     threshold, create an Alert record; expose `GET /alerts` to list them)
   - Each alert shows location, AQI value, timestamp, dismissible

3. Build `src/pages/Settings.tsx`:
   - Health profile section (prominent, editable — changing it should
     visibly affect Dashboard recommendations on next visit)
   - Saved locations management (add/remove)
   - Alert threshold configuration per location
   - Notification preferences (can be UI-only/non-functional toggles if
     actual push/email delivery is out of scope for this timeline — note
     clearly in code comments if so)
   - Appearance/units (can be UI-only for now)
   - "Data Sources & Responsible AI" section: static content explaining
     data comes from Open-Meteo's atmospheric model (not personal
     hardware), and advice is grounded in WHO/EPA guidelines via RAG —
     pull wording from 00_Project_Vision.md and 28_RAG_Resources_Guide.md
   - Log out button

Sprint 3 exit check: all 8 pages exist, are wired to real backend data (no
mock data remaining anywhere), and a full click-through from landing →
signup → dashboard → trends → chat → settings works without errors.
```
