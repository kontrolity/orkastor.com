import React, { Suspense, lazy } from 'react';
import { Navbar } from '@/components/ork/nav/Navbar';
import { CursorLight, ScrollProgress } from '@/components/ork/motion/Effects';
import { Hero } from '@/components/ork/product/Hero';
import { ProductCards } from '@/components/ork/product/ProductCards';
import { useSeo } from '@/hooks/useSeo';

const Outcomes = lazy(() => import('@/components/ork/product/Proof').then((m) => ({ default: m.Outcomes })));
const FinalCTA = lazy(() => import('@/components/ork/product/FinalCTA'));
const Footer = lazy(() => import('@/components/ork/layout/Footer'));

/**
 * orkastor.com — the LANDING page.
 *
 * ── WHAT THIS PAGE USED TO BE, AND WHY IT CHANGED ───────────────────────────
 *
 * The first version of this redesign put nine deep technical sections here: an
 * animated cluster incident, the multi-agent roster, the AI security path, the
 * draggable microVM comparison, the environment lifecycle, use cases, limits and
 * a philosophy section. Each was accurate and each is still on the site.
 *
 * They were on the wrong page. All of it also exists on /kubegraf and /cloud,
 * so the landing page was a duplicate of both product pages stacked together —
 * ~9,200px of architecture aimed at somebody who had not yet decided they cared.
 * A landing page's job is to make a visitor want the depth, then send them to it.
 *
 * ── SO THIS PAGE NOW ANSWERS THREE QUESTIONS, IN ORDER ──────────────────────
 *
 *   1. Hero          what is Orkastor
 *   2. ProductCards  what the product is, precisely
 *   3. Outcomes      what changes for me
 *   4. FinalCTA      start
 *
 * It used to answer six. Two sections have since gone and the comment is
 * updated rather than left describing a page that no longer exists:
 *
 *   Testimonials  the three founder quotes, removed by request. The
 *                 component and content/proof.js are untouched.
 *   Boundary      "One company, two products" — its premise was the
 *                 KubeGraf / Domineta split, and Domineta is unlisted.
 *
 * The first two questions also lost their plural: the hero used to ask which
 * of the two products you wanted.
 *
 * ── ON THE PROOF ────────────────────────────────────────────────────────────
 *
 * The logos and quotes are KubeGraf's, published on kubegraf.io, attributed to
 * named people at named companies. They are labelled as KubeGraf's rather than
 * "our customers", because Domineta is invitation-only and has none.
 * See src/content/proof.js for what was deliberately left out.
 */
export default function OrkHome() {
  useSeo({
    title: 'Orkastor — Infrastructure for teams who run Kubernetes',
    description:
      'Orkastor builds infrastructure software for Kubernetes teams. KubeGraf is an AI SRE for ' +
      'the clusters you already run — it detects the incident, finds the root cause, and ' +
      'ships the fix.',
    canonical: 'https://www.orkastor.com/',
    image: 'https://www.orkastor.com/og-image.png',
  });

  return (
    <div className="ork min-h-screen relative">
      <CursorLight />
      <ScrollProgress />
      <Navbar onDeep />

      {/* ── HOW THIS PAGE DIVIDES ─────────────────────────────────────────
          The side frame is off here (it is still on the sub-pages). Every
          section boundary is a .ork-seam hairline, including the one above
          <FinalCTA />.

          ⚠ That last one is easy to get wrong, and was: --deep-bg looks like
          a dark panel, so a rule above it reads as redundant. It is NOT dark
          here. In the light token block --deep-bg resolves to var(--bg) and
          --deep-ink to var(--text), so the "deep" sections are plain white
          like everything else and need the hairline exactly as much as the
          others do. Check what the token resolves to, not what it is called.

          With the site forced to light (see App.jsx) every ground on the page
          is #FFFFFF, so these hairlines are the only thing giving the page
          structure. .ork-seam still goes transparent under `.dark`, which is
          now unreachable but kept with the rest of the dark tokens. */}
      <main>
        <Hero />
        <div className="ork-seam" />
        <ProductCards />

        {/* <Testimonials /> followed <Outcomes /> here — the three founder
            quotes from Finden, Neufology and Grovyn. Removed from this page.

            The component and its content (content/proof.js) are untouched, so
            restoring it is re-adding the one line. Note the quotes are
            KubeGraf's customers, published on kubegraf.io, and proof.js
            records that provenance — anywhere they are reused, that
            attribution has to travel with them. */}
        <div className="ork-seam" />
        <Suspense fallback={null}>
          <Outcomes />
        </Suspense>

        {/* The "One company, two products" section was here. Its entire
            premise was the KubeGraf / Domineta split — the eyebrow, the
            headline ("Everything we build sits on one line"), the paired
            cards and the closing note about what KubeGraf does not watch yet
            were all about the relationship between the two. With Domineta
            unlisted there is no relationship left to explain, and a section
            arguing a boundary with one side reads as a page missing half its
            content. COMPANY.boundary / shared / separate / notYet stay in
            content/site.js — /about still reads them. */}
        <div className="ork-seam" />
        <Suspense fallback={null}><FinalCTA /></Suspense>
      </main>

      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
}
