import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Shield, Lock, Server, CheckCircle2, Zap } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/* ── Incident pool & RCA data ─────────────────────────────────── */
const INCIDENT_POOL = [
  { svc: 'api-server',    ns: 'production', status: 'CrashLoop',  color: '#ef4444' },
  { svc: 'payment-svc',   ns: 'checkout',   status: 'OOMKilled',  color: '#f59e0b' },
  { svc: 'auth-worker',   ns: 'identity',   status: 'Degraded',   color: '#6C47FF' },
  { svc: 'nginx-ingress', ns: 'ingress',    status: 'Pending',    color: '#f59e0b' },
  { svc: 'redis-cache',   ns: 'cache',      status: 'OOMKilled',  color: '#ef4444' },
  { svc: 'worker-queue',  ns: 'jobs',       status: 'CrashLoop',  color: '#6C47FF' },
  { svc: 'metrics-srv',   ns: 'monitoring', status: 'Degraded',   color: '#8B5CF6' },
  { svc: 'db-replica',    ns: 'postgres',   status: 'Restarting', color: '#ef4444' },
];

const RCA_MAP = {
  CrashLoop:   { causes: ['Deploy v2.3.1', 'Memory limit 512Mi', 'Traffic spike +40%'], fix: 'limits.memory: 512Mi → 1Gi',    evidence: 'deploy → OOM → restart loop'   },
  OOMKilled:   { causes: ['Heap leak detected', 'Cache limit 256Mi', 'Query volume +65%'], fix: 'limits.memory: 256Mi → 512Mi', evidence: 'heap grow → limit → OOM kill'  },
  Degraded:    { causes: ['Config mismatch v1.4', 'Replica count = 1', 'Net timeout +30%'], fix: 'replicas: 1 → 3',             evidence: 'config → single pod → degraded' },
  Pending:     { causes: ['Node disk pressure', 'Resource quota hit', 'Image pull backoff'], fix: 'node.affinity: auto-select', evidence: 'disk pressure → unschedulable'  },
  Restarting:  { causes: ['Liveness probe fail', 'Init container crash', 'Volume mount err'], fix: 'livenessProbe.delay: 10→30', evidence: 'probe fail → restart loop'      },
};

/* ── Live dashboard hook ──────────────────────────────────────── */
function useDashboardLive() {
  const poolIdxRef              = useRef(3);
  const timerRef                = useRef(null);
  const [incidents, setIncidents] = useState(INCIDENT_POOL.slice(0, 3).map((inc, i) => ({ ...inc, active: i === 0 })));
  const [resolved, setResolved] = useState(142);
  const [mttr, setMttr]         = useState(18);
  const [secAgo, setSecAgo]     = useState(4);
  const [incidentId, setIncidentId] = useState(2847);
  const [confidence, setConfidence] = useState([94, 91, 88]);
  const [timelineStep, setTimelineStep] = useState(2); // 0–3
  const [isResolving, setIsResolving]   = useState(false);

  // Tick seconds-ago every second
  useEffect(() => {
    const tick = setInterval(() => setSecAgo(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // Drift confidence scores ±1 every 2.5 s
  useEffect(() => {
    const drift = setInterval(() => {
      setConfidence(c => c.map(v => Math.max(82, Math.min(98, v + (Math.random() > 0.5 ? 1 : -1)))));
    }, 2500);
    return () => clearInterval(drift);
  }, []);

  // Animate timeline: step 0→1→2 then hold; completes to 3 on resolution
  useEffect(() => {
    let step = 0;
    const advance = setInterval(() => {
      step = Math.min(step + 1, 2);
      setTimelineStep(step);
    }, 1200);
    return () => clearInterval(advance);
  }, []);

  // Simulate auto-resolution every 8–18 s
  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setIsResolving(true);
        setTimelineStep(3); // "Done" lights up

        setTimeout(() => {
          const newMttr = 14 + Math.floor(Math.random() * 8);
          setResolved(r => r + 1);
          setMttr(newMttr);
          setSecAgo(0);
          setIncidentId(id => id + 1);
          setIsResolving(false);
          setTimelineStep(0); // reset for next incident

          // Rotate incidents: drop first, append next from pool
          setIncidents(prev => {
            const next = prev.slice(1);
            const newInc = INCIDENT_POOL[poolIdxRef.current % INCIDENT_POOL.length];
            poolIdxRef.current += 1;
            next.push({ ...newInc, active: false });
            return next.map((inc, i) => ({ ...inc, active: i === 0 }));
          });

          setConfidence([
            90 + Math.floor(Math.random() * 7),
            87 + Math.floor(Math.random() * 6),
            83 + Math.floor(Math.random() * 7),
          ]);

          schedule();
        }, 1800);
      }, 8000 + Math.random() * 10000);
    };
    schedule();
    return () => clearTimeout(timerRef.current);
  }, []);

  return { incidents, resolved, mttr, secAgo, incidentId, confidence, timelineStep, isResolving };
}

