import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    desc: 'For individuals and small teams getting started.',
    cta: 'Get Started',
    ctaHref: '#cta',
    highlight: false,
    features: [
      '1 Kubernetes cluster',
      'Up to 50 pods monitored',
      'AI Root Cause Analysis',
      'SafeFix™ with manual approval',
      '7-day incident history',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: '$79', annual: '$63' },
    desc: 'For growing engineering teams running production workloads.',
    cta: 'Start Free Trial',
    ctaHref: '#cta',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Up to 5 Kubernetes clusters',
      'Unlimited pods monitored',
      'AI Root Cause Analysis',
      'SafeFix™ Auto-Remediation',
      'Dry-Run Validation + OPA policies',
      '90-day incident history',
      'Slack & PagerDuty integrations',
      'Email support',
    ],
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    desc: 'For large organisations with compliance and scale requirements.',
    cta: 'Contact Sales',
    ctaHref: '#cta',
    highlight: false,
    features: [
      'Unlimited clusters',
      'Unlimited pods monitored',
      'All Pro features',
      'SOC 2 / HIPAA / PCI-DSS reports',
      'SSO / SAML / SCIM',
      'Custom retention & audit logs',
      'Dedicated Slack channel',
      'SLA & priority support',
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
      <NavBar />

      <main className="relative pt-32 pb-24 px-5 sm:px-6 overflow-hidden">
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
              Pricing
            </span>
            <h1 className="text-[clamp(36px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-4">
              Start free. Scale when ready.
            </h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              All plans run entirely inside your environment — your data never leaves.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm transition-colors ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setAnnual((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${annual ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${annual ? 'translate-x-5' : ''}`}
                />
              </button>
              <span className={`text-sm transition-colors ${annual ? 'text-white' : 'text-slate-500'}`}>
                Annual <span className="text-teal-400 font-semibold">–20%</span>
              </span>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`bento-card p-7 flex flex-col ${plan.highlight ? 'border-blue-500/30' : ''}`}
                style={plan.highlight ? { background: 'rgba(59,130,246,0.04)' } : {}}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-white/70">{plan.name}</span>
                  {plan.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-[42px] font-black tracking-[-0.03em] text-white">
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly !== 'Custom' && (
                    <span className="text-slate-500 text-sm ml-1">/mo</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{plan.desc}</p>

                {/* CTA */}
                <a
                  href={plan.ctaHref}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold mb-8 transition-all ${
                    plan.highlight
                      ? 'btn-shimmer'
                      : 'border border-white/[0.09] text-slate-300 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04]'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                {/* Features */}
                <ul className="space-y-2.5 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-teal-500/70 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-600 text-sm mt-10">
            All plans include SOC 2 readiness, zero data exfiltration, and human approval gates.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
