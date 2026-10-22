import React from 'react';
import { Section, Container, Button, Arrow } from '../ui';
import { Reveal } from '../motion/Reveal';
import { EXTERNAL } from '@/content/site';

/**
 * "The hard part is already built" — the three-step flow.
 *
 * ── WHY THIS SECTION EXISTS ─────────────────────────────────────────────────
 *
 * The page could say what the product is (ProductCards) and what changes for
 * you (Outcomes), and then asked for a decision — with nothing in between
 * answering "what do I actually have to do?". For infrastructure software
 * aimed at a team that already runs clusters, that is the question standing
 * between interest and a trial, and leaving it unanswered is what makes a
 * reader go and look for a docs page instead of a CTA.
 *
 * Three steps, not five. The number is the claim: if onboarding needed five
 * steps to describe, describing it honestly would be an argument against the
 * product.
 *
 * ── THE NUMBERS ARE DECORATION, NOT CONTENT ─────────────────────────────────
 *
 * The step index is rendered from the map index and marked aria-hidden. A
 * screen reader gets an ordered list and reads "1, 2, 3" from the list
 * semantics; without the hiding it reads each one twice.
 */

const STEPS = [
  [
    'Install the agent',
    'One Helm release into a namespace you choose. It reads from inside the cluster and opens no inbound ports.',
  ],
  [
    'It watches, and learns the shape',
    'Metrics, logs and events become one evidence set per incident, so a root cause has something to be found in.',
  ],
  [
    'You approve the fix',
    'The change arrives proposed, dry-run validated, and verified afterwards. Nothing lands because the agent decided it should.',
  ],
];

export function HowItWorks() {
  return (
    <Section id="how" tone="page">
      <Container wide>
        <Reveal>
          <p className="ork-micro" style={{ color: 'var(--text-3)' }}>Getting started</p>
          <h2 className="ork-display-l mt-7" style={{ color: 'var(--text)', maxWidth: '20ch' }}>
            The hard part is already built.
          </h2>
          <p className="ork-sub mt-6" style={{ color: 'var(--text-2)', maxWidth: '52ch' }}>
            It runs in the clusters you already have. There is nothing to migrate and nothing to
            re-platform.
          </p>
        </Reveal>

        <div className="ork-rule mt-14" />

        {/* An ordered list, so the sequence survives without the styling —
            this is a procedure, and a <div> grid of three cards is not one.

            ⚠ NOT <Stagger>. It wraps each child in a <Reveal> div, and a div
            between <ol> and <li> is invalid list markup — the browser keeps
            rendering it and assistive tech stops counting it as a list. The
            stagger is done by hand here so the <li> stay direct children. */}
        <ol className="grid gap-10 sm:grid-cols-3 mt-10">
          {STEPS.map(([title, body], i) => (
            <li key={title}>
              <Reveal delay={i * 80} y={14}>
              <span
                aria-hidden="true"
                className="ork-micro inline-flex items-center justify-center"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  color: 'var(--kg-text)',
                  marginBottom: 18,
                }}
              >
                {i + 1}
              </span>
              <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 10, fontSize: 17 }}>
                {title}
              </p>
              <p className="ork-body" style={{ color: 'var(--text-2)' }}>{body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={240}>
          <Button
            href={EXTERNAL.kubegrafSite}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12"
          >
            Read the install guide <Arrow />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export default HowItWorks;
