import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Activity, Bell, GitBranch, BookOpen, Clock, Code2,
  Lock, MessageSquare, Search, Server, Settings2, SlidersHorizontal,
} from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

/* ── Bento hero card ────────────────────────────────────────── */
function HeroCard({ icon: Icon, title, description, accentColor, colSpan = '', rowSpan = '', children }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`bento-card group p-7 ${colSpan} ${rowSpan}`}
    >
      {/* Hover glow */}
      <div
        className="absolute top-0 left-0 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${accentColor}18, transparent 70%)` }}
      />

      <div
        className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 border shrink-0 transition-all duration-300 group-hover:scale-105"
        style={{ background: `${accentColor}12`, borderColor: `${accentColor}28` }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>

      <h3 className="relative text-white font-bold text-lg mb-2.5 leading-snug">{title}</h3>
      <p className="relative text-slate-500 text-sm leading-relaxed">{description}</p>
      {children}
    </motion.div>
  );
}

/* ── Small feature row card ─────────────────────────────────── */
function SmallCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bento-card group flex items-start gap-4 p-5"
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-white/[0.07] bg-white/[0.04] group-hover:border-blue-500/25 group-hover:bg-blue-500/8 transition-all duration-300">
        <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors duration-300" />
      </div>
      <div>
        <h4 className="text-white text-sm font-semibold mb-1">{title}</h4>
        <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ── Private AI card with visual ────────────────────────────── */
function PrivateAICard() {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bento-card group p-7 lg:col-span-2 lg:row-span-2 flex flex-col"
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 w-full h-48 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(52,211,153,0.10), transparent 70%)' }}
      />

      <div className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-all duration-300 group-hover:scale-105"
           style={{ background: '#34d39912', borderColor: '#34d39928' }}>
        <Lock className="w-5 h-5 text-emerald-400" />
      </div>

      <h3 className="relative text-white font-bold text-xl mb-3 leading-snug">Private In-Environment AI</h3>
      <p className="relative text-slate-500 text-sm leading-relaxed mb-6">
        AI inference runs inside your own VPC — no calls to OpenAI, Bedrock, or any external LLM.
        Zero data exfiltration. SOC 2, HIPAA, and PCI-DSS ready by design.
      </p>

      {/* Visual: network diagram showing data staying inside */}
      <div className="relative mt-auto flex-1 min-h-[140px] rounded-2xl border border-white/[0.06] bg-black/40 overflow-hidden flex items-center justify-center">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-line-grid opacity-40" />

        {/* VPC boundary */}
        <div className="relative border-2 border-dashed border-emerald-500/20 rounded-2xl p-6 flex items-center gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center mb-2 mx-auto">
              <Server className="w-5 h-5 text-slate-500" />
            </div>
            <div className="text-[10px] text-slate-600 font-mono">Your Cluster</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-px bg-gradient-to-r from-emerald-500/60 to-blue-500/60" />
            <div className="text-[9px] text-emerald-600/70 font-mono tracking-wider">INSIDE VPC</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl border border-emerald-500/25 bg-emerald-500/8 flex items-center justify-center mb-2 mx-auto shadow-glow-violet">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-[10px] text-emerald-600 font-mono">AI Engine</div>
          </div>
        </div>

        {/* "NO EXTERNAL" label */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md border border-red-500/20 bg-red-500/8 text-[10px] font-semibold text-red-400 font-mono tracking-wider">
          0 external calls
        </div>
      </div>
    </motion.div>
  );
}

/* ── Observability card with metric visualization ───────────── */
function ObservabilityCard() {
  const bars = [65, 80, 45, 90, 70, 55, 95, 72, 85, 60, 78, 88];
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bento-card group p-7 lg:col-span-2"
    >
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.10), transparent 70%)' }}
      />

      <div className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-all duration-300 group-hover:scale-105"
           style={{ background: '#3b82f612', borderColor: '#3b82f628' }}>
        <Activity className="w-5 h-5 text-blue-400" />
      </div>

      <h3 className="relative text-white font-bold text-lg mb-2 leading-snug">Unified Observability</h3>
      <p className="relative text-slate-500 text-sm leading-relaxed mb-5">
        Metrics, logs, traces, and events across Kubernetes, AWS, GCP, and Azure — one intelligent view.
      </p>

      {/* Mini metric bar chart */}
      <div className="relative flex items-end gap-1 h-16 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-500"
            style={{
              height: `${h}%`,
              background: i === 9
                ? 'rgba(251,191,36,0.7)'
                : `rgba(59,130,246,${0.2 + (h / 100) * 0.45})`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
        <div className="absolute -top-1 left-1/2 w-px h-full border-l border-dashed border-amber-500/30" />
        <div className="absolute -top-4 left-1/2 ml-1 text-[10px] text-amber-500/70 font-mono whitespace-nowrap">
          ⚠ anomaly
        </div>
      </div>
      <div className="flex justify-between mt-1.5 px-1">
        <span className="text-[10px] text-slate-700 font-mono">24h ago</span>
        <span className="text-[10px] text-slate-700 font-mono">now</span>
      </div>
    </motion.div>
  );
}

