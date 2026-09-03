import React from 'react';
import { Link } from 'react-router-dom';
import { Wind } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-deepAtmosphere text-mistWhite border-t border-slateInk/20 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-clearSky/20 text-clearSky flex items-center justify-center border border-clearSky/30">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl text-mistWhite tracking-tight">
                AirSense
              </span>
            </div>
            <p className="text-xs text-slateInk leading-relaxed font-sans max-w-sm">
              AI-powered air-quality health guidance grounded in peer-reviewed WHO and EPA environmental guidelines.
            </p>
          </div>

          {/* Nav Links Columns (md:col-span-7) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6 text-xs">
            {/* Product */}
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-mistWhite uppercase tracking-wider text-[11px]">
                Product
              </h4>
              <ul className="space-y-2 text-slateInk font-sans">
                <li>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-mistWhite transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:text-mistWhite transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="hover:text-mistWhite transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-mistWhite uppercase tracking-wider text-[11px]">
                Company
              </h4>
              <ul className="space-y-2 text-slateInk font-sans">
                <li>
                  <button
                    onClick={() => scrollToSection('science')}
                    className="hover:text-mistWhite transition-colors cursor-pointer"
                  >
                    About Science
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-mistWhite transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-mistWhite transition-colors">
                    Register Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-mistWhite uppercase tracking-wider text-[11px]">
                Legal
              </h4>
              <ul className="space-y-2 text-slateInk font-sans">
                <li>
                  <span className="hover:text-mistWhite transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="hover:text-mistWhite transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slateInk/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slateInk font-mono">
          <p>© {currentYear} AirSense. All rights reserved.</p>
          <p className="text-[11px] font-sans">Grounded Health Reasoning Engine</p>
        </div>
      </div>
    </footer>
  );
};
