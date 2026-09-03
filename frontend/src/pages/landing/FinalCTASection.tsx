import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../components';

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-mistWhite relative overflow-hidden border-b border-slateInk/15">
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clearSky/10 border border-clearSky/25 text-clearSky text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>START PROTECTING YOUR HEALTH TODAY</span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-deepAtmosphere tracking-tight">
          Know what your air means for you.
        </h2>

        <p className="text-slateInk text-base sm:text-lg max-w-xl mx-auto font-sans leading-relaxed">
          Turn raw air-quality numbers into clear, practical decisions for your day grounded in established medical guidelines.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn How It Works
          </Button>
        </div>
      </div>
    </section>
  );
};
