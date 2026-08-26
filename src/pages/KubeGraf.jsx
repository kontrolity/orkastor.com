import React, { Suspense, lazy } from 'react';
import Nav from '@/components/home/Nav';
import Hero from '@/components/home/Hero';
import Integrations from '@/components/home/Integrations';
import StatsBar from '@/components/home/StatsBar';

/**
 * /kubegraf — the KubeGraf argument, moved off the home page intact.
 *
 * ── THIS IS A MOVE, NOT A REWRITE ───────────────────────────────────────────
 *
 * Every section here was the home page's, in this order, and none of it was
 * touched. That is deliberate: the copy, the demo and the section order were
 * already good, and rewriting them while relocating them would have made a
 * layout change indistinguishable from a content change if either turned out
 * wrong.
 *
 * The anchors survive too. `/#features`, `/#security` and `/#platform` were in
 * the old nav, so anything that linked them now wants `/kubegraf#features` — the
 * ids are unchanged, so those links keep resolving on this page.
 *
 * ── WHY THIS PAGE EXISTS AT ALL, GIVEN kubegraf.io ──────────────────────────
 *
 * KubeGraf has its own site, and the product cards send a decided visitor
 * straight there. This page is for the undecided one: someone on the parent site
 * comparing two products should be able to read about both WITHOUT leaving, and
 * a cross-domain jump mid-comparison loses them.
 *
 * So the CTA at the bottom is kubegraf.io. This page's job is to finish the
 * argument and hand over, not to be a second product site.
 */

const DeepDive = lazy(() => import('@/components/home/DeepDive'));
const Features = lazy(() => import('@/components/home/Features'));
const HowItWorks = lazy(() => import('@/components/home/HowItWorks'));
const Security = lazy(() => import('@/components/home/Security'));
const Platform = lazy(() => import('@/components/home/Platform'));
const Faq = lazy(() => import('@/components/home/Faq'));
const CTA = lazy(() => import('@/components/home/CTA'));
const Footer = lazy(() => import('@/components/home/Footer'));

export default function KubeGraf() {
  return (
    <div className="lp min-h-screen">
      {/* No onDark — this page opens on the cream KubeGraf hero, not the navy one. */}
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
