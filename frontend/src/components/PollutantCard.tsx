import React from 'react';
import { Card } from './Card';

export interface PollutantCardProps {
  name: string;
  chemicalFormula?: string;
  value: number | string;
  unit?: string;
  status?: 'Good' | 'Moderate' | 'Unhealthy' | 'High';
  description?: string;
  className?: string;
}

export const PollutantCard: React.FC<PollutantCardProps> = ({
  name,
  chemicalFormula,
  value,
  unit = 'µg/m³',
  status = 'Moderate',
  description,
  className = '',
}) => {
  const getStatusColor = (st: string) => {
    switch (st.toLowerCase()) {
      case 'good':
        return 'text-clearSky bg-clearSky/10 border-clearSky/25';
      case 'moderate':
        return 'text-hazyAmber bg-hazyAmber/10 border-hazyAmber/25';
      default:
        return 'text-alertRust bg-alertRust/10 border-alertRust/25';
    }
  };

  return (
    <Card className={`p-4 hover:border-slateInk/30 transition-colors ${className}`} variant="light">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-semibold text-sm text-deepAtmosphere">{name}</span>
          {chemicalFormula && (
            <span className="text-xs text-slateInk font-mono">({chemicalFormula})</span>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Numerical Value in IBM Plex Mono font */}
      <div className="flex items-baseline gap-1 my-1">
        <span className="font-mono text-2xl font-bold text-deepAtmosphere tracking-tight">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-xs font-mono text-slateInk">{unit}</span>
      </div>

      {description && (
        <p className="text-xs text-slateInk mt-2 line-clamp-2 leading-relaxed font-sans">{description}</p>
      )}
    </Card>
  );
};
