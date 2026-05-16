import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { AlertTriangle, Search, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    id: 1,
    icon: AlertTriangle,
    title: 'Anomaly Detected',
    description: 'Orkastor detects unusual patterns across metrics, logs, and traces simultaneously — no alert rules needed.',
    detail: '⚠  api-server-7d4f8 — CrashLoopBackOff · restarts: 7 · namespace: production',
    time: 'T+0s',
    elapsed: 0,           // seconds since incident start
    accent: '#F59E0B',
    /** Which approval mode this step lives under */
    mode: 'Observe Only',
  },
  {
    id: 2,
    icon: Search,
    title: 'Root Cause Analysis',
    description: 'AI correlates signals across services and pinpoints the likely root cause with an evidence chain and confidence score.',
    detail: '94% confidence: OOMKilled — memory limit 512Mi · peak 498Mi · +40% traffic',
    time: 'T+3s',
    elapsed: 3,
    accent: '#A78BFA',
    mode: 'Observe Only',
  },
  {
    id: 3,
    icon: Shield,
    title: 'SafeFix Proposed',
    description: 'A remediation is generated from your runbooks and historical fixes, dry-run validated before review.',
    detail: 'Proposed: increase limits → 1Gi · dry-run: PASSED · awaiting approval',
    time: 'T+8s',
    elapsed: 8,
    accent: '#6C47FF',
    mode: 'Suggest & Approve',
  },
  {
    id: 4,
    icon: CheckCircle2,
    title: 'Applied & Verified',
    description: 'Fix applied in your configured approval mode. Service health confirmed, incident closed with full audit trail.',
    detail: '✓ Approved ops@company.com · ✓ Applied · incident resolved · SLO breach prevented',
    time: 'T+18s',
    elapsed: 18,
    accent: '#34D399',
    mode: 'Auto-Fix (Low Risk)',
  },
];

