import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, ArrowRight, Play, GitMerge, Shield, Search, Activity, ExternalLink } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

const FEATURES = [
  {
    icon: Activity,
    title: 'Multi-Source Correlation',
    desc: 'Fuses logs, metrics, events, and deployments into a single causal timeline.',
    accent: '#2dd4bf',
  },
  {
    icon: Shield,
    title: 'SafeFix™ Auto-Remediation',
    desc: 'AI-generated fixes with human approval gate and automatic rollback if metrics regress.',
    accent: '#3b82f6',
  },
  {
    icon: Search,
    title: 'Dry-Run Validation',
    desc: 'Every proposed change is validated in dry-run mode before it touches production.',
    accent: '#8b5cf6',
  },
  {
    icon: GitMerge,
    title: 'Confidence-Scored RCA',
    desc: 'Root cause analysis with an evidence chain and percentage confidence for every finding.',
    accent: '#f59e0b',
  },
];

const KUBETERM_LINES = [
  { delay: 0,    text: '$ orkastor diagnose --namespace production',  color: 'text-slate-400' },
  { delay: 600,  text: 'Fetching events, logs, metrics...',           color: 'text-slate-600' },
  { delay: 1200, text: '✓ 12 signals correlated across 3 sources',    color: 'text-teal-400' },
  { delay: 1900, text: '',                                             color: '' },
  { delay: 2200, text: '⚠  payment-svc CrashLoopBackOff (94% conf)', color: 'text-amber-400' },
  { delay: 2700, text: '   cause: OOMKill → memory limit 256Mi',      color: 'text-slate-500' },
  { delay: 3200, text: '   correlated with: deploy v3.2.1 @ 14:03',   color: 'text-slate-600' },
  { delay: 3900, text: '',                                             color: '' },
  { delay: 4200, text: '⟳ SafeFix™ generating patch...',              color: 'text-blue-400' },
  { delay: 5100, text: '  patch: resources.limits.memory → 512Mi',    color: 'text-slate-300' },
  { delay: 5700, text: '  dry-run: PASSED · no policy violations',    color: 'text-slate-600' },
  { delay: 6400, text: '',                                             color: '' },
  { delay: 6700, text: '✓ Approved · applying to production...',      color: 'text-emerald-400' },
  { delay: 7400, text: '✓ Resolved · incident closed in 14s',         color: 'text-emerald-400' },
];

function KubeTerminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const timers = [];
    setVisibleLines([]);
    const schedule = () => {
      KUBETERM_LINES.forEach((line, i) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, i]);
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, line.delay);
        timers.push(t);
      });
      const total = KUBETERM_LINES[KUBETERM_LINES.length - 1].delay + 2600;
      const loop = setTimeout(() => { setVisibleLines([]); schedule(); }, total);
      timers.push(loop);
    };
    schedule();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal-window w-full">
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-red-500/80" />
        <span className="terminal-dot bg-amber-500/80" />
        <span className="terminal-dot bg-emerald-500/80" />
        <div className="ml-3 flex items-center gap-2 text-slate-600 text-xs font-mono">
          <Terminal className="w-3 h-3" />
          kubēgraf — production
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[11px] text-teal-600 font-mono">live</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12.5px] leading-relaxed space-y-px h-52 sm:h-60 overflow-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {KUBETERM_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${
              visibleLines.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            } ${line.color}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines.length > 0 && visibleLines.length < KUBETERM_LINES.length && (
          <span className="inline-block w-1.5 h-3.5 bg-teal-400 animate-cursor-blink" />
        )}
      </div>
    </div>
  );
}

export default function KubeGrafSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="kubegraf"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Top teal glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(45,212,191,0.09) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14 md:mb-18"
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-teal-500/30 text-teal-400/80 bg-teal-500/[0.07] mb-5">
            Flagship Module
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-4xl mx-auto">
            KubēGraf —{' '}
            <span className="text-gradient-brand">AI SRE for Kubernetes</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            The first Orkastor module: monitors your Kubernetes clusters in real time,
            correlates signals across every source, and resolves incidents — all inside your VPC.
          </p>
        </motion.div>

        {/* ── Two-column layout: features + terminal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">

          {/* Feature mini-cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {FEATURES.map((feat) => (
              <motion.div
                key={feat.title}
                variants={itemVar}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bento-card group p-6"
              >
                {/* Hover glow */}
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${feat.accent}10, transparent 60%)` }}
                />
                <div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-4 border shrink-0 transition-all duration-300 group-hover:scale-105"
                  style={{ background: `${feat.accent}12`, borderColor: `${feat.accent}28` }}
                >
                  <feat.icon className="w-4.5 h-4.5" style={{ color: feat.accent }} />
                </div>
                <h3 className="relative text-white font-bold text-sm mb-1.5 leading-snug">{feat.title}</h3>
                <p className="relative text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Terminal visual */}
          <motion.div
            initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE_OUT_EXPO }}
          >
            <KubeTerminal />
          </motion.div>
        </div>

        {/* ── CTAs ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, delay: 0.35, ease: EASE_OUT_EXPO }}
        >
          <a
            href="https://kubegraf.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold shadow-glow-strong hover:scale-[1.02] active:scale-[0.99] transition-transform"
          >
            Try KubēGraf Free
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="#safefix"
            className="btn-ghost card-glow-border-hover inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all"
          >
            <Play className="w-4 h-4 text-teal-400" />
            See SafeFix Workflow
          </a>
        </motion.div>
      </div>
    </section>
  );
}
