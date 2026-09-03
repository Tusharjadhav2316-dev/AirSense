import React from 'react';
import { Sparkles, Wind } from 'lucide-react';
import { LocationSelector } from './LocationSelector';

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  showLocationSelector?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  selectedCity = 'Pune',
  onCityChange,
  showLocationSelector = true,
  actions,
  className = '',
}) => {
  return (
    <header
      className={`bg-mistWhite/80 backdrop-blur-md border-b border-slateInk/15 px-4 md:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 ${className}`}
    >
      {/* Left: Logo/Title Branding */}
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-lg bg-deepAtmosphere text-clearSky flex items-center justify-center shrink-0">
          <Wind className="w-4.5 h-4.5" />
        </div>
        <div>
          {title ? (
            <h1 className="font-display font-bold text-lg md:text-xl text-deepAtmosphere leading-tight">
              {title}
            </h1>
          ) : (
            <h1 className="font-display font-bold text-lg md:text-xl text-deepAtmosphere leading-tight">
              AirSense
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-slateInk mt-0.5 font-sans">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Generic Privacy-Preserving Indicator & Location Selector */}
      <div className="flex items-center gap-2.5">
        {/* Generic "Personalized Guidance Active" badge — No explicit health conditions exposed */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clearSky/10 border border-clearSky/25 text-clearSky text-[11px] font-medium">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>Personalized AI Guidance</span>
        </div>

        {showLocationSelector && (
          <LocationSelector
            selectedCity={selectedCity}
            onCityChange={onCityChange}
          />
        )}

        {actions}
      </div>
    </header>
  );
};
