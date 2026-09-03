import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  BrainCircuit,
  Calendar as CalendarIcon,
  Activity,
  AlertTriangle,
  Award,
  BarChart2,
  PieChart
} from 'lucide-react';
import {
  Card,
  TrendChart,
  CalendarHeatmap,
  BottomNav,
} from '../components';
import type { NavTab } from '../components';
import { fetchAQITrend } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { TrendPoint } from '../types';

type RangeDays = 7 | 30 | 90;
type TrendsSubTab = 'trend' | 'heatmap' | 'anomalies' | 'insights';

export const TrendsPage: React.FC = () => {
  const { homeLocation } = useAuth();
  const [city, setCity] = useState<string>(homeLocation || 'Pune');
  const [days, setDays] = useState<RangeDays>(30);
  const [subTab, setSubTab] = useState<TrendsSubTab>('trend');
  const [activeTab, setActiveTab] = useState<NavTab>('trends');

  // Query historical trend data
  const trendQuery = useQuery({
    queryKey: ['aqiTrend', city, days],
    queryFn: () => fetchAQITrend(city, days),
  });

  // Mock trend data generator if offline/standby
  const mockPoints: TrendPoint[] = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const baseAQI = 42 + Math.floor(Math.sin(i * 0.4) * 25) + (i % 9 === 0 ? 55 : 0);
    return {
      date: dateStr,
      aqi: baseAQI,
      rolling_avg: 48 + i * 0.2,
      is_anomaly: i % 9 === 0,
    };
  });

  const points = trendQuery.data?.trend || mockPoints;
  const anomaliesCount = points.filter((p) => p.is_anomaly).length;
  const avgAQI = Math.round(points.reduce((acc, p) => acc + p.aqi, 0) / (points.length || 1));
  const maxAQIObj = points.reduce((prev, current) => (current.aqi > prev.aqi ? current : prev), points[0] || { aqi: 0, date: '' });
  const goodDaysCount = points.filter((p) => p.aqi <= 50).length;

  return (
    <div className="min-h-screen bg-deepAtmosphere text-mistWhite pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slateInk/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-clearSky to-blue-600 flex items-center justify-center shadow-lg shadow-clearSky/20">
              <TrendingUp className="w-5 h-5 text-deepAtmosphere font-bold" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-mistWhite tracking-tight">
                Trends & Pattern Analytics
              </h1>
              <p className="text-xs text-slateInk">Historical AQI trajectories & anomaly detection</p>
            </div>
          </div>

          {/* City & Time Range Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slateInk/10 border border-slateInk/20 rounded-xl p-0.5">
              {['Pune', 'Delhi', 'Honolulu', 'London'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    city === c ? 'bg-clearSky text-deepAtmosphere font-bold' : 'text-slateInk hover:text-mistWhite'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slateInk/10 border border-slateInk/20 rounded-xl p-0.5">
              {([7, 30, 90] as RangeDays[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  className={`px-3 py-1 text-xs rounded-lg font-mono font-medium transition-all cursor-pointer ${
                    days === r ? 'bg-clearSky text-deepAtmosphere font-bold' : 'text-slateInk hover:text-mistWhite'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. AI-GENERATED PATTERN INSIGHT BANNER */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#162137] via-[#1B2A47] to-[#0E1729] border border-hazyAmber/30 p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-hazyAmber text-xs font-semibold uppercase tracking-wider mb-2">
              <BrainCircuit className="w-4 h-4 text-hazyAmber" />
              <span>AI Pattern Insight — {city} ({days}-Day Trajectory)</span>
            </div>

            <h2 className="font-display font-bold text-xl md:text-2xl text-mistWhite leading-snug">
              "Over the past {days} days, {city}'s air quality averaged AQI {avgAQI} with {anomaliesCount} distinct anomaly spike(s). Peak pollution occurred on {maxAQIObj.date} (AQI {maxAQIObj.aqi})."
            </h2>
          </div>
        </section>

        {/* Summary Stat Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 border-slateInk/20">
            <div className="flex items-center justify-between text-slateInk text-xs mb-1">
              <span>Average AQI</span>
              <Activity className="w-4 h-4 text-clearSky" />
            </div>
            <div className="text-2xl font-bold font-mono text-mistWhite">{avgAQI}</div>
            <span className="text-[11px] text-slateInk">Rolling {days}-day mean</span>
          </Card>

          <Card className="p-4 border-slateInk/20">
            <div className="flex items-center justify-between text-slateInk text-xs mb-1">
              <span>Peak Anomaly AQI</span>
              <AlertTriangle className="w-4 h-4 text-alertRust" />
            </div>
            <div className="text-2xl font-bold font-mono text-alertRust">{maxAQIObj.aqi}</div>
            <span className="text-[11px] text-slateInk">Recorded on {maxAQIObj.date || 'N/A'}</span>
          </Card>

          <Card className="p-4 border-slateInk/20">
            <div className="flex items-center justify-between text-slateInk text-xs mb-1">
              <span>Good AQI Days</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{goodDaysCount}</div>
            <span className="text-[11px] text-slateInk">Days with AQI &le; 50</span>
          </Card>

          <Card className="p-4 border-slateInk/20">
            <div className="flex items-center justify-between text-slateInk text-xs mb-1">
              <span>Spike Anomalies</span>
              <BarChart2 className="w-4 h-4 text-hazyAmber" />
            </div>
            <div className="text-2xl font-bold font-mono text-hazyAmber">{anomaliesCount}</div>
            <span className="text-[11px] text-slateInk">Flagged spike events</span>
          </Card>
        </section>

        {/* Tabbed Navigation */}
        <div className="flex items-center gap-2 border-b border-slateInk/20 pb-2">
          {[
            { id: 'trend', label: 'AQI Trajectory Chart', icon: TrendingUp },
            { id: 'heatmap', label: '30-Day Heatmap Grid', icon: CalendarIcon },
            { id: 'anomalies', label: 'Anomaly Spikes', icon: AlertTriangle },
            { id: 'insights', label: 'Summary Breakdown', icon: PieChart },
          ].map((t) => {
            const IconComponent = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id as TrendsSubTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  subTab === t.id
                    ? 'bg-clearSky/15 text-clearSky border border-clearSky/30'
                    : 'text-slateInk hover:text-mistWhite'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-tab Content Render */}
        {subTab === 'trend' && (
          <section>
            <TrendChart data={points} days={days} title={`${city} — ${days}-Day AQI Trajectory & Rolling Average`} />
          </section>
        )}

        {subTab === 'heatmap' && (
          <section>
            <CalendarHeatmap data={points} title={`${city} — 30-Day Calendar Heatmap`} />
          </section>
        )}

        {subTab === 'anomalies' && (
          <section className="space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="font-display font-semibold text-base text-mistWhite flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-alertRust" />
                <span>Detected Anomaly Events ({anomaliesCount})</span>
              </h3>

              {anomaliesCount > 0 ? (
                <div className="space-y-2">
                  {points
                    .filter((p) => p.is_anomaly)
                    .map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-deepAtmosphere/80 border border-alertRust/30 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-alertRust/20 text-alertRust font-mono font-bold">
                            AQI {p.aqi}
                          </span>
                          <div>
                            <strong className="text-mistWhite font-mono">{p.date}</strong>
                            <p className="text-slateInk text-[11px]">AQI spiked significantly above 7-day rolling average ({Math.round(p.rolling_avg)})</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-alertRust font-semibold">Anomaly Flagged</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-slateInk">No significant anomaly spikes detected in the selected time range.</p>
              )}
            </Card>
          </section>
        )}

        {subTab === 'insights' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="font-display font-semibold text-base text-mistWhite">Statistical Distribution</h3>
              <ul className="space-y-2 text-xs text-slateInk">
                <li className="flex justify-between border-b border-slateInk/15 pb-2">
                  <span>Total Days Analyzed</span>
                  <strong className="text-mistWhite font-mono">{days} Days</strong>
                </li>
                <li className="flex justify-between border-b border-slateInk/15 pb-2">
                  <span>Days in Good AQI (&le;50)</span>
                  <strong className="text-emerald-400 font-mono">{goodDaysCount} Days ({Math.round((goodDaysCount / days) * 100)}%)</strong>
                </li>
                <li className="flex justify-between border-b border-slateInk/15 pb-2">
                  <span>Days in Moderate/Unhealthy Range</span>
                  <strong className="text-hazyAmber font-mono">{days - goodDaysCount} Days ({Math.round(((days - goodDaysCount) / days) * 100)}%)</strong>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Anomaly Spike Rate</span>
                  <strong className="text-alertRust font-mono">{Math.round((anomaliesCount / days) * 100)}%</strong>
                </li>
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-display font-semibold text-base text-mistWhite">WHO/EPA Health Trend Assessment</h3>
              <p className="text-xs text-mistWhite/85 leading-relaxed font-sans">
                Based on rolling 7-day averages, {city}'s atmospheric conditions indicate stable baseline particulate concentrations with occasional localized spikes. Asthmatic and pediatric individuals should monitor daily alerts during flagged anomaly periods.
              </p>
            </Card>
          </section>
        )}

      </main>

      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
    </div>
  );
};
