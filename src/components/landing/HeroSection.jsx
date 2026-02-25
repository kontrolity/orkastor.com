import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Play, Sparkles } from 'lucide-react';

// Terminal animation lines
const TERMINAL_LINES = [
  { delay: 0,    text: '$ orkastor watch --cluster production',          color: 'text-slate-300' },
  { delay: 700,  text: 'Connecting to cluster api.prod.internal...',     color: 'text-slate-500' },
  { delay: 1400, text: '✓ Connected  ·  847 pods  ·  12 namespaces',    color: 'text-emerald-400' },
  { delay: 2100, text: '',                                                color: '' },
  { delay: 2500, text: '⚠  api-server-7d4f8  CrashLoopBackOff',        color: 'text-amber-400' },
  { delay: 3100, text: '   namespace: production  ·  restarts: 7',      color: 'text-slate-500' },
  { delay: 3700, text: '',                                                color: '' },
  { delay: 4000, text: '⟳ Analyzing root cause...',                     color: 'text-blue-400' },
  { delay: 5000, text: '  cause:   OOMKilled — memory limit 512Mi',     color: 'text-slate-300' },
  { delay: 5500, text: '  peak:    498Mi  ·  traffic +40% post-deploy', color: 'text-slate-400' },
  { delay: 6100, text: '  pattern: 3 similar incidents in 24h',         color: 'text-slate-400' },
  { delay: 6700, text: '',                                                color: '' },
  { delay: 7000, text: '✓ SafeFix generated  →  increase limits 1Gi',  color: 'text-blue-300' },
  { delay: 7500, text: '  dry-run: PASSED  ·  awaiting approval...',    color: 'text-slate-500' },
  { delay: 8800, text: '✓ Approved by ops@company.com',                 color: 'text-emerald-400' },
  { delay: 9400, text: '✓ Applied  ·  incident resolved in 18s',        color: 'text-emerald-400' },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const timers = [];
    setVisibleLines([]);

    const schedule = () => {
      TERMINAL_LINES.forEach((line, i) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, i]);
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }, line.delay);
        timers.push(t);
      });

      const total = TERMINAL_LINES[TERMINAL_LINES.length - 1].delay + 2500;
      const loop = setTimeout(() => {
        setVisibleLines([]);
        schedule();
      }, total);
      timers.push(loop);
    };

    schedule();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal-window shadow-terminal w-full max-w-2xl mx-auto">
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-red-500/80" />
        <span className="terminal-dot bg-amber-500/80" />
        <span className="terminal-dot bg-emerald-500/80" />
        <div className="ml-3 flex items-center gap-2 text-slate-500 text-xs font-mono">
          <Terminal className="w-3 h-3" />
          orkastor — production
        </div>
      </div>

      <div
        ref={containerRef}
        className="p-3 sm:p-5 font-mono text-[11px] sm:text-[13px] leading-relaxed space-y-0.5 h-56 sm:h-64 overflow-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {TERMINAL_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-opacity duration-300 ${
              visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'
            } ${line.color}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines.length > 0 && visibleLines.length < TERMINAL_LINES.length && (
          <span className="inline-block w-2 h-4 bg-blue-400 animate-cursor-blink" />
        )}
      </div>
    </div>
  );
}

const STATS = [
  { val: '80%',   label: 'Faster MTTR' },
  { val: '0',     label: 'Bytes exfiltrated' },
  { val: '18s',   label: 'Mean resolution' },
  { val: '100%',  label: 'Human approved' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[109px]"
      style={{ backgroundColor: '#000000' }}>

      {/* ── Dual radial glows ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%)',
          animation: 'glow-drift 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(16,185,129,0.10) 0%, transparent 65%)',
        }}
      />

      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2.5 mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 text-blue-300 text-xs font-semibold tracking-wide uppercase card-specular">
            <Sparkles className="w-3 h-3" />
            AI-Powered Kubernetes SRE Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="text-[clamp(48px,8vw,88px)] font-black tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-white">Your AI SRE</span>
          <br />
          <span className="text-gradient-brand">That Never Sleeps.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Orkastor diagnoses Kubernetes incidents, surfaces root causes with evidence,
          and applies human-approved fixes — running{' '}
          <span className="text-slate-200 font-medium">entirely inside your cluster.</span>
          {' '}No SaaS. No data leaving your network.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
        >
          <a
            href="#cta"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold shadow-glow-strong hover:scale-[1.02] active:scale-[0.99] transition-transform"
          >
            <Terminal className="w-4 h-4" />
            Install Free
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#safefix"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-slate-200 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all card-specular"
          >
            <Play className="w-4 h-4 text-blue-400" />
            See SafeFix in Action
          </a>
        </motion.div>

        {/* Install snippet */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 rounded-xl font-mono text-xs sm:text-sm border border-white/[0.07] bg-black/50 backdrop-blur-sm max-w-[90vw] overflow-x-auto whitespace-nowrap">
            <span className="text-slate-600">$</span>
            <span className="text-blue-300">brew install orkastor</span>
            <span className="text-slate-700">&&</span>
            <span className="text-blue-300">orkastor init</span>
          </div>
        </motion.div>

        {/* Animated Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.4 }}
        >
          <AnimatedTerminal />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-14"
        >
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-white text-glow-cyan">{s.val}</div>
              <div className="text-xs text-slate-500 mt-0.5 tracking-wide">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
      />
    </section>
  );
}
