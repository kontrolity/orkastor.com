import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal, SectionMarker } from './shared';

const ITEMS = [
  {
    q: 'How does KubeGraf run inside my environment?',
    a: 'KubeGraf installs into your cluster with Helm in minutes. All AI inference runs in-environment — there are no SaaS round-trips and no external LLM calls, so logs, metrics, and secrets never leave your network.',
  },
  {
    q: 'Will the AI change production without my approval?',
    a: 'No. Every SafeFix™ patch is validated in dry-run, cryptographically signed, and waits for human approval before rollout. Teams that want more automation can define policies to auto-apply fixes for low-risk incident classes — always with a full audit trail.',
  },
  {
    q: 'What does it integrate with?',
    a: 'Slack, PagerDuty, Prometheus, Grafana, ArgoCD, Helm, Terraform, OpenTelemetry, and the major clouds (AWS, GCP, Azure). Incidents, findings, and approvals flow to wherever your team already works.',
  },
  {
    q: 'Which clusters are supported?',
    a: 'Any conformant Kubernetes — EKS, GKE, AKS, and on-prem distributions. Multi-cluster setups are supported from a single installation.',
  },
  {
    q: 'How is it priced?',
    a: 'KubeGraf is free to start. Business and Custom tiers for larger teams are detailed on the pricing page — both run entirely inside your own environment.',
  },
];

function Item({ item, open, onToggle }) {
  return (
    <div className="lp-card overflow-hidden" style={{ borderRadius: 14 }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.015em' }}>
          {item.q}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ color: 'var(--lp-ink-3)', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 text-[14px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <SectionMarker index="08" label="FAQ" />
        <Reveal className="mb-10 sm:mb-12">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            Questions, <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>answered.</span>
          </h2>
        </Reveal>
        <Reveal>
          <div className="space-y-3">
            {ITEMS.map((item, i) => (
              <Item key={item.q} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
