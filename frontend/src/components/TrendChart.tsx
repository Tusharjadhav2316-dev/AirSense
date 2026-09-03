import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { TrendPoint } from '../types';
import { Card } from './Card';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export interface TrendChartProps {
  data: TrendPoint[];
  title?: string;
  className?: string;
  days?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: TrendPoint = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-[#0E1729] border border-slateInk/30 shadow-xl text-xs">
        <p className="font-mono text-slateInk mb-1">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-clearSky" />
          <span className="text-mistWhite">AQI:</span>
          <span className="font-mono font-bold text-clearSky">{data.aqi}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-hazyAmber" />
          <span className="text-mistWhite">7-Day Rolling Avg:</span>
          <span className="font-mono font-semibold text-hazyAmber">{data.rolling_avg.toFixed(1)}</span>
        </div>
        {data.is_anomaly && (
          <div className="mt-2 pt-2 border-t border-slateInk/20 flex items-center gap-1.5 text-alertRust font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Spike Anomaly (&gt;25% above rolling avg)</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({
  data = [],
  title = 'AQI Trend & Anomaly Analysis',
  className = '',
  days = 30,
}) => {
  const anomalyCount = data.filter((d) => d.is_anomaly).length;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-clearSky" />
          <span>{title}</span>
        </div>
      }
      action={
        anomalyCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-alertRust/15 border border-alertRust/30 text-alertRust text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {anomalyCount} Anomal{anomalyCount === 1 ? 'y' : 'ies'} Detected
          </span>
        ) : null
      }
      className={className}
    >
      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slateInk text-sm font-mono">
            No historical trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4FA8E0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4FA8E0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRolling" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E0A458" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E0A458" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#64748B" strokeOpacity={0.15} />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => (val.length > 5 ? val.slice(5) : val)}
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 'dataMax + 20']} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={50} stroke="#4FA8E0" strokeDasharray="3 3" strokeOpacity={0.4} label={{ value: 'Good Threshold (50)', fill: '#4FA8E0', fontSize: 10 }} />
              <ReferenceLine y={100} stroke="#E0A458" strokeDasharray="3 3" strokeOpacity={0.4} label={{ value: 'Moderate Threshold (100)', fill: '#E0A458', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="aqi"
                name="Daily AQI"
                stroke="#4FA8E0"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAQI)"
              />
              <Area
                type="monotone"
                dataKey="rolling_avg"
                name="7-Day Rolling Avg"
                stroke="#E0A458"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorRolling)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slateInk pt-3 border-t border-slateInk/15 mt-2 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-clearSky" />
            <span>Raw AQI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-hazyAmber border-dashed" />
            <span>7-Day Rolling Avg</span>
          </div>
        </div>
        <span>{days}-Day Window</span>
      </div>
    </Card>
  );
};
