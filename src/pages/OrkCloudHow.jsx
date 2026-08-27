import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, SectionHead, Panel, Badge } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { KernelBoundary } from '@/components/ork/visuals/KernelBoundary';
import { EnvironmentLifecycle } from '@/components/ork/visuals/CloudVisuals';
import { CLOUD } from '@/content/site';

/**
 * /cloud/how-it-works — more technical than /cloud, and deliberately drier.
 *
 * The reader here has already decided they are interested and now wants to know
 * what actually happens. So: the request path, the boundary, storage, TTL, cold
 * starts. Tables and specifics rather than argument.
 *
 * Everything is sourced from the product's own docs and its live site. Where a
 * number is not published — pricing, cold-start bounds beyond "five to twenty
 * minutes" — it is not invented.
 */
export default function OrkCloudHow() {
  return (
    <Page
      onDeep
      seo={{
        title: 'How Orkastor Cloud works — microVMs, guest kernels and TTLs',
        description:
          'The request path, the microVM boundary, what happens to storage, how the TTL works and ' +
          'why the first environment after a quiet spell is slow.',
        canonical: 'https://www.orkastor.com/cloud/how-it-works',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="Orkastor Cloud · how it works"
        title="What actually happens"
        titleB="when you ask for an environment."
        sub="The request path, the boundary it lands inside, and what happens when the clock runs out."
        accent="#48CBCB"
        badge={<Badge kind="invite" onDeep>By invitation</Badge>}
      />

      <Section tone="page">
        <Container wide>
          <Reveal><SectionHead eyebrow="Step by step" title="From an image to a URL." /></Reveal>
          <div className="mt-11 space-y-4">
            {[
              ['01', 'You describe it', 'A container image, a name, a region and a TTL. No cluster, no ingress config, no certificate to chase.'],
              ['02', 'A microVM boots', 'Kata Containers starts a virtual machine with its own guest kernel on bare metal we keep for customer work alone.'],
              ['03', 'Services start together', 'Your frontend, API and datastore come up inside the same boundary and can address each other.'],
              ['04', 'A URL is minted', 'TLS terminated, reachable by a teammate or a webhook — which is the thing local development cannot give you.'],
              ['05', 'The clock runs', 'A visible countdown, and a one-click extend. Nothing quietly becomes a permanent bill.'],
              ['06', 'It is destroyed', 'Grace period, then removal. Storage goes with it, database included.'],
            ].map(([n, t, b], i) => (
              <Reveal key={n} delay={i * 50}>
                <Panel className="p-6 flex gap-5 items-start">
                  <span className="ork-mono ork-micro" style={{ color: 'var(--cloud-text)', minWidth: 26 }}>{n}</span>
                  <span>
                    <span className="ork-heading block" style={{ color: 'var(--text)', fontSize: 16 }}>{t}</span>
                    <span className="ork-body block mt-1.5" style={{ color: 'var(--text-2)' }}>{b}</span>
                  </span>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt">
        <Container wide>
          <Reveal><SectionHead eyebrow="The boundary, in detail" title="Two architectures, side by side." /></Reveal>
          <Reveal delay={70}><div className="mt-11"><KernelBoundary /></div></Reveal>
          <Reveal delay={100}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full ork-small" style={{ borderCollapse: 'collapse', minWidth: 520 }}>
                <caption className="ork-micro text-left pb-3" style={{ color: 'var(--text-3)' }}>
                  Container environment compared with an Orkastor environment
                </caption>
                <thead>
                  <tr>
                    {['Property', 'Container environment', 'Orkastor environment'].map((h) => (
                      <th key={h} className="ork-micro text-left" style={{ color: 'var(--text-2)', padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLOUD.compare.map(([prop, a, b]) => (
                    <tr key={prop}>
                      <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border-soft)', color: 'var(--text)' }}>{prop}</td>
                      <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border-soft)', color: 'var(--text-2)' }}>{a}</td>
                      <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border-soft)', color: 'var(--cloud-text)' }}>{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="page">
        <Container wide>
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 items-center">
            <Reveal>
              <SectionHead eyebrow="Storage and the clock" title="Nothing is kept, and that is deliberate." />
              <dl className="mt-8 space-y-5">
                {[
                  ['Storage lifecycle', 'Volumes live and die with the environment. There are no backups to restore from, so seed with test data rather than anything you would miss.'],
                  ['TTL and grace', 'Every environment states its expiry up front. A grace period follows, then removal.'],
                  ['Cold starts', 'Hardware scales to zero when nobody is using it, so the first environment after a quiet spell can take five to twenty minutes. The rest are quick.'],
                  ['One region', 'eu-north-1, with no region picker. Custom domains are not supported yet.'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="ork-small" style={{ color: 'var(--text)', fontWeight: 600 }}>{k}</dt>
                    <dd className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={80}><EnvironmentLifecycle /></Reveal>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
