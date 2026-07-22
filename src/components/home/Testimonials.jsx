import React from 'react';
import { Star } from 'lucide-react';
import { Reveal, SectionMarker } from './shared';

const FEATURED = {
  quote: "Orkastor reduced our P0 response time from 45 minutes to under 2 minutes. The AI's root cause analysis is eerily accurate — it caught a memory leak we'd been chasing for months within 8 seconds. Our on-call rotation is finally sustainable.",
  author: 'Sarah Chen',
  role: 'Principal SRE, FinTech Corp',
  initials: 'SC',
};

const OTHERS = [
  {
    quote: 'We were skeptical about AI making changes to production, but the approval workflows and audit trails gave us the confidence we needed. We now run in auto-fix mode for low-risk incidents.',
    author: 'Marcus Rodriguez',
    role: 'VP Engineering, CloudScale',
    initials: 'MR',
  },
  {
    quote: 'The runbook automation alone saved us 20+ engineer-hours per week. The CLI is a genuine joy to use — feels like it was designed by someone who actually does on-call.',
    author: 'Alex Kim',
    role: 'Staff Engineer, DataPipe',
    initials: 'AK',
  },
];

function Avatar({ initials }) {
  return (
    <span
      className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[12px] font-bold shrink-0"
      style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)', border: '1px solid rgba(255,122,31,0.28)' }}
    >
      {initials}
    </span>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 mb-4" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5" style={{ fill: 'var(--lp-amber)', color: 'var(--lp-amber)' }} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="06" label="What engineers say" />
        <Reveal className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            On-call, but <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>sustainable.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Featured */}
          <Reveal>
            <figure
              className="lp-card p-7 sm:p-9 h-full flex flex-col"
              style={{ borderColor: 'rgba(255,122,31,0.30)', boxShadow: '0 1px 2px rgba(22,24,29,0.04), 0 16px 44px rgba(255,122,31,0.10)' }}
            >
              <Stars />
              <blockquote className="text-[17px] sm:text-[19px] leading-relaxed flex-1" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.01em' }}>
                “{FEATURED.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar initials={FEATURED.initials} />
                <span className="text-[14px]" style={{ color: 'var(--lp-ink-3)' }}>
                  <span className="font-semibold block" style={{ color: 'var(--lp-ink)' }}>{FEATURED.author}</span>
                  {FEATURED.role}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Two stacked */}
          <div className="flex flex-col gap-5">
            {OTHERS.map((t, i) => (
              <Reveal key={t.author} delay={100 + i * 90} className="flex-1">
                <figure className="lp-card p-6 sm:p-7 h-full flex flex-col">
                  <blockquote className="text-[14.5px] leading-relaxed flex-1" style={{ color: 'var(--lp-ink-2)' }}>
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <Avatar initials={t.initials} />
                    <span className="text-[13px]" style={{ color: 'var(--lp-ink-3)' }}>
                      <span className="font-semibold block" style={{ color: 'var(--lp-ink)' }}>{t.author}</span>
                      {t.role}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
