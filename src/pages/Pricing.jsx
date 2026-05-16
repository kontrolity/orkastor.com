import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Check, X, ArrowRight, ArrowUpRight, Sparkles, ChevronDown,
  Shield, Zap, Building2,
} from 'lucide-react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';
import GrainOverlay from '@/components/landing/GrainOverlay';

const EASE = [0.16, 1, 0.3, 1];

/* ── Plans ─────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: Sparkles,
    price: { monthly: 0, annual: 0 },
    priceLabel: { monthly: '$0', annual: '$0' },
    desc: 'For individuals and small teams getting started.',
    cta: 'Get Started',
    ctaHref: '#cta',
    accent: '#2DD4BF',     // teal
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
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    price: { monthly: 79, annual: 63 },
    priceLabel: { monthly: '$79', annual: '$63' },
    desc: 'For growing engineering teams running production workloads.',
    cta: 'Start Free Trial',
    ctaHref: '#cta',
    accent: '#7B4DFF',     // spectral violet
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
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: null, annual: null },
    priceLabel: { monthly: 'Custom', annual: 'Custom' },
    desc: 'For large organisations with compliance and scale requirements.',
    cta: 'Contact Sales',
    ctaHref: 'mailto:hello@orkastor.com',
    accent: '#38BDF8',     // cyan
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

/* ── Comparison matrix ─────────────────────────────────────────── */
const COMPARISON = [
  {
    section: 'Detection & RCA',
    rows: [
      { feature: 'Anomaly detection across metrics, logs, traces', free: true, pro: true, ent: true },
      { feature: 'AI Root Cause Analysis with evidence chain',     free: true, pro: true, ent: true },
      { feature: 'Confidence scoring on every cause',              free: true, pro: true, ent: true },
      { feature: 'Cross-cluster correlation',                      free: false, pro: true, ent: true },
    ],
  },
  {
    section: 'Remediation',
    rows: [
      { feature: 'SafeFix™ proposals (manual approval)', free: true, pro: true, ent: true },
      { feature: 'SafeFix™ auto-remediation',            free: false, pro: true, ent: true },
      { feature: 'Dry-run validation + OPA policies',    free: false, pro: true, ent: true },
      { feature: 'Custom remediation playbooks',         free: false, pro: false, ent: true },
    ],
  },
  {
    section: 'Scale & Limits',
    rows: [
      { feature: 'Kubernetes clusters', free: '1',  pro: '5',          ent: 'Unlimited' },
      { feature: 'Pods monitored',      free: '50', pro: 'Unlimited',  ent: 'Unlimited' },
      { feature: 'Incident history',    free: '7 days', pro: '90 days', ent: 'Custom' },
    ],
  },
  {
    section: 'Compliance & Security',
    rows: [
      { feature: 'Zero data exfiltration (local-first)', free: true, pro: true, ent: true },
      { feature: 'Audit logs',                            free: true, pro: true, ent: true },
      { feature: 'SOC 2 / HIPAA / PCI-DSS reports',       free: false, pro: false, ent: true },
      { feature: 'SSO / SAML / SCIM',                     free: false, pro: false, ent: true },
    ],
  },
  {
    section: 'Support',
    rows: [
      { feature: 'Community support (Discord)', free: true, pro: true, ent: true },
      { feature: 'Email support',                free: false, pro: true, ent: true },
      { feature: 'Dedicated Slack channel',      free: false, pro: false, ent: true },
      { feature: 'SLA-backed response time',     free: false, pro: false, ent: true },
    ],
  },
];

/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: 'What counts as a "pod" for pricing?',
    a: 'Any pod running in a namespace your Orkastor agent is watching. System pods (kube-system, orkastor-system) don\'t count toward your limit.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. Upgrades take effect immediately and are pro-rated. Downgrades take effect at the end of the current billing cycle. No annual lock-in.',
  },
  {
    q: 'Where does my data go?',
    a: 'Nowhere. Orkastor runs entirely inside your cluster. Telemetry, logs, and remediation actions stay local. We never see your infrastructure or your incident data.',
  },
  {
    q: 'Do you offer a startup discount?',
    a: 'Yes — qualifying startups (<$5M raised, <25 employees) get 50% off Pro for 12 months. Reach out to hello@orkastor.com with your funding stage.',
  },
  {
    q: 'What\'s the difference between Pro and Enterprise?',
    a: 'Pro gives growing teams production-grade auto-remediation. Enterprise adds compliance reporting (SOC 2/HIPAA/PCI-DSS), identity management (SSO/SAML/SCIM), custom playbooks, dedicated support, and SLA-backed response times.',
  },
  {
    q: 'Is there a free trial of Pro?',
    a: '14-day Pro trial, no credit card required. After 14 days you can stay on Pro, downgrade to Free, or contact sales for Enterprise.',
  },
];