/* ── RCA card with evidence chain ───────────────────────────── */
function RCACard() {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bento-card group p-7"
    >
      <div
        className="absolute top-0 left-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0% 0%, rgba(45,212,191,0.10), transparent 70%)' }}
      />

      <div className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-all duration-300 group-hover:scale-105"
           style={{ background: '#2dd4bf12', borderColor: '#2dd4bf28' }}>
        <Code2 className="w-5 h-5 text-teal-400" />
      </div>

      <h3 className="relative text-white font-bold text-lg mb-2.5">Deployment-Aware RCA</h3>
      <p className="relative text-slate-500 text-sm leading-relaxed mb-5">
        Trace incidents to the exact deploy or config change with an evidence chain.
      </p>

      {/* Evidence chain */}
      <div className="relative space-y-2">
        {[
          { label: 'Deploy v2.3.1', conf: '94%', color: '#ef4444' },
          { label: 'OOMKilled (512Mi)', conf: '91%', color: '#f59e0b' },
          { label: 'Traffic +40%', conf: '88%', color: '#3b82f6' },
        ].map((ev, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ev.color }} />
            <div className="flex-1 text-[11px] font-mono text-slate-400 truncate">{ev.label}</div>
            <div className="text-[10px] font-semibold font-mono" style={{ color: ev.color }}>{ev.conf}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const SMALL_FEATURES = [
  { icon: Bell,             title: 'Intelligent Alerting',  desc: 'Context-aware alerts that group signals and eliminate noise.' },
  { icon: GitBranch,        title: 'Change Correlation',    desc: 'Automatically correlates deployments with incident timelines.' },
  { icon: BookOpen,         title: 'Runbook Automation',    desc: 'Convert runbooks into automated workflows with AI assistance.' },
  { icon: Clock,            title: 'SLO Management',        desc: 'Define, track, and enforce SLOs with automatic error budget reporting.' },
  { icon: MessageSquare,    title: 'Slack & Teams Native',  desc: 'Manage incidents and approve fixes without leaving chat.' },
  { icon: Search,           title: 'Semantic Log Search',   desc: 'Ask questions in plain English, get answers from your logs.' },
  { icon: Server,           title: 'Multi-Cloud',           desc: 'AWS, GCP, Azure, and on-premise Kubernetes — one agent, one audit trail.' },
  { icon: Settings2,        title: 'Policy as Code',        desc: 'Define remediation policies in YAML or OPA — version controlled.' },
  { icon: SlidersHorizontal,title: 'Configurable Autonomy', desc: 'A spectrum, not a toggle — Observe Only to Full Autopilot, per namespace.' },
];

export default function FeaturesGrid() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="platform"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Top blue glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14 md:mb-18"
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
            Platform Capabilities
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-4xl mx-auto">
            From Alert to Resolution —{' '}
            <span className="text-gradient-brand">One Platform, Zero SaaS</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Unlike point solutions that only alert or only diagnose, Orkastor closes the full loop —
            and everything runs inside your own environment.
          </p>
        </motion.div>

        {/* ── Bento grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {/* Private AI — 2 cols × 2 rows (hero card) */}
          <PrivateAICard />

          {/* Observability — 2 cols × 1 row */}
          <ObservabilityCard />

          {/* RCA — 1 col × 1 row */}
          <RCACard />

          {/* Configurable Autonomy mini card */}
          <motion.div
            variants={item}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bento-card group p-6 flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border border-white/[0.07] bg-white/[0.04] transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/25 group-hover:bg-blue-500/8">
              <SlidersHorizontal className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Configurable Autonomy</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              A spectrum, not a toggle. Set autonomy per cluster or namespace — from Observe Only to Full Autopilot.
            </p>
            <div className="mt-auto pt-4 flex gap-1.5">
              {['Observe', 'Suggest', 'Auto', 'Full'].map((m, i) => (
                <div
                  key={m}
                  className="flex-1 h-1.5 rounded-full"
                  style={{
                    background: i === 1
                      ? 'linear-gradient(90deg, #3b82f6, #2dd4bf)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-slate-700 font-mono">manual</span>
              <span className="text-[9px] text-slate-700 font-mono">autopilot</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Small features grid ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {SMALL_FEATURES.map(f => (
            <SmallCard key={f.title} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
