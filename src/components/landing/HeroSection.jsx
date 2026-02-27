import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Shield, CheckCircle2, Zap } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/* ── Constants ────────────────────────────────────────────────── */
const INCIDENT_POOL = [
  { svc: 'api-server',    ns: 'production', status: 'CrashLoop',  color: '#ef4444', severity: 'P1' },
  { svc: 'payment-svc',   ns: 'checkout',   status: 'OOMKilled',  color: '#f59e0b', severity: 'P1' },
  { svc: 'auth-worker',   ns: 'identity',   status: 'Degraded',   color: '#6C47FF', severity: 'P2' },
  { svc: 'nginx-ingress', ns: 'ingress',    status: 'Pending',    color: '#f59e0b', severity: 'P2' },
  { svc: 'redis-cache',   ns: 'cache',      status: 'OOMKilled',  color: '#ef4444', severity: 'P1' },
  { svc: 'worker-queue',  ns: 'jobs',       status: 'CrashLoop',  color: '#6C47FF', severity: 'P2' },
  { svc: 'metrics-srv',   ns: 'monitoring', status: 'Degraded',   color: '#8B5CF6', severity: 'P3' },
  { svc: 'db-replica',    ns: 'postgres',   status: 'Restarting', color: '#ef4444', severity: 'P1' },
];

const RCA_MAP = {
  CrashLoop: {
    causes: ['Deploy v2.3.1', 'Memory limit 512Mi', 'Traffic spike +40%'],
    fix: 'limits.memory: 512Mi → 1Gi',
    evidence: 'deploy → OOM → restart loop',
    risk: 'Low',
    patch: [
      { op: '-', line: '    memory: "512Mi"' },
      { op: '+', line: '    memory: "1Gi"' },
      { op: ' ', line: '    cpu: "500m"' },
      { op: ' ', line: '    restartPolicy: Always' },
    ],
  },
  OOMKilled: {
    causes: ['Heap leak detected', 'Cache limit 256Mi', 'Query volume +65%'],
    fix: 'limits.memory: 256Mi → 512Mi',
    evidence: 'heap grow → limit → OOM kill',
    risk: 'Low',
    patch: [
      { op: '-', line: '    memory: "256Mi"' },
      { op: '+', line: '    memory: "512Mi"' },
      { op: ' ', line: '    cpu: "500m"' },
      { op: ' ', line: '    requests.memory: "128Mi"' },
    ],
  },
  Degraded: {
    causes: ['Config mismatch v1.4', 'Replica count = 1', 'Net timeout +30%'],
    fix: 'replicas: 1 → 3',
    evidence: 'config → single pod → degraded',
    risk: 'Medium',
    patch: [
      { op: '-', line: '  replicas: 1' },
      { op: '+', line: '  replicas: 3' },
      { op: ' ', line: '  strategy: RollingUpdate' },
      { op: ' ', line: '  maxSurge: 1' },
    ],
  },
  Pending: {
    causes: ['Node disk pressure', 'Resource quota hit', 'Image pull backoff'],
    fix: 'node.affinity: auto-select',
    evidence: 'disk pressure → unschedulable',
    risk: 'Medium',
    patch: [
      { op: '-', line: '  nodeSelector: worker-03' },
      { op: '+', line: '  nodeAffinity: auto' },
      { op: '+', line: '  tolerations: disk-pressure' },
      { op: ' ', line: '  priorityClass: high' },
    ],
  },
  Restarting: {
    causes: ['Liveness probe fail', 'Init container crash', 'Volume mount err'],
    fix: 'livenessProbe.delay: 10→30',
    evidence: 'probe fail → restart loop',
    risk: 'Low',
    patch: [
      { op: '-', line: '  initialDelaySeconds: 10' },
      { op: '+', line: '  initialDelaySeconds: 30' },
      { op: ' ', line: '  periodSeconds: 10' },
      { op: ' ', line: '  failureThreshold: 3' },
    ],
  },
};

