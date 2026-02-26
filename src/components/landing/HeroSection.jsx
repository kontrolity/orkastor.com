import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, ChevronRight } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ── Animated Terminal ──────────────────────────────────────── */
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
    <div className="terminal-window w-full">
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
        className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12.5px] leading-relaxed space-y-px h-56 overflow-hidden"
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
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[76px]"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Single faint blue radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center py-16 sm:py-20">

        {/* ── Announcement Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="flex justify-center mb-8"
        >
          <a href="https://kubegraf.io/" target="_blank" rel="noopener noreferrer" className="badge-pill group">
            <span className="pill-tag">New</span>
            KubēGraf v1.0 — in-environment AI SRE for Kubernetes
            <ChevronRight className="w-3.5 h-3.5 text-blue-400/60 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
          className="text-[clamp(48px,7vw,88px)] font-black tracking-[-0.04em] leading-[0.92] mb-8 text-white"
          style={{ textWrap: 'balance' }}
        >
          The AI DevOps &amp;<br />
          Cloud Orchestrator.
        </motion.h1>

        {/* ── Subheadline ── */}
        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, delay: 0.16, ease: EASE_OUT_EXPO }}
          className="text-base sm:text-lg text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          AI agents that run inside your own environment —
          no data leaves your network.
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, delay: 0.24, ease: EASE_OUT_EXPO }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
        >
          <a
            href="#cta"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold hover:scale-[1.02] active:scale-[0.99] transition-transform"
          >
            Get Early Access
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://kubegraf.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all"
          >
            See KubēGraf
            <ArrowRight className="w-4 h-4 opacity-60" />
          </a>
        </motion.div>

        {/* ── Install snippet ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE_OUT_EXPO }}
          className="flex justify-center mb-14"
        >
          <div className="card-frosted inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-xl font-mono text-[11px] sm:text-[13px] max-w-[90vw] overflow-x-auto whitespace-nowrap">
            <span className="text-slate-700">$</span>
            <span className="text-blue-300">brew install orkastor</span>
            <span className="text-slate-700">&&</span>
            <span className="text-teal-400">orkastor init</span>
          </div>
        </motion.div>

        {/* ── Terminal ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.42, ease: EASE_OUT_EXPO }}
        >
          <AnimatedTerminal />
        </motion.div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap justify-center items-center mt-14"
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
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
      />
    </section>
  );
}
