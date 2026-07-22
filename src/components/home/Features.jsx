import React from 'react';
import { Reveal, SectionMarker } from './shared';

const FEATURES = [
  {
    title: 'Evidence-chain RCA',
    text: 'Logs, metrics, events, and deployments fused into one causal timeline, with a confidence score on every finding.',
  },
  {
    title: 'SafeFix™ remediation',
    text: 'AI-generated patches that are cryptographically signed and validated in dry-run before anything touches production.',
  },
  {
    title: 'Human-in-the-loop',
    text: 'Nothing ships without your approval. Review the diff, see the blast radius, approve or dismiss in one click.',
  },
  {
    title: 'Live cluster intelligence',
    text: 'A real-time graph of workloads, nodes, and dependencies — so the agent reasons about your system, not just one pod.',
  },
  {
    title: 'Private by design',
    text: 'AI inference runs inside your environment. No SaaS round-trips, no external LLM calls, zero data exfiltration.',
  },
  {
    title: 'Plugs into your stack',
    text: 'Slack, PagerDuty, Prometheus, Grafana, ArgoCD, and more — KubeGraf meets your team where it already works.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="03" label="Why teams pick KubeGraf" />

        <Reveal className="max-w-3xl mb-14 sm:mb-16">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            Everything an on-call engineer wishes they had{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>at 3 a.m.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--lp-ink-2)' }}>
            Not another dashboard. An agent that investigates like your best SRE — and shows its work.
          </p>
        </Reveal>

        {/* Editorial index rows */}
        <div style={{ borderTop: '1px solid var(--lp-line)' }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 40}>
              <div
                className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 py-7 sm:py-8 transition-colors"
                style={{ borderBottom: '1px solid var(--lp-line-soft)' }}
              >
                <div className="md:col-span-1 lp-index pt-1">0{i + 1}</div>
                <h3
                  className="md:col-span-4 text-[17px] sm:text-[19px] font-semibold transition-colors"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {f.title}
                </h3>
                <p
                  className="md:col-span-6 md:col-start-7 text-[14.5px] leading-relaxed"
                  style={{ color: 'var(--lp-ink-2)' }}
                >
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
