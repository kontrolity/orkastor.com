import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Activity, Bell, GitBranch, BookOpen, Clock, Code2,
  Lock, MessageSquare, Search, Server, Settings2, Workflow,
} from 'lucide-react';

const HERO_FEATURES = [
  {
    icon: Activity,
    title: 'Real-time Observability',
    description: 'Unified view of metrics, logs, and traces across every service in your cluster — no context switching required.',
    accent: 'blue',
  },
  {
    icon: Lock,
    title: 'Air-Gapped Security',
    description: 'Runs entirely inside your cluster. Zero data exfiltration. SOC 2, HIPAA, and PCI-DSS ready.',
    accent: 'emerald',
  },
  {
    icon: Code2,
    title: 'Code-Level RCA',
    description: 'Trace incidents to the exact commit or config change that caused them — with evidence.',
    accent: 'emerald',
  },
];

const GRID_FEATURES = [
  { icon: Bell, title: 'Intelligent Alerting', desc: 'Context-aware alerts that group signals and eliminate noise.' },
  { icon: GitBranch, title: 'Change Correlation', desc: 'Automatically correlates deployments with incident timelines.' },
  { icon: BookOpen, title: 'Runbook Automation', desc: 'Convert runbooks into automated workflows with AI assistance.' },
  { icon: Clock, title: 'SLO Management', desc: 'Define, track, and enforce SLOs with automatic error budget reporting.' },
  { icon: MessageSquare, title: 'Slack & Teams Native', desc: 'Manage incidents and approve fixes without leaving chat.' },
  { icon: Search, title: 'Semantic Log Search', desc: 'Ask questions in plain English, get answers from your logs instantly.' },
  { icon: Server, title: 'Multi-Cloud', desc: 'Works across AWS, GCP, Azure, and on-premise Kubernetes clusters.' },
  { icon: Settings2, title: 'Policy as Code', desc: 'Define remediation policies in YAML or OPA — version controlled.' },
  { icon: Workflow, title: 'Workflow Builder', desc: 'Visual editor for complex multi-step remediation sequences.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

export default function FeaturesGrid() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="platform"
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Top blue glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden" animate={inView ? 'show' : 'hidden'}
          variants={fadeUp} custom={0}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/[0.10] text-white/[0.30] mb-5">
            Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            The Complete{' '}
            <span className="text-gradient-brand">AI SRE Platform</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            All the tools your team needs to achieve high reliability — without the toil.
          </p>
        </motion.div>

        {/* Hero bento row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {HERO_FEATURES.map((f, i) => {
            const Icon = f.icon;
            const isBlue = f.accent === 'blue';
            return (
              <motion.div
                key={f.title}
                className="card-specular relative group p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300 overflow-hidden"
                initial="hidden" animate={inView ? 'show' : 'hidden'}
                variants={fadeUp} custom={i + 1}
              >
                {/* Corner glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
                />

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
                >
                  <Icon className="w-6 h-6 text-slate-500" />
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Small feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GRID_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className="group flex items-start gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.04] transition-all duration-200"
                initial="hidden" animate={inView ? 'show' : 'hidden'}
                variants={fadeUp} custom={i + 4}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04] border border-white/[0.08] group-hover:border-blue-500/25 group-hover:bg-blue-500/8 transition-all duration-200">
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-0.5">{f.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
