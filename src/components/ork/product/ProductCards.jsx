import React from 'react';
import { Container, Section, Badge, Button, Arrow } from '../ui';
import { Reveal, Stagger } from '../motion/Reveal';
import { KUBEGRAF, EXTERNAL } from '@/content/site';

/**
 * The product, as a full-width editorial block.
 *
 * ── WHY THIS IS NO LONGER A CARD ────────────────────────────────────────────
 *
 * It was a two-card row until Domineta was unlisted. What survived that was a
 * ONE-ITEM GRID: a `maxWidth: 560` column on a 1320px container, so the
 * section ran two thirds empty to the right — wrapped in an `ork-depth`
 * perspective whose own comment explained it was there to stop a ROW of cards
 * fanning, with no row left to fan. A card is a container for one of several
 * things; with one thing, the container is the only thing a reader notices.
 *
 * The old header here argued for "equal weight, equal width, same bullet
 * count, because the section's job is to help someone choose". There is
 * nothing to choose between any more, so that reasoning retired with the
 * second card.
 *
 * ── AND THE CLAIM WAS MADE THREE TIMES ──────────────────────────────────────
 *
 * The heading said "An AI SRE for the clusters you own", its standfirst said
 * "It detects the incident, finds the cause and ships the fix", and the card
 * blurb was KUBEGRAF.oneLine: "An AI SRE for Kubernetes. It detects the
 * incident, finds the root cause, and ships the fix." One sentence, three
 * times, in one section — and the hero above already rotates through that
 * same pipeline.
 *
 * So the pipeline is stated ONCE, by the hero. This section answers what the
 * hero raises and leaves open: what installing it actually means. The
 * standfirst carries only what nothing else says — you install it, you keep
 * your credentials — and the columns carry the substance.
 *
 * ── THE COLUMNS ARE WHAT MAKES IT IMPACTFUL ─────────────────────────────────
 *
 * Three spec columns under a rule, full width, each led by a mono label. It is
 * the same device the spec rows use elsewhere in this language, and it is what
 * lets the section be large without being loud: the heading is the only big
 * thing on it, and everything beneath is dense and scannable.
 */

/* Each label names the axis its point is about, so the three read as a set
   rather than as three unrelated sentences. The sentences themselves are the
   bullet copy they replace, unchanged. */
const POINTS = [
  ['Agent', 'One thin agent, outbound-only — no inbound ports, no cluster credentials held centrally.'],
  ['Output', 'A root cause and a change, not another dashboard of graphs.'],
  ['Control', 'Every fix is proposed for approval. Autonomy is a dial you set.'],
];

export function ProductCards() {
  return (
    <Section id="products" tone="page">
      <Container wide>
        <Reveal>
          {/* Section label, product and status share one row: all three are
              facts ABOUT what follows, and stacking them made three separate
              small things where one line will do. */}
          <div className="ork-micro flex flex-wrap items-center gap-3" style={{ color: 'var(--text-3)' }}>
            <span>The product</span>
            <span aria-hidden="true" className="h-px w-8" style={{ background: 'var(--border)' }} />
            <span style={{ color: 'var(--kg-text)' }}>{KUBEGRAF.name}</span>
            <Badge kind="live">Live</Badge>
          </div>

          {/* ⚠ .ork-display-l, a tier UP from .ork-display-m. This is the
              section's one large element and it finally has the width to be
              one — at the old size, inside a 560px card, it was the same size
              as the card's own title and led nothing. */}
          <h2 className="ork-display-l mt-7" style={{ color: 'var(--text)', maxWidth: '18ch' }}>
            An AI SRE for the clusters you own.
          </h2>

          {/* Trimmed. This used to continue "It detects the incident, finds
              the cause and ships the fix" — which the hero headline already
              rotates through and the columns below state properly. What is
              left is the half nothing else on the page says. */}
          <p className="ork-sub mt-6" style={{ color: 'var(--text-2)', maxWidth: '52ch' }}>
            An agent you install, in infrastructure that stays yours — with credentials we never hold.
          </p>
        </Reveal>

        {/* The rule is what turns three paragraphs into a specification. */}
        <div className="ork-rule mt-14" />

        <Stagger className="grid gap-10 sm:grid-cols-3 mt-10" step={70} y={12}>
          {POINTS.map(([label, body]) => (
            <div key={label}>
              <p className="ork-micro" style={{ color: 'var(--kg-text)', marginBottom: 10 }}>{label}</p>
              <p className="ork-body" style={{ color: 'var(--text-2)' }}>{body}</p>
            </div>
          ))}
        </Stagger>

        <Reveal delay={240}>
          <Button
            href={EXTERNAL.kubegrafSite}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12"
          >
            kubegraf.io <Arrow />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export default ProductCards;
