import React, { useEffect } from 'react';
import { ArrowUpRight, Check, Shield } from 'lucide-react';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';
import { CONTACT_EMAIL, Reveal } from '@/components/home/shared';

const TIERS = [
  {
    name: 'Business',
    blurb: 'For engineering teams running production workloads.',
    bullet: '5 clusters · unlimited pods · auto-remediation · email support',
  },
  {
    name: 'Custom',
    blurb: 'For organisations with compliance and scale needs.',
    bullet: 'Unlimited scale · SOC 2 / HIPAA · SSO / SAML · SLA-backed support',
  },
];

const HIGHLIGHTS = [
  'AI Root Cause Analysis across metrics, logs, and traces',
  'SafeFix™ auto-remediation with dry-run validation',
  'Runs entirely inside your cluster — zero data exfiltration',
  'Slack & PagerDuty integrations · 90-day incident history',
];

export default function Pricing() {
  useEffect(() => {
    document.title = 'Pricing – Orkastor';
  }, []);

  return (
    <div className="lp min-h-screen">
      <Nav />

      <main className="relative overflow-hidden lp-hero-wash">
        {/* Hero */}
        <section className="relative pt-[140px] sm:pt-[164px] pb-12 sm:pb-16">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <div className="lp-eyebrow mb-5 justify-center">Pricing</div>
              <h1 className="lp-display text-[clamp(36px,5.4vw,68px)]">
                Simple pricing for{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>serious infrastructure.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--lp-ink-2)' }}>
                Our flagship product, KubeGraf, is where pricing lives today. Business for
                growing teams, Custom for organisations at scale — both run entirely inside
                your own environment.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Flagship card */}
        <section className="relative pb-20 sm:pb-28">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="lp-card p-7 sm:p-11">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="w-11 h-11 rounded-xl inline-flex items-center justify-center shrink-0"
                    style={{ background: 'var(--lp-orange)', color: '#fff', boxShadow: '0 4px 14px rgba(255,122,31,0.30)' }}
                  >
                    <Shield className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="lp-eyebrow !text-[10px]">Flagship product</div>
                    <div className="text-xl sm:text-2xl font-semibold mt-0.5" style={{ letterSpacing: '-0.025em' }}>
                      KubeGraf
                    </div>
                  </div>
                </div>

                <p className="text-[15px] sm:text-base leading-relaxed max-w-2xl mb-8" style={{ color: 'var(--lp-ink-2)' }}>
                  KubeGraf is the AI SRE platform for Kubernetes. It watches your clusters,
                  diagnoses incidents with multi-model reasoning, and applies human-approved
                  remediations — all inside your own environment, with zero external AI calls.
                </p>

                {/* Highlights */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-9">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[14px]" style={{ color: 'var(--lp-ink-2)' }}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--lp-orange-deep)' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Plans */}
                <div className="pt-8" style={{ borderTop: '1px solid var(--lp-line-soft)' }}>
                  <div className="lp-index mb-5">Plans</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {TIERS.map((t) => (
                      <div
                        key={t.name}
                        className="rounded-xl p-5"
                        style={{ background: 'rgba(22,24,29,0.03)', border: '1px solid var(--lp-line-soft)' }}
                      >
                        <div className="text-[15px] font-semibold mb-1" style={{ letterSpacing: '-0.015em' }}>{t.name}</div>
                        <div className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--lp-ink-2)' }}>{t.blurb}</div>
                        <div className="lp-mono text-[11.5px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>{t.bullet}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href="https://kubegraf.io/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lp-btn-dark group w-full sm:w-auto"
                    >
                      View KubeGraf pricing
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="lp-btn-ghost w-full sm:w-auto">
                      Talk to sales
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Trust strip */}
            <Reveal delay={120}>
              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px]"
                style={{ color: 'var(--lp-ink-3)' }}
              >
                {['Zero data exfiltration', 'Human approval gates', 'Cancel anytime'].map((t, i) => (
                  <React.Fragment key={t}>
                    {i > 0 && <span aria-hidden="true" className="hidden sm:inline w-4 h-px" style={{ background: 'var(--lp-line)' }} />}
                    <span>{t}</span>
                  </React.Fragment>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
