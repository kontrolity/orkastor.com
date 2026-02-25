import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Brain, Wrench, FileText } from 'lucide-react';

const PILLARS = [
  {
    icon: Eye,
    title: 'Continuous Monitoring',
    description: 'Deep observability across metrics, logs, traces, and events — unified in one intelligent view across your entire infrastructure.',
    accent: 'blue',
    glyph: '01',
  },
  {
    icon: Brain,
    title: 'AI-Driven Analysis',
    description: 'AI inference runs inside your VPC — no external LLM calls. Correlates signals across services and surfaces root causes with a confidence score in seconds.',
    accent: 'emerald',
    glyph: '02',
  },
  {
    icon: Wrench,
    title: 'Safe Auto-Remediation',
    description: 'Fixes are dry-run validated before you approve them. Configure autonomy per cluster or namespace — from Observe Only to Full Autopilot.',
    accent: 'blue',
    glyph: '03',
  },
  {
    icon: FileText,
    title: 'Full Audit Trail',
    description: 'Every action logged, every AI decision explained. Complete traceability for compliance, post-mortems, and peace of mind.',
    accent: 'emerald',
    glyph: '04',
  },
];

const STATS = [
  { val: '18s', label: 'Avg. time to fix' },
  { val: '99.9%', label: 'Uptime maintained' },
  { val: '85%', label: 'Toil reduction' },
  { val: '3×', label: 'Faster incident response' },
];

function CounterStat({ val, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const match = val.match(/^([0-9.]+)(.*)$/);
    if (!match) { setDisplayed(val); return; }
    const target = parseFloat(match[1]);
    const suffix = match[2];
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplayed((Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, val]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white text-glow-cyan mb-1">{displayed}</div>
      <div className="text-slate-500 text-sm tracking-wide">{label}</div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08 } }),
};

export default function WhatIsAISRE() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle emerald glow */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 0%, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden" animate={inView ? 'show' : 'hidden'}
          variants={fadeUp} custom={0}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/[0.10] text-white/[0.30] mb-5">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            Monitor. Diagnose. Fix.{' '}
            <span className="text-gradient-cyan">Nothing Leaves Your Network.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Most tools alert. Some diagnose. Few fix. Orkastor does all three —
            across Kubernetes and cloud provider services — with AI inference running
            entirely inside your own environment. No external LLM calls. Ever.
          </p>
        </motion.div>

        {/* Bento pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            const isBlue = p.accent === 'blue';
            return (
              <motion.div
                key={p.title}
                className="card-specular relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.14] group transition-all duration-300 overflow-hidden"
                initial="hidden" animate={inView ? 'show' : 'hidden'}
                variants={fadeUp} custom={i + 1}
              >
                {/* Glyph watermark */}
                <div
                  className="absolute top-3 right-4 text-[52px] font-black leading-none pointer-events-none select-none"
                  style={{ color: 'rgba(255,255,255,0.04)' }}
                >
                  {p.glyph}
                </div>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
                >
                  <Icon className="w-5 h-5 text-slate-500" />
                </div>

                <h3 className="text-white font-semibold text-base mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.description}</p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="border-t border-white/[0.07] pt-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s) => (
            <CounterStat key={s.label} val={s.val} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
