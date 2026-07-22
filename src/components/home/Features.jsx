import React from 'react';
import {
  GitPullRequestArrow, Network, PlugZap, ShieldCheck, Sparkles, UserCheck,
} from 'lucide-react';
import { Reveal, SectionHead } from './shared';

/* Bento grid: two feature cards with mini-visuals, four compact cards. */

function MiniChain() {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
      {['alert', 'deploy', 'root cause'].map((s, i, arr) => (
        <React.Fragment key={s}>
          <span
            className="lp-mono text-[11px] px-2.5 py-1 rounded-lg"
            style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)', border: '1px solid rgba(255,122,31,0.20)' }}
          >
            {s}
          </span>
          {i < arr.length - 1 && <span style={{ color: 'var(--lp-ink-3)' }}>→</span>}
        </React.Fragment>
      ))}
      <span className="lp-mono text-[11px] font-semibold ml-1" style={{ color: 'var(--lp-green)' }}>96% conf.</span>
    </div>
  );
}

function MiniDiff() {
  return (
    <div className="mt-5 lp-console px-4 py-3 lp-mono text-[11.5px] leading-relaxed">
      <div style={{ color: '#F87171' }}>- memory: "512Mi"</div>
      <div style={{ color: '#4ADE80' }}>+ memory: "1Gi"   <span style={{ color: 'rgba(230,232,238,0.4)' }}># signed · dry-run ✓</span></div>
    </div>
  );
}

const BIG = [
  {
    icon: Sparkles,
    title: 'Evidence-chain RCA',
    text: 'Logs, metrics, events, and deployments fused into one causal timeline, with a confidence score on every finding — auditable, not oracular.',
    Visual: MiniChain,
  },
  {
    icon: GitPullRequestArrow,
    title: 'SafeFix™ remediation',
    text: 'AI-generated patches that are cryptographically signed and validated in dry-run before anything touches production.',
    Visual: MiniDiff,
  },
];

const SMALL = [
  {
    icon: UserCheck,
    title: 'Human-in-the-loop',
    text: 'Nothing ships without approval. Review the diff and blast radius, approve or dismiss in one click.',
  },
  {
    icon: Network,
    title: 'Live cluster intelligence',
    text: 'A real-time graph of workloads, nodes, and dependencies — the agent reasons about your system, not one pod.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'AI inference runs inside your environment. No SaaS round-trips, zero data exfiltration.',
  },
  {
    icon: PlugZap,
    title: 'Plugs into your stack',
    text: 'Slack, PagerDuty, Prometheus, Grafana, ArgoCD, and more — where your team already works.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHead
          eyebrow="Why teams pick KubeGraf"
          title={<>Everything an on-call engineer wishes they had <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>at 3 a.m.</span></>}
          sub="Not another dashboard. An agent that investigates like your best SRE — and shows its work."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {BIG.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="lp-card lp-card-hover p-7 h-full flex flex-col">
                <span
                  className="w-11 h-11 rounded-xl inline-flex items-center justify-center mb-4"
                  style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                >
                  <f.icon className="w-5 h-5" />
                </span>
                <h3 className="text-[18px] font-semibold mb-2" style={{ letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>{f.text}</p>
                <div className="mt-auto"><f.Visual /></div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SMALL.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div className="lp-card lp-card-hover p-6 h-full">
                <span
                  className="w-10 h-10 rounded-xl inline-flex items-center justify-center mb-4"
                  style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                >
                  <f.icon className="w-[18px] h-[18px]" />
                </span>
                <h3 className="text-[15.5px] font-semibold mb-1.5" style={{ letterSpacing: '-0.015em' }}>{f.title}</h3>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
