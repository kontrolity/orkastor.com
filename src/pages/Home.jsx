import React from 'react';
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import LogoBar from '@/components/landing/LogoBar';
import IntegrationsSection from '@/components/landing/IntegrationsSection';
import KubeGrafSection from '@/components/landing/KubeGrafSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import SafeFixWorkflow from '@/components/landing/SafeFixWorkflow';
import TestimonialSection from '@/components/landing/TestimonialSection';
import ModularPlatformSection from '@/components/landing/ModularPlatformSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#131316' }}>
      <NavBar />
      <HeroSection />
      <LogoBar />
      <IntegrationsSection />
      <KubeGrafSection />
      <FeaturesGrid />
      <SafeFixWorkflow />
      <TestimonialSection />
      <ModularPlatformSection />
      <CTASection />
      <Footer />
    </div>
  );
}
