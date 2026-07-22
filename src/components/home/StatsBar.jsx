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
    <section className="relative lp-inverted overflow-hidden">
      {/* quiet texture: faint dot grid fading out */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, black, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, black, transparent 85%)',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 py-14 sm:py-16">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="flex flex-col items-center text-center px-4"
            >
              <div
                className="w-full flex flex-col items-center"
                style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.22)' } : undefined}
              >
                <span
                  className="lp-display text-[clamp(36px,4.5vw,56px)]"
                  style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}
                >
                  {s.value}
                </span>
                <span
                  className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] max-w-[200px] leading-relaxed"
                  style={{ color: 'rgba(255,244,235,0.78)' }}
                >
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
