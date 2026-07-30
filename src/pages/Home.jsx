import React, { Suspense, lazy } from 'react';
import Nav from '@/components/home/Nav';
import Hero from '@/components/home/Hero';
import Integrations from '@/components/home/Integrations';
import StatsBar from '@/components/home/StatsBar';

// Below-the-fold sections are code-split so the hero paints with a small bundle.
const DeepDive = lazy(() => import('@/components/home/DeepDive'));
const Features = lazy(() => import('@/components/home/Features'));
const HowItWorks = lazy(() => import('@/components/home/HowItWorks'));
const Security = lazy(() => import('@/components/home/Security'));
const Testimonials = lazy(() => import('@/components/home/Testimonials'));
const Platform = lazy(() => import('@/components/home/Platform'));
const Faq = lazy(() => import('@/components/home/Faq'));
const CTA = lazy(() => import('@/components/home/CTA'));
const Footer = lazy(() => import('@/components/home/Footer'));

export default function Home() {
  return (
    <div className="lp min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <StatsBar />
        <Suspense fallback={null}>
          <DeepDive />
          <Features />
          <HowItWorks />
          <Security />
          <Testimonials />
          <Platform />
          <Faq />
          <CTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
