import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Frown } from 'lucide-react';
import landscapeImg from '../../assets/landscape.jpg';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF6F0] to-[#EBF3FA] pt-8 sm:pt-12 md:pt-16 pb-0">
      
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[350px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-[400px] h-[300px] bg-blue-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two Column Grid: Left Hero Copy (~60%) / Right Live Example Card (~40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pb-8 sm:pb-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Primary Editorial Headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[54px] text-[#0F172A] leading-[1.08] tracking-tight">
              Better air decisions.<br />
              Better health.
            </h1>

            {/* Supporting Copy */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-sans">
              AI-powered guidance that turns real air quality data into personalized health advice, grounded in WHO &amp; EPA guidelines.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
              >
                Try AirSense Free
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-semibold text-sm sm:text-base px-5 py-3 rounded-xl shadow-2xs flex items-center gap-2 transition-all duration-150 cursor-pointer active:scale-95"
              >
                <span>See How It Works</span>
                <PlayCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN — LIVE EXAMPLE CARD */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-7 space-y-4">
              
              {/* Badge */}
              <div>
                <span className="inline-block bg-[#FDF3E7] text-[#9A6B38] font-bold text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-md font-sans">
                  LIVE EXAMPLE
                </span>
              </div>

              {/* Main Reasoning Headline */}
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F172A] leading-snug tracking-tight">
                Air quality is{' '}
                <span className="text-[#EA580C] font-bold">unsafe</span> for outdoor exercise right now.
              </h2>

              {/* Explanation */}
              <p className="text-slate-600 text-xs sm:text-sm font-sans leading-relaxed">
                Fine particles are high and can irritate your lungs.
              </p>

              {/* Why this advice block */}
              <div className="pt-1">
                <span className="block text-xs font-bold text-slate-900 font-sans">
                  Why this advice?
                </span>
                <span className="block text-xs text-slate-500 font-sans mt-0.5">
                  PM2.5 is 3.1x above WHO daily guideline.
                </span>
              </div>

              {/* Bottom Evidence Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 font-sans">AQI</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#EA580C] tracking-tight leading-none">
                    168
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans ml-1">
                    Unhealthy
                  </span>
                </div>

                <div className="w-7 h-7 rounded-full bg-red-50 text-[#EA580C] flex items-center justify-center">
                  <Frown className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Atmospheric Landscape Visual Band (Rolls into white section) */}
      <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 overflow-hidden mt-2">
        <img
          src={landscapeImg}
          alt="Atmospheric landscape showing green hills, wind turbines, and city skyline"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft top and bottom fade masks for seamless integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBF3FA]/30 via-transparent to-transparent" />
      </div>

    </section>
  );
};
