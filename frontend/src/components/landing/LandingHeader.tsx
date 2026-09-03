import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo: Constellation particle mark + AirSense */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Particle Constellation Icon SVG matching page_1_landing.png */}
          <div className="w-8 h-8 flex items-center justify-center relative">
            <svg
              className="w-7 h-7 text-[#1D4ED8]"
              viewBox="0 0 32 32"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer orbit / cluster dots */}
              <circle cx="16" cy="4" r="2.2" fill="#2563EB" />
              <circle cx="25" cy="8" r="1.8" fill="#3B82F6" />
              <circle cx="28" cy="16" r="2.4" fill="#1D4ED8" />
              <circle cx="24" cy="24" r="1.8" fill="#60A5FA" />
              <circle cx="16" cy="28" r="2.2" fill="#2563EB" />
              <circle cx="8" cy="24" r="1.8" fill="#3B82F6" />
              <circle cx="4" cy="16" r="2.4" fill="#1D4ED8" />
              <circle cx="7" cy="8" r="1.8" fill="#60A5FA" />
              {/* Inner ring dots */}
              <circle cx="16" cy="10" r="1.6" fill="#1E40AF" />
              <circle cx="21" cy="13" r="1.5" fill="#2563EB" />
              <circle cx="21" cy="19" r="1.6" fill="#3B82F6" />
              <circle cx="16" cy="22" r="1.5" fill="#1E40AF" />
              <circle cx="11" cy="19" r="1.5" fill="#2563EB" />
              <circle cx="11" cy="13" r="1.6" fill="#3B82F6" />
              {/* Center core */}
              <circle cx="16" cy="16" r="2.6" fill="#1D4ED8" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-[#0B1220] tracking-tight">
            AirSense
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-slate-600">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#0B1220] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#0B1220] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('science')}
            className="hover:text-[#0B1220] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="hover:text-[#0B1220] transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/signup')}
            className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all duration-150 cursor-pointer active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100/80 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-200/60 mt-3 space-y-2">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-600 px-2">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('science')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900"
            >
              About
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/signup');
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900"
            >
              Pricing
            </button>
          </nav>
          <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2 px-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full text-slate-700 bg-white border border-slate-200 text-sm font-medium py-2 rounded-xl text-center"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/signup');
              }}
              className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold py-2 rounded-xl text-center"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