const EVENT_POOL = [
  { type: 'Warning', msg: 'Back-off restarting failed container',     obj: 'api-server-7d9f',    ns: 'production', age: '2s'  },
  { type: 'Warning', msg: 'OOMKilled: container exceeded mem limit',  obj: 'payment-svc-6c8b',   ns: 'checkout',   age: '8s'  },
  { type: 'Normal',  msg: 'Successfully pulled image "v2.3.2"',       obj: 'auth-worker-5f4a',   ns: 'identity',   age: '15s' },
  { type: 'Warning', msg: 'Liveness probe failed: connection refused', obj: 'nginx-ingress-2d3e', ns: 'ingress',    age: '22s' },
  { type: 'Normal',  msg: 'Scaled up replica set to 3 replicas',      obj: 'worker-queue',       ns: 'jobs',       age: '31s' },
  { type: 'Warning', msg: 'Node disk usage at 87% capacity',          obj: 'worker-02',          ns: 'kube-system',age: '45s' },
  { type: 'Normal',  msg: 'HPA scaled deployment from 2→4 replicas',  obj: 'api-server',         ns: 'production', age: '58s' },
  { type: 'Normal',  msg: 'ConfigMap updated: app-config-v1.5',       obj: 'configmap/app',      ns: 'production', age: '72s' },
];

const CLUSTER_NODES = [
  { name: 'master-01', status: 'Ready',    cpu: 23, mem: 41 },
  { name: 'worker-01', status: 'Ready',    cpu: 67, mem: 72 },
  { name: 'worker-02', status: 'Ready',    cpu: 45, mem: 58 },
  { name: 'worker-03', status: 'NotReady', cpu: 91, mem: 89 },
];

const RESOLVED_INCIDENTS = [
  { svc: 'frontend-app', ns: 'web',    status: 'Resolved', color: '#34d399', severity: 'P2', age: '43s' },
  { svc: 'scheduler',    ns: 'system', status: 'Resolved', color: '#34d399', severity: 'P3', age: '2m'  },
];

/* ── Live dashboard hook ──────────────────────────────────────── */
function useDashboardLive() {
  const poolIdxRef  = useRef(3);
  const eventIdxRef = useRef(4);
  const timerRef    = useRef(null);

  const [incidents, setIncidents]       = useState(
    INCIDENT_POOL.slice(0, 3).map((inc, i) => ({ ...inc, active: i === 0, age: `${(i + 1) * 4}s` }))
  );
  const [resolved, setResolved]         = useState(142);
  const [mttr, setMttr]                 = useState(18);
  const [secAgo, setSecAgo]             = useState(4);
  const [incidentId, setIncidentId]     = useState(2847);
  const [confidence, setConfidence]     = useState([97, 90, 89]);
  const [timelineStep, setTimelineStep] = useState(2);
  const [isResolving, setIsResolving]   = useState(false);
  const [podCount, setPodCount]         = useState(847);
  const [events, setEvents]             = useState(EVENT_POOL.slice(0, 4));

  useEffect(() => {
    const tick = setInterval(() => setSecAgo(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const drift = setInterval(() => {
      setConfidence(c => c.map(v => Math.max(84, Math.min(98, v + (Math.random() > 0.5 ? 1 : -1)))));
      setPodCount(p => Math.max(844, Math.min(850, p + (Math.random() > 0.6 ? 1 : -1))));
    }, 2500);
    return () => clearInterval(drift);
  }, []);

  useEffect(() => {
    const evtTimer = setInterval(() => {
      const idx = eventIdxRef.current % EVENT_POOL.length;
      eventIdxRef.current += 1;
      setEvents(prev => {
        const newEvt = { ...EVENT_POOL[idx], age: `${Math.floor(Math.random() * 5) + 1}s` };
        return [newEvt, ...prev.slice(0, 3)];
      });
    }, 5000);
    return () => clearInterval(evtTimer);
  }, []);

  useEffect(() => {
    let step = 0;
    const advance = setInterval(() => {
      step = Math.min(step + 1, 2);
      setTimelineStep(step);
    }, 1200);
    return () => clearInterval(advance);
  }, []);

  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setIsResolving(true);
        setTimelineStep(3);
        setTimeout(() => {
          const newMttr = 14 + Math.floor(Math.random() * 8);
          setResolved(r => r + 1);
          setMttr(newMttr);
          setSecAgo(0);
          setIncidentId(id => id + 1);
          setIsResolving(false);
          setTimelineStep(0);
          setIncidents(prev => {
            const next = prev.slice(1);
            const newInc = INCIDENT_POOL[poolIdxRef.current % INCIDENT_POOL.length];
            poolIdxRef.current += 1;
            next.push({ ...newInc, active: false, age: '1s' });
            return next.map((inc, i) => ({ ...inc, active: i === 0 }));
          });
          setConfidence([
            93 + Math.floor(Math.random() * 5),
            88 + Math.floor(Math.random() * 5),
            84 + Math.floor(Math.random() * 6),
          ]);
          schedule();
        }, 1800);
      }, 8000 + Math.random() * 10000);
    };
    schedule();
    return () => clearTimeout(timerRef.current);
  }, []);

  return { incidents, resolved, mttr, secAgo, incidentId, confidence, timelineStep, isResolving, podCount, events };
}