/* ── Animated gradient mesh background ───────────────────────── */
function GradientMeshBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Blob 1 — violet, center-top */}
      <div
        className="blob-1 absolute rounded-full"
        style={{
          top: '-20%',
          left: '30%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(108,71,255,0.22) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Blob 2 — sky, bottom-right */}
      <div
        className="blob-2 absolute rounded-full"
        style={{
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Blob 3 — purple, left */}
      <div
        className="blob-3 absolute rounded-full"
        style={{
          top: '40%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
    </div>
  );
}

/* ── 3-Panel Dashboard Mockup (live) ─────────────────────────── */
function DashboardMockup({ live }) {
  const { incidents, resolved, mttr, incidentId, confidence, timelineStep, isResolving } = live;
  const activeInc = incidents[0] || INCIDENT_POOL[0];
  const rca       = RCA_MAP[activeInc.status] || RCA_MAP.CrashLoop;
  const confColors = ['#6C47FF', '#8B5CF6', '#0EA5E9'];
  const TIMELINE  = ['Detect', 'RCA', 'Fix', 'Done'];
  const TIMES     = ['T+0s', 'T+3s', 'T+8s', `T+${mttr}s`];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden select-none relative"
      style={{
        background: '#080C14',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 0 1px rgba(108,71,255,0.18), 0 80px 160px rgba(0,0,0,0.5), 0 0 120px rgba(108,71,255,0.15)',
      }}
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #6C47FF 30%, #0EA5E9 70%, transparent 100%)', backgroundSize: '200% auto', animation: 'shimmer-slide 3s linear infinite' }}
      />

      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28ca41' }} />
        <div className="flex-1 mx-4">
          <div className="mx-auto h-5 rounded-md flex items-center px-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', maxWidth: '260px' }}>
            <span className="text-[10px] font-mono text-slate-600">app.orkastor.com / production</span>
          </div>
        </div>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isResolving ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[10px] font-mono" style={{ color: isResolving ? '#34d399' : 'rgba(248,113,113,0.8)' }}>
            {isResolving ? 'RESOLVING...' : 'INCIDENT ACTIVE'}
          </span>
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {['Overview', 'Incidents', 'RCA', 'SafeFix™'].map((tab, i) => (
          <div key={tab} className="px-4 py-2 text-[11px] font-medium rounded-t-lg cursor-pointer transition-all"
            style={i === 1 ? { background: 'rgba(108,71,255,0.12)', borderBottom: '2px solid #6C47FF', color: '#A78BFA' } : { color: '#524770' }}>
            {tab}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 mb-1">
          <div className="text-[10px] font-mono px-2 py-1 rounded transition-all"
            style={{ background: isResolving ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', color: isResolving ? '#34d399' : '#f87171', border: `1px solid ${isResolving ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {isResolving ? '✓ Fixing' : `${incidents.length} Active`}
          </div>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="grid grid-cols-3" style={{ minHeight: '290px' }}>

        {/* Panel 1 — Live Incidents */}
        <div className="p-4 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#524770' }}>Live Incidents</div>
          {incidents.map((inc, i) => (
            <div key={`${inc.svc}-${i}`} className="mb-2 p-2.5 rounded-xl cursor-pointer transition-all"
              style={{
                background: inc.active ? (isResolving ? 'rgba(52,211,153,0.06)' : 'rgba(239,68,68,0.06)') : 'rgba(255,255,255,0.02)',
                border: `1px solid ${inc.active ? (isResolving ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.18)') : 'rgba(255,255,255,0.05)'}`,
              }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: inc.active && isResolving ? '#34d399' : inc.color, boxShadow: `0 0 6px ${inc.active && isResolving ? '#34d399' : inc.color}` }} />
                <span className="text-[11px] font-mono text-white font-semibold truncate">{inc.svc}</span>
                {inc.active && (
                  <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: isResolving ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)', color: isResolving ? '#34d399' : '#f87171' }}>
                    {isResolving ? 'Fixing' : 'Live'}
                  </span>
                )}
              </div>
              <div className="text-[9px] font-mono" style={{ color: '#524770' }}>{inc.ns} · {inc.status}</div>
            </div>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {[
              { label: 'MTTR', val: `${mttr}s`, color: '#6C47FF' },
              { label: 'Resolved', val: String(resolved), color: '#0EA5E9' },
            ].map(s => (
              <div key={s.label} className="p-2 rounded-lg text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="text-base font-black font-mono transition-all" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#3D3460' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2 — Root Cause Analysis */}
        <div className="p-4 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#524770' }}>Root Cause Analysis</div>
          <div className="p-3 rounded-xl mb-3" style={{ background: isResolving ? 'rgba(52,211,153,0.05)' : 'rgba(245,158,11,0.05)', border: `1px solid ${isResolving ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.15)'}` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-3 h-3" style={{ color: isResolving ? '#34d399' : '#fbbf24' }} />
              <span className="text-[11px] font-semibold text-white">Incident #{incidentId}</span>
              <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: isResolving ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)', color: isResolving ? '#34d399' : '#f87171' }}>
                {isResolving ? 'FIXED' : 'ACTIVE'}
              </span>
            </div>
            <div className="text-[10px] font-mono" style={{ color: '#6B6294' }}>{activeInc.svc} · {activeInc.status}BackOff</div>
          </div>
          <div className="mb-2">
            <div className="text-[9px] font-medium mb-2" style={{ color: '#6B6294' }}>Confidence scores</div>
            {rca.causes.map((label, idx) => (
              <div key={label} className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: confColors[idx] }} />
                <div className="flex-1 text-[9px] font-mono truncate" style={{ color: '#9B93C4' }}>{label}</div>
                <span className="text-[9px] font-mono font-semibold" style={{ color: confColors[idx] }}>{confidence[idx]}%</span>
                <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${confidence[idx]}%`, background: confColors[idx] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[8px] font-mono" style={{ color: '#524770' }}>📋 Evidence chain: {rca.evidence}</div>
          </div>
        </div>

        {/* Panel 3 — SafeFix™ */}
        <div className="p-4">
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#524770' }}>SafeFix™ Proposal</div>
          <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(108,71,255,0.07)', border: '1px solid rgba(108,71,255,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold" style={{ color: '#A78BFA' }}>Auto-Remediation</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                dry-run ✓
              </span>
            </div>
            <div className="font-mono text-[10px] p-2 rounded-lg mb-3"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', color: '#A78BFA' }}>
              {rca.fix}
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold"
                style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.4), rgba(79,46,232,0.4))', color: '#C4B5FD', border: '1px solid rgba(108,71,255,0.4)' }}>
                <CheckCircle2 className="w-3 h-3" /> Approve
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-[10px]"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#524770', border: '1px solid rgba(255,255,255,0.06)' }}>
                Dismiss
              </button>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[9px] mb-2" style={{ color: '#524770' }}>Resolution timeline</div>
            <div className="flex items-center">
              {TIMELINE.map((label, i, arr) => {
                const done = i <= timelineStep;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full transition-all duration-500"
                        style={{ background: done ? '#6C47FF' : 'rgba(255,255,255,0.1)', boxShadow: done ? '0 0 6px rgba(108,71,255,0.6)' : 'none' }} />
                      <span className="text-[8px] font-mono mt-1 transition-colors duration-500" style={{ color: done ? '#6C47FF' : '#3D3460' }}>{TIMES[i]}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex-1 h-px mx-1 transition-all duration-700"
                        style={{ background: done ? 'linear-gradient(90deg, #6C47FF, rgba(108,71,255,0.3))' : 'rgba(255,255,255,0.06)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[9px] font-mono transition-all" style={{ color: '#34d399' }}>{resolved} incidents auto-resolved this month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main HeroSection ─────────────────────────────────────────── */
export default function HeroSection() {
  const live = useDashboardLive();
  const { resolved, mttr, secAgo } = live;
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#0C0C14',
        minHeight: '100vh',
        paddingTop: 'calc(76px + var(--banner-height, 0px))',
      }}
    >
      <GradientMeshBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-24 w-full">

        {/* ── Centered text block ── */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">

          {/* Announcement pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8"
          >
            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: 'rgba(108,71,255,0.1)',
                border: '1px solid rgba(108,71,255,0.28)',
                color: '#A78BFA',
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{ background: '#6C47FF' }}
              >
                New
              </span>
              KubēGraf v1.0 — AI SRE for Kubernetes
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="font-black tracking-[-0.04em] mb-6"
            style={{
              fontSize: 'clamp(44px, 7vw, 84px)',
              lineHeight: 1.02,
              background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 45%, #A78BFA 68%, #6C47FF 85%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The AI DevOps &amp;
            <br />
            Cloud Orchestrator
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="text-lg leading-relaxed mb-10 max-w-xl text-slate-400"
          >
            AI agents that detect, diagnose, and fix Kubernetes incidents —
            running entirely inside your own environment.
            Zero data exfiltration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-10"
          >
            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #6C47FF 0%, #4F2EE8 100%)',
                boxShadow: '0 4px 24px rgba(108,71,255,0.4), 0 1px 0 rgba(255,255,255,0.12) inset',
              }}
            >
              Get Early Access
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: '#CBD5E1',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              See KubēGraf ↗
            </a>
          </motion.div>

          {/* Inline stats row — live */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
          >
            {/* MTTR — ticks with each resolution */}
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono font-semibold text-emerald-400">{mttr}s</span>
              <span className="text-slate-500">avg MTTR</span>
            </span>

            <span className="text-slate-700 hidden sm:inline">·</span>

            {/* Resolved count — increments live */}
            <span className="flex items-center gap-1">
              <span className="font-mono font-semibold text-white">{resolved}+</span>
              <span className="text-slate-500">incidents resolved</span>
            </span>

            <span className="text-slate-700 hidden sm:inline">·</span>

            <span className="flex items-center gap-1 text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              Zero data exfiltration
            </span>

            <span className="text-slate-700 hidden sm:inline">·</span>

            <span className="flex items-center gap-1 text-slate-500">
              <Shield className="w-3 h-3 shrink-0" style={{ color: '#524770' }} />
              SOC 2 ready
            </span>
          </motion.div>
        </div>

        {/* ── Full-width product mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 56, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Floating live badge — ticking */}
          <div
            className="absolute -top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: '#34d399',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Live — Production</span>
            <span style={{ color: 'rgba(52,211,153,0.4)' }}>·</span>
            <span className="font-mono">
              {secAgo < 60
                ? `last fix ${secAgo}s ago`
                : `last fix ${Math.floor(secAgo / 60)}m ${secAgo % 60}s ago`}
            </span>
          </div>

          {/* Glow under the card */}
          <div
            className="absolute -inset-x-8 -bottom-8 h-24 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 80% at 50% 100%, rgba(108,71,255,0.2) 0%, transparent 70%)',
            }}
          />
          <DashboardMockup live={live} />
        </motion.div>
      </div>

      {/* Bottom fade to main bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #131316)' }}
      />
    </section>
  );
}
