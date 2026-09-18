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
          'Orkastor builds infrastructure software for Kubernetes teams. KubeGraf is an AI SRE ' +
          'that works inside the clusters you already own.',
        canonical: 'https://www.orkastor.com/about',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="About Orkastor"
        title="Infrastructure software"
        titleB="for Kubernetes teams."
        sub={COMPANY.oneLine}
        accent="#48CBCB"
      />

      <Section tone="page">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="What we build"
              title="One product, and a clear line around it."
              sub="KubeGraf works inside the clusters you already own. The agent is yours, the credentials stay yours, and nothing about your infrastructure has to move for it to be useful."
            />
          </Reveal>
          <div className="mt-11" style={{ maxWidth: 560 }}>
            {[
              /* "Read more" was /kubegraf, this site's KubeGraf page. It is
                 gone, so the card reads on at the product's own site. */
              ['KubeGraf', 'Your infrastructure', 'The clusters exist and keeping them healthy is the work. KubeGraf detects the incident, finds the cause and ships the fix — with an agent you install and credentials we never hold.', 'var(--kg-text)', EXTERNAL.kubegrafSite],
            ].map(([name, side, body, ink, href], i) => (
              <Reveal key={name} delay={i * 70}>
                <Panel className="p-8 h-full flex flex-col">
                  <p className="ork-micro" style={{ color: ink, marginBottom: 10 }}>{side}</p>
                  <p className="ork-display-m" style={{ color: 'var(--text)', marginBottom: 14 }}>{name}</p>
                  <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 26 }}>{body}</p>
                  <div className="mt-auto">
                    <Button href={href} variant="secondary" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>Read more <Arrow /></Button>
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* The "How they relate" section was here: "One account, and a
          deliberate wall", the what-they-share / what-stays-separate pair, and
          the note that KubeGraf does not watch Domineta environments yet.

          All of it described the relationship BETWEEN the two products. With
          Domineta unlisted there is one product and no relationship, and a
          section explaining a wall with nothing on the other side of it
          invites exactly the question the unlisting is meant to avoid.

          COMPANY.shared / separate / notYet stay in content/site.js so this
          section can be restored verbatim when Domineta is listed again. */}

      <Section tone="page">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="How we write about this"
              title="If we cannot point at a source, it does not go on the site."
              sub="No customer logos, no testimonials, no uptime figures, and no mean-time-to-resolution number. A company page full of unbacked metrics makes everything under it read as marketing."
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
