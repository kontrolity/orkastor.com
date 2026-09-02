import React from 'react';
import { Reveal, SectionMarker } from '@/components/home/shared';

/**
 * The non-goals, stated as prominently as the features.
 *
 * Rendered in neutral ink rather than error-red: these are product decisions,
 * not warnings, and a lower environment sold as production-adjacent is a support
 * burden and a broken promise. Every line here comes from the architecture
 * document's explicit non-goal list.
 */
const NON_GOALS = [
  ['No production SLA', 'No uptime commitment and no multi-AZ high availability per environment. If your users depend on it, it does not belong here.'],
  ['No managed databases', 'You can run a database in an environment. It is not managed, and it is not backed up. Treat every byte inside an environment as disposable.'],
  ['No custom domains', 'Hostnames are generated under domineta.com. No customer-supplied TLS certificates.'],
  ['No cross-environment networking', 'Environments cannot reach each other. That is the same control that stops one tenant reaching another.'],
  ['No GPU', 'Not in v1.'],
  ['No regulated data', 'No compliance certifications are claimed for this product. Do not put customer PII, payment data or anything under a regulatory regime into a lower environment.'],
];

export default function NonGoals() {
  return (
    <section id="not-for" className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="05" label="What it is not" />

        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-12 lg:gap-16">
          <Reveal>
            <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
              The limits, in the same size type as the{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
                features.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
              Domineta is a lower environment. Everything below is a deliberate choice about what a
              lower environment is for — not a roadmap item we are embarrassed about.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
              If what you need is production hosting, this is the wrong tool, and we would rather tell you
              on this page than in a support ticket at 3am.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <dl className="m-0">
              {NON_GOALS.map(([title, body]) => (
                <div key={title} className="lpc-row py-5 flex gap-4">
                  {/* A hairline dash, not a red cross: these are boundaries, not errors. */}
                  <span
                    aria-hidden="true"
                    className="mt-[10px] w-3 h-px shrink-0"
                    style={{ background: 'var(--lp-ink-3)' }}
                  />
                  <div className="min-w-0">
                    <dt className="text-[15px] font-semibold mb-1.5" style={{ letterSpacing: '-0.015em' }}>
                      {title}
                    </dt>
                    <dd className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-2)' }}>
                      {body}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
