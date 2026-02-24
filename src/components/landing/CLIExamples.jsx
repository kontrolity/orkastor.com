import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';

const EXAMPLES = [
  {
    label: 'Watch & Auto-Fix',
    command: 'orkastor watch --cluster prod --auto-fix low-risk',
    lines: [
      { text: '✓ Watching 47 services · 3 namespaces · 847 pods', color: 'text-emerald-400' },
      { text: '', color: '' },
      { text: '⚠  checkout-svc — high error rate 12.3%',         color: 'text-amber-400' },
      { text: '⟳ Analyzing root cause...',                        color: 'text-blue-400' },
      { text: '  cause: circuit breaker misconfiguration',        color: 'text-slate-400' },
      { text: '  confidence: 91%',                                color: 'text-slate-500' },
      { text: '', color: '' },
      { text: '✓ SafeFix applied: circuit breaker threshold updated', color: 'text-emerald-400' },
      { text: '✓ Error rate normalized to 0.2%  ·  resolved in 24s', color: 'text-emerald-400' },
    ],
    delay: 180,
  },
  {
    label: 'Diagnose Issue',
    command: 'orkastor diagnose --service payments-api --since 1h',
    lines: [
      { text: '⟳ Collecting traces, metrics, logs...',            color: 'text-blue-400' },
      { text: '', color: '' },
      { text: '  Root cause: DB connection pool exhausted (97%)', color: 'text-white' },
      { text: '  Confidence: 94%',                                color: 'text-emerald-400' },
      { text: '', color: '' },
      { text: '  Contributing factors:',                          color: 'text-slate-400' },
      { text: '    • 3 slow queries >2s in last hour',            color: 'text-amber-400' },
      { text: '    • connection leak in worker v2.3.1',           color: 'text-amber-400' },
      { text: '', color: '' },
      { text: '→ Run: orkastor fix --apply ORCH-4821',            color: 'text-blue-300' },
    ],
    delay: 200,
  },
  {
    label: 'Generate Runbook',
    command: 'orkastor runbook generate --from-incident INC-2847',
    lines: [
      { text: '⟳ Analyzing incident timeline...',                 color: 'text-blue-400' },
      { text: '⟳ Extracting 6 decision points...',               color: 'text-blue-400' },
      { text: '', color: '' },
      { text: '✓ Runbook generated:',                             color: 'text-emerald-400' },
      { text: '  runbooks/db-connection-exhaustion.md',           color: 'text-blue-300' },
      { text: '', color: '' },
      { text: '✓ Added to knowledge base  ·  auto-indexed',       color: 'text-emerald-400' },
      { text: '✓ Future similar incidents will use this runbook', color: 'text-slate-400' },
    ],
    delay: 220,
  },
];

function AnimatedOutput({ lines, delay }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisible(prev => [...prev, i]), i * delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [lines, delay]);

  return (
    <div className="space-y-0.5 min-h-[200px]">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`text-[13px] leading-relaxed font-mono transition-opacity duration-200 ${
            visible.includes(i) ? 'opacity-100' : 'opacity-0'
          } ${line.color || 'text-transparent'}`}
        >
          {line.text || '\u00a0'}
        </div>
      ))}
      {visible.length > 0 && visible.length < lines.length && (
        <span className="inline-block w-2 h-4 bg-blue-400 animate-cursor-blink" />
      )}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1 } }),
};

export default function CLIExamples() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const handleCopy = () => {
    navigator.clipboard.writeText('$ ' + EXAMPLES[active].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="cli"
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle blue glow bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 100%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden" animate={inView ? 'show' : 'hidden'}
          variants={fadeUp} custom={0}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-blue-500/25 text-blue-400 bg-blue-500/8 mb-5">
            CLI-First
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            Built for Engineers{' '}
            <span className="text-gradient-cyan">Who Live in the Terminal</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Full-featured CLI that fits your existing workflows.
            Also available as a web dashboard and Slack bot.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Tab row */}
          <motion.div
            className="flex gap-2 mb-4 flex-wrap"
            initial="hidden" animate={inView ? 'show' : 'hidden'}
            variants={fadeUp} custom={1}
          >
            {EXAMPLES.map((ex, i) => (
              <button
                key={ex.label}
                onClick={() => setActive(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  active === i
                    ? 'border-blue-500/35 bg-blue-500/10 text-blue-300'
                    : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:text-slate-300 hover:border-white/[0.14]'
                }`}
              >
                {ex.label}
              </button>
            ))}
          </motion.div>

          {/* Terminal */}
          <motion.div
            className="terminal-window shadow-terminal card-specular"
            initial="hidden" animate={inView ? 'show' : 'hidden'}
            variants={fadeUp} custom={2}
          >
            {/* Title bar */}
            <div className="terminal-titlebar">
              <span className="terminal-dot bg-red-500/80" />
              <span className="terminal-dot bg-amber-500/80" />
              <span className="terminal-dot bg-emerald-500/80" />
              <div className="ml-3 flex items-center gap-2 text-slate-500 text-xs font-mono">
                <Terminal className="w-3 h-3" />
                orkastor — production
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-300 transition-colors font-mono"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">copied</span></>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />copy</>
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 font-mono text-[13px] mb-4 pb-3 border-b border-white/[0.06]">
                <span className="text-slate-700">$</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active}
                    className="text-blue-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {EXAMPLES[active].command}
                  </motion.span>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <AnimatedOutput lines={EXAMPLES[active].lines} delay={EXAMPLES[active].delay} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Install hint */}
          <motion.div
            className="mt-5 text-center"
            initial="hidden" animate={inView ? 'show' : 'hidden'}
            variants={fadeUp} custom={3}
          >
            <span className="text-slate-600 text-sm">Install: </span>
            <code className="font-mono text-sm text-blue-400 bg-blue-500/8 px-2.5 py-1 rounded-lg border border-blue-500/15">
              brew install orkastor
            </code>
            <span className="text-slate-700 text-sm mx-2">or</span>
            <code className="font-mono text-sm text-blue-400 bg-blue-500/8 px-2.5 py-1 rounded-lg border border-blue-500/15">
              npm i -g @orkastor/cli
            </code>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
