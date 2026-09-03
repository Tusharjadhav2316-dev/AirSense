import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../../components';

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
    <header className="sticky top-0 z-30 bg-mistWhite/90 backdrop-blur-md border-b border-slateInk/15 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-clearSky/15 border border-clearSky/30 flex items-center justify-center text-clearSky group-hover:bg-clearSky/25 transition-colors shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-xl text-deepAtmosphere tracking-tight block leading-none">
              AirSense
            </span>
            <span className="text-[10px] text-slateInk font-sans block mt-0.5">
              AI Health Reasoning
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slateInk">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-deepAtmosphere transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-deepAtmosphere transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('science')}
            className="hover:text-deepAtmosphere transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-deepAtmosphere transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Desktop Auth Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-slateInk/20 text-deepAtmosphere hover:bg-mistWhite cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-slateInk/15 mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slateInk px-2">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-lg hover:bg-mistWhite hover:text-deepAtmosphere"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left px-3 py-2 rounded-lg hover:bg-mistWhite hover:text-deepAtmosphere"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('science')}
              className="text-left px-3 py-2 rounded-lg hover:bg-mistWhite hover:text-deepAtmosphere"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left px-3 py-2 rounded-lg hover:bg-mistWhite hover:text-deepAtmosphere"
            >
              Pricing
            </button>
          </nav>
          <div className="pt-2 border-t border-slateInk/10 flex flex-col gap-2 px-2">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/signup');
              }}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
