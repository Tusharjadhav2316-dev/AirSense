# 22 — Product Requirements

## Pages (8, locked)
1. Landing Page
2. Login / Signup (with location + health profile setup)
3. Main Dashboard (Home)
4. City Detail / Compare View
5. Trends / Analytics
6. AI Chat / Advice History
7. Alerts (notification center)
8. Settings (incl. Data Sources & Responsible AI section)

## Functional Requirements

### Landing Page
- Hero shows a live-feeling sample AI recommendation (not a stock AQI number)
- 3-step "how it works" section
- Trust section citing WHO/EPA
- CTA to sign up

### Login/Signup
- Email/password auth (JWT)
- First-run: pick home location (search or geolocation) + optional health
  profile (None/Asthma/Elderly/Child)
- Social login optional (Google/Apple) — nice-to-have, not required for MVP

### Main Dashboard
- Location selector (search or saved locations)
- AI recommendation hero (largest element) with "why" + source citations
- Supporting AQI badge + pollutant breakdown cards (PM2.5, PM10, O3, NO2,
  SO2, CO)
- 7-day trend + 24-48h forecast chart
- Bottom nav: Home / Trends / Chat / Alerts / Settings

### City Detail / Compare
- Compare 2-3 cities side by side
- Each city leads with a short AI comparative insight line
- Mini sparkline + pollutant breakdown per city
- "Add another city to compare" action

### Trends / Analytics
- AI-generated pattern insight at top
- Tabbed views: AQI Trend / Pollutants / Anomalies / Insights
- Trend chart with configurable range (7/30/90 days)
- Calendar heatmap (30 days, severity-colored)
- Insights panel (anomaly count, highest/average AQI, days in Good range)

### AI Chat / Advice History
- Conversational interface, free-text questions
- AI responses show source citations as pills
- New Chat / History tabs
- Disclaimer: "AI advice is for informational purposes and not a substitute
  for medical care."

### Alerts
- List of triggered alerts (threshold-based: AQI crossed into Unhealthy+ for
  a saved location)
- Configurable thresholds per location (tied into Settings)

### Settings
- Health profile (drives personalization — must be prominent, not buried)
- Saved locations management
- Alert thresholds + notification preferences
- Appearance, units, language
- Data Sources & Responsible AI (transparency page/section)
- Log out

## Non-Functional Requirements
- Mobile-responsive (collapses to single column, bottom tab bar)
- All AI-generated advice must show source citations
- No personal health data sent to third parties beyond the LLM call itself
  (state this explicitly in Settings > Data Sources)
- Reasonable load time — cache Open-Meteo responses for a few minutes per
  location to avoid redundant calls

## Out of Scope (v1)
- Native mobile app (design system is prepared for it, not built yet)
- Multi-language UI
- Payments/subscriptions
- Admin panel
- Hardware/IoT sensor integration
