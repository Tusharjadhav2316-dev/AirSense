# 14 — UI/UX Guide (LOCKED DESIGN — v2)

Status: **Approved.** Reference image: dashboard mockup approved on this
project (8 pages, recommendation-first hierarchy). Do not redesign without
explicit sign-off — implement exactly what's specified here.

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Deep Atmosphere | #0B1220 | Dark base, nav backgrounds |
| Clear Sky | #4FA8E0 | Good AQI accent, primary CTA |
| Hazy Amber | #E0A458 | Moderate AQI accent, warnings |
| Alert Rust | #D64545 | Poor/hazardous accent, anomaly markers |
| Mist White | #F4F7FA | Card/surface background |
| Slate Ink | #64748B | Secondary text/labels |

### Typography
- **Display/Headlines/AI recommendation text:** Space Grotesk
- **Body/UI text:** Inter
- **Data values (AQI numbers, pollutant readings, timestamps):** IBM Plex Mono

### Spacing
8px base grid throughout. No page-specific one-off spacing values.

### Components
- Cards: 12-16px rounded corners, subtle elevation shadow, no heavy borders
- Icons: thin-line, minimal (Lucide React fits this)
- Motion: gentle only — slow gradient shifts, soft fade-ins, no bounce

## THE CORE RULE — Recommendation-First Hierarchy
This is the single most important rule in this document. It's what makes
AirSense read as a health reasoning tool, not a weather app.

**Every screen that shows AI-generated advice must show it as the largest,
first-read element.** The AQI number/category is always secondary —
shown as a smaller supporting badge, never the page's visual centerpiece.

Wrong: big number → small advice caption underneath (weather-app pattern)
Right: large advice sentence → small number badge alongside → "why" +
sources beneath

## Page-by-Page Spec

### 1. Landing Page
Hero = live-feeling sample recommendation sentence, not an AQI widget.
Small AQI/category shown off to the side as supporting evidence. 3-step
"how it works." WHO/EPA trust badges. CTA in Clear Sky.

### 2. Login/Signup
Split screen. Left: ambient gradient + "Know what your air means for you."
Right: form + first-run location + health profile picker (visible, not
buried).

### 3. Main Dashboard
Hero: AI recommendation sentence (largest text) + "why" + sources.
Supporting row: AQI badge, pollutant cards (mono type), 7-day trend +
forecast chart. Bottom nav: Home / Trends / Chat / Alerts / Settings.

### 4. City Detail / Compare
Each city leads with a short AI comparative insight line above the data
cards. Horizontally scrollable on mobile.

### 5. Trends / Analytics
AI pattern insight at top. Tabs: AQI Trend / Pollutants / Anomalies /
Insights. Anomalies marked in Alert Rust vs. rolling average. Calendar
heatmap. Insights panel (anomaly count, avg/highest AQI, good-range days).

### 6. AI Chat / Advice History
Full conversational UI. User/AI messages visually distinct. Source
citation pills under every grounded AI response. Persistent disclaimer
at input bar.

### 7. Alerts
List of triggered threshold alerts per saved location, timestamped,
dismissible. Links back to configuring thresholds in Settings.

### 8. Settings
Health profile (prominent — drives all personalization), saved locations,
alert thresholds, notification prefs, appearance/units, **Data Sources &
Responsible AI** section (transparency: model-based data not hardware,
WHO/EPA-grounded advice), log out.

## Mobile Conversion Note
All components must be built as reusable, token-based components (not
per-page one-offs) so a future React Native version reuses the same
tokens — only layout changes, not styling.
