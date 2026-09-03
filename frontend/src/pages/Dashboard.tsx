import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Wind,
  Search,
  Sliders,
  CheckCircle2,
  Info,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import {
  Button,
  Card,
  RecommendationHero,
  RecommendationHeroSkeleton,
  PollutantCard,
  TrendChart,
  BottomNav,
} from '../components';
import type { NavTab } from '../components';
import {
  fetchHealth,
  fetchAQICurrent,
  fetchAQITrend,
  fetchAgentAdvice
} from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { HealthProfile, TrendPoint } from '../types';

export const Dashboard: React.FC = () => {
  const { user, healthProfile, homeLocation, logout, setHealthProfile } = useAuth();
  const [city, setCity] = useState<string>(homeLocation || 'Pune');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [customCityInput, setCustomCityInput] = useState<string>('');

  // 1. Health check query
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  // 2. Current AQI query
  const aqiQuery = useQuery({
    queryKey: ['aqiCurrent', city],
    queryFn: () => fetchAQICurrent(city),
  });

  // 3. Agent advice query
  const adviceQuery = useQuery({
    queryKey: ['agentAdvice', city, healthProfile],
    queryFn: () => fetchAgentAdvice(city, healthProfile),
  });

  // 4. Trend query
  const trendQuery = useQuery({
    queryKey: ['aqiTrend', city],
    queryFn: () => fetchAQITrend(city, 30),
  });

  const handleCitySelect = (newCity: string) => {
    setCity(newCity);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      setCity(customCityInput.trim());
      setCustomCityInput('');
    }
  };

  const mockTrendData: TrendPoint[] = Array.from({ length: 14 }).map((_, i) => {
    const dateStr = `2026-08-${(i + 14).toString().padStart(2, '0')}`;
    const baseAQI = 45 + Math.floor(Math.sin(i) * 20) + (i === 7 ? 65 : 0);
    return {
      date: dateStr,
      aqi: baseAQI,
      rolling_avg: 48 + i * 0.5,
      is_anomaly: i === 7,
    };
  });

  const trendPoints = trendQuery.data?.trend || mockTrendData;
  const isCityError = aqiQuery.isError || adviceQuery.isError;

  return (
    <div className="min-h-screen bg-deepAtmosphere text-mistWhite pb-24 selection:bg-clearSky selection:text-deepAtmosphere">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slateInk/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-clearSky to-blue-600 flex items-center justify-center shadow-lg shadow-clearSky/20">
              <Wind className="w-5 h-5 text-deepAtmosphere font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-mistWhite tracking-tight">AirSense Dashboard</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-clearSky/15 text-clearSky border border-clearSky/30">
                  Sprint 3 — Day 12
                </span>
              </div>
              <p className="text-xs text-slateInk">Welcome, {user?.email || 'User'}</p>
            </div>
          </div>

          {/* Quick Controls & Logout */}
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search city..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slateInk/10 border border-slateInk/30 text-xs text-mistWhite placeholder-slateInk focus:outline-none focus:border-clearSky w-32 md:w-40"
              />
              <Search className="w-3.5 h-3.5 text-slateInk absolute left-2.5 top-2.5" />
            </form>

            <div className="flex items-center bg-slateInk/10 border border-slateInk/20 rounded-xl p-0.5">
              {['Pune', 'Delhi', 'Honolulu', 'London'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleCitySelect(c)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    city === c ? 'bg-clearSky text-deepAtmosphere font-semibold' : 'text-slateInk hover:text-mistWhite'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <select
              value={healthProfile}
              onChange={(e) => setHealthProfile(e.target.value as HealthProfile)}
              className="px-3 py-1.5 rounded-xl bg-slateInk/10 border border-slateInk/30 text-xs text-mistWhite font-medium focus:outline-none focus:border-clearSky capitalize cursor-pointer"
            >
              <option value="none" className="bg-[#111A2E]">General Population</option>
              <option value="asthma" className="bg-[#111A2E]">Asthma / Respiratory</option>
              <option value="elderly" className="bg-[#111A2E]">Elderly Care</option>
              <option value="child" className="bg-[#111A2E]">Child / Pediatric</option>
              <option value="outdoor_worker" className="bg-[#111A2E]">Outdoor Worker</option>
            </select>

            <Button variant="ghost" size="sm" onClick={logout} leftIcon={<LogOut className="w-4 h-4 text-alertRust" />}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* System Health Status Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#131E32]/70 border border-slateInk/20 text-xs font-mono">
          <div className="flex items-center gap-2">
            {healthQuery.isSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                FastAPI Backend Live (v{healthQuery.data.version})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Info className="w-4 h-4" />
                Backend Standby / Local Mock Fallback Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-slateInk">
            <span>Location: <strong className="text-mistWhite">{city}</strong></span>
            <span>Profile: <strong className="text-clearSky capitalize">{healthProfile}</strong></span>
          </div>
        </div>

        {/* CITY SEARCH ERROR STATE — Graceful Handling for Invalid Cities (404) */}
        {isCityError ? (
          <Card className="p-8 text-center space-y-4 border-alertRust/40 bg-alertRust/10">
            <AlertTriangle className="w-10 h-10 text-alertRust mx-auto" />
            <div>
              <h3 className="font-display font-bold text-lg text-mistWhite">City Location Not Found</h3>
              <p className="text-xs text-slateInk max-w-md mx-auto mt-1">
                Unable to locate atmospheric data for "{city}". Please check spelling or select one of the suggested cities below.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              {['Pune', 'Delhi', 'Honolulu', 'London'].map((c) => (
                <Button key={c} variant="secondary" size="sm" onClick={() => handleCitySelect(c)}>
                  Select {c}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <>
            {/* 1. LOCKED UI RULE: Recommendation-First Hierarchy Hero */}
            <section>
              {adviceQuery.isLoading ? (
                <RecommendationHeroSkeleton />
              ) : adviceQuery.data ? (
                <RecommendationHero
                  recommendation={adviceQuery.data.recommendation}
                  why={adviceQuery.data.why}
                  sources={adviceQuery.data.sources}
                  aqiValue={adviceQuery.data.aqi_value}
                  aqiCategory={adviceQuery.data.aqi_category}
                  city={city}
                  usedAiGeneration={adviceQuery.data.used_ai_generation}
                  healthProfile={healthProfile}
                />
              ) : (
                <RecommendationHero
                  recommendation={`Air quality in ${city} is currently moderate. Asthmatic individuals should limit prolonged outdoor exertion.`}
                  why="Particulate matter (PM2.5) levels exceed standard WHO air quality threshold guidelines for sensitive respiratory conditions."
                  sources={['WHO Global Air Quality Guidelines 2021', 'EPA AQI Technical Assistance Guidance']}
                  aqiValue={aqiQuery.data?.aqi || 84}
                  aqiCategory={aqiQuery.data?.category || 'Moderate'}
                  city={city}
                  usedAiGeneration={true}
                  healthProfile={healthProfile}
                />
              )}
            </section>

            {/* 2. Secondary Supporting Row: Pollutant Cards Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-lg text-mistWhite flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-clearSky" />
                  <span>Pollutant Measurements & Data Breakdown</span>
                </h2>
                {aqiQuery.data && (
                  <span className="text-xs font-mono text-slateInk">Source: {aqiQuery.data.data_source}</span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <PollutantCard
                  name="PM2.5"
                  chemicalFormula="Fine Particles"
                  value={aqiQuery.data?.pollutants?.pm2_5 ?? 24.8}
                  unit="µg/m³"
                  status={aqiQuery.data?.aqi && aqiQuery.data.aqi > 100 ? 'Unhealthy' : 'Moderate'}
                  description="Respiratory tract penetration"
                />
                <PollutantCard
                  name="PM10"
                  chemicalFormula="Coarse Dust"
                  value={aqiQuery.data?.pollutants?.pm10 ?? 52.1}
                  unit="µg/m³"
                  status="Good"
                  description="Inhalable coarse particles"
                />
                <PollutantCard
                  name="O3"
                  chemicalFormula="Ozone"
                  value={aqiQuery.data?.pollutants?.o3 ?? 38.4}
                  unit="µg/m³"
                  status="Good"
                  description="Ground-level photochemical ozone"
                />
                <PollutantCard
                  name="NO2"
                  chemicalFormula="Nitrogen Dioxide"
                  value={aqiQuery.data?.pollutants?.no2 ?? 18.6}
                  unit="µg/m³"
                  status="Good"
                  description="Traffic & combustion emission"
                />
                <PollutantCard
                  name="SO2"
                  chemicalFormula="Sulfur Dioxide"
                  value={aqiQuery.data?.pollutants?.so2 ?? 5.2}
                  unit="µg/m³"
                  status="Good"
                  description="Industrial energy emission"
                />
                <PollutantCard
                  name="CO"
                  chemicalFormula="Carbon Monoxide"
                  value={aqiQuery.data?.pollutants?.co ?? 310.0}
                  unit="µg/m³"
                  status="Good"
                  description="Vehicle exhaust gas"
                />
              </div>
            </section>

            {/* 3. 30-Day Trend & Anomaly Chart */}
            <section>
              <TrendChart data={trendPoints} days={30} title={`${city} — 30-Day AQI Trend & Spikes`} />
            </section>
          </>
        )}

      </main>

      {/* Responsive Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
    </div>
  );
};
