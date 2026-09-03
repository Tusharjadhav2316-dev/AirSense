import React from 'react';

export const TrustSection: React.FC = () => {
  return (
    <section id="science" className="bg-white pb-12 pt-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Rounded Science & Trust Strip */}
        <div className="rounded-2xl bg-[#F1F4F9] border border-slate-200/70 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          {/* Left Copy */}
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#0F172A] tracking-tight">
              Grounded in science. Built for your health.
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 font-sans">
              We follow WHO &amp; EPA air quality guidelines.
            </p>
          </div>

          {/* Right Authority Badges (WHO & EPA) */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 self-stretch md:self-auto justify-start md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
            
            {/* World Health Organization Badge */}
            <div className="flex items-center gap-2.5">
              {/* WHO Emblem SVG */}
              <svg className="w-8 h-8 text-[#008DC9] shrink-0" viewBox="0 0 40 40" fill="currentColor">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 6 C12.3 6 6 12.3 6 20 C6 27.7 12.3 34 20 34 C27.7 34 34 27.7 34 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="20" cy="20" rx="9" ry="17" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="6" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="1.2" />
                <line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1" />
                <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="1" />
                {/* Rod & Snake symbol */}
                <line x1="20" y1="8" x2="20" y2="32" stroke="#008DC9" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 14 Q23 16 17 21 Q23 25 18 29" fill="none" stroke="#008DC9" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs leading-tight text-[#0F172A]">
                  World Health
                </span>
                <span className="font-sans text-[11px] font-medium leading-tight text-slate-600">
                  Organization
                </span>
              </div>
            </div>

            {/* EPA Badge */}
            <div className="flex items-center gap-2.5">
              {/* EPA Flower / Seal Emblem SVG */}
              <svg className="w-8 h-8 text-[#005EA2] shrink-0" viewBox="0 0 40 40" fill="currentColor">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 9 C15 15 15 25 20 31 C25 25 25 15 20 9 Z" fill="currentColor" opacity="0.8" />
                <path d="M9 20 C15 15 25 15 31 20 C25 25 15 25 9 20 Z" fill="currentColor" opacity="0.6" />
                <circle cx="20" cy="20" r="4" fill="#005EA2" />
              </svg>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm leading-tight text-[#0F172A] tracking-wider">
                  EPA
                </span>
                <span className="font-sans text-[9px] font-medium text-slate-500 leading-tight">
                  United States<br />Environmental Protection Agency
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
