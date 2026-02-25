import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Eye, Brain, Wrench, FileText } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const PILLARS = [
  {
    icon: Eye,
    title: 'Continuous Monitoring',
    description: 'Deep observability across metrics, logs, traces, and events — unified in one intelligent view across your entire infrastructure.',
    accent: '#3b82f6',
    glyph: '01',
  },
  {
    icon: Brain,
    title: 'AI-Driven Analysis',
    description: 'AI inference runs inside your VPC — no external LLM calls. Correlates signals across services and surfaces root causes with a confidence score in seconds.',
    accent: '#2dd4bf',
    glyph: '02',
  },
  {
    icon: Wrench,
    title: 'Safe Auto-Remediation',
    description: 'Fixes are dry-run validated before you approve them. Configure autonomy per cluster or namespace — from Observe Only to Full Autopilot.',
    accent: '#34d399',
    glyph: '03',
  },
  {
    icon: FileText,
    title: 'Full Audit Trail',
    description: 'Every action logged, every AI decision explained. Complete traceability for compliance, post-mortems, and peace of mind.',
    accent: '#60a5fa',
    glyph: '04',
  },
];

const STATS = [
  { val: 18,  suffix: 's', label: 'Avg. time to fix' },
  { val: 99.9, suffix: '%', label: 'Uptime maintained', decimal: true },
  { val: 85,  suffix: '%', label: 'Toil reduction' },
  { val: 3,   suffix: '×', label: 'Faster response' },
];

function AnimatedNumber({ val, suffix, decimal }) {
  const count = useMotionValue(0);
  const display = useTransform(count, v =>
    decimal ? v.toFixed(1) + suffix : Math.round(v) + suffix
  );
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, val, { duration: 1.6, ease: 'easeOut' });
    return controls.stop;
  }, [inView, count, val]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

export default function WhatIsAISRE() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle emerald glow */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 0%, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
            How It Works
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-4xl mx-auto">
            Monitor. Diagnose. Fix.{' '}
            <span className="text-gradient-cyan">Nothing Leaves Your Network.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-[600px] mx-auto leading-relaxed">
            Most tools alert. Some diagnose. Few fix. Orkastor does all three —
            across Kubernetes and cloud provider services — with AI inference running
            entirely inside your own environment. No external LLM calls. Ever.
          </p>
        </motion.div>

        {/* ── Pillar cards ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                variants={itemVar}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bento-card group relative p-6"
              >
                {/* Glyph watermark */}
                <div
                  className="absolute top-4 right-5 text-[44px] font-black leading-none pointer-events-none select-none"
                  style={{ color: 'rgba(255,255,255,0.03)' }}
                >
                  {p.glyph}
                </div>

                {/* Hover glow */}
                <div
                  className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${p.accent}14, transparent 70%)` }}
                />

                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-all duration-300 group-hover:scale-105"
                  style={{ background: `${p.accent}12`, borderColor: `${p.accent}28` }}
                >
                  <Icon className="w-5 h-5" style={{ color: p.accent }} />
                </div>

                <h3 className="relative text-white font-semibold text-base mb-2">{p.title}</h3>
                <p className="relative text-slate-500 text-sm leading-relaxed">{p.description}</p>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.accent}40, transparent)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Stats row ── */}
        <div className="section-divider mb-14" />
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {STATS.map((s, i) => (
            <motion.div key={s.label} variants={itemVar} className="text-center">
              <div className="text-[clamp(36px,5vw,52px)] font-black text-white text-glow-blue leading-none mb-2 tabular-nums">
                <AnimatedNumber val={s.val} suffix={s.suffix} decimal={s.decimal} />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
