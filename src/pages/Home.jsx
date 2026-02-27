import React from 'react';
import AnnouncementBanner from '@/components/landing/AnnouncementBanner';
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import LogoBar from '@/components/landing/LogoBar';
import StatsStrip from '@/components/landing/StatsStrip';
import FeatureTabs from '@/components/landing/FeatureTabs';
import IntegrationsSection from '@/components/landing/IntegrationsSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import SafeFixWorkflow from '@/components/landing/SafeFixWorkflow';
import TestimonialSection from '@/components/landing/TestimonialSection';
import ModularPlatformSection from '@/components/landing/ModularPlatformSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#131316' }}>
      <AnnouncementBanner />
      <NavBar />
      <HeroSection />
      <LogoBar />
      <StatsStrip />
      <FeatureTabs />
      <IntegrationsSection />
      <FeaturesGrid />
      <SafeFixWorkflow />
      <TestimonialSection />
      <ModularPlatformSection />
      <CTASection />
      <Footer />
    </div>
  );
}
