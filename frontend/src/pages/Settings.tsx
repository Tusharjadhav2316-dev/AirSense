import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Heart,
  MapPin,
  Bell,
  Sliders,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  Database,
  Plus,
  Trash2
} from 'lucide-react';
import {
  Button,
  Card,
  BottomNav,
} from '../components';
import type { NavTab } from '../components';
import { useAuth } from '../context/AuthContext';
import type { HealthProfile } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, healthProfile, homeLocation, logout, setHealthProfile, setHomeLocation } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('settings');

  const [savedLocations, setSavedLocations] = useState<string[]>(['Pune', 'Delhi', 'Honolulu']);
  const [newCityInput, setNewCityInput] = useState<string>('');
  const [thresholdAQI, setThresholdAQI] = useState<number>(100);

  // Notification Preference Toggles
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [browserNotifications, setBrowserNotifications] = useState<boolean>(true);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(false);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const city = newCityInput.trim();
    if (city && !savedLocations.includes(city)) {
      setSavedLocations([...savedLocations, city]);
      setNewCityInput('');
    }
  };

  const handleRemoveLocation = (city: string) => {
    if (savedLocations.length > 1) {
      setSavedLocations(savedLocations.filter((c) => c !== city));
    }
  };

  return (
    <div className="min-h-screen bg-deepAtmosphere text-mistWhite pb-24">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slateInk/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-clearSky to-blue-600 flex items-center justify-center shadow-lg shadow-clearSky/20">
              <Settings className="w-5 h-5 text-deepAtmosphere font-bold" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-mistWhite tracking-tight">
                Account & AirSense Preferences
              </h1>
              <p className="text-xs text-slateInk">Health profiles, locations, & alert triggers</p>
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* 1. USER ACCOUNT & HEALTH PROFILE SECTION */}
        <section className="space-y-4">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slateInk/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-clearSky/15 border border-clearSky/30 flex items-center justify-center text-clearSky">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-mistWhite">Account Session</h3>
                  <p className="text-xs font-mono text-slateInk">{user?.email || 'Logged in user'}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
                JWT Authenticated
              </span>
            </div>

            {/* Health Profile Picker — Changing affects Dashboard AI recommendations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-hazyAmber" />
                <h4 className="font-display font-semibold text-sm text-mistWhite">
                  Personal Health Profile
                </h4>
              </div>
              <p className="text-xs text-slateInk">
                Select your primary respiratory or vulnerable health condition. Changing this updates all WHO/EPA RAG recommendation algorithms instantly across AirSense.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'none', label: 'General Population', desc: 'Standard WHO baseline guidelines' },
                  { id: 'asthma', label: 'Asthma / Respiratory', desc: 'Heightened sensitivity to PM2.5 & O3' },
                  { id: 'elderly', label: 'Elderly Care (65+)', desc: 'Cardiovascular & lung protection' },
                  { id: 'child', label: 'Child / Pediatric', desc: 'Developing lung safety & outdoor play' },
                  { id: 'outdoor_worker', label: 'Outdoor Worker', desc: 'Long-exposure exertion thresholds' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setHealthProfile(p.id as HealthProfile)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      healthProfile === p.id
                        ? 'bg-clearSky/15 border-clearSky text-mistWhite shadow-lg shadow-clearSky/10'
                        : 'bg-deepAtmosphere/60 border-slateInk/20 text-slateInk hover:text-mistWhite hover:border-slateInk/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs font-semibold">{p.label}</strong>
                      {healthProfile === p.id && <CheckCircle2 className="w-4 h-4 text-clearSky" />}
                    </div>
                    <p className="text-[11px] text-slateInk leading-snug">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* 2. SAVED LOCATIONS & HOME SETTING */}
        <section className="space-y-4">
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slateInk/20 pb-3">
              <MapPin className="w-5 h-5 text-clearSky" />
              <h3 className="font-display font-semibold text-base text-mistWhite">
                Saved Locations Management
              </h3>
            </div>

            <div className="space-y-3">
              <label className="block text-xs text-slateInk">Default Home Location:</label>
              <input
                type="text"
                value={homeLocation}
                onChange={(e) => setHomeLocation(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-deepAtmosphere border border-slateInk/30 text-sm text-mistWhite focus:outline-none focus:border-clearSky w-full max-w-md"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs text-slateInk">Saved Cities ({savedLocations.length}):</label>
              <div className="flex flex-wrap items-center gap-2">
                {savedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slateInk/15 text-mistWhite text-xs font-medium border border-slateInk/30"
                  >
                    {loc}
                    {savedLocations.length > 1 && (
                      <button onClick={() => handleRemoveLocation(loc)} className="hover:text-alertRust cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5 text-slateInk" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddLocation} className="flex items-center gap-2 max-w-md pt-2">
                <input
                  type="text"
                  placeholder="Add location (e.g., London)..."
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-deepAtmosphere border border-slateInk/30 text-xs text-mistWhite placeholder-slateInk focus:outline-none focus:border-clearSky"
                />
                <Button type="submit" variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add City
                </Button>
              </form>
            </div>
          </Card>
        </section>

        {/* 3. ALERT THRESHOLD CONFIG & NOTIFICATIONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slateInk/20 pb-3">
              <Sliders className="w-5 h-5 text-hazyAmber" />
              <h3 className="font-display font-semibold text-base text-mistWhite">AQI Alert Threshold</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slateInk">Warning Threshold:</span>
                <strong className="text-hazyAmber font-bold">AQI &gt; {thresholdAQI}</strong>
              </div>
              <input
                type="range"
                min={50}
                max={200}
                step={10}
                value={thresholdAQI}
                onChange={(e) => setThresholdAQI(Number(e.target.value))}
                className="w-full h-2 bg-slateInk/20 rounded-lg appearance-none cursor-pointer accent-hazyAmber"
              />
            </div>
            <p className="text-[11px] text-slateInk">
              Notifications trigger when any saved location exceeds this threshold level.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slateInk/20 pb-3">
              <Bell className="w-5 h-5 text-clearSky" />
              <h3 className="font-display font-semibold text-base text-mistWhite">Notification Toggles</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Email Threshold Alerts</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-clearSky cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Browser Push Warnings</span>
                <input
                  type="checkbox"
                  checked={browserNotifications}
                  onChange={(e) => setBrowserNotifications(e.target.checked)}
                  className="w-4 h-4 accent-clearSky cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Weekly AQI Digest</span>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4 h-4 accent-clearSky cursor-pointer"
                />
              </label>
            </div>
          </Card>
        </section>

        {/* 4. RESPONSIBLE AI & DATA SOURCES TRANSPARENCY */}
        <section>
          <Card className="p-6 space-y-3 border-clearSky/25 bg-gradient-to-r from-[#0F1E33] to-[#0E1729]">
            <div className="flex items-center gap-2 text-clearSky">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-display font-semibold text-base text-mistWhite">
                Data Sources & Responsible AI Transparency
              </h3>
            </div>

            <p className="text-xs text-mistWhite/90 leading-relaxed font-sans">
              AirSense retrieves real-time atmospheric measurements from <strong>Open-Meteo's European Centre for Medium-Range Weather Forecasts (ECMWF)</strong> global reanalysis models. All AI health advice is strictly grounded in peer-reviewed vector-indexed medical guidelines from the <strong>World Health Organization (WHO)</strong> and <strong>US Environmental Protection Agency (EPA)</strong>.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slateInk pt-1">
              <Database className="w-3.5 h-3.5 text-clearSky" />
              <span>ChromaDB Vector Store • Open-Meteo API v1 • FastAPI Agent Pipeline</span>
            </div>
          </Card>
        </section>

      </main>

      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
    </div>
  );
};
