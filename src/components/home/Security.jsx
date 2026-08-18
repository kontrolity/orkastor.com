import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Reveal } from './shared';

const CHECKS = [
  { title: 'In-environment AI inference', text: 'Models run inside your cluster — no external LLM calls.' },
  { title: 'Zero data exfiltration', text: 'Logs, metrics, and secrets never leave your network.' },
  { title: 'Signed SafeFix™ patches', text: 'Every change is cryptographically signed and traceable.' },
  { title: 'Dry-run gated', text: 'Fixes are validated against your cluster before rollout.' },
  { title: 'Approval workflows', text: 'Human sign-off required — with optional auto-fix policies you define.' },
  { title: 'Full audit trail', text: 'Every investigation, finding, and action is logged and reviewable.' },
];

export default function Security() {
  return (
    <section id="security" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-dark)' }}>
      {/* warm floor glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 15% 110%, rgba(255,122,31,0.16), transparent 60%),' +
            'radial-gradient(ellipse 45% 50% at 90% -10%, rgba(245,159,10,0.08), transparent 60%)',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Editorial marker (dark variant) */}
        <Reveal className="flex items-center justify-between pt-6 mb-10 sm:mb-12" style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}>
          <div className="lp-eyebrow" style={{ color: 'var(--lp-amber)' }}>
            <ShieldCheck className="w-4 h-4" />
            Security &amp; privacy
          </div>
          <span className="lp-index" style={{ color: 'rgba(230,232,238,0.45)' }}>05</span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: headline + quote */}
          <Reveal>
            <h2 className="lp-display text-[clamp(28px,4.2vw,46px)]" style={{ color: '#fff' }}>
              Your data never leaves your cluster.{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange)' }}>Period.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(230,232,238,0.70)' }}>
              Most AI ops tools ship your telemetry to someone else's cloud.
              Orkastor took the opposite bet: the AI comes to your environment,
              runs there, and stays there.
            </p>
            {/* Scoped deliberately — "your cluster", not "your network", and named
                as KubeGraf rather than Orkastor-wide.
                
                This section is an absolute data-residency guarantee, and it is true
                of KubeGraf: the agent runs in the customer's cluster and inference
                happens there. It is structurally NOT true of Orkastor Cloud, where we
                operate the infrastructure and therefore hold the telemetry — the
                Cloud section three below says exactly that ("because we run it,
                KubeGraf can investigate your workloads … with nothing to install").
                
                Leaving the promise unqualified once a second product exists would
                make the page contradict itself, and a data-residency claim is the
                worst possible place for that. One sentence costs nothing and keeps
                both statements true. */}
            <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: 'rgba(230,232,238,0.55)' }}>
              This is how KubeGraf works wherever you install it — your cluster, your
              rules. Orkastor Cloud is the deliberate exception: we operate that
              infrastructure, so we hold its telemetry. That difference is the whole
              reason it needs no agent.
            </p>

          </Reveal>

          {/* Right: checklist */}
          <Reveal delay={120}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHECKS.map((c) => (
                <div
                  key={c.title}
                  className="p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#4ADE80' }} />
                    <h3 className="text-[14px] font-semibold" style={{ color: '#fff', letterSpacing: '-0.01em' }}>{c.title}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(230,232,238,0.60)' }}>{c.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
