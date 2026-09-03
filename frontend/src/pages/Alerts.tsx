import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Sliders,
  ShieldAlert,
  MapPin,
  Clock
} from 'lucide-react';
import {
  Button,
  Card,
  AQIBadge,
  BottomNav,
} from '../components';
import type { NavTab } from '../components';
import { fetchAlerts, dismissAlert } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { AlertItem } from '../types';

export const AlertsPage: React.FC = () => {
  const { homeLocation } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<NavTab>('alerts');
  const [thresholdAQI, setThresholdAQI] = useState<number>(100);

  // Query active threshold alerts from backend
  const alertsQuery = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
  });

  // Dismiss alert mutation
  const dismissMutation = useMutation({
    mutationFn: (alertId: string) => dismissAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const mockFallbackAlerts: AlertItem[] = [
    {
      id: 'alt-101',
      city: 'Delhi',
      aqi: 210,
      category: 'Unhealthy',
      message: 'AQI in Delhi has crossed 200 (Unhealthy). High PM2.5 levels detected. Sensitive groups should avoid outdoor activity.',
      timestamp: new Date().toISOString(),
      dismissed: false,
    },
    {
      id: 'alt-102',
      city: 'Pune',
      aqi: 84,
      category: 'Moderate',
      message: `Daily AQI update for ${homeLocation || 'Pune'}: Air quality is Moderate (84). Asthmatic individuals should limit prolonged exertion.`,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      dismissed: false,
    },
  ];

  const alerts = alertsQuery.data?.alerts || mockFallbackAlerts;

  return (
    <div className="min-h-screen bg-deepAtmosphere text-mistWhite pb-24">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slateInk/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-alertRust to-red-600 flex items-center justify-center shadow-lg shadow-alertRust/20">
              <Bell className="w-5 h-5 text-mistWhite font-bold" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-mistWhite tracking-tight">
                Air Quality Threshold Alerts
              </h1>
              <p className="text-xs text-slateInk">Live threshold warnings for saved locations</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-alertRust/20 text-alertRust border border-alertRust/40">
            {alerts.length} Active Alerts
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* 1. Threshold Configuration Quick Card */}
        <section>
          <Card className="p-6 space-y-4 border-slateInk/25 bg-gradient-to-br from-[#121E36] to-[#0E1729]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-clearSky" />
                <h3 className="font-display font-semibold text-base text-mistWhite">
                  Configure AQI Alert Trigger Threshold
                </h3>
              </div>
              <span className="font-mono text-sm font-bold text-clearSky bg-clearSky/15 px-3 py-1 rounded-xl border border-clearSky/30">
                AQI &gt; {thresholdAQI}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={50}
                max={200}
                step={10}
                value={thresholdAQI}
                onChange={(e) => setThresholdAQI(Number(e.target.value))}
                className="w-full h-2 bg-slateInk/20 rounded-lg appearance-none cursor-pointer accent-clearSky"
              />
              <div className="flex justify-between text-[11px] text-slateInk font-mono">
                <span>50 (Good)</span>
                <span>100 (Moderate)</span>
                <span>150 (Unhealthy Sensitive)</span>
                <span>200+ (Unhealthy)</span>
              </div>
            </div>

            <p className="text-xs text-slateInk">
              Trigger instant notifications whenever air quality in your saved locations exceeds AQI {thresholdAQI}.
            </p>
          </Card>
        </section>

        {/* 2. Active Alert Cards List */}
        <section className="space-y-4">
          <h2 className="font-display font-semibold text-base text-mistWhite flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-alertRust" />
            <span>Triggered Location Warnings</span>
          </h2>

          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`p-6 space-y-3 transition-all ${
                    alert.aqi > 150 ? 'border-alertRust/50 bg-alertRust/10' : 'border-slateInk/30 bg-[#121E36]'
                  }`}
                >
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-clearSky" />
                      <h3 className="font-display font-bold text-lg text-mistWhite">{alert.city}</h3>
                      <AQIBadge aqi={alert.aqi} category={alert.category} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slateInk font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissMutation.mutate(alert.id)}
                        leftIcon={<Trash2 className="w-4 h-4 text-slateInk hover:text-alertRust" />}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>

                  {/* Warning Message Body */}
                  <p className="text-sm text-mistWhite/90 font-sans leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-hazyAmber shrink-0 mt-0.5" />
                    <span>{alert.message}</span>
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center space-y-3 border-slateInk/20">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-display font-bold text-lg text-mistWhite">All Clear — No Active Threshold Alerts</h3>
              <p className="text-xs text-slateInk max-w-sm mx-auto">
                Air quality across all your saved locations is currently below configured warning thresholds.
              </p>
            </Card>
          )}
        </section>

      </main>

      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
    </div>
  );
};
