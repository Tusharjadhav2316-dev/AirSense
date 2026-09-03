import React from 'react';
import { ShieldCheck, BrainCircuit, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AQIBadge } from './AQIBadge';
import { SourcesPill } from './SourcesPill';
import type { AQICategory } from '../types';

export interface RecommendationHeroProps {
  recommendation: string;
  why?: string;
  sources?: string[];
  aqiValue?: number;
  aqiCategory?: AQICategory | string;
  city?: string;
  usedAiGeneration?: boolean;
  healthProfile?: string;
  className?: string;
}

export const RecommendationHero: React.FC<RecommendationHeroProps> = ({
  recommendation,
  why,
  sources = [],
  aqiValue,
  aqiCategory = 'Moderate',
  city = 'Pune',
  usedAiGeneration = true,
  className = '',
}) => {
  const categoryLower = (aqiCategory || '').toLowerCase();
  const isGood = categoryLower.includes('good') || (aqiValue !== undefined && aqiValue <= 50);
  const isModerate = categoryLower.includes('moderate');

  // Predominantly light, severity-aware ambient surface background
  const ambientClass = isGood
    ? 'ambient-good'
    : isModerate
    ? 'ambient-moderate'
    : 'ambient-unhealthy';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${ambientClass} border p-6 md:p-8 shadow-xs transition-all duration-300 ${className}`}
    >
      {/* Top Header Row: AI Badge & Compact Supporting AQI Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clearSky/10 border border-clearSky/25 text-clearSky text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Health Guidance — {city}</span>
          </div>

          {!usedAiGeneration && isGood && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-clearSky/15 text-clearSky text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Optimal Air Quality
            </span>
          )}
        </div>

        {/* Supporting AQI badge — Compact supporting evidence in top right */}
        {aqiCategory && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slateInk font-sans">Air Quality:</span>
            <AQIBadge aqi={aqiValue} category={aqiCategory} size="sm" />
          </div>
        )}
      </div>

      {/* Dominant AI Recommendation Sentence — Space Grotesk Font, Deep Atmosphere Color */}
      <div className="mb-6 relative z-10">
        <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-deepAtmosphere leading-tight tracking-tight">
          "{recommendation}"
        </h2>
      </div>

      {/* Light / Soft WHO/EPA Grounded RAG Explanation ("Why") */}
      {why && (
        <div className="mb-6 p-4 rounded-2xl bg-white/80 border border-slateInk/15 backdrop-blur-xs relative z-10">
          <div className="flex items-start gap-3">
            {isGood ? (
              <CheckCircle2 className="w-5 h-5 text-clearSky shrink-0 mt-0.5" />
            ) : isModerate ? (
              <ShieldCheck className="w-5 h-5 text-hazyAmber shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-alertRust shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slateInk mb-1 font-sans">
                Why this advice?
              </h4>
              <p className="text-sm text-deepAtmosphere/90 leading-relaxed font-sans font-normal">
                {why}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Row: WHO/EPA Source Citation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slateInk/15 relative z-10">
        <SourcesPill sources={sources} />

        <div className="flex items-center gap-2 text-xs text-slateInk font-mono">
          <span>{usedAiGeneration ? 'WHO/EPA RAG + LLM Grounded' : 'Fast-Path Assessment'}</span>
        </div>
      </div>
    </div>
  );
};
