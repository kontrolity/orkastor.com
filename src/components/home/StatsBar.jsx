import React from 'react';
import { Reveal } from './shared';

const STATS = [
  { value: '18s',  label: 'median time to root cause' },
  { value: '80%',  label: 'reduction in MTTR' },
  { value: '100%', label: 'AI inference in your environment' },
  { value: '0',    label: 'bytes of data exfiltrated' },
];

export default function StatsBar() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="lp-hairline" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 py-12 sm:py-16">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="flex flex-col items-center text-center px-4">
              <span className="lp-display text-[clamp(36px,4.5vw,56px)]" style={{ color: 'var(--lp-ink)' }}>
                {s.value}
              </span>
              <span className="mt-2 text-[13px] max-w-[180px] leading-snug" style={{ color: 'var(--lp-ink-3)' }}>
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>
        <div className="lp-hairline" />
      </div>
    </section>
  );
}
