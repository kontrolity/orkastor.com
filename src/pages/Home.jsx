import React from 'react';
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import WhatIsAISRE from '@/components/landing/WhatIsAISRE';
import SafeFixWorkflow from '@/components/landing/SafeFixWorkflow';
import CLIExamples from '@/components/landing/CLIExamples';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import BenefitsSection from '@/components/landing/BenefitsSection';
import IntegrationsSection from '@/components/landing/IntegrationsSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <HeroSection />
      <WhatIsAISRE />
      <SafeFixWorkflow />
      <CLIExamples />
      <FeaturesGrid />
      <BenefitsSection />
      <IntegrationsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
