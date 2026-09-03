# 27 — Data Analytics Guide

## Purpose
This is what separates AirSense from "an app that calls an API and shows
the response." The analytics layer is real, pandas-based statistical
processing on top of raw data.

## Where Analytics Lives
All in the `/aqi/trend` endpoint (FastAPI) and consumed by: Main Dashboard
(mini trend), Trends/Analytics page (full detail), Compare page (mini
sparkline).

## 1. Historical Data Collection
- On each `/aqi/current` call for a location, log the reading to the
  database (timestamp, city, AQI, pollutant breakdown) — this builds your
  own historical dataset over time, on top of what Open-Meteo provides
- Also pull Open-Meteo's own historical/forecast data where available, to
  backfill before your own logging has enough history

## 2. Rolling Average (the baseline)
```python
import pandas as pd

df['rolling_7day_avg'] = df['aqi'].rolling(window=7, min_periods=1).mean()
```
This is what "normal" means for a given location — required before anomaly
detection means anything.

## 3. Anomaly Detection
```python
THRESHOLD_PCT = 0.25  # 25% above rolling average = anomaly

df['is_anomaly'] = df['aqi'] > (df['rolling_7day_avg'] * (1 + THRESHOLD_PCT))
```
This matches exactly what's shown in the locked UI mockup ("Anomalies are
flagged when AQI is > 25% above 7-day rolling average"). Keep the threshold
configurable, not hardcoded, so it can be tuned.

## 4. Calendar Heatmap Data
Bucket each day's AQI into severity categories (Good/Moderate/Unhealthy for
Sensitive Groups/Unhealthy/Very Unhealthy/Hazardous) and return a
date→category map for the past 30 days — powers the heatmap on the Trends
page.

## 5. Simple Forecast (optional stretch, Sprint 2 Day 9 or Sprint 4 buffer)
Open-Meteo already provides a modeled forecast, so you don't need to build
your own forecasting model to have a "forecast" feature. But if you want a
genuine data-analytics artifact for your resume:
- A simple linear regression or exponential smoothing on your own logged
  historical data, compared against Open-Meteo's forecast, as a "sanity
  check" layer
- Frame this honestly: it's a secondary/experimental model, not the primary
  forecast source

## 6. Insights Generation (feeds the "Insights" tab shown in mockup)
Compute simple aggregate stats per location over a rolling 30-day window:
- Number of anomalies detected
- Highest AQI recorded + date
- Average AQI
- Days in "Good" range
These are plain pandas aggregations (`.count()`, `.max()`, `.mean()`,
boolean filtering) — no ML needed, but genuinely real analysis, not
decoration.

## What NOT to Overbuild
Do not try to build a serious ML forecasting model in 18 days — Open-Meteo
already gives you a scientifically modeled forecast. Your value-add is the
rolling average / anomaly / insights layer, which is achievable and honest.

## For Your Resume/Interview
Be precise about what you built vs. what you consumed:
- "Consumed" — raw current/forecast AQI from Open-Meteo
- "Built" — rolling average computation, anomaly detection logic, insight
  aggregation, calendar heatmap bucketing — all in pandas, all your own code
