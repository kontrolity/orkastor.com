import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, DollarSign, Lock, Cloud, GitBranch, Plus } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

const MODULES = [
  {
    icon: Activity,
    name: 'KubēGraf',
    tag: 'Available Now',
    tagStyle: 'border-teal-500/40 bg-teal-500/10 text-teal-400',
    description: 'In-environment AI SRE for Kubernetes. Monitor, diagnose, and auto-remediate — zero exfiltration.',
    accent: '#2dd4bf',
    active: true,
  },
  {
    icon: DollarSign,
    name: 'CostAI',
    tag: 'Coming Soon',
    tagStyle: 'border-white/10 bg-white/[0.04] text-slate-600',
    description: 'Cloud cost analysis & optimization. Rightsizing recommendations powered by usage AI.',
    accent: '#10b981',
    active: false,
  },
  {
    icon: Lock,
    name: 'SecuBot',
    tag: 'Coming Soon',
    tagStyle: 'border-white/10 bg-white/[0.04] text-slate-600',
    description: 'Security enforcement & best practices. Continuous compliance scanning and auto-remediation.',
    accent: '#f59e0b',
    active: false,
  },
  {
    icon: Cloud,
    name: 'InfraPilot',
    tag: 'Coming Soon',
    tagStyle: 'border-white/10 bg-white/[0.04] text-slate-600',
    description: 'Multi-cloud provisioning. Intelligent infrastructure lifecycle management across AWS, GCP, and Azure.',
    accent: '#3b82f6',
    active: false,
  },
  {
    icon: GitBranch,
    name: 'GitOps AI',
    tag: 'Coming Soon',
    tagStyle: 'border-white/10 bg-white/[0.04] text-slate-600',
    description: 'CD/GitOps automation. Smart deployment pipelines with rollback intelligence and drift detection.',
    accent: '#8b5cf6',
    active: false,
  },
];

export default function ModularPlatformSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="platform"
      className="relative py-24 md:py-28 overflow-hidden"
      style={{ backgroundColor: '#050505' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[240px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14 md:mb-18"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
            Platform
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-4xl mx-auto">
            A Platform for Every{' '}
            <span className="text-gradient-brand">AI DevOps Module</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Orkastor is designed to grow — add AI agents for any part of your infrastructure lifecycle.
          </p>
        </motion.div>

        {/* ── Module grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {MODULES.map((mod) => (
            <motion.div
              key={mod.name}
              variants={itemVar}
              whileHover={mod.active ? { y: -3, transition: { duration: 0.2 } } : {}}
              className={`bento-card group p-6 ${mod.active ? 'card-glow-border' : 'opacity-50'}`}
            >
              {/* Hover glow — active only */}
              {mod.active && (
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${mod.accent}12, transparent 65%)` }}
                />
              )}

              {/* Header row */}
              <div className="relative flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: `${mod.accent}${mod.active ? '14' : '08'}`,
                    borderColor: `${mod.accent}${mod.active ? '30' : '18'}`,
                  }}
                >
                  <mod.icon className="w-5 h-5" style={{ color: mod.active ? mod.accent : `${mod.accent}60` }} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full border ${mod.tagStyle}`}>
                  {mod.tag}
                </span>
              </div>

              <h3 className="relative text-white font-bold text-base mb-2 leading-snug">{mod.name}</h3>
              <p className="relative text-slate-500 text-sm leading-relaxed">{mod.description}</p>
            </motion.div>
          ))}

          {/* Build Your Own placeholder */}
          <motion.div
            variants={itemVar}
            className="bento-card p-6 opacity-40"
            style={{ border: '1px dashed rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-dashed border-white/10 bg-white/[0.03]">
                <Plus className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full border border-white/10 bg-white/[0.04] text-slate-600">
                Coming Soon
              </span>
            </div>
            <h3 className="text-slate-500 font-bold text-base mb-2">Build Your Own</h3>
            <p className="text-slate-700 text-sm leading-relaxed">Open plugin system — extend Orkastor with custom AI agents for any workflow.</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
