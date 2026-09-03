import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import type { TrendPoint } from '../types';

export interface CalendarHeatmapProps {
  data: TrendPoint[];
  title?: string;
  className?: string;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  data,
  title = '30-Day Air Quality Calendar Heatmap',
  className = '',
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

  // Take up to 30 points
  const points = data.slice(-30);

  const getTileStyles = (aqi: number) => {
    if (aqi <= 50) {
      return 'bg-clearSky/20 border-clearSky/40 text-clearSky hover:bg-clearSky/35';
    } else if (aqi <= 100) {
      return 'bg-hazyAmber/25 border-hazyAmber/40 text-hazyAmber hover:bg-hazyAmber/40';
    } else {
      return 'bg-alertRust/30 border-alertRust/50 text-alertRust hover:bg-alertRust/50';
    }
  };

  const getCategoryName = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    return 'Unhealthy';
  };

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-[#121E36] to-[#0E1729] border border-slateInk/25 p-6 shadow-xl ${className}`}>
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-clearSky/10 text-clearSky">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-mistWhite">{title}</h3>
            <p className="text-xs text-slateInk">Visual breakdown of daily AQI severity & anomaly spikes</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slateInk">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-clearSky/30 border border-clearSky/50" />
            <span>Good (&le;50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-hazyAmber/30 border border-hazyAmber/50" />
            <span>Moderate (51-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-alertRust/40 border border-alertRust/60" />
            <span>Unhealthy (&gt;100)</span>
          </div>
        </div>
      </div>

      {/* Grid of 30 days */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5 mb-4">
        {points.map((pt, idx) => (
          <div
            key={pt.date || idx}
            onMouseEnter={() => setHoveredPoint(pt)}
            onMouseLeave={() => setHoveredPoint(null)}
            className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer font-mono ${getTileStyles(
              pt.aqi
            )}`}
          >
            {pt.is_anomaly && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alertRust animate-ping" />
            )}

            <span className="text-[10px] opacity-75 font-sans">Day {idx + 1}</span>
            <span className="text-sm font-bold mt-0.5">{pt.aqi}</span>
          </div>
        ))}
      </div>

      {/* Interactive Tooltip Card */}
      {hoveredPoint ? (
        <div className="p-3.5 rounded-2xl bg-deepAtmosphere/90 border border-clearSky/30 flex items-center justify-between text-xs animate-fadeIn">
          <div>
            <span className="text-slateInk">Date: </span>
            <strong className="text-mistWhite font-mono">{hoveredPoint.date}</strong>
            <span className="mx-2 text-slateInk">•</span>
            <span className="text-slateInk">AQI: </span>
            <strong className="text-clearSky font-mono">{hoveredPoint.aqi}</strong>
            <span className="mx-2 text-slateInk">•</span>
            <span className="text-slateInk">Category: </span>
            <strong className="text-mistWhite">{getCategoryName(hoveredPoint.aqi)}</strong>
          </div>
          {hoveredPoint.is_anomaly && (
            <span className="inline-flex items-center gap-1 text-alertRust font-semibold text-[11px] bg-alertRust/15 px-2 py-0.5 rounded-full border border-alertRust/30">
              <AlertCircle className="w-3.5 h-3.5" />
              Anomaly Spike Detected
            </span>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-deepAtmosphere/40 border border-slateInk/15 text-center text-xs text-slateInk">
          Hover over any day tile above to view detailed atmospheric breakdown & anomaly metrics.
        </div>
      )}
    </div>
  );
};
