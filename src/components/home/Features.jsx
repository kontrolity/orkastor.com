import React from 'react';
import {
  GitPullRequestArrow, Network, PlugZap, ShieldCheck, Sparkles, UserCheck,
} from 'lucide-react';
import { Reveal, SectionHead } from './shared';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Evidence-chain RCA',
    text: 'Logs, metrics, events, and deployments fused into one causal timeline, with a confidence score on every finding.',
  },
  {
    icon: GitPullRequestArrow,
    title: 'SafeFix™ remediation',
    text: 'AI-generated patches that are cryptographically signed and validated in dry-run before anything touches production.',
  },
  {
    icon: UserCheck,
    title: 'Human-in-the-loop',
    text: 'Nothing ships without your approval. Review the diff, see the blast radius, approve or dismiss in one click.',
  },
  {
    icon: Network,
    title: 'Live cluster intelligence',
    text: 'A real-time graph of workloads, nodes, and dependencies — so the agent reasons about your system, not just one pod.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'AI inference runs inside your environment. No SaaS round-trips, no external LLM calls, zero data exfiltration.',
  },
  {
    icon: PlugZap,
    title: 'Plugs into your stack',
    text: 'Slack, PagerDuty, Prometheus, Grafana, ArgoCD, and more — KubeGraf meets your team where it already works.',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <div className="lp-card lp-card-hover p-6 h-full">
                <span
                  className="w-10 h-10 rounded-xl inline-flex items-center justify-center mb-4"
                  style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                >
                  <f.icon className="w-[18px] h-[18px]" />
                </span>
                <h3 className="text-[16px] font-semibold mb-1.5" style={{ letterSpacing: '-0.015em' }}>{f.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