/* ── Background ──────────────────────────────────────────────── */
function GradientMeshBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="blob-1 absolute rounded-full" style={{ top: '-20%', left: '30%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(108,71,255,0.22) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="blob-2 absolute rounded-full" style={{ bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="blob-3 absolute rounded-full" style={{ top: '40%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
    </div>
  );
}

/* ── Tab panels ──────────────────────────────────────────────── */
function OverviewPanel({ live }) {
  const { incidents, resolved, mttr, podCount, events } = live;
  const metrics = [
    { label: 'Active Incidents', val: `${incidents.length}`, sub: 'in last 1h',        color: '#ef4444' },
    { label: 'Pods Running',     val: `${podCount}/850`,     sub: '3 not ready',        color: '#0EA5E9' },
    { label: 'Avg MTTR',         val: `${mttr}s`,            sub: '↓ 80% vs last week', color: '#6C47FF' },
    { label: 'Uptime',           val: '99.97%',              sub: 'last 30 days',       color: '#34d399' },
  ];
  return (
    <div className="p-4" style={{ minHeight: '290px' }}>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {metrics.map(m => (
          <div key={m.label} className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-base font-black font-mono mb-0.5 transition-all" style={{ color: m.color }}>{m.val}</div>
            <div className="text-[9px] font-medium text-white mb-0.5 leading-tight">{m.label}</div>
            <div className="text-[8px]" style={{ color: '#524770' }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="mb-3">
        <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#524770' }}>Recent Events</div>
        <div className="space-y-1.5">
          {events.map((evt, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: evt.type === 'Warning' ? 'rgba(245,158,11,0.1)' : 'rgba(52,211,153,0.08)', color: evt.type === 'Warning' ? '#fbbf24' : '#34d399' }}>{evt.type}</span>
              <span className="text-[9px] font-mono flex-1 truncate" style={{ color: '#6B6294' }}>{evt.msg}</span>
              <span className="text-[8px] font-mono shrink-0" style={{ color: '#3D3460' }}>{evt.age}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#524770' }}>Node Health</div>
        <div className="grid grid-cols-4 gap-1.5">
          {CLUSTER_NODES.map(node => (
            <div key={node.name} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${node.status === 'Ready' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.2)'}` }}>
              <div className="flex items-center gap-1 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.status === 'Ready' ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-[8px] font-mono truncate" style={{ color: '#9B93C4' }}>{node.name}</span>
              </div>
              <div className="text-[7px] font-mono" style={{ color: '#524770' }}>CPU {node.cpu}%</div>
              <div className="text-[7px] font-mono" style={{ color: '#524770' }}>Mem {node.mem}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IncidentsPanel({ live }) {
  const { incidents, resolved, mttr, isResolving } = live;
  const allRows = [
    ...incidents.map(inc => ({ ...inc, state: 'active' })),
    ...RESOLVED_INCIDENTS.map(inc => ({ ...inc, state: 'resolved', active: false })),
  ];
  return (
    <div className="p-4" style={{ minHeight: '290px' }}>
      <div className="flex items-center gap-1.5 mb-3">
        {['All', 'P1', 'P2', 'Resolving'].map((f, i) => (
          <div key={f} className="px-2.5 py-1 rounded-full text-[9px] font-medium cursor-pointer"
            style={i === 0 ? { background: 'rgba(108,71,255,0.15)', color: '#A78BFA', border: '1px solid rgba(108,71,255,0.3)' } : { background: 'rgba(255,255,255,0.03)', color: '#524770', border: '1px solid rgba(255,255,255,0.05)' }}>
            {f}
          </div>
        ))}
        <div className="ml-auto text-[9px] font-mono" style={{ color: '#524770' }}>{allRows.length} total</div>
      </div>
      <div className="flex items-center gap-2 px-2 pb-1 text-[8px] font-bold uppercase tracking-wider" style={{ color: '#3D3460' }}>
        <span className="w-5">SEV</span>
        <span className="flex-1">Service</span>
        <span className="w-16">Namespace</span>
        <span className="w-20">Status</span>
        <span className="w-8 text-right">Age</span>
      </div>
      <div className="space-y-1.5">
        {allRows.map((inc, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl"
            style={{
              background: inc.state === 'active' && inc.active ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${inc.state === 'active' && inc.active ? 'rgba(239,68,68,0.15)' : inc.state === 'resolved' ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)'}`,
            }}>
            <span className="w-5 text-[9px] font-bold" style={{ color: inc.state === 'resolved' ? '#34d399' : inc.severity === 'P1' ? '#ef4444' : inc.severity === 'P2' ? '#f59e0b' : '#6B6294' }}>{inc.severity}</span>
            <div className="flex-1 flex items-center gap-1.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: inc.state === 'resolved' ? '#34d399' : inc.color, boxShadow: inc.active && inc.state === 'active' ? `0 0 5px ${inc.color}` : 'none' }} />
              <span className="text-[10px] font-mono text-white font-medium truncate">{inc.svc}</span>
              {inc.active && inc.state === 'active' && (
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0"
                  style={{ background: isResolving ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', color: isResolving ? '#34d399' : '#f87171' }}>
                  {isResolving ? 'fixing' : 'live'}
                </span>
              )}
            </div>
            <span className="w-16 text-[9px] font-mono truncate" style={{ color: '#6B6294' }}>{inc.ns}</span>
            <span className="w-20 text-[9px] font-mono truncate" style={{ color: inc.state === 'resolved' ? '#34d399' : inc.color }}>{inc.state === 'resolved' ? '✓ Resolved' : inc.status}</span>
            <span className="w-8 text-[9px] font-mono text-right" style={{ color: '#524770' }}>{inc.age || '4s'}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="text-base font-black font-mono transition-all" style={{ color: '#6C47FF' }}>{mttr}s</div>
          <div className="text-[8px] uppercase tracking-wider" style={{ color: '#3D3460' }}>MTTR</div>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="text-base font-black font-mono transition-all" style={{ color: '#0EA5E9' }}>{resolved}</div>
          <div className="text-[8px] uppercase tracking-wider" style={{ color: '#3D3460' }}>RESOLVED</div>
        </div>
      </div>
    </div>
  );
}

function RCAPanel({ live }) {
  const { incidents, incidentId, confidence, isResolving } = live;
  const activeInc  = incidents[0] || INCIDENT_POOL[0];
  const rca        = RCA_MAP[activeInc.status] || RCA_MAP.CrashLoop;
  const confColors = ['#6C47FF', '#8B5CF6', '#0EA5E9'];
  return (
    <div className="p-4" style={{ minHeight: '290px' }}>
      <div className="p-3 rounded-xl mb-3"
        style={{ background: isResolving ? 'rgba(52,211,153,0.05)' : 'rgba(245,158,11,0.05)', border: `1px solid ${isResolving ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.15)'}` }}>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: isResolving ? '#34d399' : '#fbbf24' }} />
          <span className="text-sm font-bold text-white">Incident #{incidentId}</span>
          <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: isResolving ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)', color: isResolving ? '#34d399' : '#f87171' }}>
            {isResolving ? 'FIXED' : 'ACTIVE'}
          </span>
        </div>
        <div className="text-[11px] font-mono" style={{ color: '#6B6294' }}>{activeInc.svc} / {activeInc.ns} · {activeInc.status}BackOff</div>
      </div>
      <div className="mb-3">
        <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#524770' }}>Confidence Scores</div>
        {rca.causes.map((label, idx) => (
          <div key={label} className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: confColors[idx] }} />
            <div className="flex-1 text-[10px] font-mono truncate" style={{ color: '#9B93C4' }}>{label}</div>
            <span className="text-[10px] font-mono font-bold w-8 text-right transition-all duration-700" style={{ color: confColors[idx] }}>{confidence[idx]}%</span>
            <div className="w-14 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${confidence[idx]}%`, background: confColors[idx] }} />
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#524770' }}>Evidence Chain</div>
        <div className="text-[10px] font-mono flex flex-wrap gap-x-1 items-center">
          {rca.evidence.split(' → ').map((step, i, arr) => (
            <span key={step} className="flex items-center gap-1">
              <span style={{ color: '#9B93C4' }}>{step}</span>
              {i < arr.length - 1 && <span style={{ color: '#6C47FF' }}>→</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="p-2.5 rounded-xl flex items-center gap-2.5"
        style={{ background: 'rgba(108,71,255,0.06)', border: '1px solid rgba(108,71,255,0.2)' }}>
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#A78BFA' }} />
        <div className="flex-1 min-w-0">
          <div className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: '#6B6294' }}>Recommended fix</div>
          <div className="text-[10px] font-mono font-semibold truncate" style={{ color: '#A78BFA' }}>{rca.fix}</div>
        </div>
        <span className="text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0"
          style={{ background: rca.risk === 'Low' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', color: rca.risk === 'Low' ? '#34d399' : '#fbbf24', border: `1px solid ${rca.risk === 'Low' ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
          {rca.risk} risk
        </span>
      </div>
    </div>
  );
}

function SafeFixPanel({ live }) {
  const { incidents, resolved, mttr, timelineStep, isResolving } = live;
  const activeInc = incidents[0] || INCIDENT_POOL[0];
  const rca       = RCA_MAP[activeInc.status] || RCA_MAP.CrashLoop;
  const TIMELINE  = ['Detect', 'RCA', 'Fix', 'Done'];
  const TIMES     = ['T+0s', 'T+3s', 'T+8s', `T+${mttr}s`];
  return (
    <div className="p-4" style={{ minHeight: '290px' }}>
      <div className="p-3 rounded-xl mb-3"
        style={{ background: 'rgba(108,71,255,0.07)', border: '1px solid rgba(108,71,255,0.2)' }}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-bold" style={{ color: '#A78BFA' }}>Auto-Remediation</span>
          <div className="flex gap-1.5">
            <span className="text-[8px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: rca.risk === 'Low' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${rca.risk === 'Low' ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.2)'}`, color: rca.risk === 'Low' ? '#34d399' : '#fbbf24' }}>
              {rca.risk} risk
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
              dry-run ✓
            </span>
          </div>
        </div>
        <div className="font-mono text-[9px] p-2.5 rounded-lg mb-3"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {rca.patch.map((line, i) => (
            <div key={i} className="flex items-center gap-1.5 leading-relaxed"
              style={{ color: line.op === '+' ? '#34d399' : line.op === '-' ? '#f87171' : '#6B6294' }}>
              <span className="w-2.5 shrink-0 opacity-60">{line.op}</span>
              <span>{line.line}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.5), rgba(79,46,232,0.5))', color: '#C4B5FD', border: '1px solid rgba(108,71,255,0.4)' }}>
            <CheckCircle2 className="w-3 h-3" /> Approve
          </button>
          <button className="flex-1 py-2 rounded-lg text-[11px]"
            style={{ background: 'rgba(255,255,255,0.03)', color: '#524770', border: '1px solid rgba(255,255,255,0.06)' }}>
            Dismiss
          </button>
        </div>
      </div>
      <div className="mb-3">
        <div className="text-[9px] mb-2" style={{ color: '#524770' }}>Resolution timeline</div>
        <div className="flex items-center">
          {TIMELINE.map((label, i, arr) => {
            const done = i <= timelineStep;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                    style={{ background: done ? '#6C47FF' : 'rgba(255,255,255,0.08)', boxShadow: done ? '0 0 8px rgba(108,71,255,0.7)' : 'none' }} />
                  <span className="text-[8px] font-mono mt-0.5 transition-colors duration-500" style={{ color: done ? '#A78BFA' : '#3D3460' }}>{label}</span>
                  <span className="text-[7px] font-mono" style={{ color: done ? '#6C47FF' : '#3D3460' }}>{TIMES[i]}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex-1 h-px mx-1 transition-all duration-700"
                    style={{ background: i < timelineStep ? 'linear-gradient(90deg, #6C47FF, rgba(108,71,255,0.3))' : 'rgba(255,255,255,0.06)' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="p-2 rounded-lg flex items-center gap-2"
        style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-[9px] font-mono transition-all" style={{ color: '#34d399' }}>{resolved} incidents auto-resolved this month</span>
      </div>
    </div>
  );
}

/* ── Dashboard Mockup (tabbed) ───────────────────────────────── */
function DashboardMockup({ live }) {
  const { incidents, isResolving } = live;
  const [activeTab, setActiveTab] = useState(1);
  const tabTimerRef = useRef(null);
  const tabOrderRef = useRef(0);
  const TAB_CYCLE   = [1, 2, 3, 0];
  const TABS        = ['Overview', 'Incidents', 'RCA', 'SafeFix™'];

  useEffect(() => {
    tabTimerRef.current = setInterval(() => {
      tabOrderRef.current = (tabOrderRef.current + 1) % TAB_CYCLE.length;
      setActiveTab(TAB_CYCLE[tabOrderRef.current]);
    }, 4500);
    return () => clearInterval(tabTimerRef.current);
  }, []);

  const handleTabClick = (idx) => {
    clearInterval(tabTimerRef.current);
    setActiveTab(idx);
    const orderIdx = TAB_CYCLE.indexOf(idx);
    tabOrderRef.current = orderIdx === -1 ? 0 : orderIdx;
    tabTimerRef.current = setInterval(() => {
      tabOrderRef.current = (tabOrderRef.current + 1) % TAB_CYCLE.length;
      setActiveTab(TAB_CYCLE[tabOrderRef.current]);
    }, 4500);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden select-none relative"
      style={{ background: '#080C14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 0 1px rgba(108,71,255,0.18), 0 80px 160px rgba(0,0,0,0.5), 0 0 120px rgba(108,71,255,0.15)' }}>
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #6C47FF 30%, #0EA5E9 70%, transparent 100%)', backgroundSize: '200% auto', animation: 'shimmer-slide 3s linear infinite' }} />

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
      <div className="flex items-center gap-0.5 px-4 pt-2 pb-0 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => handleTabClick(i)}
            className="px-4 py-2 text-[11px] font-medium rounded-t-lg cursor-pointer transition-all"
            style={i === activeTab
              ? { background: 'rgba(108,71,255,0.12)', borderBottom: '2px solid #6C47FF', color: '#A78BFA', marginBottom: '-1px' }
              : { color: '#524770', borderBottom: '2px solid transparent', marginBottom: '-1px' }}>
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 mb-1">
          <div className="text-[10px] font-mono px-2 py-1 rounded transition-all"
            style={{ background: isResolving ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', color: isResolving ? '#34d399' : '#f87171', border: `1px solid ${isResolving ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {isResolving ? '✓ Fixing' : `${incidents.length} Active`}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}>
          {activeTab === 0 && <OverviewPanel live={live} />}
          {activeTab === 1 && <IncidentsPanel live={live} />}
          {activeTab === 2 && <RCAPanel live={live} />}
          {activeTab === 3 && <SafeFixPanel live={live} />}
        </motion.div>
      </AnimatePresence>
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
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ background: '#6C47FF' }}>
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

          {/* Inline stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono font-semibold text-emerald-400">{mttr}s</span>
              <span className="text-slate-500">avg MTTR</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">·</span>
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
          {/* Floating live badge */}
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
              {secAgo < 60 ? `last fix ${secAgo}s ago` : `last fix ${Math.floor(secAgo / 60)}m ${secAgo % 60}s ago`}
            </span>
          </div>

          {/* Glow under card */}
          <div className="absolute -inset-x-8 -bottom-8 h-24 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 65% 80% at 50% 100%, rgba(108,71,255,0.2) 0%, transparent 70%)' }} />

          <DashboardMockup live={live} />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #131316)' }} />
    </section>
  );
}
