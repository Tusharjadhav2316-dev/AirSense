import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, ShieldCheck, Activity, Clock, Sparkles } from 'lucide-react';
import { Button, AQIBadge, Card, SourcesPill } from '../../components';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden py-10 md:py-16 px-4 sm:px-6 lg:px-8 ambient-unhealthy border-b border-slateInk/15">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-alertRust/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[250px] bg-clearSky/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Responsive Grid: Desktop 2-column (65% left / 35% right), Mobile 1-column stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT / MAIN RECOMMENDATION CONTENT (lg:col-span-7 or 8) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clearSky/10 border border-clearSky/25 text-clearSky text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED AIR QUALITY HEALTH ASSISTANT</span>
            </div>

            {/* 2. Dominant Space Grotesk AI Recommendation Headline */}
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-deepAtmosphere leading-[1.15] tracking-tight">
                Air quality is{' '}
                <span className="text-alertRust underline decoration-alertRust/30 decoration-wavy decoration-2">
                  unsafe
                </span>{' '}
                for outdoor exercise right now — here's why.
              </h1>
            </div>

            {/* 3. "Why" Grounded RAG Reasoning Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-slateInk/15 shadow-xs backdrop-blur-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-alertRust/10 text-alertRust flex items-center justify-center shrink-0 mt-0.5">
                  <BrainCircuit className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slateInk mb-1 font-sans">
                    WHO / EPA Medical RAG Explanation
                  </h4>
                  <p className="text-sm sm:text-base text-deepAtmosphere/90 leading-relaxed font-sans font-normal">
                    PM2.5 concentration is currently 3.1× above the WHO daily guideline. Fine particulate matter can penetrate deep into the lungs, increasing respiratory inflammation, especially for sensitive groups or active outdoor exertion.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Sources Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <SourcesPill sources={['WHO Global Air Quality Guidelines 2021', 'EPA Air Quality Index Standards']} />
              <div className="flex items-center gap-1.5 text-xs text-slateInk font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-clearSky" />
                <span>Peer-Reviewed Medical Evidence</span>
              </div>
            </div>

            {/* 5. Primary & Secondary Action CTAs (Placed BEFORE Live AQI Evidence on Mobile per Correction 02) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => navigate('/signup')}
              >
                Try AirSense Free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={scrollToHowItWorks}
              >
                See How It Works
              </Button>
            </div>
          </div>

          {/* RIGHT / SUPPORTING LIVE AQI EVIDENCE CARD (lg:col-span-5) */}
          <div className="lg:col-span-5 w-full">
            <Card variant="light" className="p-6 border-slateInk/20 shadow-md relative overflow-hidden bg-white/95">
              {/* Card Header Badge */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slateInk/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-alertRust animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slateInk">
                    LIVE EXAMPLE
                  </span>
                </div>
                <span className="text-xs text-slateInk font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 10m ago
                </span>
              </div>

              {/* City Name */}
              <div className="mb-4">
                <h3 className="font-display font-bold text-xl text-deepAtmosphere">
                  Pune, Maharashtra
                </h3>
                <p className="text-xs text-slateInk font-sans">Current Outdoor Conditions</p>
              </div>

              {/* Compact AQI Supporting Badge (Does NOT visually compete with the hero headline) */}
              <div className="p-4 rounded-2xl bg-mistWhite border border-slateInk/10 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slateInk font-mono block">AQI Index</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono text-3xl font-bold text-deepAtmosphere tracking-tight">
                      168
                    </span>
                    <AQIBadge category="Unhealthy" showNumber={false} size="sm" />
                  </div>
                </div>

                <div className="text-right border-l border-slateInk/10 pl-4">
                  <span className="text-[11px] text-slateInk font-mono block">Dominant Pollutant</span>
                  <span className="font-mono text-sm font-bold text-deepAtmosphere block mt-0.5">
                    PM2.5 (58.2 µg/m³)
                  </span>
                </div>
              </div>

              {/* Supporting Mini Trend Sparkline */}
              <div className="pt-2 border-t border-slateInk/10 flex items-center justify-between text-xs text-slateInk font-mono">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-alertRust" />
                  <span>3-Day Trend: Rising (+18%)</span>
                </div>
                <span className="text-[11px] text-clearSky font-sans font-medium">Supporting Evidence</span>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};
