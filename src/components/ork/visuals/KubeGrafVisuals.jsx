import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { KUBEGRAF } from '@/content/site';

/**
 * Scroll-driven stage progression, shared by the process rail below.
 *
 * Reads scroll position against the element's own box and maps it to a stage
 * index. NOT scroll-jacking: the page scrolls exactly as it would otherwise and
 * this only observes. The brief forbids hijacking and this is the difference —
 * nothing is pinned, nothing is intercepted, no wheel event is cancelled.
 */
function useScrollStage(count) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(reduced ? count - 1 : 0);

  useEffect(() => {
    if (reduced) { setStage(count - 1); return undefined; }
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the element's top hits 70% of the viewport, 1 when its bottom
      // passes 30%. Gives a full sweep without the element having to be pinned.
      const total = r.height + vh * 0.4;
      const seen = vh * 0.7 - r.top;
      const t = Math.max(0, Math.min(1, seen / total));
      setStage(Math.min(count - 1, Math.floor(t * count)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    read();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, reduced]);

  // An object, not a tuple: `[ref, stage]` infers as
  // `(number | MutableRefObject)[]`, so the destructured ref is a union that
  // will not typecheck against a DOM ref.
  return { ref, stage };
}

/**
 * The incident, told as a cluster. Five stages, driven by scroll.
 *
 * A workload goes bad, gets investigated, gets a cause, gets a fix, and the fix
 * is verified. The pod's colour is the whole state machine: grey → red →
 * amber → green. No screenshot needed, and nothing here implies a capability the
 * docs do not describe.
 */
export function ClusterIncident({ className = '', stage: stageProp = undefined }) {
  // When `stage` is supplied the component is a pure view — the shared driver in
  // KubeGrafProcess owns the scroll maths. It keeps its own driver only when
  // used standalone.
  const { ref: ownRef, stage: ownStage } = useScrollStage(5);
  const stage = stageProp ?? ownStage;
  const ref = stageProp === undefined ? ownRef : undefined;
  const reduced = useReducedMotion();

  const podFill = (bad) => {
    if (!bad) return 'var(--border-strong)';
    if (stage >= 4) return '#4ADE80';
    if (stage >= 3) return 'var(--kg)';
    if (stage >= 1) return '#F87171';
    return '#F87171';
  };

  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 560 300" role="img" aria-labelledby="ci-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <title id="ci-title">
          A Kubernetes cluster with a control plane and four nodes. One workload fails and is
          then detected, investigated, diagnosed, fixed and verified.
        </title>

        <rect x="12" y="12" width="536" height="276" rx="10" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
        <text x="28" y="34" className="ork-mono" fill="var(--text-3)" fontSize="8.5" letterSpacing="1.3">CLUSTER</text>

        <rect x="212" y="48" width="136" height="30" rx="6" fill="var(--bg-alt)" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="280" y="67" textAnchor="middle" fill="var(--text-2)" fontSize="9" letterSpacing="0.9">CONTROL PLANE</text>

        {[0, 1, 2, 3].map((n) => {
          const x = 44 + n * 128;
          const pods = n === 1 ? 2 : n === 2 ? 3 : 1;
          return (
            <g key={n}>
              <line x1="280" y1="78" x2={x + 44} y2="104" stroke="var(--border)" strokeWidth="0.9" />
              <rect x={x} y="104" width="88" height="26" rx="5" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
              <text x={x + 44} y="121" textAnchor="middle" fill="var(--text-3)" fontSize="8">node {n + 1}</text>
              {Array.from({ length: pods }).map((_, p) => {
                const bad = n === 2 && p === 1;
                const px = x + 10 + p * 26;
                return (
                  <g key={p}>
                    <rect x={px} y="146" width="18" height="18" rx="4"
                          fill={podFill(bad)}
                          style={{ transition: reduced ? 'none' : 'fill 500ms var(--ease-standard)' }} />
                    {bad && stage >= 1 && stage < 4 && !reduced ? (
                      <rect data-motion-loop="" x={px - 4} y="142" width="26" height="26" rx="6" fill="none"
                            stroke={stage >= 3 ? 'rgba(255,138,61,0.7)' : 'rgba(248,113,113,0.65)'} strokeWidth="1"
                            style={{ animation: 'ork-breathe 1.5s ease-in-out infinite' }} />
                    ) : null}
                    <line x1={x + 44} y1="130" x2={px + 9} y2="146" stroke="var(--border)" strokeWidth="0.7" />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* The verdict line. One row that changes as the stage advances, so the
            reader never has to hold five states in their head. */}
        <rect x="40" y="204" width="480" height="46" rx="8"
              fill={stage >= 4 ? 'rgba(74,222,128,0.08)' : stage >= 3 ? 'rgba(255,138,61,0.08)' : stage >= 1 ? 'rgba(248,113,113,0.07)' : 'var(--bg-alt)'}
              stroke={stage >= 4 ? 'rgba(74,222,128,0.4)' : stage >= 3 ? 'rgba(255,138,61,0.4)' : stage >= 1 ? 'rgba(248,113,113,0.35)' : 'var(--border)'}
              strokeWidth="1"
              style={{ transition: reduced ? 'none' : 'all 480ms var(--ease-standard)' }} />
        <text x="60" y="223" className="ork-mono" fontSize="8" letterSpacing="1.3"
              fill={stage >= 4 ? '#4ADE80' : stage >= 3 ? 'var(--kg)' : stage >= 1 ? '#F87171' : 'var(--text-3)'}>
          {['AWAITING SIGNAL', 'DETECTED', 'INVESTIGATING', 'ROOT CAUSE', 'SAFEFIX VERIFIED'][stage]}
        </text>
        <text x="60" y="240" fill="var(--text-2)" fontSize="9">
          {[
            'checkout-api · 4 pods healthy',
            'checkout-api pod restarting — signal from the in-cluster agent',
            'correlating container output, events and memory over the last 15 minutes',
            'memory limit below actual working set. The pod is OOMKilled on every burst',
            'limit raised, rollout complete, generation advanced — the change landed',
          ][stage]}
        </text>
      </svg>
    </div>
  );
}

/** The five stages as a rail. Same scroll driver, so it stays in step with the
 *  cluster above it — two independent observers would drift. */
export function ProcessRail({ className = '', stage: stageProp = undefined }) {
  const { ref: ownRef, stage: ownStage } = useScrollStage(5);
  const stage = stageProp ?? ownStage;
  const ref = stageProp === undefined ? ownRef : undefined;
  return (
    <div ref={ref} className={className}>
      <ol className="grid sm:grid-cols-5 gap-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {KUBEGRAF.stages.map(([label, note], i) => {
          const done = i < stage;
          const now = i === stage;
          return (
            <li key={label}
                style={{
                  padding: '16px 16px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${now ? 'var(--kg)' : 'var(--border)'}`,
                  background: now ? 'rgba(255,138,61,0.06)' : 'transparent',
                  opacity: done || now ? 1 : 0.5,
                  transition: 'all 380ms var(--ease-standard)',
                }}>
              <span className="ork-micro" style={{ color: now ? 'var(--kg-text)' : 'var(--text-3)' }}>
                {String(i + 1).padStart(2, '0')} · {label}
              </span>
              <p className="ork-small mt-2" style={{ color: 'var(--text-2)' }}>{note}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * The multi-agent roster, hub and spoke.
 *
 * The SRE agent is at the centre because it is the only one that may write or
 * execute — every other agent observes, reviews or advises. Line weight encodes
 * that: the SRE's edge to the cluster is heavy, the review edges are thin, and
 * Security's is dashed because a veto is a refusal, not a change.
 *
 * Nothing here goes beyond what how-it-works.md documents.
 */
export function AgentNetwork({ className = '' }) {
  const reduced = useReducedMotion();
  const [hot, setHot] = useState(null);
  const others = KUBEGRAF.agents.filter((a) => a.name !== 'SRE');

  return (
    <div className={className}>
      <svg viewBox="0 0 560 380" role="img" aria-labelledby="an-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <title id="an-title">
          Six specialist agents around a central SRE agent. Only the SRE agent may author and
          apply changes; the others observe, review, advise or veto.
        </title>

        {others.map((a, i) => {
          const ang = (i / others.length) * Math.PI * 2 - Math.PI / 2;
          const x = 280 + Math.cos(ang) * 140;
          const y = 190 + Math.sin(ang) * 128;
          const dim = hot && hot !== a.name ? 0.32 : 1;
          const dashed = a.mode === 'review';
          return (
            <g key={a.name} opacity={dim} style={{ transition: 'opacity 220ms var(--ease-standard)' }}
               onMouseEnter={() => setHot(a.name)} onMouseLeave={() => setHot(null)}>
              <line x1="280" y1="190" x2={x} y2={y}
                    stroke={dashed ? 'rgba(248,113,113,0.5)' : 'var(--border-strong)'}
                    strokeWidth={a.mode === 'independent' ? 0.8 : 1}
                    strokeDasharray={dashed ? '4 4' : a.mode === 'independent' ? '2 3' : undefined} />
              {!reduced ? (
                <line data-motion-loop="" x1={x} y1={y} x2="280" y2="190" stroke="var(--kg)" strokeWidth="1.6"
                      strokeLinecap="round" pathLength="1" strokeDasharray="0.1 0.9"
                      style={{ animation: `ork-pulse ${5 + i}s linear ${i * 0.8}s infinite`, opacity: 0.4 }} />
              ) : null}
              <rect x={x - 58} y={y - 20} width="116" height="40" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
              <text x={x} y={y - 4} textAnchor="middle" fill="var(--text)" fontSize="9.5" fontWeight="600">{a.name}</text>
              <text x={x} y={y + 10} textAnchor="middle" fill="var(--text-3)" fontSize="7.5">{a.rights}</text>
            </g>
          );
        })}

        {/* The centre. Heavier ring, and the only one labelled with a mode. */}
        <circle cx="280" cy="190" r="52" fill="rgba(255,138,61,0.08)" stroke="var(--kg)" strokeWidth="1.6" />
        <text x="280" y="184" textAnchor="middle" fill="var(--kg-text)" fontSize="13" fontWeight="700" letterSpacing="0.6">SRE</text>
        <text x="280" y="200" textAnchor="middle" fill="var(--text-3)" fontSize="7.5" letterSpacing="1">AUTO · R·W·X</text>
        <text x="280" y="366" textAnchor="middle" fill="var(--text-3)" fontSize="8.5">
          {hot ? `${hot} — ${others.find((a) => a.name === hot)?.note}` : 'Only the SRE agent may author and apply a change.'}
        </text>
      </svg>
    </div>
  );
}

/**
 * The security path, stated honestly.
 *
 * Outbound-only, no inbound ports, no stored cluster credentials — all in the
 * docs. And the AI hop is DRAWN, because it exists: the agent's telemetry goes
 * to KubeGraf's own gateway and on to Amazon Bedrock, redacted. The old site
 * claimed "zero external AI calls" and "0 bytes leave your network"; this
 * diagram is the correction, not a softening of it.
 */
export function SecurityPath({ className = '' }) {
  const reduced = useReducedMotion();
  return (
    <div className={className}>
      <svg viewBox="0 0 560 232" role="img" aria-labelledby="sp-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <title id="sp-title">
          The customer cluster sends telemetry outbound to the KubeGraf control plane, which
          calls its own AI gateway and Amazon Bedrock with redacted data. No inbound ports are
          opened on the cluster.
        </title>

        <rect x="24" y="20" width="180" height="88" rx="9" fill="none" stroke="var(--border-strong)" strokeWidth="1.2" />
        <text x="114" y="44" textAnchor="middle" fill="var(--text)" fontSize="10" fontWeight="600">YOUR CLUSTER</text>
        <text x="114" y="62" textAnchor="middle" fill="var(--text-3)" fontSize="8">kubegraf-agent</text>
        <text x="114" y="78" textAnchor="middle" fill="var(--text-3)" fontSize="8">outbound only</text>
        <text x="114" y="94" textAnchor="middle" fill="#4ADE80" fontSize="7.5" letterSpacing="0.9">NO INBOUND PORTS</text>

        <line x1="204" y1="64" x2="336" y2="64" stroke="var(--border-strong)" strokeWidth="1" />
        {!reduced ? (
          <line data-motion-loop="" x1="204" y1="64" x2="336" y2="64" stroke="var(--kg)" strokeWidth="2" strokeLinecap="round"
                pathLength="1" strokeDasharray="0.14 0.86" style={{ animation: 'ork-pulse 4s linear infinite' }} />
        ) : null}
        <text x="270" y="56" textAnchor="middle" fill="var(--text-3)" fontSize="7.5">snapshots ↑</text>
        <text x="270" y="80" textAnchor="middle" fill="var(--text-3)" fontSize="7.5">signed commands ↓</text>

        <rect x="336" y="20" width="200" height="88" rx="9" fill="var(--bg-alt)" stroke="var(--border-strong)" strokeWidth="1.2" />
        <text x="436" y="44" textAnchor="middle" fill="var(--text)" fontSize="10" fontWeight="600">KUBEGRAF CONTROL PLANE</text>
        <text x="436" y="62" textAnchor="middle" fill="var(--text-3)" fontSize="8">no cluster credentials stored</text>
        <text x="436" y="80" textAnchor="middle" fill="var(--text-3)" fontSize="8">signs every command it sends</text>

        <line x1="436" y1="108" x2="436" y2="146" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="336" y="146" width="200" height="70" rx="9" fill="none" stroke="var(--cloud)" strokeWidth="1.1" />
        <text x="436" y="170" textAnchor="middle" fill="var(--cloud-text)" fontSize="9.5" fontWeight="600">AI GATEWAY → BEDROCK</text>
        <text x="436" y="188" textAnchor="middle" fill="var(--text-3)" fontSize="8">redacted telemetry, not raw logs</text>
        <text x="436" y="204" textAnchor="middle" fill="var(--text-3)" fontSize="8">no bring-your-own model keys</text>

        {/* Said plainly, because the previous site said the opposite. */}
        <text x="24" y="168" fill="var(--text-2)" fontSize="8.5">This hop leaves your environment,</text>
        <text x="24" y="182" fill="var(--text-2)" fontSize="8.5">by design. What crosses it is redacted</text>
        <text x="24" y="196" fill="var(--text-2)" fontSize="8.5">telemetry — not your logs, and never</text>
        <text x="24" y="210" fill="var(--text-2)" fontSize="8.5">your credentials.</text>
      </svg>
    </div>
  );
}

/**
 * The cluster and the rail, driven by ONE stage.
 *
 * They were two components each running their own `useScrollStage`, against
 * their own bounding boxes — so they computed different stages from the same
 * scroll position and visibly disagreed: the cluster showed ROOT CAUSE while the
 * rail still highlighted DETECT. The comment on ProcessRail said two observers
 * would drift, and then there were two.
 *
 * One driver on the wrapper, passed down. The rail is a legend for the diagram,
 * so they cannot be allowed to disagree.
 */
export function KubeGrafProcess({ className = '' }) {
  const { ref, stage } = useScrollStage(5);
  return (
    <div ref={ref} className={className}>
      <ClusterIncident stage={stage} />
      <div className="mt-8">
        <ProcessRail stage={stage} />
      </div>
    </div>
  );
}
