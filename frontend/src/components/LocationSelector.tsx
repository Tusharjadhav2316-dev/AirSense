import React, { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

export interface LocationSelectorProps {
  selectedCity: string;
  onCityChange?: (city: string) => void;
  availableCities?: string[];
  className?: string;
}

const DEFAULT_CITIES = ['Pune', 'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'London', 'New York'];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCity,
  onCityChange,
  availableCities = DEFAULT_CITIES,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (city: string) => {
    if (onCityChange) {
      onCityChange(city);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slateInk/20 text-deepAtmosphere hover:border-clearSky/50 hover:bg-mistWhite/80 transition-all text-xs font-medium cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-clearSky/30"
      >
        <MapPin className="w-3.5 h-3.5 text-clearSky shrink-0" />
        <span className="font-semibold">{selectedCity}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slateInk transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 py-1.5 bg-white border border-slateInk/20 rounded-xl shadow-xl z-50 animate-in fade-in duration-150">
          <div className="px-3 py-1 text-[10px] uppercase font-mono font-semibold text-slateInk tracking-wider border-b border-slateInk/10 mb-1">
            Select Location
          </div>
          {availableCities.map((city) => (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-mistWhite transition-colors cursor-pointer ${
                city.toLowerCase() === selectedCity.toLowerCase()
                  ? 'text-clearSky font-semibold bg-clearSky/5'
                  : 'text-deepAtmosphere'
              }`}
            >
              <span>{city}</span>
              {city.toLowerCase() === selectedCity.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-clearSky" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
