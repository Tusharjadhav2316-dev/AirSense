import React from 'react';
import type { AQICategory } from '../types';

export interface AQIBadgeProps {
  aqi?: number;
  category: AQICategory | string;
  size?: 'sm' | 'md';
  showNumber?: boolean;
  className?: string;
}

export const getAQIColorConfig = (category: string) => {
  const catLower = category.toLowerCase();
  if (catLower.includes('good')) {
    return {
      bg: 'bg-clearSky/15',
      text: 'text-clearSky',
      border: 'border-clearSky/30',
      dot: 'bg-clearSky',
    };
  }
  if (catLower.includes('moderate')) {
    return {
      bg: 'bg-hazyAmber/15',
      text: 'text-hazyAmber',
      border: 'border-hazyAmber/30',
      dot: 'bg-hazyAmber',
    };
  }
  return {
    bg: 'bg-alertRust/15',
    text: 'text-alertRust',
    border: 'border-alertRust/30',
    dot: 'bg-alertRust',
  };
};

export const AQIBadge: React.FC<AQIBadgeProps> = ({
  aqi,
  category,
  size = 'md',
  showNumber = true,
  className = '',
}) => {
  const colors = getAQIColorConfig(category);
  const sizeStyles = size === 'sm' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-3 py-1.5 text-xs font-medium gap-2';

  return (
    <div
      className={`inline-flex items-center rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeStyles} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
      {showNumber && aqi !== undefined && (
        <span className="font-mono font-bold text-xs md:text-sm tracking-tight">{aqi}</span>
      )}
      <span className="font-sans font-medium">{category}</span>
    </div>
  );
};
