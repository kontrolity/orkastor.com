import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, DollarSign, Lock, Cloud, GitBranch, Plus } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const MODULES = [
  {
    icon: Activity,
    name: 'KubēGraf',
    tag: 'Available Now',
    tagColor: 'rgba(119,72,246,0.4)',
    tagBg: 'rgba(119,72,246,0.1)',
    tagText: '#A78BFA',
    description: 'In-environment AI SRE for Kubernetes. Monitor, diagnose, and auto-remediate — zero exfiltration.',
    accent: '#7748F6',
    active: true,
  },
  {
    icon: DollarSign,
    name: 'CostAI',
    tag: 'Coming Soon',
    tagColor: 'rgba(255,255,255,0.08)',
    tagBg: 'rgba(255,255,255,0.03)',
    tagText: '#374151',
    description: 'Cloud cost analysis & optimization. Rightsizing recommendations powered by usage AI.',
    accent: '#0EA5E9',
    active: false,
  },
  {
    icon: Lock,
    name: 'SecuBot',
    tag: 'Coming Soon',
    tagColor: 'rgba(255,255,255,0.08)',
    tagBg: 'rgba(255,255,255,0.03)',
    tagText: '#374151',
    description: 'Security enforcement & best practices. Continuous compliance scanning and auto-remediation.',
    accent: '#F59E0B',
    active: false,
  },
  {
    icon: Cloud,
    name: 'InfraPilot',
    tag: 'Coming Soon',
    tagColor: 'rgba(255,255,255,0.08)',
    tagBg: 'rgba(255,255,255,0.03)',
    tagText: '#374151',
    description: 'Multi-cloud provisioning. Intelligent infrastructure lifecycle management across AWS, GCP, and Azure.',
    accent: '#7748F6',
    active: false,
  },
  {
    icon: GitBranch,
    name: 'GitOps AI',
    tag: 'Coming Soon',
    tagColor: 'rgba(255,255,255,0.08)',
    tagBg: 'rgba(255,255,255,0.03)',
    tagText: '#374151',
    description: 'CD/GitOps automation. Smart deployment pipelines with rollback intelligence and drift detection.',
    accent: '#0EA5E9',
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
      style={{ backgroundColor: '#1E1A33' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[240px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(119,72,246,0.08) 0%, rgba(14,165,233,0.03) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* Section header */}
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5"
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
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

        {/* Module grid */}
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
              {mod.active && (
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${mod.accent}10, transparent 65%)`,
                  }}
                />
              )}

              <div className="relative flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: `${mod.accent}${mod.active ? '14' : '08'}`,
                    borderColor: `${mod.accent}${mod.active ? '30' : '18'}`,
                  }}
                >
                  <mod.icon
                    className="w-5 h-5"
                    style={{ color: mod.active ? mod.accent : `${mod.accent}60` }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full border"
                  style={{
                    borderColor: mod.tagColor,
                    background: mod.tagBg,
                    color: mod.tagText,
                  }}
                >
                  {mod.tag}
                </span>
              </div>

              <h3 className="relative text-white font-bold text-base mb-2 leading-snug">{mod.name}</h3>
              <p className="relative text-slate-500 text-sm leading-relaxed">{mod.description}</p>
            </motion.div>
          ))}

          {/* Build Your Own */}
          <motion.div
            variants={itemVar}
            className="bento-card p-6 opacity-40"
            style={{ border: '1px dashed rgba(255,255,255,0.10)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  border: '1px dashed rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <Plus className="w-5 h-5 text-slate-600" />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#374151',
                }}
              >
                Coming Soon
              </span>
            </div>
            <h3 className="text-slate-500 font-bold text-base mb-2">Build Your Own</h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Open plugin system — extend Orkastor with custom AI agents for any workflow.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
