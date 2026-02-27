import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Terminal, Brain, Wrench, CheckCircle2, Zap } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/* ── Terminal animation (adapted from KubeGrafSection) ─────────── */
const TERM_LINES = [
  { delay: 0,    text: '$ orkastor monitor --namespace production', color: '#9CA3AF' },
  { delay: 600,  text: 'Attaching to 14 signal streams...',        color: '#4B5563' },
  { delay: 1100, text: '✓ Metrics (Prometheus): 847 series',       color: '#2DD4BF' },
  { delay: 1600, text: '✓ Logs (Loki): 3 services correlated',     color: '#2DD4BF' },
  { delay: 2100, text: '✓ Events (K8s): namespace production',     color: '#2DD4BF' },
  { delay: 2700, text: '',                                          color: '' },
  { delay: 3000, text: '⚠  Anomaly detected — api-server',        color: '#F59E0B' },
  { delay: 3400, text: '   P99 latency: 42ms → 2.3s (+5400%)',    color: '#6B7280' },
  { delay: 3900, text: '   Correlation: deploy v2.3.1 @ 14:03',   color: '#4B5563' },
  { delay: 4500, text: '',                                          color: '' },
  { delay: 4800, text: '→ Escalating to RCA engine...',           color: '#7748F6' },
  { delay: 5500, text: '✓ Root cause identified (94% conf)',       color: '#34D399' },
];

function KubeTerminalMini() {
  const [visibleLines, setVisibleLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const timers = [];
    setVisibleLines([]);
    const schedule = () => {
      TERM_LINES.forEach((line, i) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, i]);
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, line.delay);
        timers.push(t);
      });
      const total = TERM_LINES[TERM_LINES.length - 1].delay + 2800;
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
        <div className="ml-3 flex items-center gap-2 text-xs font-mono" style={{ color: '#4B5563' }}>
          <Terminal className="w-3 h-3" />
          orkastor — production
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[11px] font-mono" style={{ color: '#0D9488' }}>monitoring</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12px] leading-relaxed space-y-px overflow-hidden"
        style={{ scrollBehavior: 'smooth', height: '280px' }}
      >
        {TERM_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${visibleLines.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
            style={{ color: line.color || 'transparent' }}
          >
            {line.text || '\u00A0'}
          </div>
        ))}
        {visibleLines.length > 0 && visibleLines.length < TERM_LINES.length && (
          <span className="inline-block w-1.5 h-3.5 animate-cursor-blink" style={{ background: '#0EA5E9' }} />
        )}
      </div>
    </div>
  );
}

