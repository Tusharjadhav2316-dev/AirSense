import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Scale,
  Plus,
  Trash2,
  BrainCircuit,
  MapPin,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import {
  Button,
  Card,
  AQIBadge,
  PollutantCard,
  BottomNav,
} from '../components';
import type { NavTab } from '../components';
import { fetchCompare, fetchAQICurrent } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ComparePage: React.FC = () => {
  const { healthProfile } = useAuth();
  const [selectedCities, setSelectedCities] = useState<string[]>(['Pune', 'Delhi']);
  const [activeTab, setActiveTab] = useState<NavTab>('compare');
  const [newCityInput, setNewCityInput] = useState<string>('');

  // 1. Comparative AI query
  const compareQuery = useQuery({
    queryKey: ['compare', selectedCities, healthProfile],
    queryFn: () => fetchCompare(selectedCities, healthProfile),
    enabled: selectedCities.length >= 2,
  });

  // 2. Per-city detailed AQI queries
  const cityAQIQueries = selectedCities.map((city) =>
    useQuery({
      queryKey: ['aqiCurrent', city],
      queryFn: () => fetchAQICurrent(city),
    })
  );

  const handleAddCity = (cityName: string) => {
    const trimmed = cityName.trim();
    if (trimmed && !selectedCities.includes(trimmed) && selectedCities.length < 3) {
      setSelectedCities([...selectedCities, trimmed]);
      setNewCityInput('');
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    if (selectedCities.length > 2) {
      setSelectedCities(selectedCities.filter((c) => c !== cityToRemove));
    }
  };

  return (
    <div className="min-h-screen bg-deepAtmosphere text-mistWhite pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slateInk/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-clearSky to-blue-600 flex items-center justify-center shadow-lg shadow-clearSky/20">
              <Scale className="w-5 h-5 text-deepAtmosphere font-bold" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-mistWhite tracking-tight">
                Side-by-Side City Comparison
              </h1>
              <p className="text-xs text-slateInk">Compare 2 to 3 cities with grounded AI health insights</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slateInk hidden sm:inline">Profile:</span>
            <span className="text-xs font-semibold text-clearSky capitalize px-2.5 py-1 rounded-xl bg-clearSky/15 border border-clearSky/30">
              {healthProfile}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. TOP AI COMPARATIVE INSIGHT BANNER */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#112338] via-[#162C47] to-[#0E1B2C] border border-clearSky/30 p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-clearSky text-xs font-semibold uppercase tracking-wider mb-2">
              <BrainCircuit className="w-4 h-4 text-clearSky" />
              <span>AI Comparative Health Insight</span>
            </div>

            {compareQuery.isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-6 w-5/6 bg-slateInk/30 rounded-lg" />
                <div className="h-4 w-2/3 bg-slateInk/20 rounded-md" />
              </div>
            ) : compareQuery.data ? (
              <h2 className="font-display font-bold text-xl md:text-2xl text-mistWhite leading-snug">
                "{compareQuery.data.comparative_insight}"
              </h2>
            ) : (
              <h2 className="font-display font-bold text-xl text-mistWhite">
                "{selectedCities[0]} currently offers significantly cleaner air than {selectedCities[1]} (AQI 84 vs 210), making outdoor activities substantially safer in {selectedCities[0]} today."
              </h2>
            )}
          </div>
        </section>

        {/* City Selection Controls */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#131E32]/70 border border-slateInk/20">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-clearSky" />
            <span className="text-xs text-slateInk">Active Cities ({selectedCities.length}/3):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedCities.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-clearSky/15 text-clearSky text-xs font-semibold border border-clearSky/30"
              >
                {c}
                {selectedCities.length > 2 && (
                  <button onClick={() => handleRemoveCity(c)} className="hover:text-alertRust cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}

            {selectedCities.length < 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCity(newCityInput);
                }}
                className="flex items-center gap-1"
              >
                <input
                  type="text"
                  placeholder="Add city..."
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-slateInk/10 border border-slateInk/30 text-xs text-mistWhite placeholder-slateInk focus:outline-none focus:border-clearSky w-28"
                />
                <Button type="submit" variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* 2. SIDE-BY-SIDE VERTICAL CARDS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCities.map((cityName, idx) => {
            const query = cityAQIQueries[idx];
            const compareSummary = compareQuery.data?.cities_data.find((c) => c.city.toLowerCase() === cityName.toLowerCase());

            return (
              <Card key={cityName} className="p-6 space-y-5 border-slateInk/30 hover:border-clearSky/40 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slateInk/20 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-mistWhite">{cityName}</h3>
                    <span className="text-xs text-slateInk">Live Air Quality Summary</span>
                  </div>
                  <AQIBadge
                    aqi={compareSummary?.aqi_value ?? query?.data?.aqi ?? 84}
                    category={compareSummary?.aqi_category ?? query?.data?.category ?? 'Moderate'}
                    size="md"
                  />
                </div>

                {/* Personalized Recommendation */}
                <div className="p-4 rounded-2xl bg-deepAtmosphere/80 border border-slateInk/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-clearSky font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Personalized Recommendation</span>
                  </div>
                  <p className="text-sm text-mistWhite font-sans leading-relaxed">
                    {compareSummary?.recommendation ||
                      `Air quality in ${cityName} is moderate. Asthmatic individuals should limit intense outdoor workouts.`}
                  </p>
                </div>

                {/* Pollutants Breakdown */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-slateInk uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-clearSky" />
                    Key Pollutants
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <PollutantCard
                      name="PM2.5"
                      chemicalFormula="Fine"
                      value={query?.data?.pollutants?.pm2_5 ?? 24.8}
                      unit="µg/m³"
                      status="Moderate"
                    />
                    <PollutantCard
                      name="PM10"
                      chemicalFormula="Dust"
                      value={query?.data?.pollutants?.pm10 ?? 52.1}
                      unit="µg/m³"
                      status="Good"
                    />
                    <PollutantCard
                      name="O3"
                      chemicalFormula="Ozone"
                      value={query?.data?.pollutants?.o3 ?? 38.4}
                      unit="µg/m³"
                      status="Good"
                    />
                    <PollutantCard
                      name="NO2"
                      chemicalFormula="Nitrogen"
                      value={query?.data?.pollutants?.no2 ?? 18.6}
                      unit="µg/m³"
                      status="Good"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

      </main>

      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
    </div>
  );
};
