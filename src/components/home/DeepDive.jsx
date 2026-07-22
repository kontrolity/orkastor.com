import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { KUBEGRAF_URL, Reveal, SectionMarker } from './shared';

/* ── Visual panels ───────────────────────────────────────────── */

function DetectVisual() {
  const events = [
    { type: 'Warning', msg: 'Back-off restarting failed container', obj: 'payments-api-7d9f', t: '2s' },
    { type: 'Warning', msg: 'OOMKilled: memory limit exceeded', obj: 'payments-api-7d9f', t: '8s' },
    { type: 'Normal', msg: 'Deployment rollout: v2.3.1 complete', obj: 'payments-api', t: '41s' },
    { type: 'Warning', msg: 'Liveness probe failed: connection refused', obj: 'payments-api-2d3e', t: '55s' },
  ];
  return (
    <div className="lp-console p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="lp-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(230,232,238,0.45)' }}>
          cluster events · production
        </span>
        <span className="inline-flex items-center gap-1.5 lp-mono text-[10px]" style={{ color: '#F87171' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F87171' }} />
          live
        </span>
      </div>
      <div className="space-y-1.5">
        {events.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span
              className="lp-mono text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={e.type === 'Warning'
                ? { background: 'rgba(245,159,10,0.14)', color: '#FBBF24' }
                : { background: 'rgba(74,222,128,0.10)', color: '#4ADE80' }}
            >
              {e.type}
            </span>
            <span className="lp-mono text-[11px] flex-1 truncate" style={{ color: 'rgba(230,232,238,0.72)' }}>{e.msg}</span>
            <span className="lp-mono text-[10px] shrink-0" style={{ color: 'rgba(230,232,238,0.35)' }}>{e.t}</span>
          </div>
        ))}
      </div>
      <div
        className="mt-3 px-3 py-2.5 rounded-lg flex items-center gap-2"
        style={{ background: 'rgba(255,122,31,0.10)', border: '1px solid rgba(255,122,31,0.28)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--lp-orange)' }} />
        <span className="lp-mono text-[11px]" style={{ color: '#FFB57A' }}>
          3 signals correlated → incident #2847 opened
        </span>
      </div>
    </div>
  );
}