const MODES = [
  { label: 'Observe Only',        desc: 'Detect & alert — zero automated actions',     color: '#A78BFA' },
  { label: 'Suggest & Approve',   desc: 'AI proposes fixes, you click to apply',       color: '#6C47FF' },
  { label: 'Auto-Fix (Low Risk)', desc: 'Auto-apply pre-approved safe patterns',       color: '#0EA5E9' },
  { label: 'Full Autopilot',      desc: 'AI handles everything within defined bounds', color: '#34D399' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const TOTAL_ELAPSED = STEPS[STEPS.length - 1].elapsed; // 18s — used to scale the timeline

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

  const activeData = STEPS.find(s => s.id === activeStep) || STEPS[0];
  // Percentage of the elapsed-time axis covered by the active step.
  // Used for both the top progress bar and the vertical connector fill.
  const elapsedPct = (activeData.elapsed / TOTAL_ELAPSED) * 100;
  // Vertical fill stops at the centre of the active step's icon row.
  const stepFillPct = ((activeStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <section
      ref={sectionRef}
      id="safefix"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--void-base)' }}
    >
      {/* Ambient glow — accent colour drifts with the active step */}
      <motion.div
        className="absolute top-0 right-0 w-[700px] h-[500px] pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 60% 55% at 80% 10%, ${activeData.accent}1a 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[640px] h-[440px] pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 60% 55% at 15% 95%, ${activeData.accent}12 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5"
            style={{
              border: '1px solid rgba(108,71,255,0.2)',
              color: 'rgba(108,71,255,0.6)',
              background: 'rgba(108,71,255,0.04)',
            }}
          >
            SafeFix Workflow
          </span>
          <h2 className="text-[clamp(26px,4vw,44px)] font-black tracking-[-0.03em] text-white mb-5 max-w-3xl mx-auto">
            Not a Black Box.{' '}
            <span className="text-gradient-brand">A Dimmer Switch.</span>
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            Every AI decision is explainable and every fix is dry-run validated before it touches production.
            You set the autonomy level — per cluster, per namespace, per risk tier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">

          {/* Steps + timeline */}
          <motion.div
            className="lg:col-span-3"
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {/* ── Top time-axis progress bar ──────────────────────────
             * Time markers float over a horizontal track whose fill
             * advances with the active step's elapsed seconds.
             */}
            <motion.div variants={itemVar} className="mb-5 px-1">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-600 mb-2">
                {STEPS.map(s => (
                  <span
                    key={s.id}
                    style={{
                      color: activeStep >= s.id ? s.accent : 'rgba(255,255,255,0.25)',
                      transition: 'color .35s ease',
                    }}
                  >
                    {s.time}
                  </span>
                ))}
              </div>
              <div
                className="relative h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{
                    background: `linear-gradient(90deg, ${STEPS[0].accent} 0%, ${STEPS[1].accent} 35%, ${STEPS[2].accent} 70%, ${STEPS[3].accent} 100%)`,
                    boxShadow: `0 0 12px ${activeData.accent}aa`,
                    borderRadius: '999px',
                  }}
                  animate={{ width: `${elapsedPct}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
                {/* Pulsing leading dot at the head of the fill */}
                <motion.div
                  className="absolute top-1/2 w-2.5 h-2.5 rounded-full -translate-y-1/2 -translate-x-1/2"
                  style={{
                    background: activeData.accent,
                    boxShadow: `0 0 10px ${activeData.accent}, 0 0 20px ${activeData.accent}aa`,
                  }}
                  animate={{ left: `${elapsedPct}%`, scale: [1, 1.25, 1] }}
                  transition={{
                    left: { duration: 0.9, ease: EASE },
                    scale: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                />
              </div>
            </motion.div>

            {/* ── Step cards with a connecting vertical timeline ─────── */}
            <div className="relative space-y-3">
              {/* Background rail — runs through the centre of every icon */}
              <div
                className="absolute left-[33px] top-9 bottom-9 w-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                aria-hidden="true"
              />
              {/* Foreground gradient fill — height tracks the active step */}
              <motion.div
                className="absolute left-[33px] top-9 w-px"
                style={{
                  background: `linear-gradient(180deg, ${STEPS[0].accent} 0%, ${STEPS[1].accent} 33%, ${STEPS[2].accent} 66%, ${STEPS[3].accent} 100%)`,
                  boxShadow: `0 0 8px ${activeData.accent}80`,
                }}
                animate={{ height: `calc(${stepFillPct}% + 0px)` }}
                transition={{ duration: 0.8, ease: EASE }}
                aria-hidden="true"
              />

              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                const isPast = activeStep > step.id;
                return (
                  <motion.div
                    key={step.id}
                    variants={itemVar}
                    onClick={() => setActiveStep(step.id)}
                    className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden"
                    style={{
                      border: isActive
                        ? `1px solid ${step.accent}55`
                        : '1px solid rgba(255,255,255,0.06)',
                      background: isActive
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(255,255,255,0.015)',
                      boxShadow: isActive ? `0 16px 40px -20px ${step.accent}55` : 'none',
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${step.accent}10, transparent 70%)`,
                        }}
                      />
                    )}

                    <div className="relative flex items-start gap-4 pl-1">
                      {/* Icon + pulsing sonar rings on the active step */}
                      <div className="relative shrink-0 mt-0.5">
                        {isActive && (
                          <>
                            <motion.span
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              style={{ border: `1.5px solid ${step.accent}` }}
                              animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                            />
                            <motion.span
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              style={{ border: `1.5px solid ${step.accent}` }}
                              animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                            />
                          </>
                        )}
                        <motion.div
                          className="relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300"
                          animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                          transition={isActive ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
                          style={{
                            background: isActive || isPast
                              ? `${step.accent}1f`
                              : 'rgba(255,255,255,0.03)',
                            borderColor: isActive
                              ? `${step.accent}70`
                              : isPast
                                ? `${step.accent}30`
                                : 'rgba(255,255,255,0.07)',
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: isActive ? step.accent : isPast ? `${step.accent}` : '#3D3460' }}
                          />
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2.5">
                            {/* Gradient step number — fills when active or past */}
                            <span
                              className="text-[11px] font-mono tracking-widest font-bold"
                              style={{
                                color: isActive || isPast ? step.accent : 'rgba(255,255,255,0.18)',
                                textShadow: isActive ? `0 0 12px ${step.accent}66` : 'none',
                                transition: 'color .35s ease, text-shadow .35s ease',
                              }}
                            >
                              {String(step.id).padStart(2, '0')}
                            </span>
                            <h3
                              className="font-semibold text-sm"
                              style={{ color: isActive ? '#fff' : isPast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)' }}
                            >
                              {step.title}
                            </h3>
                          </div>
                          <span
                            className="text-xs font-mono"
                            style={{
                              color: isActive ? step.accent : isPast ? `${step.accent}aa` : 'rgba(255,255,255,0.25)',
                              transition: 'color .35s ease',
                            }}
                          >
                            {step.time}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">{step.description}</p>

                        <AnimatePresence mode="wait">
                          {isActive && (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.28 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="relative px-3 py-2.5 rounded-lg font-mono text-[11px] leading-relaxed overflow-hidden"
                                style={{
                                  background: 'rgba(0,0,0,0.45)',
                                  border: `1px solid ${step.accent}33`,
                                  color: step.accent,
                                }}
                              >
                                {/* Shimmer sweep across the detail line */}
                                <motion.span
                                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                                  style={{
                                    background: `linear-gradient(90deg, transparent 0%, ${step.accent}26 50%, transparent 100%)`,
                                  }}
                                  initial={{ left: '-35%' }}
                                  animate={{ left: '105%' }}
                                  transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
                                />
                                <span className="relative">{step.detail}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-3 pl-1">
              {STEPS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: activeStep === s.id ? s.accent : 'rgba(255,255,255,0.15)',
                    transform: activeStep === s.id ? 'scale(1.6)' : 'scale(1)',
                    boxShadow: activeStep === s.id ? `0 0 8px ${s.accent}aa` : 'none',
                  }}
                  aria-label={`Go to step ${s.id}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Approval modes — the row matching the active step lights up */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
          >
            <div className="bento-card p-6">
              <div className="mb-5">
                <h3 className="text-white font-bold text-base mb-1">Approval Modes</h3>
                <p className="text-slate-500 text-xs">A spectrum, not a toggle — configure per cluster or namespace</p>
              </div>

              <div className="space-y-2.5">
                {MODES.map((m) => {
                  // A mode is "live" while the current step belongs to it.
                  const isLive = activeData.mode === m.label;
                  return (
                    <motion.div
                      key={m.label}
                      animate={{
                        borderColor: isLive ? `${m.color}66` : 'rgba(255,255,255,0.06)',
                        backgroundColor: isLive ? `${m.color}10` : 'rgba(255,255,255,0.02)',
                        boxShadow: isLive ? `0 8px 24px -12px ${m.color}55` : '0 0 0 rgba(0,0,0,0)',
                      }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="group flex items-center justify-between p-3.5 rounded-xl cursor-default border"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-1.5 h-6 rounded-full shrink-0"
                          style={{ background: m.color }}
                          animate={{ opacity: isLive ? 1 : 0.55, boxShadow: isLive ? `0 0 10px ${m.color}` : '0 0 0 transparent' }}
                          transition={{ duration: 0.45, ease: EASE }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className="text-sm font-medium"
                              style={{ color: isLive ? '#fff' : 'rgba(255,255,255,0.78)' }}
                            >
                              {m.label}
                            </div>
                            {isLive && (
                              <motion.span
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -4 }}
                                className="flex items-center gap-1 text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: `${m.color}26`,
                                  color: m.color,
                                  border: `1px solid ${m.color}44`,
                                }}
                              >
                                <span className="w-1 h-1 rounded-full" style={{ background: m.color }} />
                                Live
                              </motion.span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">{m.desc}</div>
                        </div>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 transition-all duration-200"
                        style={{
                          color: isLive ? m.color : 'rgba(255,255,255,0.2)',
                          transform: isLive ? 'translateX(2px)' : 'translateX(0)',
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <div
                className="mt-5 pt-4 text-xs text-slate-600 leading-relaxed"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                All modes include full audit logging, OPA policy enforcement, and zero external AI calls.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
