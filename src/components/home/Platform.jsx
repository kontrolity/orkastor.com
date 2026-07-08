import React from 'react';
import { ArrowUpRight, Boxes, Coins, GitBranch, Compass, ShieldAlert } from 'lucide-react';
import { KUBEGRAF_URL, Reveal, SectionHead } from './shared';

const AGENTS = [
  {
    icon: Boxes,
    name: 'KubeGraf',
    tag: 'Live',
    live: true,
    text: 'AI SRE for Kubernetes — detection, root cause analysis, and SafeFix™ remediation.',
    href: KUBEGRAF_URL,
  },
  {
    icon: Coins,
    name: 'CostAI',
    tag: 'In development',
    text: 'Continuous cloud cost intelligence — rightsizing, anomaly detection, and savings plans.',
  },
  {
    icon: ShieldAlert,
    name: 'SecuBot',
    tag: 'In development',
    text: 'Security posture agent — misconfiguration detection and policy-safe hardening.',
  },
  {
    icon: GitBranch,
    name: 'GitOps AI',
    tag: 'Research',
    text: 'Pipeline-aware agent that reasons about deploys, rollbacks, and drift.',
  },
  {
    icon: Compass,
    name: 'InfraPilot',
    tag: 'Research',
    text: 'Provisioning copilot for multi-cloud infrastructure — plan, review, apply.',
  },
];

export default function Platform() {
  return (
    <section id="platform" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHead
          eyebrow="The Orkastor platform"
          title={<>One engine. <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>A family of agents.</span></>}
          sub={
            <>
              Every Orkastor agent runs on <span className="font-semibold" style={{ color: 'var(--lp-ink)' }}>OrkaAI</span> —
              our multi-model reasoning engine that plans, investigates, and acts inside your environment.
              KubeGraf is the first. More are on the way.
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((a, i) => {
            const Card = (
              <div
                className={`lp-card p-6 h-full flex flex-col ${a.live ? 'lp-card-hover' : ''}`}
                style={a.live
                  ? { borderColor: 'rgba(255,122,31,0.35)', boxShadow: '0 1px 2px rgba(22,24,29,0.04), 0 12px 32px rgba(255,122,31,0.10)' }
                  : { opacity: 0.92 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="w-10 h-10 rounded-xl inline-flex items-center justify-center"
                    style={a.live
                      ? { background: 'var(--lp-orange)', color: '#fff', boxShadow: '0 4px 14px rgba(255,122,31,0.35)' }
                      : { background: 'rgba(22,24,29,0.05)', color: 'var(--lp-ink-3)' }}
                  >
                    <a.icon className="w-[18px] h-[18px]" />
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full inline-flex items-center gap-1.5"
                    style={a.live
                      ? { background: 'rgba(23,163,74,0.10)', color: 'var(--lp-green)' }
                      : { background: 'rgba(22,24,29,0.05)', color: 'var(--lp-ink-3)' }}
                  >
                    {a.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--lp-green)' }} />}
                    {a.tag}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold mb-1.5 inline-flex items-center gap-1.5" style={{ letterSpacing: '-0.015em' }}>
                  {a.name}
                  {a.live && <ArrowUpRight className="w-3.5 h-3.5" style={{ color: 'var(--lp-orange-deep)' }} />}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>{a.text}</p>
              </div>
            );
            return (
              <Reveal key={a.name} delay={(i % 3) * 90}>
                {a.href
                  ? <a href={a.href} target="_blank" rel="noopener noreferrer" className="block h-full">{Card}</a>
                  : Card}
              </Reveal>
            );
          })}

          {/* Filler card: the engine */}
          <Reveal delay={180}>
            <div
              className="p-6 h-full rounded-2xl flex flex-col justify-center"
              style={{ border: '1px dashed rgba(255,122,31,0.40)', background: 'rgba(255,122,31,0.04)' }}
            >
              <span className="lp-eyebrow mb-2">Powered by OrkaAI</span>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
                Multi-model reasoning, tool use, and guardrails — shared by every agent,
                deployed entirely inside your environment.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
