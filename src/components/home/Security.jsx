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
              Your data never leaves your network.{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange)' }}>Period.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(230,232,238,0.70)' }}>
              Most AI ops tools ship your telemetry to someone else's cloud.
              Orkastor took the opposite bet: the AI comes to your environment,
              runs there, and stays there.
            </p>

            {/* Pull quote (from our published testimonials) */}
            <figure
              className="mt-8 p-5 rounded-2xl max-w-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <blockquote className="text-[15px] leading-relaxed" style={{ color: 'rgba(230,232,238,0.88)' }}>
                “We tried 3 other AIOps tools before Orkastor. None of them ran in our
                private cluster. The zero-data-exfiltration guarantee made the security
                review a non-event.”
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: 'rgba(255,122,31,0.15)', color: 'var(--lp-orange)', border: '1px solid rgba(255,122,31,0.30)' }}
                >
                  PN
                </span>
                <span className="text-[13px]" style={{ color: 'rgba(230,232,238,0.60)' }}>
                  <span className="font-semibold" style={{ color: '#fff' }}>Priya Nair</span> · Head of Platform, HealthStream
                </span>
              </figcaption>
            </figure>
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
