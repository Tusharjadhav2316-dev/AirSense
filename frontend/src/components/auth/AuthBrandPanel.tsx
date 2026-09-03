import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Lock } from 'lucide-react';
import authLandscape from '../../assets/auth_landscape.jpg';

export const AuthBrandPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#0B1426] text-white flex flex-col justify-between overflow-hidden p-6 sm:p-8 md:p-10 lg:p-12 min-h-[340px] md:min-h-full">
      {/* Background artwork & gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={authLandscape}
          alt="Atmospheric sunset over distant city skyline"
          className="w-full h-full object-cover object-bottom opacity-85"
        />
        {/* Top to bottom deep navy to twilight gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1426] via-[#0B1426]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Top Brand Logo */}
      <div className="relative z-10">
        <div
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Particle Constellation Icon SVG matching Phase 01 */}
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#60A5FA]"
              viewBox="0 0 32 32"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="4" r="2.2" fill="#60A5FA" />
              <circle cx="25" cy="8" r="1.8" fill="#93C5FD" />
              <circle cx="28" cy="16" r="2.4" fill="#3B82F6" />
              <circle cx="24" cy="24" r="1.8" fill="#60A5FA" />
              <circle cx="16" cy="28" r="2.2" fill="#3B82F6" />
              <circle cx="8" cy="24" r="1.8" fill="#93C5FD" />
              <circle cx="4" cy="16" r="2.4" fill="#60A5FA" />
              <circle cx="7" cy="8" r="1.8" fill="#93C5FD" />
              <circle cx="16" cy="10" r="1.6" fill="#BFDBFE" />
              <circle cx="21" cy="13" r="1.5" fill="#60A5FA" />
              <circle cx="21" cy="19" r="1.6" fill="#93C5FD" />
              <circle cx="16" cy="22" r="1.5" fill="#BFDBFE" />
              <circle cx="11" cy="19" r="1.5" fill="#60A5FA" />
              <circle cx="11" cy="13" r="1.6" fill="#93C5FD" />
              <circle cx="16" cy="16" r="2.6" fill="#60A5FA" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            AirSense
          </span>
        </div>
      </div>

      {/* Middle Content: Main Message & 3 Feature Points */}
      <div className="relative z-10 my-auto py-8 md:py-12 max-w-md space-y-6">
        
        {/* Editorial Headline */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[42px] text-white leading-[1.15] tracking-tight">
          Know what<br />
          your air<br />
          means for you.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-[15px] text-slate-300 font-sans leading-relaxed">
          Personalized insights powered by science. Grounded in WHO &amp; EPA guidelines.
        </p>

        {/* 3 Value Badges (Shown prominently on desktop, compact on mobile) */}
        <div className="space-y-3.5 pt-2">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-slate-200 font-medium">
              Science-grounded recommendations
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-slate-200 font-medium">
              Tailored to your health profile
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-slate-200 font-medium">
              Private by design
            </span>
          </div>

        </div>

      </div>

      {/* Bottom spacer for the artwork view */}
      <div className="relative z-10 pt-4 hidden md:block">
        <div className="flex items-center justify-between text-[11px] text-slate-400/90 font-mono">
          <span>AirSense AI Health Reasoning</span>
          <span>WHO &amp; EPA RAG Engine</span>
        </div>
      </div>

    </div>
  );
};
