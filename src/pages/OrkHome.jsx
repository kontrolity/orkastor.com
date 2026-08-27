import React, { Suspense, lazy } from 'react';
import { Navbar } from '@/components/ork/nav/Navbar';
import { CursorLight, ScrollProgress } from '@/components/ork/motion/Effects';
import { Hero } from '@/components/ork/product/Hero';
import { ProductCards } from '@/components/ork/product/ProductCards';
import { Container, Section, SectionHead, Panel } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { KernelBoundary } from '@/components/ork/visuals/KernelBoundary';
import { KubeGrafProcess, AgentNetwork, SecurityPath } from '@/components/ork/visuals/KubeGrafVisuals';
import { EnvironmentLifecycle, UseCases, Limitations } from '@/components/ork/visuals/CloudVisuals';
import { COMPANY, KUBEGRAF, CLOUD } from '@/content/site';
import { useSeo } from '@/hooks/useSeo';

const FinalCTA = lazy(() => import('@/components/ork/product/FinalCTA'));
const Footer = lazy(() => import('@/components/ork/layout/Footer'));

/**
 * orkastor.com — the company page.
 *
 * The order is the argument, and it alternates ground deliberately: deep panels
 * for the company-level beats (hero, boundary, final CTA) and light ones for the
 * product detail, so the page reads as sections of one system rather than a
 * stack of cards. `Section tone="deep"` stays dark in both themes — that is the
 * control room, and inverting it in light mode would throw away the only place
 * the brand navy lives.
 *
 * Hero and the product split are EAGER. Everything from the final CTA down is
 * split, because a visitor who bounces should still have seen both products.
 */
