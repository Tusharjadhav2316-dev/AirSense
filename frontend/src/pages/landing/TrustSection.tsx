import React from 'react';
import { ShieldCheck, CheckCircle2, FileText, Lock } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustItems = [
    {
      title: 'WHO Global Air Quality Guidelines 2021',
      description: 'Grounded in World Health Organization daily exposure limits and safety thresholds.',
      icon: CheckCircle2,
    },
    {
      title: 'EPA Air Quality Index Standards',
      description: 'References United States Environmental Protection Agency AQI classification criteria.',
      icon: CheckCircle2,
    },
    {
      title: 'WHO / EPA Grounded Guidance',
      description: 'Vector-indexed medical guidelines prevent AI hallucinations and ungrounded advice.',
      icon: FileText,
    },
    {
      title: 'Transparent Source Citations',
      description: 'Every recommendation includes direct citation pills linking back to scientific guidelines.',
      icon: Lock,
    },
  ];

  return (
    <section id="science" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slateInk/15">
      <div className="max-w-6xl mx-auto space-y-10 text-center">
        {/* Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clearSky/10 border border-clearSky/25 text-clearSky text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>References & Scientific Rigor</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-deepAtmosphere tracking-tight">
            Grounded in science. Built for your health.
          </h2>
          <p className="text-slateInk text-sm sm:text-base font-sans leading-relaxed">
            AirSense grounds its air-quality health guidance in established public-health guidelines and transparent data sources.
          </p>
        </div>

        {/* 4 Trust Item Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-mistWhite/80 border border-slateInk/15 flex flex-col justify-between hover:border-clearSky/30 transition-colors"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-clearSky/15 text-clearSky flex items-center justify-center mb-3 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-semibold text-sm text-deepAtmosphere mb-1.5 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slateInk font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer / Transparency Note */}
        <p className="text-[11px] text-slateInk font-mono max-w-2xl mx-auto pt-2">
          * AirSense references peer-reviewed WHO (2021) and EPA AQI guidelines via RAG retrieval for informational health reasoning and daily activity planning.
        </p>
      </div>
    </section>
  );
};
