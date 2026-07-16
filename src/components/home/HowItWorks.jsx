import React from 'react';
import { Reveal, SectionMarker } from './shared';

const STEPS = [
  {
    time: 'T+0s',
    title: 'Signal detected',
    text: 'payments-api starts crash-looping after a deploy. KubeGraf correlates the event with the rollout automatically.',
    mono: 'Warning · BackOff restarting failed container',
  },
  {
    time: 'T+6s',
    title: 'Root cause isolated',
    text: 'Heap growth against a 512Mi limit, introduced in v2.3.1. Evidence chain assembled, 96% confidence.',
    mono: 'deploy v2.3.1 → heap growth → OOMKill → loop',
  },
  {
    time: 'T+9s',
    title: 'SafeFix™ proposed',
    text: 'A signed patch raising the memory limit, already validated in dry-run. Posted to Slack with the full diff.',
    mono: '- memory: "512Mi"   + memory: "1Gi"',
  },
  {
    time: 'T+14s',
    title: 'You approve',
    text: 'One click in Slack or the console. The patch applies with a rolling restart — no kubectl, no context switching.',
    mono: 'approved by @dana · rollout 3/3',
  },
  {
    time: 'T+18s',
    title: 'Verified healthy',
    text: 'KubeGraf watches the rollout, confirms steady-state, and writes the post-mortem timeline for you.',
    mono: '✓ Resolved · MTTR 18s · report drafted',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="04" label="How it works" />

        <Reveal className="max-w-3xl mb-14 sm:mb-16">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            From page to post-mortem in{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>18 seconds.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
            A real incident, the way KubeGraf runs it.
          </p>
        </Reveal>

        <div className="max-w-3xl">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="relative flex gap-5 sm:gap-8 pb-10 last:pb-0">
                {/* Rail */}
                <div className="flex flex-col items-center shrink-0">
                  <span
                    className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[11px] font-bold lp-mono z-10"
                    style={i === STEPS.length - 1
                      ? { background: 'rgba(23,163,74,0.12)', color: 'var(--lp-green)', border: '1px solid rgba(23,163,74,0.30)' }
                      : { background: 'var(--lp-surface)', color: 'var(--lp-orange-deep)', border: '1px solid rgba(255,122,31,0.35)' }}
                  >
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="w-px flex-1 mt-2" style={{ background: 'linear-gradient(180deg, rgba(255,122,31,0.35), var(--lp-line))' }} />
                  )}
                </div>
                {/* Content */}
                <div className="pt-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <h3 className="text-[17px] font-semibold" style={{ letterSpacing: '-0.02em' }}>{s.title}</h3>
                    <span className="lp-mono text-[11px] font-medium" style={{ color: 'var(--lp-orange-deep)' }}>{s.time}</span>
                  </div>
                  <p className="text-[14px] leading-relaxed mb-3" style={{ color: 'var(--lp-ink-2)' }}>{s.text}</p>
                  <div
                    className="inline-block lp-mono text-[11.5px] px-3 py-1.5 rounded-lg max-w-full truncate"
                    style={{ background: 'rgba(22,24,29,0.04)', border: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}
                  >
                    {s.mono}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
