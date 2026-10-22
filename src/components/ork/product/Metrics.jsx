import React from 'react';
import { Section, Container } from '../ui';
import { Reveal } from '../motion/Reveal';

/**
 * The three-figure band.
 *
 * ── WHAT IS AND IS NOT A NUMBER HERE ────────────────────────────────────────
 *
 * Two of these three are not quantities, and that is deliberate. A marketing
 * band of three big figures invites inventing the third, and an invented
 * number on an infrastructure page is the one mistake a reader of this page
 * is equipped to catch.
 *
 * So the slots carry whatever is actually true at that size:
 *
 *   "Zero"      a property of the architecture — the agent opens no inbound
 *               ports. Checkable against the install guide.
 *   "Your keys" a statement about custody, which is the question a platform
 *               team asks first and the one a percentage cannot answer.
 *   "Every fix" the verification claim, stated as coverage rather than as a
 *               success rate we would have to source.
 *
 * ⚠ Do not replace these with percentages unless the percentage has a
 * published source. OUTCOMES in content/proof.js is prose for the same
 * reason: PROOF_SOURCE records that the customer evidence on this site is
 * KubeGraf's, published on kubegraf.io, and anything stated as a figure here
 * has to survive the same test.
 *
 * ── WHY IT IS A <dl> ────────────────────────────────────────────────────────
 *
 * Each item is a term and its definition. A grid of <div>s reads to a screen
 * reader as six unrelated fragments — "Zero", "inbound ports", "Your keys" —
 * with nothing binding each figure to what it measures.
 */

const FIGURES = [
  ['Zero', 'Inbound ports. The agent reaches out; nothing reaches in.'],
  ['Your keys', 'Credentials stay in your cluster. We never hold them.'],
  ['Every fix', 'Dry-run validated before, and verified against the live cluster after.'],
];

export function Metrics() {
  return (
    <Section id="metrics" tone="page">
      <Container wide>
        <Reveal>
          <h2 className="ork-display-m" style={{ color: 'var(--text)', maxWidth: '24ch' }}>
            It runs inside your infrastructure, on your terms.
          </h2>
        </Reveal>

        <div className="ork-rule mt-12" />

        <dl className="grid gap-10 sm:grid-cols-3 mt-10">
          {FIGURES.map(([figure, body], i) => (
            <div key={figure}>
              <Reveal delay={i * 80} y={14}>
                {/* .ork-display-m, not a bespoke size: the figure is the
                    largest thing in its column and the scale already has a
                    tier for that. A one-off font-size here is how a type
                    scale stops being one. */}
                <dt className="ork-display-m" style={{ color: 'var(--kg-text)', lineHeight: 1.05 }}>
                  {figure}
                </dt>
                <dd className="ork-body mt-4" style={{ color: 'var(--text-2)', margin: 0 }}>
                  {body}
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

export default Metrics;
