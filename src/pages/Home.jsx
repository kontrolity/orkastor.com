import React, { Suspense, lazy } from 'react';
import Nav from '@/components/home/Nav';
import UmbrellaHero from '@/components/home/UmbrellaHero';
import ProductSplit from '@/components/home/ProductSplit';

/**
 * orkastor.com — the PARENT page.
 *
 * ── WHAT CHANGED AND WHY ────────────────────────────────────────────────────
 *
 * This page was the KubeGraf landing page. Its hero was "Kubernetes that heals
 * itself" over a SafeFix terminal, then Features / HowItWorks / Security /
 * Platform — all KubeGraf's argument — and Orkastor Cloud appeared near the
 * bottom as a three-fact callout.
 *
 * That is the right page for kubegraf.io and the wrong one for orkastor.com. A
 * visitor sent to the company site to find out what the company does met a pitch
 * for one of the two things it sells, and had to scroll past all of it to learn
 * the other exists.
 *
 * The KubeGraf argument is NOT deleted. It moved to /kubegraf whole — same
 * sections, same order, same components. Nothing was rewritten to make this
 * change, which is why it is a re-composition rather than a rebuild.
 *
 * ── THE ORDER IS THE ARGUMENT ───────────────────────────────────────────────
 *
 *   1. UmbrellaHero   what Orkastor is, and that there are two products
 *   2. ProductSplit   the two, at equal weight, with honest status on each
 *   3. HowTheyRelate  what they share and what stays separate
 *   4. Security       one posture, both products — a parent-level claim
 *   5. CTA / Footer
 *
 * Security stays on this page and Platform does not, and that is the dividing
 * line: "how we handle your data" is a company answer a visitor wants before
 * choosing either product. "One engine, a family of agents" is KubeGraf's
 * architecture, so it went with KubeGraf.
 *
 * Hero and split are EAGER; everything else is split. Those two are the whole
 * point of the page, and a visitor who bounces should still have seen both
 * products.
 */

const HowTheyRelate = lazy(() => import('@/components/home/HowTheyRelate'));
const Security = lazy(() => import('@/components/home/Security'));
const CTA = lazy(() => import('@/components/home/CTA'));
const Footer = lazy(() => import('@/components/home/Footer'));

export default function Home() {
  return (
    <div className="lp min-h-screen">
      {/* onDark: the hero below is navy, so the transparent nav has to invert. */}
      <Nav onDark />
      <main>
        <UmbrellaHero />
        <ProductSplit />
        <Suspense fallback={null}>
          <HowTheyRelate />
          <Security />
          <CTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
