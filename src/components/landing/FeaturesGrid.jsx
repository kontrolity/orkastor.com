import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Activity, Bell, GitBranch, BookOpen, Clock, Code2,
  Lock, MessageSquare, Search, Server, Settings2, SlidersHorizontal,
} from 'lucide-react';

const HERO_FEATURES = [
  {
    icon: Activity,
    title: 'Unified Observability',
    description: 'Metrics, logs, traces, and events across Kubernetes, AWS, GCP, and Azure — one intelligent view, no context switching, no data leaving your environment.',
    accent: 'blue',
  },
  {
    icon: Lock,
    title: 'Private In-Environment AI',
    description: 'AI inference runs inside your own VPC — no calls to OpenAI, Bedrock, or any external LLM. Zero data exfiltration. SOC 2, HIPAA, and PCI-DSS ready by design.',
    accent: 'emerald',
  },
  {
    icon: Code2,
    title: 'Deployment-Aware RCA',
    description: 'Trace incidents to the exact deploy or config change that caused them — with a full evidence chain and confidence score before a fix is proposed.',
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
  { icon: Server, title: 'Multi-Cloud', desc: 'Works across AWS, GCP, Azure, and on-premise Kubernetes clusters — one agent, one audit trail.' },
  { icon: Settings2, title: 'Policy as Code', desc: 'Define remediation policies in YAML or OPA — version controlled, auditable, and enforced automatically.' },
  { icon: SlidersHorizontal, title: 'Configurable Autonomy', desc: 'Not binary — a spectrum. Set Observe Only, Suggest & Approve, or Full Autopilot per cluster or namespace.' },
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
            Platform Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            From Alert to Resolution —{' '}
            <span className="text-gradient-brand">One Platform, Zero SaaS</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Unlike point solutions that only alert or only diagnose, Orkastor closes the full loop —
            and everything runs inside your own environment.
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
