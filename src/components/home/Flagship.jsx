import React from 'react';
import { ArrowUpRight, Radar, Search, Wrench } from 'lucide-react';
import { KUBEGRAF_URL, Reveal } from './shared';

const STEPS = [
  {
    icon: Radar,
    step: '01',
    title: 'Detect',
    text: 'KubeGraf watches events, logs, metrics, and deploys across your clusters — catching CrashLoops, OOMKills, and degradations the moment they start.',
    chip: 'kubectl get events --watch',
  },
  {
    icon: Search,
    step: '02',
    title: 'Diagnose',
    text: 'Multi-source signals are fused into a single causal timeline. Every root cause comes with an evidence chain and a confidence score — not a guess.',
    chip: 'root cause: memory limit · 96%',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'Fix',
    text: 'SafeFix™ generates a signed patch, validates it in dry-run, and waits for your approval before touching production. One click, verified rollout.',
    chip: 'safefix apply --signed ✓',
  },
];

export default function Flagship() {
  return (
    <section id="kubegraf" className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <Reveal className="max-w-3xl">
          <div className="lp-eyebrow mb-4">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--lp-green)' }} />
            Flagship product · Live
          </div>
          <h2 className="lp-display text-[clamp(30px,4.6vw,52px)]">
            Meet <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>KubeGraf</span> —
            the AI SRE platform for Kubernetes.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--lp-ink-2)' }}>
            The 3 a.m. page, answered by an agent that already knows your cluster.
            KubeGraf turns hours of debugging into an approve-and-move-on moment.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={KUBEGRAF_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-dark group">
              Launch KubeGraf
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <span className="lp-mono text-[13px]" style={{ color: 'var(--lp-ink-3)' }}>kubegraf.io</span>
          </div>
        </Reveal>

        {/* Step cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="lp-card lp-card-hover p-6 sm:p-7 h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="w-11 h-11 rounded-xl inline-flex items-center justify-center"
                    style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                  >
                    <s.icon className="w-5 h-5" />
                  </span>
                  <span className="lp-mono text-[13px] font-medium" style={{ color: 'var(--lp-ink-3)' }}>{s.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p className="text-[14px] leading-relaxed flex-1" style={{ color: 'var(--lp-ink-2)' }}>{s.text}</p>
                <div
                  className="mt-5 lp-mono text-[11.5px] px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(22,24,29,0.04)', color: 'var(--lp-ink-2)', border: '1px solid var(--lp-line-soft)' }}
                >
                  <span style={{ color: 'var(--lp-orange-deep)' }}>›</span> {s.chip}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
