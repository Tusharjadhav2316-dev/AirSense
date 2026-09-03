import React from 'react';
import { Database, BrainCircuit, ShieldCheck } from 'lucide-react';
import { Card } from '../../components';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 'STEP 01',
      title: 'REAL-TIME DATA',
      description:
        'We aggregate real-time atmospheric information from trusted global sensors, satellite models, and live weather telemetry.',
      icon: Database,
      badgeColor: 'text-clearSky bg-clearSky/10 border-clearSky/20',
    },
    {
      step: 'STEP 02',
      title: 'GROUNDED AI REASONING',
      description:
        'AirSense interprets atmospheric conditions using peer-reviewed WHO and EPA health criteria combined with your personal health profile.',
      icon: BrainCircuit,
      badgeColor: 'text-hazyAmber bg-hazyAmber/10 border-hazyAmber/20',
    },
    {
      step: 'STEP 03',
      title: 'PERSONALIZED ACTION',
      description:
        'You receive clear, practical recommendations explaining what your air means for your day and what specific actions to take.',
      icon: ShieldCheck,
      badgeColor: 'text-clearSky bg-clearSky/10 border-clearSky/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-mistWhite border-b border-slateInk/15">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-clearSky">
            The Product Loop
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-deepAtmosphere tracking-tight">
            How AirSense Works
          </h2>
          <p className="text-slateInk text-sm sm:text-base font-sans leading-relaxed">
            AirSense converts raw atmospheric pollution measurements into grounded, personalized health guidance.
          </p>
        </div>

        {/* 3 Step Cards: DATA → REASONING → ACTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                variant="light"
                className="p-6 md:p-8 hover:shadow-md transition-all duration-200 border-slateInk/15 bg-white relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-slateInk tracking-wider">
                      {item.step}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${item.badgeColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-deepAtmosphere mb-3 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slateInk font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slateInk/10 flex items-center justify-between text-[11px] font-mono text-slateInk">
                  <span>Phase {idx + 1} of 3</span>
                  <span className="text-clearSky font-medium font-sans">Data → Action</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
