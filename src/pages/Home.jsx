import React from 'react';
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import KubeGrafSection from '@/components/landing/KubeGrafSection';
import SafeFixWorkflow from '@/components/landing/SafeFixWorkflow';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import ModularPlatformSection from '@/components/landing/ModularPlatformSection';
import IntegrationsSection from '@/components/landing/IntegrationsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <HeroSection />
      <IntegrationsSection />
      <KubeGrafSection />
      <FeaturesGrid />
      <SafeFixWorkflow />
      <ModularPlatformSection />
      <CTASection />
      <Footer />
    </div>
  );
}
