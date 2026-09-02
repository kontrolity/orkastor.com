import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, SectionHead, Panel, Button, Arrow } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { COMPANY, EXTERNAL } from '@/content/site';

/**
 * /about — the company, positioned to fit both products.
 *
 * ── WHAT THIS REPLACES, AND WHY IT HAD TO GO ────────────────────────────────
 *
 * The previous page said Orkastor was "a modular AI DevOps platform that runs
 * entirely inside your own environment… every agent runs as an operator inside
 * your cluster. No data leaves. KubeGraf is the first module."
 *
 * That framing has NO ROOM for Domineta. Domineta is the opposite of an agent
 * inside your cluster: it is infrastructure we operate, with customer workloads
 * on our metal. "Runs entirely inside your own environment" cannot describe it.
 * So the site was telling two incompatible stories about what the company is.
 *
 * It also carried four unsourced figures — 500+ beta users, 18s mean resolution,
 * 80% faster MTTR, and "0 BYTES LEAVE YOUR NETWORK". The last one contradicts
 * the architecture, which routes AI through KubeGraf's gateway to Bedrock. None
 * is reproduced here. There is no metric on this page, and that is on purpose:
 * while one product is pre-GA there is nothing both impressive and true to put
 * at the top of a company page.
 */
export default function OrkAbout() {
  return (
    <Page
      onDeep
      seo={{
        title: 'About Orkastor — infrastructure software for Kubernetes teams',
        description:
          'Orkastor builds two products either side of one line: KubeGraf works inside the clusters ' +
          'you own, and Domineta is infrastructure we operate for you.',
        canonical: 'https://www.orkastor.com/about',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="About Orkastor"
        title="Infrastructure software"
        titleB="for Kubernetes teams."
        sub={COMPANY.boundary}
        accent="#48CBCB"
      />

      <Section tone="page">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="Two directions, one line"
              title="We build on both sides of the boundary."
              sub="Which is not the same as building one thing twice. The two products solve different problems, for teams in different situations."
            />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5 mt-11">
            {[
              ['KubeGraf', 'Your infrastructure', 'The clusters exist and keeping them healthy is the work. KubeGraf detects the incident, finds the cause and ships the fix — with an agent you install and credentials we never hold.', 'var(--kg-text)', '/kubegraf'],
              ['Domineta', 'Our infrastructure', 'There is no cluster, and building one is a quarter of work nobody asked for. Domineta gives you an environment on metal we operate, with a kernel boundary and an expiry date.', 'var(--cloud-text)', '/cloud'],
            ].map(([name, side, body, ink, href], i) => (
              <Reveal key={name} delay={i * 70}>
                <Panel className="p-8 h-full flex flex-col">
                  <p className="ork-micro" style={{ color: ink, marginBottom: 10 }}>{side}</p>
                  <p className="ork-display-m" style={{ color: 'var(--text)', marginBottom: 14 }}>{name}</p>
                  <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 26 }}>{body}</p>
                  <div className="mt-auto">
                    <Button href={href} variant="secondary" style={{ color: 'var(--text)' }}>Read more <Arrow /></Button>
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container wide>
          <Reveal><SectionHead eyebrow="How they relate" title="One account, and a deliberate wall." /></Reveal>
          <div className="grid md:grid-cols-2 gap-5 mt-11">
            {[
              { title: 'What they share', rows: COMPANY.shared, ink: 'var(--cloud-text)' },
              { title: 'What stays separate', rows: COMPANY.separate, ink: 'var(--kg-text)' },
            ].map(({ title, rows, ink }, i) => (
              <Reveal key={title} delay={i * 70}>
                <Panel className="p-7 h-full">
                  <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 18 }}>
                    <span style={{ color: ink }}>—</span> {title}
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

      <Section tone="page">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="How we write about this"
              title="If we cannot point at a source, it does not go on the site."
              sub="No customer logos, no testimonials, no uptime figures, and no mean-time-to-resolution number. One of the two products has not shipped, and a company page full of unbacked metrics makes everything under it read as marketing."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`mailto:${EXTERNAL.email}`} variant="secondary" style={{ color: 'var(--text)' }}>{EXTERNAL.email}</Button>
              <Button href={EXTERNAL.discord} variant="secondary" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>Discord ↗</Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </Page>
  );
}
