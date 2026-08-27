import React from 'react';
import { Container, Section, SectionHead, Panel, Badge, Button, Arrow } from '../ui';
import { Reveal } from '../motion/Reveal';
import { KUBEGRAF, CLOUD, EXTERNAL } from '@/content/site';

/**
 * The two products as editorial panels, at equal weight.
 *
 * Equal weight is not equal claims. Same width, same structure, same bullet
 * count — because the section's job is to help someone choose, and a layout that
 * gives one product three times the pixels has chosen for them. The STATUS is
 * deliberately unequal and sits in the same slot at the same size: Live, and By
 * invitation. Dressing a pre-GA product as shipped is the one thing that would
 * make everything else on the page suspect.
 *
 * Hover is restrained on purpose: the border takes the product's accent, the
 * arrow slides, the panel lifts 2px. The brief caps scale at ~1.02 and this does
 * not scale at all — a card that grows pushes its neighbour's text, which reads
 * as jitter on a two-up grid.
 */

const CARDS = [
  {
    key: 'kubegraf',
    name: KUBEGRAF.name,
    side: KUBEGRAF.side,
    status: <Badge kind="live">Live</Badge>,
    accent: 'var(--kg)',
    ink: 'var(--kg-text)',
    line: 'Your clusters.',
    blurb: KUBEGRAF.oneLine,
    points: [
      'One thin agent, outbound-only — no inbound ports, no cluster credentials held centrally',
      'A root cause and a change, not another dashboard of graphs',
      'Every fix is proposed for approval. Autonomy is a dial you set',
    ],
    primary: { label: 'Explore KubeGraf', href: '/kubegraf' },
    secondary: { label: 'kubegraf.io', href: EXTERNAL.kubegrafSite, external: true },
  },
  {
    key: 'cloud',
    name: CLOUD.name,
    side: CLOUD.side,
    status: <Badge kind="invite">By invitation</Badge>,
    accent: 'var(--cloud-bright)',
    ink: 'var(--cloud-text)',
    line: 'Our clusters.',
    blurb: CLOUD.oneLine,
    points: [
      'One environment, one microVM, one guest kernel — not a namespace on a shared one',
      'A whole environment: frontend, API and a real datastore inside the boundary',
      'Ephemeral by design. A TTL, a grace period, then it is gone',
    ],
    primary: { label: 'Explore Orkastor Cloud', href: '/cloud' },
    secondary: { label: 'orkastor.cloud', href: EXTERNAL.cloudSite, external: true },
  },
];

export function ProductCards() {
  return (
    <Section id="products" tone="page">
      <Container wide>
        <Reveal>
          <SectionHead
            eyebrow="Two products. Two jobs."
            title="Whose cluster is it?"
            sub="One works on infrastructure you own. The other is the infrastructure. That is the fastest way to tell which you want — everything else follows from it."
          />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 mt-14">
          {CARDS.map((c, i) => (
            <Reveal key={c.key} delay={i * 70}>
              <Panel hover accent={c.accent} className="h-full flex flex-col overflow-hidden">
                {/* The accent is a 3px brand stripe — decorative, so the bright
                    display value is right here. Everything read below uses `ink`. */}
                <div style={{ height: 3, background: c.accent }} />
                <div className="p-7 sm:p-9 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="ork-micro" style={{ color: c.ink }}>{c.name}</span>
                    {c.status}
                  </div>

                  <p className="ork-display-m" style={{ color: 'var(--text)', marginBottom: 6 }}>{c.line}</p>
                  <p className="ork-micro" style={{ color: 'var(--text-3)', marginBottom: 16 }}>{c.side}</p>

                  <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 24 }}>{c.blurb}</p>

                  <ul className="space-y-3 mb-9">
                    {c.points.map((pt) => (
                      <li key={pt} className="flex gap-3 ork-small" style={{ color: 'var(--text-2)' }}>
                        <span aria-hidden="true" style={{ color: c.ink, marginTop: 1, flexShrink: 0 }}>—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* mt-auto so both cards' CTAs land on one line however the
                      bullets wrap. Two rows disagreeing by 12px reads as one
                      card being an afterthought. */}
                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <Button href={c.primary.href} accent={c.key === 'kubegraf' ? 'kg' : 'cloud'}>
                      {c.primary.label} <Arrow />
                    </Button>
                    <Button
                      href={c.secondary.href}
                      variant="secondary"
                      target={c.secondary.external ? '_blank' : undefined}
                      rel={c.secondary.external ? 'noopener noreferrer' : undefined}
                      style={{ color: 'var(--text)' }}
                    >
                      {c.secondary.label} ↗
                    </Button>
                  </div>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default ProductCards;