export default function OrkHome() {
  useSeo({
    title: 'Orkastor — Infrastructure for teams who run Kubernetes',
    description:
      'Orkastor builds infrastructure software for Kubernetes teams. KubeGraf is an AI SRE for ' +
      'the clusters you already run. Orkastor Cloud provides ephemeral environments with a real ' +
      'kernel boundary.',
    canonical: 'https://www.orkastor.com/',
    image: 'https://www.orkastor.com/og-image.png',
  });

  return (
    <div className="ork min-h-screen relative">
      <CursorLight />
      <ScrollProgress />
      <Navbar onDeep />

      <main>
        <Hero />
        <ProductCards />

        {/* ── The boundary, stated at company level ────────────────────── */}
        <Section tone="deep" id="boundary">
          <Container wide>
            <Reveal>
              <SectionHead
                onDeep
                eyebrow="The infrastructure boundary"
                title="One line runs through everything we build."
                sub={COMPANY.boundary}
              />
            </Reveal>
            <Reveal delay={80}>
              <div className="grid md:grid-cols-2 gap-4 mt-12">
                {/* `border` takes an explicit rgba, NOT `${accent}44`. Appending
                    alpha hex to a var() reference produces `var(--kg)44`, which
                    is invalid CSS — the declaration is dropped and the card
                    renders with no border at all. It looked "subtle"; it was
                    broken. */}
                {[
                  ['Your infrastructure', 'KubeGraf', 'An agent you install, in a cluster you own. We never hold your credentials.',
                    'var(--kg)', 'rgba(255,138,61,0.34)'],
                  ['Our infrastructure', 'Orkastor Cloud', 'Metal we operate, kernels we boot, environments we destroy on a TTL.',
                    'var(--cloud-bright)', 'rgba(72,203,203,0.34)'],
                ].map(([side, product, body, accent, line]) => (
                  <div key={side} style={{ border: `1px solid ${line}`, borderRadius: 'var(--radius-lg)', padding: 26 }}>
                    <p className="ork-micro" style={{ color: accent, marginBottom: 10 }}>{side}</p>
                    <p className="ork-heading" style={{ color: '#F5F8FA', marginBottom: 8 }}>{product}</p>
                    <p className="ork-body" style={{ color: 'rgba(245,248,250,0.62)' }}>{body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── KubeGraf ─────────────────────────────────────────────────── */}
        <Section id="kubegraf" tone="page">
          <Container wide>
            <Reveal>
              <SectionHead
                eyebrow="KubeGraf · your infrastructure"
                title="Detect. Diagnose. Fix. Then prove the fix landed."
                sub={KUBEGRAF.oneLine}
              />
            </Reveal>
            <Reveal delay={70}><div className="mt-12"><KubeGrafProcess /></div></Reveal>
          </Container>
        </Section>

        <Section id="agents" tone="alt">
          <Container wide>
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
              <Reveal>
                <SectionHead
                  eyebrow="Multi-agent SRE"
                  title="It does not run “an AI”. It runs a roster."
                  sub="Six specialists, and only one of them may touch your cluster — after the others have had their say. Security can veto. FinOps works independently."
                />
                <ul className="mt-8 space-y-3">
                  {KUBEGRAF.agents.map((a) => (
                    <li key={a.name} className="flex items-baseline gap-3 ork-small" style={{ color: 'var(--text-2)' }}>
                      <span className="ork-mono" style={{ color: a.name === 'SRE' ? 'var(--kg-text)' : 'var(--text-3)', minWidth: 132 }}>{a.name}</span>
                      <span>{a.note}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={80}><AgentNetwork /></Reveal>
            </div>
          </Container>
        </Section>

        <Section id="security" tone="page">
          <Container wide>
            <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
              <Reveal delay={60}><SecurityPath /></Reveal>
              <Reveal>
                <SectionHead
                  eyebrow="KubeGraf security"
                  title="Outbound only. And we say where the AI call goes."
                  sub="The agent opens no inbound ports and we store no cluster credentials. The model call does leave your environment — through our gateway, on redacted telemetry. We would rather draw that than claim it does not happen."
                />
                <ul className="mt-8 space-y-4">
                  {KUBEGRAF.security.map(([k, v]) => (
                    <li key={k}>
                      <p className="ork-small" style={{ color: 'var(--text)', fontWeight: 600 }}>{k}</p>
                      <p className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{v}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── Orkastor Cloud ───────────────────────────────────────────── */}
        <Section id="cloud" tone="alt">
          <Container wide>
            <Reveal>
              <SectionHead
                eyebrow="Orkastor Cloud · our infrastructure"
                title="A real environment. Not another namespace."
                sub={CLOUD.oneLine}
              />
            </Reveal>
            <Reveal delay={80}><div className="mt-12"><KernelBoundary /></div></Reveal>
          </Container>
        </Section>

        <Section id="lifecycle" tone="page">
          <Container wide>
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 items-center">
              <Reveal>
                <SectionHead
                  eyebrow="Lifecycle"
                  title="It appears, it serves a URL, and then it is gone."
                  sub="Every environment states its expiry. That is the product, not a limitation of it — nothing here quietly becomes a permanent bill."
                />
                <dl className="mt-8 space-y-4">
                  <div>
                    <dt className="ork-small" style={{ color: 'var(--text)', fontWeight: 600 }}>Hardware isolation</dt>
                    <dd className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{CLOUD.isolation.primary}</dd>
                  </div>
                  <div>
                    <dt className="ork-small" style={{ color: 'var(--text)', fontWeight: 600 }}>Where it differs</dt>
                    <dd className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{CLOUD.isolation.caveat}</dd>
                  </div>
                </dl>
              </Reveal>
              <Reveal delay={80}><EnvironmentLifecycle /></Reveal>
            </div>
          </Container>
        </Section>

        <Section id="use-cases" tone="alt">
          <Container wide>
            <Reveal>
              <SectionHead
                eyebrow="Where it earns its place"
                title="Environments that should not become infrastructure projects."
              />
            </Reveal>
            <Reveal delay={70}><div className="mt-11"><UseCases /></div></Reveal>
          </Container>
        </Section>

        <Section id="limits" tone="page">
          <Container wide>
            <Reveal>
              <SectionHead
                eyebrow="Honest limitations"
                title="We made the trade-offs explicit."
                sub="These are decisions, not gaps waiting to be filled. Better to know now than to find out at the wrong moment."
              />
            </Reveal>
            <Reveal delay={70}><div className="mt-11"><Limitations /></div></Reveal>
          </Container>
        </Section>

        {/* ── Company ──────────────────────────────────────────────────── */}
        <Section id="philosophy" tone="alt">
          <Container wide>
            <Reveal>
              <SectionHead eyebrow="Orkastor" title="Two products, one account, and a deliberate wall between them." />
            </Reveal>
            <div className="grid md:grid-cols-2 gap-5 mt-11">
              {/* Objects rather than mixed-type tuples: a `[string, string[][], string]`
                  literal infers as a union and then neither `.map` nor a `key`
                  typechecks. */}
              {[
                { title: 'What they share', rows: COMPANY.shared, accent: 'var(--cloud-text)' },
                { title: 'What stays separate', rows: COMPANY.separate, accent: 'var(--kg-text)' },
              ].map(({ title, rows, accent }, i) => (
                <Reveal key={title} delay={i * 70}>
                  <Panel className="p-7 h-full">
                    <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 18 }}>
                      <span style={{ color: accent }}>—</span> {title}
                    </p>
                    <dl className="space-y-5">
                      {rows.map(([k, v]) => (
                        <div key={k}>
                          <dt className="ork-small" style={{ color: 'var(--text)', fontWeight: 600 }}>{k}</dt>
                          <dd className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </Panel>
                </Reveal>
              ))}
            </div>
            <Reveal delay={140}>
              <p className="ork-small mt-8" style={{ color: 'var(--text-2)', maxWidth: 720 }}>{COMPANY.notYet}</p>
            </Reveal>
          </Container>
        </Section>

        <Suspense fallback={null}><FinalCTA /></Suspense>
      </main>

      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
}
