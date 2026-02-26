import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { AlertTriangle, Search, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    id: 1,
    icon: AlertTriangle,
    title: 'Anomaly Detected',
    description: 'Orkastor detects unusual patterns across metrics, logs, and traces simultaneously — no alert rules needed.',
    detail: '⚠  api-server-7d4f8 — CrashLoopBackOff · restarts: 7 · namespace: production',
    time: 'T+0s',
    accent: '#f59e0b',
  },
  {
    id: 2,
    icon: Search,
    title: 'Root Cause Analysis',
    description: 'AI correlates signals across services and pinpoints the likely root cause with an evidence chain and confidence score.',
    detail: '94% confidence: OOMKilled — memory limit 512Mi · peak 498Mi · +40% traffic',
    time: 'T+3s',
    accent: '#3b82f6',
  },
  {
    id: 3,
    icon: Shield,
    title: 'SafeFix Proposed',
    description: 'A remediation is generated from your runbooks and historical fixes, dry-run validated before review.',
    detail: 'Proposed: increase limits → 1Gi · dry-run: PASSED · awaiting approval',
    time: 'T+8s',
    accent: '#2dd4bf',
  },
  {
    id: 4,
    icon: CheckCircle2,
    title: 'Applied & Verified',
    description: 'Fix applied in your configured approval mode. Service health confirmed, incident closed with full audit trail.',
    detail: '✓ Approved ops@company.com · ✓ Applied · incident resolved · SLO breach prevented',
    time: 'T+18s',
    accent: '#34d399',
  },
];

const MODES = [
  { label: 'Observe Only',        desc: 'Detect & alert — zero automated actions',     color: '#3b82f6' },
  { label: 'Suggest & Approve',   desc: 'AI proposes fixes, you click to apply',       color: '#2dd4bf' },
  { label: 'Auto-Fix (Low Risk)', desc: 'Auto-apply pre-approved safe patterns',       color: '#f59e0b' },
  { label: 'Full Autopilot',      desc: 'AI handles everything within defined bounds', color: '#34d399' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

export default function SafeFixWorkflow() {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep(s => s === STEPS.length ? 1 : s + 1);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="safefix"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Glows */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 80% 10%, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 20% 100%, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-emerald-500/20 text-emerald-500/60 mb-5">
            SafeFix Workflow
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-3xl mx-auto">
            Not a Black Box.{' '}
            <span className="text-gradient-violet">A Dimmer Switch.</span>
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            Every AI decision is explainable and every fix is dry-run validated before it touches production.
            You set the autonomy level — per cluster, per namespace, per risk tier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">

          {/* ── Steps ── */}
          <motion.div
            className="lg:col-span-3 space-y-3"
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <motion.div
                  key={step.id}
                  variants={itemVar}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'border-white/20 bg-white/[0.05]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.035]'
                  }`}
                >
                  {/* Active left accent */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                      style={{ background: step.accent }}
                    />
                  )}

                  {/* Hover glow */}
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${step.accent}08, transparent 70%)` }}
                    />
                  )}

                  <div className="relative flex items-start gap-4 pl-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border transition-all duration-300"
                      style={{
                        background: isActive ? `${step.accent}18` : 'rgba(255,255,255,0.04)',
                        borderColor: isActive ? `${step.accent}40` : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: isActive ? step.accent : '#64748b' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono tracking-widest text-slate-600">
                            {String(step.id).padStart(2, '0')}
                          </span>
                          <h3 className="text-white font-semibold text-sm">{step.title}</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-600">{step.time}</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">{step.description}</p>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-3 py-2.5 rounded-lg font-mono text-[11px] leading-relaxed border"
                              style={{ background: 'rgba(0,0,0,0.4)', borderColor: `${step.accent}25`, color: step.accent }}
                            >
                              {step.detail}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Progress dots */}
            <div className="flex items-center gap-2 pt-1 pl-1">
              {STEPS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: activeStep === s.id ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                    transform: activeStep === s.id ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Approval modes ── */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE_OUT_EXPO }}
          >
            <div className="bento-card p-6">
              <div className="mb-5">
                <h3 className="text-white font-bold text-base mb-1">Approval Modes</h3>
                <p className="text-slate-500 text-xs">A spectrum, not a toggle — configure per cluster or namespace</p>
              </div>

              <div className="space-y-2.5">
                {MODES.map((m, i) => (
                  <div
                    key={m.label}
                    className="group flex items-center justify-between p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1.5 h-6 rounded-full shrink-0"
                        style={{ background: m.color, opacity: 0.7 }}
                      />
                      <div>
                        <div className="text-sm font-medium text-white/80 mb-0.5">{m.label}</div>
                        <div className="text-xs text-slate-600">{m.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-slate-600 leading-relaxed">
                All modes include full audit logging, OPA policy enforcement, and zero external AI calls — inference stays inside your environment.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
