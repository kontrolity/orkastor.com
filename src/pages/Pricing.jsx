import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowUpRight, Shield, Sparkles } from 'lucide-react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';
import GrainOverlay from '@/components/landing/GrainOverlay';

const EASE = [0.16, 1, 0.3, 1];

/* ── KubēGraf tier summary — 2 short lines, no marketing detail ─ */
const TIERS = [
  {
    name:  'Business',
    blurb: 'For engineering teams running production workloads.',
    bullet: '5 clusters · unlimited pods · auto-remediation · email support',
  },
  {
    name:  'Custom',
    blurb: 'For organisations with compliance and scale needs.',
    bullet: 'Unlimited scale · SOC 2 / HIPAA · SSO / SAML · SLA-backed support',
  },
];

const KUBEGRAF_HIGHLIGHTS = [
  'AI Root Cause Analysis across metrics, logs, and traces',
  'SafeFix™ auto-remediation with dry-run validation',
  'Runs entirely inside your cluster — zero data exfiltration',
  'Slack & PagerDuty integrations · 90-day incident history',
];

/* ═════════════════════════════════════════════════════════════════
   HERO
═════════════════════════════════════════════════════════════════ */
function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[700px]"
          style={{
            background:
              'radial-gradient(ellipse 38% 70% at 30% 35%, rgba(255,138,61,0.16) 0%, transparent 60%),' +
              'radial-gradient(ellipse 42% 75% at 50% 35%, rgba(225,78,255,0.14) 0%, transparent 60%),' +
              'radial-gradient(ellipse 38% 70% at 70% 35%, rgba(56,189,248,0.14) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22) 25%, rgba(255,255,255,0.40) 50%, rgba(125,211,252,0.25) 75%, transparent)' }}
        />
        <GrainOverlay opacity={0.10} blendMode="overlay" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <motion.span
          className="badge-pill mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="pill-tag">Pricing</span>
          <span>Lives at KubēGraf</span>
        </motion.span>

        <motion.h1
          className="h-display mb-5"
          style={{ fontSize: 'clamp(36px, 5.6vw, 72px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
        >
          <span className="text-gradient-hero">Simple pricing for </span>
          <span className="text-spectral">AI-driven Kubernetes SRE</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: 'var(--ink-secondary)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
        >
          Orkastor's flagship product, <span className="text-white font-medium">KubēGraf</span>,
          is where our pricing lives today. Business for growing teams, Custom for organisations
          at scale — both run entirely inside your own environment.
        </motion.p>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   KUBĒGRAF CARD — what it is + tier summary + CTA
═════════════════════════════════════════════════════════════════ */
function KubeGrafCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-12 sm:py-16">
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="card-glow-border p-px"
        >
          <div
            className="relative rounded-[17px] p-7 sm:p-10 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,28,0.92) 0%, rgba(14,14,20,0.92) 100%)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(123,77,255,0.10)',
                  border: '1px solid rgba(123,77,255,0.30)',
                  boxShadow: '0 0 20px rgba(123,77,255,0.20)',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#A78BFA' }} />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.14em] text-purple-label">
                  Flagship Product
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-0.5">
                  KubēGraf
                </div>
              </div>
            </div>

            {/* What it is */}
            <p className="text-base text-slate-300 leading-relaxed mb-7 max-w-2xl">
              KubēGraf is the AI SRE platform for Kubernetes. It watches your clusters,
              diagnoses incidents with multi-model reasoning, and applies human-approved
              remediations — all inside your own environment, with zero external AI calls.
            </p>

            {/* Highlights */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
              {KUBEGRAF_HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-sky-300" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Tier summary */}
            <div className="pt-6 mt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate-500 mb-4">
                Plans
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                {TIERS.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="text-sm font-semibold text-white mb-1">{t.name}</div>
                    <div className="text-xs text-slate-400 leading-relaxed mb-2">{t.blurb}</div>
                    <div className="text-[11px] font-mono text-slate-500 leading-relaxed">{t.bullet}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://kubegraf.io/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-clerk-primary group"
                >
                  View KubēGraf pricing
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="mailto:hello@orkastor.com"
                  className="btn-ghost"
                >
                  <Shield className="w-4 h-4" />
                  Talk to sales
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" />Zero data exfiltration</span>
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" />Human approval gates</span>
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" />Cancel anytime</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   PAGE
═════════════════════════════════════════════════════════════════ */
export default function Pricing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--void-base)' }}>
      <NavBar />

      <main className="relative pb-20">
        <PricingHero />
        <KubeGrafCard />
      </main>

      <Footer />
    </div>
  );
}
