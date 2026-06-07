import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { WaitlistProvider } from '@/components/landing/WaitlistModal';
import AnnouncementBanner from '@/components/landing/AnnouncementBanner';
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import LogoBar from '@/components/landing/LogoBar';
import StatsStrip from '@/components/landing/StatsStrip';

// Below-the-fold sections are code-split so the hero paints with a tiny initial
// bundle. Each section's JS only downloads when it nears the viewport.
const FeatureTabs = lazy(() => import('@/components/landing/FeatureTabs'));
const IntegrationsSection = lazy(() => import('@/components/landing/IntegrationsSection'));
const FeaturesGrid = lazy(() => import('@/components/landing/FeaturesGrid'));
const SafeFixWorkflow = lazy(() => import('@/components/landing/SafeFixWorkflow'));
const TestimonialSection = lazy(() => import('@/components/landing/TestimonialSection'));
const ModularPlatformSection = lazy(() => import('@/components/landing/ModularPlatformSection'));
const CTASection = lazy(() => import('@/components/landing/CTASection'));
const Footer = lazy(() => import('@/components/landing/Footer'));

/**
 * Reveal — defers mounting (and therefore the lazy JS chunk download) until the
 * section nears the viewport, then fades + lifts it in. Gives a fast first paint
 * plus a smooth scroll-reveal. Respects prefers-reduced-motion.
 */
function Reveal({ children, minHeight = 320 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          // next frame so the fade-in transition actually runs
          requestAnimationFrame(() => setVisible(reduce ? true : true));
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' } // start loading well before it's on screen
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        minHeight: shown ? undefined : minHeight,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
        transition: 'opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {shown && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  );
}

export default function Home() {
  return (
    <WaitlistProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#131316' }}>
        {/* Above the fold — eager for instant paint */}
        <AnnouncementBanner />
        <NavBar />
        <HeroSection />
        <LogoBar />
        <StatsStrip />

        {/* Below the fold — code-split + revealed on scroll */}
        <Reveal><FeatureTabs /></Reveal>
        <Reveal><IntegrationsSection /></Reveal>
        <Reveal><FeaturesGrid /></Reveal>
        <Reveal><SafeFixWorkflow /></Reveal>
        <Reveal><TestimonialSection /></Reveal>
        <Reveal><ModularPlatformSection /></Reveal>
        <Reveal><CTASection /></Reveal>
        <Reveal minHeight={200}><Footer /></Reveal>
      </div>
    </WaitlistProvider>
  );
}
