import React from 'react';
import { Card, Button } from '../components';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Bell, Settings, ShieldCheck, Heart, MapPin } from 'lucide-react';



export const ChatPage: React.FC = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-6 text-center">
    <Card className="p-12 space-y-4">
      <MessageSquare className="w-12 h-12 text-clearSky mx-auto" />
      <h2 className="font-display font-bold text-2xl text-mistWhite">WHO/EPA Conversational AI Chat</h2>
      <p className="text-slateInk text-sm max-w-md mx-auto">
        Sprint 3 Day 14 feature: Interactive conversational assistant with peer-reviewed RAG source citations.
      </p>
    </Card>
  </div>
);

export const AlertsPage: React.FC = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-6 text-center">
    <Card className="p-12 space-y-4">
      <Bell className="w-12 h-12 text-alertRust mx-auto" />
      <h2 className="font-display font-bold text-2xl text-mistWhite">Air Quality Alert Triggers</h2>
      <p className="text-slateInk text-sm max-w-md mx-auto">
        Threshold alert notifications for saved locations when AQI exceeds sensitive respiratory limits.
      </p>
    </Card>
  </div>
);

export const SettingsPage: React.FC = () => {
  const { user, healthProfile, homeLocation, logout, setHealthProfile, setHomeLocation } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-mistWhite flex items-center gap-2">
          <Settings className="w-6 h-6 text-clearSky" />
          <span>Account & Profile Settings</span>
        </h2>
        <Button variant="danger" size="sm" onClick={logout}>Sign Out</Button>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h3 className="font-display font-semibold text-base text-mistWhite mb-1">User Account</h3>
          <p className="text-xs font-mono text-slateInk">{user?.email || 'Logged in user'}</p>
        </div>

        <div className="border-t border-slateInk/20 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slateInk mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-clearSky" />
              <span>Default Home Location</span>
            </label>
            <input
              type="text"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#111A2E] border border-slateInk/30 text-sm text-mistWhite focus:outline-none focus:border-clearSky w-full max-w-md"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slateInk mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-hazyAmber" />
              <span>Medical / Health Profile</span>
            </label>
            <select
              value={healthProfile}
              onChange={(e) => setHealthProfile(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#111A2E] border border-slateInk/30 text-sm text-mistWhite focus:outline-none focus:border-clearSky capitalize w-full max-w-md"
            >
              <option value="none">General Population</option>
              <option value="asthma">Asthma / Sensitive Respiratory</option>
              <option value="elderly">Elderly Care</option>
              <option value="child">Child / Pediatric</option>
              <option value="outdoor_worker">Outdoor Worker</option>
            </select>
          </div>
        </div>

        <div className="border-t border-slateInk/20 pt-4">
          <div className="flex items-center gap-2 text-xs text-clearSky font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Sources & Responsible AI Transparency</span>
          </div>
          <p className="text-xs text-slateInk mt-1 leading-relaxed">
            AirSense uses open atmospheric model data from Open-Meteo and strictly grounds all generated advice in vector-indexed WHO and EPA medical guidelines.
          </p>
        </div>
      </Card>
    </div>
  );
};
