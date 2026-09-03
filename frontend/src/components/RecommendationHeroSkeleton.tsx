import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const RecommendationHeroSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121E36] via-[#162544] to-[#0E1729] border border-clearSky/20 p-6 md:p-8 shadow-2xl animate-pulse">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-clearSky/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-clearSky/20 flex items-center justify-center">
            <BrainCircuit className="w-3.5 h-3.5 text-clearSky animate-spin" />
          </div>
          <div className="h-4 w-40 bg-slateInk/30 rounded-md" />
        </div>
        <div className="h-6 w-28 bg-slateInk/20 rounded-full" />
      </div>

      {/* Headline skeleton */}
      <div className="space-y-3 mb-6">
        <div className="h-8 w-11/12 bg-slateInk/30 rounded-xl" />
        <div className="h-8 w-3/4 bg-slateInk/25 rounded-xl" />
      </div>

      {/* Why card skeleton */}
      <div className="mb-6 p-4 rounded-2xl bg-deepAtmosphere/60 border border-slateInk/20">
        <div className="h-3 w-32 bg-slateInk/30 rounded mb-2" />
        <div className="h-4 w-full bg-slateInk/20 rounded mb-1" />
        <div className="h-4 w-5/6 bg-slateInk/20 rounded" />
      </div>

      {/* Bottom row skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-slateInk/15">
        <div className="h-6 w-36 bg-slateInk/20 rounded-full" />
        <div className="h-4 w-28 bg-slateInk/20 rounded" />
      </div>
    </div>
  );
};
