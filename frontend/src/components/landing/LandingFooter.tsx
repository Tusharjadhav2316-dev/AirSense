import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B1220] text-slate-400 py-4 sm:py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Left: Copyright */}
        <div className="font-sans text-slate-300">
          <span>© 2025 AirSense</span>
        </div>

        {/* Center: Legal / Company Links */}
        <div className="flex items-center gap-6 font-medium text-slate-300">
          <button
            onClick={() => {}}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => {}}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms
          </button>
          <button
            onClick={() => {}}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* Right: Social Media Icons (SVG) */}
        <div className="flex items-center gap-4 text-slate-300">
          {/* Twitter / X */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors p-1"
            aria-label="Twitter"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors p-1"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.88 0-1.6.72-1.6 1.6 0 .89.72 1.6 1.6 1.6.89 0 1.6-.71 1.6-1.6 0-.88-.71-1.6-1.6-1.6z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors p-1"
            aria-label="YouTube"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
};