/* ═════════════════════════════════════════════════════════════════
   HEADER — spectral wash + headline + billing toggle
═════════════════════════════════════════════════════════════════ */
function PricingHero({ annual, setAnnual }) {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-12">
      {/* Spectral wash */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[700px]"
          style={{
            background:
              'radial-gradient(ellipse 38% 70% at 30% 35%, rgba(255,138,61,0.18) 0%, transparent 60%),' +
              'radial-gradient(ellipse 42% 75% at 50% 35%, rgba(225,78,255,0.16) 0%, transparent 60%),' +
              'radial-gradient(ellipse 38% 70% at 70% 35%, rgba(56,189,248,0.16) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22) 25%, rgba(255,255,255,0.40) 50%, rgba(125,211,252,0.25) 75%, transparent)' }}
        />
        <GrainOverlay opacity={0.10} blendMode="overlay" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="badge-pill mb-6">
            <span className="pill-tag">Pricing</span>
            <span>Simple, transparent, no surprises</span>
          </span>
        </motion.div>

        <motion.h1
          className="h-display mb-5"
          style={{ fontSize: 'clamp(36px, 5.8vw, 76px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
        >
          <span className="text-gradient-hero">Start free.</span>{' '}
          <span className="text-spectral">Scale when ready.</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8"
          style={{ color: 'var(--ink-secondary)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
        >
          All plans run entirely inside your environment. Your data never leaves your cluster.
        </motion.p>

        {/* Billing toggle */}
        <motion.div
          className="inline-flex items-center gap-1 p-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: EASE }}
        >
          {[
            { id: 'monthly', label: 'Monthly' },
            { id: 'annual',  label: 'Annual', save: '–20%' },
          ].map((opt) => {
            const isActive = (opt.id === 'annual') === annual;
            return (
              <button
                key={opt.id}
                onClick={() => setAnnual(opt.id === 'annual')}
                className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
                style={{ color: isActive ? '#000' : 'rgba(255,255,255,0.55)' }}
              >
                {isActive && (
                  <motion.span
                    layoutId="billing-toggle-bg"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.30), 0 0 24px rgba(255,255,255,0.18)',
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">
                  {opt.label}
                  {opt.save && (
                    <span className={`ml-1.5 text-xs font-semibold ${isActive ? 'text-black/65' : 'text-sky-300'}`}>
                      {opt.save}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   PLAN CARDS
═════════════════════════════════════════════════════════════════ */
function PlanCard({ plan, annual, index, inView }) {
  const Icon = plan.icon;
  const priceLabel = annual ? plan.priceLabel.annual : plan.priceLabel.monthly;
  const isCustom = priceLabel === 'Custom';

  // Spotlight cursor effect — track mouse position
  const cardRef = useRef(null);
  const onMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.10 + index * 0.10, ease: EASE }}
      className="relative"
    >
      {/* Animated spectral border only on the highlighted plan */}
      <div className={plan.highlight ? 'card-glow-border p-px relative' : 'relative'}>
        <div
          ref={cardRef}
          onMouseMove={onMouseMove}
          className={`
            relative p-7 flex flex-col h-full overflow-hidden
            ${plan.highlight ? 'rounded-[17px]' : 'bento-card rounded-2xl'}
            spotlight-card
          `}
          style={
            plan.highlight
              ? {
                  background: 'linear-gradient(180deg, rgba(20,20,28,0.95) 0%, rgba(14,14,20,0.95) 100%)',
                  minHeight: 540,
                }
              : { minHeight: 540 }
          }
        >
          {/* Background tint glow specific to plan */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${plan.accent}22 0%, transparent 65%)`,
            }}
          />

          {/* Header row */}
          <div className="relative flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${plan.accent}1a`,
                  border: `1px solid ${plan.accent}44`,
                  boxShadow: `0 0 16px ${plan.accent}33`,
                }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color: plan.accent, width: 18, height: 18 }} />
              </div>
              <span className="text-base font-semibold text-white">{plan.name}</span>
            </div>
            {plan.badge && (
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                style={{
                  background: '#FFFFFF',
                  color: '#000',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05) inset, 0 6px 20px rgba(255,255,255,0.18)',
                }}
              >
                {plan.badge}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="relative mb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${plan.id}-${annual}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="flex items-baseline gap-1"
              >
                <span
                  className={`text-[44px] sm:text-[48px] font-bold tracking-tightest leading-none ${
                    isCustom ? '' : plan.highlight ? 'text-spectral' : ''
                  }`}
                  style={!isCustom && !plan.highlight ? { color: '#fff' } : {}}
                >
                  {priceLabel}
                </span>
                {!isCustom && (
                  <span className="text-slate-500 text-sm">/mo</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-7 relative">{plan.desc}</p>

          {/* CTA */}
          <a
            href={plan.ctaHref}
            className={`relative inline-flex items-center justify-center gap-2 mb-7 group ${
              plan.highlight ? 'btn-clerk-primary' : 'btn-ghost'
            }`}
            style={{ height: 44 }}
          >
            {plan.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* Features */}
          <ul className="relative space-y-2.5 mt-auto">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                <Check
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: plan.accent }}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function PlansGrid({ annual }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-8 sm:py-12 overflow-hidden">
      {/* Per-plan tinted washes — teal / violet / cyan to match plan accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-1/3 h-full"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(45,212,191,0.08) 0%, transparent 65%)' }}
        />
        <div className="absolute top-0 left-1/3 w-1/3 h-full"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(123,77,255,0.14) 0%, transparent 65%)' }}
        />
        <div className="absolute top-0 right-0 w-1/3 h-full"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(56,189,248,0.08) 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} annual={annual} index={i} inView={inView} />
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            'Zero data exfiltration',
            'Human approval gates',
            '14-day Pro trial — no card required',
            'Cancel anytime',
          ].map((t, i) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              {t}
              {i < 3 && <span className="text-slate-700 ml-3 hidden sm:inline">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   COMPARISON TABLE
═════════════════════════════════════════════════════════════════ */
function ComparisonCell({ value }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <Check className="w-4 h-4 text-teal-400" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="w-4 h-4 text-slate-700" />
      </div>
    );
  }
  return (
    <div className="text-center text-sm font-medium text-white/85">{value}</div>
  );
}

function ComparisonTable() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-20 sm:py-28">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(123,77,255,0.25) 50%, transparent)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="text-purple-label mb-3 inline-block">Compare plans</span>
          <h2 className="h-display text-white" style={{ fontSize: 'clamp(26px, 3.8vw, 40px)' }}>
            See every feature side by side
          </h2>
        </motion.div>

        <motion.div
          className="bento-card overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          {/* Header row */}
          <div className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-4 px-5 sm:px-7 py-5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Feature</div>
            {PLANS.map((p) => (
              <div key={p.id} className="text-center">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    color: p.accent,
                    background: `${p.accent}14`,
                    border: `1px solid ${p.accent}33`,
                  }}
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>

          {/* Sections */}
          {COMPARISON.map((section, sIdx) => (
            <div key={section.section} className={sIdx > 0 ? 'border-t' : ''}
              style={sIdx > 0 ? { borderColor: 'rgba(255,255,255,0.05)' } : {}}
            >
              {/* Section header */}
              <div className="px-5 sm:px-7 py-3"
                style={{ background: 'rgba(255,255,255,0.015)' }}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {section.section}
                </span>
              </div>
              {/* Rows */}
              {section.rows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-4 px-5 sm:px-7 py-3.5 items-center transition-colors hover:bg-white/[0.02]"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="text-sm text-slate-300">{row.feature}</div>
                  <ComparisonCell value={row.free} />
                  <ComparisonCell value={row.pro} />
                  <ComparisonCell value={row.ent} />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   FAQ
═════════════════════════════════════════════════════════════════ */
function FAQItem({ q, a, index, inView }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
      className="bento-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left flex items-center justify-between gap-4 p-5 sm:p-6 group"
      >
        <span className="text-sm sm:text-base font-medium text-white">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 group-hover:text-white"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-slate-400 leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PricingFAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Cool ambient wash */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 30% 20%, rgba(56,189,248,0.08) 0%, transparent 65%)' }}
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 80% 80%, rgba(123,77,255,0.08) 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="text-purple-label mb-3 inline-block">Questions</span>
          <h2 className="h-display text-white" style={{ fontSize: 'clamp(26px, 3.8vw, 40px)' }}>
            Frequently asked
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BOTTOM CTA
═════════════════════════════════════════════════════════════════ */
function PricingBottomCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="cta" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Spectral wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px]"
          style={{
            background:
              'radial-gradient(ellipse 40% 60% at 30% 50%, rgba(255,138,61,0.18) 0%, transparent 60%),' +
              'radial-gradient(ellipse 45% 70% at 50% 50%, rgba(123,77,255,0.22) 0%, transparent 60%),' +
              'radial-gradient(ellipse 40% 60% at 70% 50%, rgba(56,189,248,0.18) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        <GrainOverlay opacity={0.10} blendMode="overlay" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <motion.h2
          className="h-display mb-5"
          style={{ fontSize: 'clamp(28px, 4.4vw, 52px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="text-gradient-hero">Ready to ship </span>
          <span className="text-spectral">production-grade AI SRE?</span>
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto"
          style={{ color: 'var(--ink-secondary)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.10, ease: EASE }}
        >
          Start free in 5 minutes. No credit card. Your data never leaves your cluster.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
        >
          <a href="#cta" className="btn-clerk-primary group">
            <Sparkles className="w-4 h-4 opacity-80" />
            Start Free
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a href="mailto:hello@orkastor.com" className="btn-ghost">
            <Shield className="w-4 h-4" />
            Talk to Sales
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   PAGE
═════════════════════════════════════════════════════════════════ */
export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--void-base)' }}>
      <NavBar />

      <main className="relative">
        <PricingHero annual={annual} setAnnual={setAnnual} />
        <PlansGrid annual={annual} />
        <ComparisonTable />
        <PricingFAQ />
        <PricingBottomCTA />
      </main>

      <Footer />
    </div>
  );
}
