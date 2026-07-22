import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Lock, ShieldCheck, Zap } from 'lucide-react';
import { DiscordIcon, DISCORD_URL, KUBEGRAF_URL } from './shared';

const EASE = [0.16, 1, 0.3, 1];

/* ── Demo state machine: Detect → Diagnose → SafeFix → Resolved ── */
const STEPS = ['Detect', 'Diagnose', 'SafeFix', 'Resolved'];

const INCIDENTS = [
  {
    id: 2847, svc: 'payments-api', ns: 'production', status: 'CrashLoopBackOff', sev: 'P1',
    causes: [
      { label: 'Deploy v2.3.1 — memory limit 512Mi', conf: 96 },
      { label: 'Traffic spike +42% on /charge', conf: 88 },
      { label: 'Node pressure on worker-03', conf: 61 },
    ],
    evidence: ['deploy v2.3.1', 'heap growth', 'OOMKill', 'restart loop'],
    patch: [
      { op: ' ', line: 'resources:' },
      { op: ' ', line: '  limits:' },
      { op: '-', line: '    memory: "512Mi"' },
      { op: '+', line: '    memory: "1Gi"' },
    ],
    fix: 'Raise memory limit · rolling restart',
  },
  {
    id: 2848, svc: 'auth-worker', ns: 'identity', status: 'Degraded', sev: 'P2',
    causes: [
      { label: 'Single replica after config change', conf: 94 },
      { label: 'Liveness probe timeout too low', conf: 83 },
      { label: 'Upstream DNS latency', conf: 47 },
    ],
    evidence: ['config v1.4', 'replica = 1', 'probe timeouts', 'degraded'],
    patch: [
      { op: ' ', line: 'spec:' },
      { op: '-', line: '  replicas: 1' },
      { op: '+', line: '  replicas: 3' },
      { op: ' ', line: '  strategy: RollingUpdate' },
    ],
    fix: 'Scale to 3 replicas · rolling update',
  },
];

function useDemo() {
  const [step, setStep] = useState(1);
  const [idx, setIdx] = useState(0);
  const [resolved, setResolved] = useState(142);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          setIdx((i) => (i + 1) % INCIDENTS.length);
          setResolved((r) => r + 1);
          return 0;
        }
        return s + 1;
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return { step, incident: INCIDENTS[idx], resolved };
}

