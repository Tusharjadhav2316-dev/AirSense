import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Real-time data',
      description: 'We aggregate data from trusted atmospheric models and satellites.',
    },
    {
      num: 2,
      title: 'AI reasoning',
      description: 'Our AI interprets air quality using WHO & EPA guidelines and your health profile.',
    },
    {
      num: 3,
      title: 'Personalized action',
      description: 'You get clear, practical recommendations to protect your health.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-white pt-6 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Centered Heading */}
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0B1220] tracking-tight">
            How AirSense Works
          </h2>
        </div>

        {/* 3 Horizontal Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-2">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-3.5">
              {/* Numbered circular badge */}
              <div className="w-8 h-8 rounded-full bg-[#E0EDFF] text-[#1D4ED8] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 select-none font-sans">
                {step.num}
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-[#0F172A] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13.5px] text-slate-600 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
