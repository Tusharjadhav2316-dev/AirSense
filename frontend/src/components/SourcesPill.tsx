import React, { useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';

export interface SourcesPillProps {
  sources?: string[];
  className?: string;
}

export const SourcesPill: React.FC<SourcesPillProps> = ({
  sources = ['WHO Global Air Quality Guidelines 2021', 'EPA Air Quality Index Standards'],
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slateInk/20 text-deepAtmosphere hover:border-clearSky/40 hover:bg-mistWhite transition-all text-xs font-medium cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-clearSky"
      >
        <BookOpen className="w-3.5 h-3.5 text-clearSky shrink-0" />
        <span>
          {sources.length} Grounded Source{sources.length > 1 ? 's' : ''}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slateInk transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Sources Details Dropdown */}
      {isExpanded && (
        <div className="absolute left-0 bottom-full mb-2 w-72 md:w-96 p-4 rounded-2xl bg-white border border-slateInk/20 shadow-xl z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slateInk/10">
            <div className="flex items-center gap-1.5 text-clearSky text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>WHO / EPA Medical Evidence</span>
            </div>
            <span className="text-[10px] text-slateInk uppercase font-mono">Vector RAG</span>
          </div>

          <ul className="space-y-2">
            {sources.map((src, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-deepAtmosphere p-2 rounded-xl bg-mistWhite/80 border border-slateInk/10 hover:border-clearSky/30 transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-clearSky/20 text-clearSky font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{src}</p>
                  <p className="text-[10px] text-slateInk mt-0.5">
                    Peer-reviewed medical guidance document
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-slateInk shrink-0 mt-1" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
