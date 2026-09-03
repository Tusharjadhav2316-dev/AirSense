import React from 'react';
import {
  LandingHeader,
  LandingHero,
  HowItWorksSection,
  TrustSection,
  LandingFooter,
} from '../components/landing';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B1220] flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Global Navigation */}
      <LandingHeader />

      {/* Main Marketing Page Content */}
      <main className="flex-1">
        {/* 2. Hero Section with Live Example & Atmospheric Landscape */}
        <LandingHero />

        {/* 3. How AirSense Works (3-Step Loop) */}
        <HowItWorksSection />

        {/* 4. Science / Trust Strip (WHO & EPA Grounding) */}
        <TrustSection />
      </main>

      {/* 5. Deep Atmosphere Footer */}
      <LandingFooter />
    </div>
  );
};
