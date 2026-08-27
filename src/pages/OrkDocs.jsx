import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, SectionHead, Panel, Badge } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { EXTERNAL } from '@/content/site';

/**
 * /docs — a gateway, not a documentation set.
 *
 * ── EVERY LINK HERE IS REAL ─────────────────────────────────────────────────
 *
 * The previous page had `href="#"` placeholders styled as documentation links:
 * a reader clicked and nothing happened. A dead link that looks live is worse
 * than an absent one, so this page only points at destinations that exist —
 * each product's own site, the Console, the registry and Discord — and says
 * plainly that Orkastor does not host a docs site of its own yet.
 *
 * No invented page titles, no fabricated API reference, no "coming soon" stubs
 * dressed as sections.
 */

const GROUPS = [
  {
    product: 'KubeGraf',
    ink: 'var(--kg-text)',
    status: <Badge kind="live">Live</Badge>,
    note: 'KubeGraf’s documentation lives on its own site, alongside the product.',
    links: [
      { label: 'kubegraf.io', href: EXTERNAL.kubegrafSite, note: 'Product site, features and security' },
      { label: 'Pricing', href: EXTERNAL.kubegrafPricing, note: 'Plans, limits and the trial' },
      { label: 'app.kubegraf.io', href: EXTERNAL.kubegrafApp, note: 'Sign in to the dashboard' },
    ],
  },
  {
    product: 'Orkastor Cloud',
    ink: 'var(--cloud-text)',
    status: <Badge kind="invite">By invitation</Badge>,
    note: 'Cloud is being built in the open. The site carries the architecture; the Console carries the specifics of your environments.',
    links: [
      { label: 'orkastor.cloud', href: EXTERNAL.cloudSite, note: 'The boundary, the limits and the lifecycle' },
      { label: 'console.orkastor.cloud', href: EXTERNAL.cloudConsole, note: 'Environments, regions and cost' },
      { label: 'How it works', href: '/cloud/how-it-works', note: 'The request path, in detail', internal: true },
    ],
  },
];

export default function OrkDocs() {
  return (
    <Page
      onDeep
      seo={{
        title: 'Documentation — Orkastor',
        description:
          'Where the documentation for each Orkastor product lives: KubeGraf on kubegraf.io, and ' +
          'Orkastor Cloud on orkastor.cloud and in the Console.',
        canonical: 'https://www.orkastor.com/docs',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="Documentation"
        title="Two products,"
        titleB="two sets of docs."
        sub="Each product's documentation lives with the product. This page is the signpost — there is no Orkastor-wide docs site yet, and we would rather say so than build a shell of one."
        accent="#48CBCB"
      />

      <Section tone="page">
        <Container wide>
          <div className="grid md:grid-cols-2 gap-5">
            {GROUPS.map((g, i) => (
              <Reveal key={g.product} delay={i * 70}>
                <Panel className="p-8 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="ork-micro" style={{ color: g.ink }}>{g.product}</span>
                    {g.status}
                  </div>
                  <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 24 }}>{g.note}</p>
                  <ul className="space-y-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {g.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target={l.internal ? undefined : '_blank'}
                          rel={l.internal ? undefined : 'noopener noreferrer'}
                          className="block p-3.5 rounded-[10px]"
                          style={{ border: '1px solid var(--border)', transition: 'border-color 200ms' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = g.ink; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                          <span className="ork-small block" style={{ color: 'var(--text)', fontWeight: 600 }}>
                            {l.label}{l.internal ? '' : ' ↗'}
                          </span>
                          <span className="ork-small block mt-0.5" style={{ color: 'var(--text-2)' }}>{l.note}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <Panel className="p-7 mt-5">
              <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 8 }}>Questions the docs do not answer yet</p>
              <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 18 }}>
                Both products are moving quickly, and some of what you might want is not written down
                anywhere public. Asking is faster than searching.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={EXTERNAL.discord} target="_blank" rel="noopener noreferrer" className="ork-small"
                   style={{ padding: '10px 16px', borderRadius: 999, border: '1px solid var(--border)', color: 'var(--text)' }}>
                  Discord ↗
                </a>
                <a href={`mailto:${EXTERNAL.email}`} className="ork-small"
                   style={{ padding: '10px 16px', borderRadius: 999, border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {EXTERNAL.email}
                </a>
              </div>
            </Panel>
          </Reveal>
        </Container>
      </Section>
    </Page>
  );
}