/* ── Console panels ──────────────────────────────────────────── */
function IncidentPane({ incident, step }) {
  const done = step === 3;
  return (
    <div className="p-4 sm:p-5 flex flex-col gap-3" style={{ borderRight: '1px solid var(--lp-line-soft)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--lp-ink-3)' }}>
          Incident #{incident.id}
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={done
            ? { background: 'rgba(23,163,74,0.10)', color: 'var(--lp-green)' }
            : { background: 'rgba(220,40,40,0.08)', color: 'var(--lp-red)' }}
        >
          {done ? 'RESOLVED' : incident.sev}
        </span>
      </div>

      <div className="lp-card p-3.5 !rounded-xl" style={{ borderColor: done ? 'rgba(23,163,74,0.25)' : 'rgba(220,40,40,0.18)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${done ? '' : 'animate-pulse'}`}
            style={{ background: done ? 'var(--lp-green)' : 'var(--lp-red)' }}
          />
          <span className="lp-mono text-[13px] font-semibold" style={{ color: 'var(--lp-ink)' }}>{incident.svc}</span>
        </div>
        <div className="lp-mono text-[11px]" style={{ color: 'var(--lp-ink-3)' }}>
          {incident.ns} · {done ? 'Running · 3/3 ready' : incident.status}
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--lp-ink-3)' }}>
          Evidence chain
        </div>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {incident.evidence.map((e, i) => (
            <React.Fragment key={e}>
              <span
                className="lp-mono text-[11px] px-2 py-1 rounded-md"
                style={{
                  background: i <= step ? 'var(--lp-orange-soft)' : 'rgba(22,24,29,0.04)',
                  color: i <= step ? 'var(--lp-orange-deep)' : 'var(--lp-ink-3)',
                  transition: 'all .4s',
                }}
              >
                {e}
              </span>
              {i < incident.evidence.length - 1 && (
                <span style={{ color: 'var(--lp-ink-3)' }} className="text-[11px]">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function RcaPane({ incident, step }) {
  return (
    <div className="p-4 sm:p-5" style={{ borderRight: '1px solid var(--lp-line-soft)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3.5 h-3.5" style={{ color: 'var(--lp-orange)' }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--lp-ink-3)' }}>
          Root cause analysis
        </span>
      </div>
      <div className="space-y-3">
        {incident.causes.map((c, i) => (
          <div key={c.label}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[12px] truncate" style={{ color: 'var(--lp-ink-2)' }}>{c.label}</span>
              <span className="lp-mono text-[11px] font-semibold shrink-0" style={{ color: i === 0 ? 'var(--lp-orange-deep)' : 'var(--lp-ink-3)' }}>
                {step >= 1 ? `${c.conf}%` : '—'}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(22,24,29,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: step >= 1 ? `${c.conf}%` : '4%',
                  background: i === 0
                    ? 'linear-gradient(90deg, var(--lp-orange), var(--lp-amber))'
                    : 'rgba(22,24,29,0.18)',
                  transition: 'width .9s cubic-bezier(.16,1,.3,1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-4 p-3 rounded-xl flex items-start gap-2.5"
        style={{ background: 'var(--lp-orange-soft)', border: '1px solid rgba(255,122,31,0.22)' }}
      >
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--lp-orange-deep)' }} />
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--lp-orange-deep)' }}>
            Recommended fix
          </div>
          <div className="text-[12px] font-medium truncate" style={{ color: 'var(--lp-ink)' }}>{incident.fix}</div>
        </div>
      </div>
    </div>
  );
}

function SafeFixPane({ incident, step }) {
  const applied = step >= 3;
  return (
    <div className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--lp-ink-3)' }}>
          SafeFix™ patch
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
          style={{ background: 'rgba(23,163,74,0.10)', color: 'var(--lp-green)' }}
        >
          <ShieldCheck className="w-3 h-3" /> signed · dry-run ✓
        </span>
      </div>

      <div className="lp-console p-3.5 lp-mono text-[11.5px] leading-relaxed">
        {incident.patch.map((l, i) => (
          <div
            key={i}
            className="flex gap-2"
            style={{
              color: l.op === '+' ? '#4ADE80' : l.op === '-' ? '#F87171' : 'rgba(230,232,238,0.55)',
              opacity: step >= 2 ? 1 : 0.25,
              transition: `opacity .5s ${i * 0.08}s`,
            }}
          >
            <span className="w-3 shrink-0 opacity-70">{l.op}</span>
            <span className="whitespace-pre">{l.line}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <div
          className="flex-1 h-9 rounded-lg inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-all duration-500"
          style={applied
            ? { background: 'rgba(23,163,74,0.12)', color: 'var(--lp-green)', border: '1px solid rgba(23,163,74,0.30)' }
            : { background: 'var(--lp-orange)', color: '#fff', boxShadow: '0 4px 14px rgba(255,122,31,0.30)' }}
        >
          {applied ? (<><CheckCircle2 className="w-3.5 h-3.5" /> Applied &amp; verified</>) : 'Approve fix'}
        </div>
        <div
          className="h-9 px-3.5 rounded-lg inline-flex items-center text-[12px] font-medium"
          style={{ border: '1px solid var(--lp-line)', color: 'var(--lp-ink-3)' }}
        >
          Dismiss
        </div>
      </div>
    </div>
  );
}

function KubeGrafConsole() {
  const { step, incident, resolved } = useDemo();
  return (
    <div className="lp-window select-none" aria-hidden="true">
      {/* Chrome bar */}
      <div className="lp-window-bar">
        <span className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
        <div className="flex-1 flex justify-center px-2">
          <div
            className="h-6 px-3 rounded-md inline-flex items-center gap-1.5 max-w-[280px] w-full justify-center"
            style={{ background: 'rgba(22,24,29,0.04)', border: '1px solid var(--lp-line-soft)' }}
          >
            <Lock className="w-3 h-3" style={{ color: 'var(--lp-ink-3)' }} />
            <span className="lp-mono text-[11px] truncate" style={{ color: 'var(--lp-ink-3)' }}>
              app.kubegraf.io — production
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 lp-mono text-[10px]" style={{ color: 'var(--lp-green)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--lp-green)' }} />
          {resolved} auto-resolved
        </span>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        <IncidentPane incident={incident} step={step} />
        <RcaPane incident={incident} step={step} />
        <SafeFixPane incident={incident} step={step} />
      </div>

      {/* Timeline footer */}
      <div
        className="flex items-center gap-2 px-4 sm:px-6 py-3"
        style={{ borderTop: '1px solid var(--lp-line-soft)', background: '#FBFAF7' }}
      >
        {STEPS.map((label, i) => {
          const active = i <= step;
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    background: active ? (i === 3 ? 'var(--lp-green)' : 'var(--lp-orange)') : 'rgba(22,24,29,0.12)',
                    boxShadow: i === step ? '0 0 0 4px rgba(255,122,31,0.15)' : 'none',
                  }}
                />
                <span
                  className="text-[11px] font-medium transition-colors duration-500"
                  style={{ color: active ? 'var(--lp-ink)' : 'var(--lp-ink-3)' }}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px transition-all duration-700" style={{ background: i < step ? 'var(--lp-orange)' : 'var(--lp-line)' }} />
              )}
            </React.Fragment>
          );
        })}
        <span className="ml-auto hidden sm:block lp-mono text-[10px] shrink-0" style={{ color: 'var(--lp-ink-3)' }}>
          T+{step === 3 ? '18s' : `${step * 4 + 2}s`}
        </span>
      </div>
    </div>
  );
}

/* ── Slack surface — the agent where your team already works ── */
function SlackView() {
  return (
    <div className="lp-window select-none" aria-hidden="true">
      <div className="lp-window-bar">
        <span className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
        <div className="flex-1 flex justify-center px-2">
          <span className="lp-mono text-[11px]" style={{ color: 'var(--lp-ink-3)' }}># incidents — Slack</span>
        </div>
        <span className="w-16" />
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Bot: detection */}
        <div className="flex gap-3">
          <span className="w-8 h-8 rounded-lg shrink-0 inline-flex items-center justify-center text-[11px] font-bold"
            style={{ background: 'var(--lp-orange)', color: '#fff' }}>KG</span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[13.5px] font-bold" style={{ color: 'var(--lp-ink)' }}>KubeGraf</span>
              <span className="text-[9px] font-bold px-1 rounded uppercase" style={{ background: 'rgba(22,24,29,0.07)', color: 'var(--lp-ink-3)' }}>app</span>
              <span className="text-[11px]" style={{ color: 'var(--lp-ink-3)' }}>03:02</span>
            </div>
            <p className="text-[13.5px] mt-0.5" style={{ color: 'var(--lp-ink-2)' }}>
              🔴 <span className="font-semibold" style={{ color: 'var(--lp-ink)' }}>P1 · payments-api</span> is
              crash-looping in <span className="lp-mono text-[12.5px]">production</span> — investigating…
            </p>
            {/* RCA reply */}
            <p className="text-[13.5px] mt-2" style={{ color: 'var(--lp-ink-2)' }}>
              Root cause <span className="font-semibold" style={{ color: 'var(--lp-ink)' }}>(96% confidence)</span>:
              memory limit 512Mi exceeded after deploy <span className="lp-mono text-[12.5px]">v2.3.1</span>.
              Evidence: deploy → heap growth → OOMKill → restart loop.
            </p>
            {/* SafeFix attachment */}
            <div className="mt-3 pl-3 py-2.5 pr-3 rounded-r-xl max-w-md"
              style={{ borderLeft: '3px solid var(--lp-orange)', background: 'var(--lp-orange-soft)' }}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[12px] font-bold" style={{ color: 'var(--lp-ink)' }}>SafeFix™ patch ready</span>
                <span className="text-[10px] font-semibold inline-flex items-center gap-1" style={{ color: 'var(--lp-green)' }}>
                  <ShieldCheck className="w-3 h-3" /> signed · dry-run ✓
                </span>
              </div>
              <div className="lp-mono text-[12px] mb-2.5" style={{ color: 'var(--lp-ink-2)' }}>
                limits.memory: <span style={{ color: 'var(--lp-red)' }}>512Mi</span> → <span style={{ color: 'var(--lp-green)' }}>1Gi</span> · rolling restart
              </div>
              <div className="flex gap-2">
                <span className="h-8 px-3.5 rounded-lg inline-flex items-center text-[12px] font-semibold"
                  style={{ background: 'var(--lp-green)', color: '#fff' }}>Approve</span>
                <span className="h-8 px-3.5 rounded-lg inline-flex items-center text-[12px] font-medium"
                  style={{ background: '#fff', border: '1px solid var(--lp-line)', color: 'var(--lp-ink-2)' }}>Dismiss</span>
              </div>
            </div>
          </div>
        </div>

        {/* Human approval */}
        <div className="flex gap-3">
          <span className="w-8 h-8 rounded-lg shrink-0 inline-flex items-center justify-center text-[11px] font-bold"
            style={{ background: 'rgba(22,24,29,0.08)', color: 'var(--lp-ink-2)' }}>DR</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[13.5px] font-bold" style={{ color: 'var(--lp-ink)' }}>dana</span>
              <span className="text-[11px]" style={{ color: 'var(--lp-ink-3)' }}>03:03</span>
            </div>
            <p className="text-[13.5px] mt-0.5" style={{ color: 'var(--lp-ink-2)' }}>approved ✅ — thanks KubeGraf</p>
          </div>
        </div>

        {/* Bot: resolution */}
        <div className="flex gap-3">
          <span className="w-8 h-8 rounded-lg shrink-0 inline-flex items-center justify-center text-[11px] font-bold"
            style={{ background: 'var(--lp-orange)', color: '#fff' }}>KG</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[13.5px] font-bold" style={{ color: 'var(--lp-ink)' }}>KubeGraf</span>
              <span className="text-[9px] font-bold px-1 rounded uppercase" style={{ background: 'rgba(22,24,29,0.07)', color: 'var(--lp-ink-3)' }}>app</span>
              <span className="text-[11px]" style={{ color: 'var(--lp-ink-3)' }}>03:03</span>
            </div>
            <p className="text-[13.5px] mt-0.5" style={{ color: 'var(--lp-ink-2)' }}>
              ✅ Applied — rollout 3/3 healthy. <span className="font-semibold" style={{ color: 'var(--lp-ink)' }}>Resolved in 18s.</span> Post-mortem timeline drafted.
            </p>
            <div className="flex gap-1.5 mt-2">
              {['🎉 3', '🙌 2', '⚡ 1'].map((r) => (
                <span key={r} className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(22,24,29,0.05)', border: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CLI surface ─────────────────────────────────────────────── */
function CliView() {
  const LINES = [
    { c: '#E6E8EE', t: '$ kubegraf investigate payments-api -n production' },
    { c: 'rgba(230,232,238,0.55)', t: '▸ correlating events, logs, metrics, rollouts…' },
    { c: '#4ADE80', t: '✓ root cause: memory limit 512Mi exceeded after deploy v2.3.1  (confidence 96%)' },
    { c: 'rgba(230,232,238,0.55)', t: '▸ generating SafeFix™ patch… signed sha256:9f2c…e81a' },
    { c: '#4ADE80', t: '✓ dry-run passed · blast radius: 1 deployment · rollback ready' },
    { c: '#FBBF24', t: '? apply patch to production — approve in Slack or press [y]  y' },
    { c: '#4ADE80', t: '✓ applied · rollout 3/3 healthy · resolved in 18s' },
  ];
  return (
    <div className="lp-window select-none" aria-hidden="true">
      <div className="lp-window-bar">
        <span className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
        <div className="flex-1 flex justify-center px-2">
          <span className="lp-mono text-[11px]" style={{ color: 'var(--lp-ink-3)' }}>kubegraf — zsh</span>
        </div>
        <span className="w-16" />
      </div>
      <div className="p-5 sm:p-7 lp-mono text-[12px] sm:text-[13px] leading-[1.9]" style={{ background: 'var(--lp-dark)' }}>
        {LINES.map((l, i) => (
          <div key={i} style={{ color: l.c }}>{l.t}</div>
        ))}
        <div className="flex items-center gap-0.5" style={{ color: '#E6E8EE' }}>
          $ <span className="inline-block w-2 h-4 ml-1 animate-cursor-blink" style={{ background: 'var(--lp-orange)' }} />
        </div>
      </div>
    </div>
  );
}

/* ── Tabbed demo: Console / Slack / CLI ──────────────────────── */
const DEMO_TABS = [
  { key: 'console', label: 'Console' },
  { key: 'slack', label: 'Slack' },
  { key: 'cli', label: 'CLI' },
];

function DemoTabs() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % DEMO_TABS.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const select = (i) => {
    pausedRef.current = true; // manual choice wins; stop auto-rotation
    setActive(i);
  };

  return (
    <div>
      <div role="tablist" aria-label="KubeGraf demo surfaces" className="flex items-center gap-1.5 mb-4">
        {DEMO_TABS.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === i}
            onClick={() => select(i)}
            className="h-9 px-4 rounded-full text-[13px] font-semibold transition-all"
            style={active === i
              ? { background: '#FAF8F4', color: 'var(--lp-ink)' }
              : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(230,232,238,0.75)' }}
          >
            {t.label}
          </button>
        ))}
        <span className="ml-auto hidden sm:block lp-mono text-[11px]" style={{ color: 'rgba(230,232,238,0.5)' }}>
          same agent, every surface
        </span>
      </div>
      <div role="tabpanel">
        {active === 0 && <KubeGrafConsole />}
        {active === 1 && <SlackView />}
        {active === 2 && <CliView />}
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative overflow-hidden lp-hero-dark">
      {/* faded dot grid */}
      <div
        className="absolute inset-0 lp-dot-grid-dark pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 0%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 0%, black 20%, transparent 75%)',
          opacity: 0.5,
        }}
      />
      {/* horizon hairline above the light page below */}
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,122,31,0.45) 30%, rgba(255,122,31,0.45) 70%, transparent)' }} />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-[130px] sm:pt-[158px] pb-16 sm:pb-24">
        {/* Announcement pill */}
        <motion.a
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          href={KUBEGRAF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="lp-pill-dark group mb-9 inline-flex"
        >
          <span className="lp-pill-tag">Live</span>
          KubeGraf v1.0 — our flagship AI SRE platform
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.a>

        {/* Headline — editorial scale, left-aligned */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          className="lp-display text-[clamp(46px,8.4vw,108px)]"
          style={{ lineHeight: 0.99, color: '#FAF8F4' }}
        >
          Infrastructure that
          <br />
          <span className="lp-serif" style={{ color: 'var(--lp-orange)' }}>heals itself.</span>
        </motion.h1>

        {/* Hairline-divided row: manifesto left, actions right */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-12 sm:mt-14 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
        >
          <p
            className="lg:col-span-6 max-w-xl text-base sm:text-lg leading-relaxed"
            style={{ color: 'rgba(230,232,238,0.72)' }}
          >
            Orkastor builds AI agents for infrastructure operations. Our flagship product,{' '}
            <a href={KUBEGRAF_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-2 underline-offset-2" style={{ color: '#fff', textDecorationColor: 'var(--lp-orange)' }}>
              KubeGraf
            </a>
            , detects, diagnoses, and fixes Kubernetes incidents in minutes — not hours.
            With AI that runs inside your environment and never exfiltrates your data.
          </p>

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col items-start gap-5">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <a href={KUBEGRAF_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-primary group">
                Try KubeGraf free
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-ghost-dark">
                <DiscordIcon className="w-4 h-4" style={{ color: 'rgba(230,232,238,0.7)' }} />
                Join the community
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px]" style={{ color: 'rgba(230,232,238,0.55)' }}>
              {['Root cause in seconds', 'SafeFix™ signed patches', 'Zero data exfiltration'].map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span aria-hidden="true" className="w-3 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />}
                  <span>{t}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product console */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
          className="mt-16 sm:mt-20"
        >
          <DemoTabs />
        </motion.div>
      </div>
    </section>
  );
}
