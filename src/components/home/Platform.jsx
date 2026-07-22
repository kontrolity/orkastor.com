import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { KUBEGRAF_URL, Reveal, SectionMarker } from './shared';

const AGENTS = [
  {
    name: 'KubeGraf',
    tag: 'Live',
    live: true,
    text: 'AI SRE for Kubernetes — detection, root cause analysis, and SafeFix™ remediation.',
    href: KUBEGRAF_URL,
  },
  {
    name: 'CostAI',
    tag: 'In development',
    text: 'Continuous cloud cost intelligence — rightsizing, anomaly detection, and savings plans.',
  },
  {
    name: 'SecuBot',
    tag: 'In development',
    text: 'Security posture agent — misconfiguration detection and policy-safe hardening.',
  },
  {
    name: 'GitOps AI',
    tag: 'Research',
    text: 'Pipeline-aware agent that reasons about deploys, rollbacks, and drift.',
  },
  {
    name: 'InfraPilot',
    tag: 'Research',
    text: 'Provisioning copilot for multi-cloud infrastructure — plan, review, apply.',
  },
];

function AgentRow({ agent, index }) {
  const inner = (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 py-6 sm:py-7 items-baseline transition-colors"
      style={{ borderBottom: '1px solid var(--lp-line-soft)' }}
    >
      <div className="md:col-span-1 lp-index">0{index + 1}</div>
      <h3
        className="md:col-span-3 text-[17px] sm:text-[19px] font-semibold inline-flex items-center gap-1.5"
        style={{ letterSpacing: '-0.02em', color: agent.live ? 'var(--lp-ink)' : 'var(--lp-ink-2)' }}
      >
        {agent.name}
        {agent.live && (
          <ArrowUpRight
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: 'var(--lp-orange-deep)' }}
          />
        )}
      </h3>
      <p className="md:col-span-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
        {agent.text}
      </p>
      <div className="md:col-span-3 flex md:justify-end">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
          style={agent.live
            ? { background: 'rgba(23,163,74,0.10)', color: 'var(--lp-green)' }
            : { background: 'rgba(22,24,29,0.05)', color: 'var(--lp-ink-3)' }}
        >
          {agent.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--lp-green)' }} />}
          {agent.tag}
        </span>
      </div>
    </div>
  );

  return agent.href
    ? (
      <a href={agent.href} target="_blank" rel="noopener noreferrer" className="group block">
        {inner}
      </a>
    )
    : inner;
}

export default function Platform() {
  return (
    <section id="platform" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="07" label="The Orkastor platform" />

        <Reveal className="max-w-3xl mb-14 sm:mb-16">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            One engine.{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>A family of agents.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--lp-ink-2)' }}>
            Every Orkastor agent runs on{' '}
            <span className="font-semibold" style={{ color: 'var(--lp-ink)' }}>OrkaAI</span> —
            our multi-model reasoning engine that plans, investigates, and acts inside your
            environment. KubeGraf is the first. More are on the way.
          </p>
        </Reveal>

        {/* Agent index */}
        <div style={{ borderTop: '1px solid var(--lp-line)' }}>
          {AGENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 40}>
              <AgentRow agent={a} index={i} />
            </Reveal>
          ))}
        </div>

        {/* Engine note */}
        <Reveal delay={220}>
          <div className="mt-10 max-w-2xl">
            <div className="lp-eyebrow mb-3">Powered by OrkaAI</div>
            <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
              Multi-model reasoning, tool use, and guardrails — shared by every agent,
              deployed entirely inside your environment.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
