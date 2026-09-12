import React, { Suspense, lazy } from 'react';
import { Navbar } from '@/components/ork/nav/Navbar';
import { CursorLight, ScrollProgress } from '@/components/ork/motion/Effects';
import { Hero } from '@/components/ork/product/Hero';
import { ProductCards } from '@/components/ork/product/ProductCards';
import { Container, Section, SectionHead, Panel, Button, Arrow } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { COMPANY } from '@/content/site';
import { useSeo } from '@/hooks/useSeo';

const Outcomes = lazy(() => import('@/components/ork/product/Proof').then((m) => ({ default: m.Outcomes })));
const Testimonials = lazy(() => import('@/components/ork/product/Proof').then((m) => ({ default: m.Testimonials })));
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
 * ── SO THIS PAGE NOW ANSWERS FOUR QUESTIONS, IN ORDER ───────────────────────
 *
 *   1. Hero          what is Orkastor, and which of the two do I want
 *   2. ProductCards  what are the two things, precisely
 *   3. Outcomes      what changes for me
 *   4. Testimonials  what did it change for them
 *   5. Boundary      one short company-level idea, no diagram
 *   6. FinalCTA      pick a side
 *
 * The technical argument is one click away in both directions and nothing was
 * deleted to get here — the diagrams moved, they did not go.
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
      'the clusters you already run. Domineta provides ephemeral environments with a real ' +
      'kernel boundary.',
    canonical: 'https://www.orkastor.com/',
    image: 'https://www.orkastor.com/og-image.png',
  });

  return (
    <div className="ork min-h-screen relative">
      <CursorLight />
      <ScrollProgress />
      <Navbar onDeep />

      {/* ── THE FRAME ────────────────────────────────────────────────────
          .ork-frame and .ork-rule were written into styles/mono.css when the
          language landed and then never applied to anything. The stylesheet
          calls the frame "what makes the reference read as a document rather
          than as a stack of cards", and that is the single most identifying
          structural thing about the sites this language was taken from — a
          hairline running the height of the page, with sections divided by
          rules instead of by changes of ground.

          Wiring it up is the whole of this change. Nothing new was invented
          and no claim was added; the language already specified this and the
          page simply was not using it. */}
      <main className="ork-frame">
        <Hero />
        <div className="ork-rule" />
        <ProductCards />

        <div className="ork-rule" />
        <Suspense fallback={null}>
          <Outcomes />
          <div className="ork-rule" />
          <Testimonials />
        </Suspense>

        {/* The company-level idea, said in words. This was a full section with a
            diagram; on a landing page one paragraph and two lines carries it, and
            the diagram is on both product pages for anyone who wants it. */}
        <div className="ork-rule" />
        <Section tone="deep" id="boundary">
          <Container wide>
            <Reveal>
              <SectionHead
                onDeep
                eyebrow="One company, two products"
                title="Everything we build sits on one line."
                sub={COMPANY.boundary}
              />
            </Reveal>
            <Reveal delay={80}>
              <div className="grid md:grid-cols-2 gap-4 mt-11 ork-depth">
                {[
                  { side: 'Your infrastructure', name: 'KubeGraf', body: 'An agent you install, in a cluster you own. We never hold your credentials.', accent: 'var(--kg-text)', line: 'rgba(255,138,61,0.34)', href: '/kubegraf' },
                  { side: 'Our infrastructure', name: 'Domineta', body: 'Metal we operate, kernels we boot, environments we destroy on a TTL.', accent: 'var(--cloud-text)', line: 'rgba(72,203,203,0.34)', href: '/cloud' },
                ].map((c) => (
                  <a key={c.side} href={c.href} className="block ork-depth-item" style={{ border: `1px solid ${c.line}`, borderRadius: 'var(--radius-lg)', padding: 26 }}>
                    <p className="ork-micro" style={{ color: c.accent, marginBottom: 10 }}>{c.side}</p>
                    <p className="ork-heading" style={{ color: 'var(--deep-ink)', marginBottom: 8 }}>{c.name}</p>
                    <p className="ork-body" style={{ color: 'var(--deep-ink-muted)' }}>{c.body}</p>
                    <p className="ork-small mt-4" style={{ color: c.accent }}>See how it works →</p>
                  </a>
                ))}
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="ork-small mt-8" style={{ color: 'var(--deep-ink-muted)', maxWidth: 720 }}>{COMPANY.notYet}</p>
            </Reveal>
          </Container>
        </Section>

        <div className="ork-rule" />
        <Suspense fallback={null}><FinalCTA /></Suspense>
      </main>

      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
}
