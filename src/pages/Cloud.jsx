import React, { Suspense, lazy, useEffect } from 'react';
import Nav from '@/components/home/Nav';
import CloudHero from '@/components/cloud/CloudHero';

// The hero (and the figure inside it) is eager; everything below the fold is
// code-split, matching how the KubeGraf landing page is composed.
const ProblemSection = lazy(() => import('@/components/cloud/ProblemSection'));
const WhatYouGet = lazy(() => import('@/components/cloud/WhatYouGet'));
const CloudSteps = lazy(() => import('@/components/cloud/CloudSteps'));
const IsolationSection = lazy(() => import('@/components/cloud/IsolationSection'));
const NonGoals = lazy(() => import('@/components/cloud/NonGoals'));
const KubeGrafLink = lazy(() => import('@/components/cloud/KubeGrafLink'));
const WaitlistSection = lazy(() => import('@/components/cloud/WaitlistSection'));
const Footer = lazy(() => import('@/components/home/Footer'));

export default function Cloud() {
  useEffect(() => {
    document.title = 'Domineta — managed lower environments for dev and test';
  }, []);

  return (
    <div className="lp min-h-screen">
      {/* First focusable element: the nav is fixed, so keyboard users need a way
          past it into the content. */}
      <a href="#main" className="lp-skip">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <CloudHero />
        <Suspense fallback={null}>
          <ProblemSection />
          <WhatYouGet />
          <CloudSteps />
          <IsolationSection />
          <NonGoals />
          <KubeGrafLink />
          <WaitlistSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