function DiagnoseVisual() {
  const causes = [
    { label: 'Deploy v2.3.1 — memory limit 512Mi', conf: 96, top: true },
    { label: 'Traffic spike +42% on /charge', conf: 88 },
    { label: 'Node pressure on worker-03', conf: 61 },
  ];
  return (
    <div className="lp-card p-5 sm:p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--lp-ink-3)' }}>
        Causal timeline · incident #2847
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 mb-5">
        {['deploy v2.3.1', 'heap growth', 'OOMKill', 'restart loop'].map((step, i, arr) => (
          <React.Fragment key={step}>
            <span
              className="lp-mono text-[11px] px-2.5 py-1.5 rounded-lg"
              style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)', border: '1px solid rgba(255,122,31,0.22)' }}
            >
              {step}
            </span>
            {i < arr.length - 1 && <span className="text-[12px]" style={{ color: 'var(--lp-ink-3)' }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="space-y-3.5">
        {causes.map((c) => (
          <div key={c.label}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[12.5px]" style={{ color: 'var(--lp-ink-2)' }}>{c.label}</span>
              <span className="lp-mono text-[12px] font-semibold" style={{ color: c.top ? 'var(--lp-orange-deep)' : 'var(--lp-ink-3)' }}>
                {c.conf}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(22,24,29,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.conf}%`,
                  background: c.top ? 'linear-gradient(90deg, var(--lp-orange), var(--lp-amber))' : 'rgba(22,24,29,0.18)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SafeFixVisual() {
  return (
    <div className="lp-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--lp-ink-3)' }}>
          SafeFix™ · payments-api
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
          style={{ background: 'rgba(23,163,74,0.10)', color: 'var(--lp-green)' }}
        >
          <ShieldCheck className="w-3 h-3" /> signed · dry-run ✓
        </span>
      </div>
      <div className="lp-console p-4 lp-mono text-[12px] leading-relaxed mb-4">
        <div style={{ color: 'rgba(230,232,238,0.5)' }}>  resources:</div>
        <div style={{ color: 'rgba(230,232,238,0.5)' }}>    limits:</div>
        <div style={{ color: '#F87171' }}>-     memory: "512Mi"</div>
        <div style={{ color: '#4ADE80' }}>+     memory: "1Gi"</div>
      </div>
      <div className="flex gap-2 mb-4">
        <span
          className="flex-1 h-10 rounded-lg inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold"
          style={{ background: 'var(--lp-orange)', color: '#fff', boxShadow: '0 4px 14px rgba(255,122,31,0.30)' }}
        >
          <CheckCircle2 className="w-4 h-4" /> Approve
        </span>
        <span
          className="h-10 px-4 rounded-lg inline-flex items-center text-[13px] font-medium"
          style={{ border: '1px solid var(--lp-line)', color: 'var(--lp-ink-3)' }}
        >
          Dismiss
        </span>
      </div>
      <div className="lp-mono text-[10.5px]" style={{ color: 'var(--lp-ink-3)' }}>
        sha256:9f2c…e81a · blast radius: 1 deployment · rollback ready
      </div>
    </div>
  );
}

/* ── Content ─────────────────────────────────────────────────── */

const BLOCKS = [
  {
    num: '01',
    title: 'Detect before your pager does',
    text: 'KubeGraf watches events, logs, metrics, and rollouts across every cluster — correlating raw signals into one incident instead of forty alerts.',
    bullets: ['CrashLoops, OOMKills, probe failures, pending pods', 'Deploy-aware: every anomaly linked to what changed', 'Noise-free: signals grouped into a single incident'],
    Visual: DetectVisual,
  },
  {
    num: '02',
    title: 'Diagnose with evidence, not guesses',
    text: 'Multi-source signals are fused into a causal timeline. Every root cause ships with an evidence chain and a confidence score you can audit.',
    bullets: ['Logs + metrics + events + deploys in one timeline', 'Ranked hypotheses with confidence scores', 'Explainable: click any finding to see its evidence'],
    Visual: DiagnoseVisual,
  },
  {
    num: '03',
    title: 'Fix with a signature, not a shell',
    text: 'SafeFix™ generates the patch, validates it in dry-run, signs it, and waits for your approval. One click — verified rollout, rollback ready.',
    bullets: ['Cryptographically signed patches', 'Dry-run validated before anything touches prod', 'Human-approved — or auto-fix for low-risk classes'],
    Visual: SafeFixVisual,
  },
];

export default function DeepDive() {
  return (
    <section id="kubegraf" className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="02" label="Flagship product · Live" />

        {/* Section header */}
        <Reveal className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="lp-display text-[clamp(30px,4.6vw,52px)]">
            Things break. <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>All the time.</span>
            <br />
            Meet <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>KubeGraf</span> — the AI SRE that handles it.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--lp-ink-2)' }}>
            The 3 a.m. page, answered by an agent that already knows your cluster.
            KubeGraf turns hours of debugging into an approve-and-move-on moment.
          </p>
          <div className="mt-7">
            <a href={KUBEGRAF_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-dark group">
              Launch KubeGraf
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>

        {/* Alternating deep-dive rows */}
        <div className="space-y-20 sm:space-y-28">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.num}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="lp-mono text-[13px] font-semibold mb-3" style={{ color: 'var(--lp-orange-deep)' }}>
                    {b.num}
                  </div>
                  <h3 className="lp-display text-[clamp(24px,3vw,34px)] mb-4">{b.title}</h3>
                  <p className="text-[15.5px] leading-relaxed mb-6" style={{ color: 'var(--lp-ink-2)' }}>{b.text}</p>
                  <ul className="space-y-2.5">
                    {b.bullets.map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-[14px]" style={{ color: 'var(--lp-ink-2)' }}>
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--lp-green)' }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <b.Visual />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
