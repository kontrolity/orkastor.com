import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, ArrowRight, Play, Sparkles, ChevronRight, Lock, Zap, CheckCircle2 } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const TERMINAL_LINES = [
  { delay: 0,    text: '$ orkastor watch --cluster production',       color: 'text-slate-400' },
  { delay: 700,  text: 'Connecting to api.prod.internal...',          color: 'text-slate-600' },
  { delay: 1300, text: '✓ Connected · 847 pods · 12 namespaces',      color: 'text-emerald-400' },
  { delay: 2000, text: '',                                             color: '' },
  { delay: 2400, text: '⚠  api-server-7d4f8  CrashLoopBackOff',      color: 'text-amber-400' },
  { delay: 2900, text: '   namespace: production · restarts: 7',      color: 'text-slate-600' },
  { delay: 3500, text: '',                                             color: '' },
  { delay: 3800, text: '⟳ Analyzing root cause...',                  color: 'text-blue-400' },
  { delay: 4800, text: '  cause:   OOMKilled — limit 512Mi',          color: 'text-slate-300' },
  { delay: 5300, text: '  peak:    498Mi · traffic +40% post-deploy', color: 'text-slate-500' },
  { delay: 5900, text: '  pattern: 3 similar incidents in 24h',       color: 'text-slate-500' },
  { delay: 6500, text: '',                                             color: '' },
  { delay: 6800, text: '✓ SafeFix generated → increase limits 1Gi',  color: 'text-blue-300' },
  { delay: 7300, text: '  dry-run: PASSED · awaiting approval...',    color: 'text-slate-600' },
  { delay: 8600, text: '✓ Approved by ops@company.com',              color: 'text-emerald-400' },
  { delay: 9200, text: '✓ Applied · incident resolved in 18s',        color: 'text-emerald-400' },
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
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, line.delay);
        timers.push(t);
      });
      const total = TERMINAL_LINES[TERMINAL_LINES.length - 1].delay + 2800;
      const loop = setTimeout(() => { setVisibleLines([]); schedule(); }, total);
      timers.push(loop);
    };
    schedule();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal-window w-full max-w-2xl mx-auto">
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-red-500/80" />
        <span className="terminal-dot bg-amber-500/80" />
        <span className="terminal-dot bg-emerald-500/80" />
        <div className="ml-3 flex items-center gap-2 text-slate-600 text-xs font-mono">
          <Terminal className="w-3 h-3" />
          orkastor — production
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-emerald-600 font-mono">live</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12.5px] leading-relaxed space-y-px h-52 sm:h-60 overflow-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {TERMINAL_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${
              visibleLines.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            } ${line.color}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines.length > 0 && visibleLines.length < TERMINAL_LINES.length && (
          <span className="inline-block w-1.5 h-3.5 bg-blue-400 animate-cursor-blink" />
        )}
      </div>
    </div>
  );
}

const STATS = [
  { val: '80%',  label: 'Faster MTTR' },
  { val: '0',    label: 'Bytes leave your network' },
  { val: '18s',  label: 'Mean resolution' },
  { val: '100%', label: 'Human-approved fixes' },
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const terminalY = useTransform(scrollY, [0, 500], [0, 40]);
  const terminalOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[109px]"
      style={{ backgroundColor: '#000000' }}
    >
      {/* ── Spotlight SVG ── */}
      <svg
        className="spotlight-overlay"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sg1" cx="50%" cy="0%" r="60%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sg2" cx="75%" cy="0%" r="50%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="600" cy="-80" rx="700" ry="420" fill="url(#sg1)" />
        <ellipse cx="900" cy="-60" rx="420" ry="280" fill="url(#sg2)" />
      </svg>

      {/* ── Mesh blobs ── */}
      <div
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none rounded-full opacity-[0.18]"
        style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute top-[-60px] right-[-80px] w-[400px] h-[350px] pointer-events-none rounded-full opacity-[0.09] animate-glow-drift"
        style={{ background: 'radial-gradient(ellipse, #2dd4bf 0%, transparent 70%)', filter: 'blur(70px)' }}
      />

      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 75%)',
        }}
      />

      {/* ── Beam line ── */}
      <div className="beam-line" style={{ top: '30%', animationDelay: '0s' }} />
      <div className="beam-line" style={{ top: '55%', animationDelay: '1.5s', opacity: 0.4 }} />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center py-16 sm:py-20">

        {/* ── Announcement Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="flex justify-center mb-8"
        >
          <a href="#kubegraf" className="badge-pill group">
            <span className="pill-tag">New</span>
            KubēGraf v1.0 — in-environment AI SRE for Kubernetes
            <ChevronRight className="w-3.5 h-3.5 text-blue-400/60 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* ── Mono eyebrow ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04, ease: EASE_OUT_EXPO }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-slate-700" />
          <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-slate-600">
            AI-Powered Orchestration Platform
          </span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-slate-700" />
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
          className="text-[clamp(56px,9.5vw,112px)] font-black tracking-[-0.04em] leading-[0.9] mb-8"
        >
          <span className="block text-white/90">Cloud &amp; DevOps</span>
          <span className="text-gradient-brand">Orchestrator</span>
        </motion.h1>

        {/* ── Subheadline ── */}
        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, delay: 0.16, ease: EASE_OUT_EXPO }}
          className="text-base sm:text-lg md:text-[19px] font-light text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          AI agents that run <span className="text-slate-200 font-normal">inside your own environment</span> — no data leaves your network.
          Starting with{' '}
          <span className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[15px] font-semibold font-mono align-middle">
            KubēGraf
          </span>
          {' '}for Kubernetes SRE, expanding to cloud costs, security, and beyond.
        </motion.p>

        {/* ── Trust pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {[
            { icon: Lock,         label: 'Zero Exfiltration' },
            { icon: Zap,          label: '18s Mean Resolution' },
            { icon: CheckCircle2, label: 'Human-Approved Fixes' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] text-[12px] font-medium text-slate-500"
            >
              <Icon className="w-3 h-3 text-slate-600" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, delay: 0.28, ease: EASE_OUT_EXPO }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
        >
          <a
            href="#cta"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold shadow-glow-strong hover:scale-[1.02] active:scale-[0.99] transition-transform"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#kubegraf"
            className="btn-ghost card-glow-border-hover inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all"
          >
            <Play className="w-4 h-4 text-blue-400" />
            See KubēGraf in Action
          </a>
        </motion.div>

        {/* ── Install snippet ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36, ease: EASE_OUT_EXPO }}
          className="flex justify-center mb-14"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-xl font-mono text-[11px] sm:text-[13px] border border-white/[0.07] bg-black/60 backdrop-blur-sm max-w-[90vw] overflow-x-auto whitespace-nowrap">
            <span className="text-slate-700">$</span>
            <span className="text-blue-300">brew install orkastor</span>
            <span className="text-slate-800">&&</span>
            <span className="text-teal-400">orkastor init</span>
          </div>
        </motion.div>

        {/* ── Terminal ── */}
        <motion.div
          style={{ y: terminalY, opacity: terminalOpacity }}
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.42, ease: EASE_OUT_EXPO }}
        >
          <AnimatedTerminal />
        </motion.div>

        {/* ── Stats bar with dividers ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap justify-center items-center mt-12"
        >
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="text-center px-5 sm:px-8 py-3">
                <div className="text-2xl sm:text-[28px] font-black text-white text-glow-blue tabular-nums">
                  {s.val}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 mt-1">
                  {s.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div className="w-px h-8 bg-white/[0.07] hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
      />
    </section>
  );
}