/* ── RCA confidence panel ──────────────────────────────────────── */
function RCAPanel() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}
    >
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-red-500/80" />
        <span className="terminal-dot bg-amber-500/80" />
        <span className="terminal-dot bg-emerald-500/80" />
        <div className="ml-3 text-xs font-mono" style={{ color: '#4B5563' }}>Root Cause Analysis</div>
        <div className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          ACTIVE
        </div>
      </div>
      <div className="p-5">
        <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-sm font-semibold text-white">Incident #2847</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">api-server · CrashLoopBackOff · production</div>
        </div>

        <div className="text-[11px] font-medium text-slate-500 mb-3">Confidence scores</div>
        {[
          { label: 'Deploy v2.3.1 introduced OOM',  conf: '94%', color: '#7748F6', w: '94%' },
          { label: 'Memory limit too low (512Mi)',   conf: '91%', color: '#8B5CF6', w: '91%' },
          { label: 'Traffic spike +40% at 14:03',   conf: '88%', color: '#0EA5E9', w: '88%' },
          { label: 'Node pressure on prod-node-03', conf: '72%', color: '#34D399', w: '72%' },
        ].map(c => (
          <div key={c.label} className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
            <div className="flex-1 text-[11px] font-mono text-slate-400 truncate">{c.label}</div>
            <span className="text-[11px] font-mono font-bold shrink-0" style={{ color: c.color }}>{c.conf}</span>
            <div className="w-16 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: c.w, background: c.color }} />
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[11px] font-mono text-slate-500">📋 Evidence chain: deploy → OOM → restart loop → cascade</div>
        </div>
      </div>
    </div>
  );
}

/* ── SafeFix proposal panel ────────────────────────────────────── */
function SafeFixPanel() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#0A0A0A',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}
    >
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-red-500/80" />
        <span className="terminal-dot bg-amber-500/80" />
        <span className="terminal-dot bg-emerald-500/80" />
        <div className="ml-3 text-xs font-mono" style={{ color: '#4B5563' }}>SafeFix™ Proposal</div>
        <div className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded"
          style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
          dry-run ✓
        </div>
      </div>
      <div className="p-5">
        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(119,72,246,0.07)', border: '1px solid rgba(119,72,246,0.2)' }}>
          <div className="text-[11px] font-bold text-violet-300 mb-3 uppercase tracking-wider">Proposed remediation</div>
          <div className="font-mono text-sm p-3 rounded-lg mb-4"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', color: '#A78BFA' }}>
            <div className="text-slate-500 mb-1 text-[10px]"># patch: api-server deployment</div>
            <div>resources:</div>
            <div className="pl-4">limits:</div>
            <div className="pl-8 line-through opacity-40">memory: 512Mi</div>
            <div className="pl-8 text-emerald-400">memory: 1Gi</div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(119,72,246,0.5), rgba(93,53,212,0.5))',
                color: '#C4B5FD',
                border: '1px solid rgba(119,72,246,0.4)',
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve &amp; Apply
            </button>
            <button
              className="px-4 py-2.5 rounded-xl text-sm"
              style={{ background: 'rgba(255,255,255,0.03)', color: '#4B5563', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              Dismiss
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {[
            { t: 'T+0s',  label: 'Detect', done: true  },
            { t: 'T+3s',  label: 'RCA',    done: true  },
            { t: 'T+8s',  label: 'Fix',    done: true  },
            { t: 'T+18s', label: 'Done',   done: false },
          ].map((item, i, arr) => (
            <React.Fragment key={item.t}>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full"
                  style={{ background: item.done ? '#7748F6' : 'rgba(255,255,255,0.1)', boxShadow: item.done ? '0 0 6px rgba(119,72,246,0.6)' : 'none' }} />
                <span className="text-[9px] font-mono mt-1" style={{ color: item.done ? '#7748F6' : '#374151' }}>{item.t}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="flex-1 h-px" style={{ background: item.done ? 'rgba(119,72,246,0.4)' : 'rgba(255,255,255,0.06)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="p-3 rounded-xl flex items-center gap-2"
          style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-mono" style={{ color: '#34d399' }}>142 incidents auto-resolved this month</span>
        </div>
      </div>
    </div>
  );
}

/* ── Tab data ──────────────────────────────────────────────────── */
const TABS = [
  {
    id: 'monitor',
    label: 'Monitor',
    Icon: Terminal,
    heading: 'Real-time anomaly detection',
    description:
      'Correlates metrics, logs, Kubernetes events, and deployment history to surface anomalies the moment they emerge — before your users notice.',
    features: [
      'Multi-source signal correlation',
      'P99 latency & error rate tracking',
      'Deployment impact analysis',
    ],
    visual: 'terminal',
  },
  {
    id: 'diagnose',
    label: 'Diagnose',
    Icon: Brain,
    heading: 'AI-driven root cause analysis',
    description:
      'Evidence-based causal chains with confidence scores. Know exactly why an incident happened and which service is responsible — in seconds.',
    features: [
      'Confidence-scored hypotheses',
      'Evidence chain visualization',
      'Historical pattern matching',
    ],
    visual: 'rca',
  },
  {
    id: 'autofix',
    label: 'Auto-Fix',
    Icon: Wrench,
    heading: 'Safe, dry-run remediation',
    description:
      'AI generates a fix, validates it in dry-run mode, then waits for your approval. Configure autonomy per cluster or namespace — from Observe-Only to Full Autopilot.',
    features: [
      'Dry-run validation before any apply',
      'Human approval gate (configurable)',
      'Full audit trail for every action',
    ],
    visual: 'safefix',
  },
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState('monitor');
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const tab = TABS.find(t => t.id === activeTab);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#1E1A33' }}
    >
      {/* Background top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(119,72,246,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-6"
            style={{
              border: '1px solid rgba(119,72,246,0.3)',
              color: 'rgba(167,139,250,0.8)',
              background: 'rgba(119,72,246,0.07)',
            }}
          >
            Platform
          </span>
          <h2
            className="font-black tracking-[-0.03em] text-white mb-4 leading-[1.05]"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
          >
            Everything you need to{' '}
            <span className="text-gradient-brand">resolve faster</span>
          </h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-xl mx-auto">
            One platform for detection, diagnosis, and remediation —
            with AI running entirely inside your own infrastructure.
          </p>
        </motion.div>

        {/* Sticky tab bar */}
        <div className="sticky z-40 mb-12 flex justify-center" style={{ top: '80px' }}>
          <div
            className="flex items-center gap-1 p-1 rounded-2xl"
            style={{
              background: 'rgba(20,16,42,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={
                  activeTab === id
                    ? {
                        background: 'rgba(119,72,246,0.15)',
                        boxShadow: '0 0 0 1px rgba(119,72,246,0.25)',
                        color: '#C4B5FD',
                      }
                    : { color: '#4B5563' }
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Left: text content */}
            <div>
              <h3
                className="font-black tracking-[-0.03em] text-white mb-5 leading-tight"
                style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}
              >
                {tab.heading}
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                {tab.description}
              </p>
              <ul className="space-y-3">
                {tab.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#7748F6' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual */}
            <div>
              {tab.visual === 'terminal' && <KubeTerminalMini />}
              {tab.visual === 'rca'      && <RCAPanel />}
              {tab.visual === 'safefix'  && <SafeFixPanel />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
