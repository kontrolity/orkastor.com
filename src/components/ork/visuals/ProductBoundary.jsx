import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useHasPointer } from '@/hooks/useReducedMotion';

/**
 * THE HERO DIAGRAM. Orkastor at the top, a signal splitting to two products,
 * each running its own loop.
 *
 * This is the one visual that has to do the explaining: a visitor should be able
 * to look at it for three seconds and know the two products are different
 * things. So the two branches are deliberately NOT symmetrical — KubeGraf's
 * cycle is detect→diagnose→fix→verify on a cluster that already exists; Cloud's
 * is create→isolate→run→expire on one that appears and then does not. Same
 * diagram, opposite shapes.
 *
 * ── INTERACTION, AND WHY IT IS NOT REQUIRED ─────────────────────────────────
 *
 * Hover promotes a branch and dims the other, and reveals which side of the
 * boundary it is. On touch there is no hover, so the branches simply both stay
 * legible — the labels are always rendered, never hover-gated. An interaction
 * that is the only way to read the diagram is a diagram that does not work on a
 * phone.
 *
 * ── HOW THE ANIMATION IS DRIVEN ─────────────────────────────────────────────
 *
 * One `setInterval` advancing a step index, not a rAF loop: the visual changes
 * four times per branch cycle, so animating at 60fps would be 60× the work for
 * the same result. Paused when off-screen via IntersectionObserver, and never
 * started at all under reduced motion, where it renders the final state.
 */

const KG_STEPS = ['Detect', 'Diagnose', 'Fix', 'Verify'];
const CL_STEPS = ['Create', 'Isolate', 'Run', 'Expire'];

export function ProductBoundary({ className = '' }) {
  const reduced = useReducedMotion();
  const hasPointer = useHasPointer();
  const [step, setStep] = useState(0);
  const [hot, setHot] = useState(null);      // 'kg' | 'cloud' | null
  const [live, setLive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !live) return undefined;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1500);
    return () => window.clearInterval(id);
  }, [reduced, live]);

  const dim = (side) => (hot && hot !== side ? 0.34 : 1);
  const on = (side, i) => (reduced ? true : step >= i && (!hot || hot === side));

  return (
    <div ref={ref} className={className} style={{ position: 'relative' }}>
      <svg viewBox="0 0 720 396" role="img" aria-labelledby="ork-boundary-title" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <title id="ork-boundary-title">
          Orkastor splits into two products. KubeGraf works inside clusters you already own,
          cycling through detect, diagnose, fix and verify. Orkastor Cloud is infrastructure
          Orkastor operates, cycling through create, isolate, run and expire.
        </title>

        <defs>
          <linearGradient id="obTrunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cloud-bright)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--cloud-bright)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* ── Orkastor, the trunk ─────────────────────────────────────────── */}
        <g>
          <rect x="300" y="6" width="120" height="34" rx="17" fill="none" stroke="rgba(245,248,250,0.44)" strokeWidth="1" />
          <text x="360" y="28" textAnchor="middle" fill="#F5F8FA" fontSize="12.5" fontWeight="600" letterSpacing="1.6">ORKASTOR</text>
          <line x1="360" y1="40" x2="360" y2="86" stroke="url(#obTrunk)" strokeWidth="1.4" />
          {!reduced ? (
            <line data-motion-loop="" x1="360" y1="40" x2="360" y2="86" stroke="var(--cloud-bright)" strokeWidth="2.4"
                  strokeLinecap="round" pathLength="1" strokeDasharray="0.25 0.75"
                  style={{ animation: 'ork-pulse 3.4s linear infinite' }} />
          ) : null}
          <text x="360" y="70" textAnchor="middle" fill="rgba(245,248,250,0.58)" fontSize="9" letterSpacing="1.4">INFRASTRUCTURE</text>
        </g>

        {/* ── The split ───────────────────────────────────────────────────── */}
        <path d="M360 86 L360 104 Q360 116 348 116 L196 116 Q184 116 184 128 L184 146"
              fill="none" stroke="rgba(245,248,250,0.34)" strokeWidth="1.2" />
        <path d="M360 86 L360 104 Q360 116 372 116 L524 116 Q536 116 536 128 L536 146"
              fill="none" stroke="rgba(245,248,250,0.34)" strokeWidth="1.2" />

        {/* ── THE BOUNDARY. The one line the whole site is built around. ──── */}
        <g opacity="0.9">
          <line x1="20" y1="131" x2="700" y2="131" stroke="rgba(72,203,203,0.22)" strokeWidth="1" strokeDasharray="3 5" />
          <text x="30" y="126" fill="rgba(245,248,250,0.56)" fontSize="8.5" letterSpacing="1.5">THE BOUNDARY</text>
        </g>

        {/* ── KubeGraf branch ─────────────────────────────────────────────── */}
        <g
          opacity={dim('kg')}
          style={{ transition: 'opacity 260ms var(--ease-standard)', cursor: hasPointer ? 'default' : 'auto' }}
          onMouseEnter={hasPointer ? () => setHot('kg') : undefined}
          onMouseLeave={hasPointer ? () => setHot(null) : undefined}
        >
          <text x="184" y="164" textAnchor="middle" fill="var(--kg)" fontSize="12" fontWeight="700" letterSpacing="1.5">KUBEGRAF</text>
          <text x="184" y="180" textAnchor="middle" fill="rgba(245,248,250,0.68)" fontSize="9" letterSpacing="1.2">YOUR INFRASTRUCTURE</text>

          {/* A cluster that already exists: a fixed ring of pods. */}
          <circle cx="184" cy="268" r="58" fill="none" stroke="rgba(255,138,61,0.22)" strokeWidth="1" strokeDasharray="2 4" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = 184 + Math.cos(ang) * 40;
            const y = 268 + Math.sin(ang) * 40;
            // One pod is the incident, and it is the one the cycle acts on.
            const bad = i === 2;
            const fixed = bad && on('kg', 2);
            return (
              <g key={i}>
                <rect x={x - 7} y={y - 7} width="14" height="14" rx="3"
                      fill={bad ? (fixed ? 'rgba(74,222,128,0.9)' : 'rgba(248,113,113,0.9)') : 'rgba(245,248,250,0.36)'}
                      style={{ transition: 'fill 400ms var(--ease-standard)' }} />
                {bad && !fixed && !reduced ? (
                  <rect data-motion-loop="" x={x - 11} y={y - 11} width="22" height="22" rx="5" fill="none"
                        stroke="rgba(248,113,113,0.6)" strokeWidth="1"
                        style={{ animation: 'ork-breathe 1.6s ease-in-out infinite' }} />
                ) : null}
              </g>
            );
          })}
          {/* Below the ring, not inside it: at 40px radius the centre is where
              the pods are, and the label was reading as another node. */}
          <text x="184" y="342" textAnchor="middle" fill="rgba(245,248,250,0.5)" fontSize="7.5" letterSpacing="1.3">A CLUSTER YOU ALREADY RUN</text>

          {KG_STEPS.map((label, i) => (
            <g key={label} opacity={on('kg', i) ? 1 : 0.26} style={{ transition: 'opacity 300ms var(--ease-standard)' }}>
              <text x={64 + i * 62} y="378" textAnchor="middle" fontSize="9.5" fontWeight={on('kg', i) ? 700 : 500}
                    fill={on('kg', i) ? 'var(--kg)' : 'rgba(245,248,250,0.68)'} letterSpacing="0.6">
                {label.toUpperCase()}
              </text>
              {i < 3 ? <line x1={64 + i * 62 + 24} y1="375" x2={64 + (i + 1) * 62 - 24} y2="375" stroke="rgba(255,138,61,0.35)" strokeWidth="1" /> : null}
            </g>
          ))}
        </g>

        {/* ── Orkastor Cloud branch ───────────────────────────────────────── */}
        <g
          opacity={dim('cloud')}
          style={{ transition: 'opacity 260ms var(--ease-standard)' }}
          onMouseEnter={hasPointer ? () => setHot('cloud') : undefined}
          onMouseLeave={hasPointer ? () => setHot(null) : undefined}
        >
          <text x="536" y="164" textAnchor="middle" fill="var(--cloud-bright)" fontSize="12" fontWeight="700" letterSpacing="1.5">ORKASTOR CLOUD</text>
          <text x="536" y="180" textAnchor="middle" fill="rgba(245,248,250,0.68)" fontSize="9" letterSpacing="1.2">OUR INFRASTRUCTURE</text>

          {/* An environment that appears, gets a kernel boundary, and goes away.
              The microVM rect only exists from the isolate step onward. */}
          <rect x="470" y="212" width="132" height="112" rx="10" fill="none"
                stroke="rgba(72,203,203,0.5)" strokeWidth="1.4"
                pathLength="1" strokeDasharray="1"
                style={{
                  strokeDashoffset: on('cloud', 1) ? 0 : 1,
                  transition: 'stroke-dashoffset 700ms var(--ease-standard)',
                  opacity: on('cloud', 0) ? 1 : 0.15,
                }} />
          <text x="536" y="204" textAnchor="middle" fill="rgba(72,203,203,0.8)" fontSize="7.5" letterSpacing="1.3">MICROVM · GUEST KERNEL</text>

          {['web', 'api', 'db'].map((svc, i) => (
            <g key={svc} opacity={on('cloud', 0) ? 1 : 0.12} style={{ transition: 'opacity 400ms var(--ease-standard)' }}>
              <rect x={486 + i * 36} y="248" width="28" height="20" rx="4" fill="rgba(72,203,203,0.16)" stroke="rgba(72,203,203,0.4)" strokeWidth="0.8" />
              <text x={500 + i * 36} y="262" textAnchor="middle" fill="rgba(245,248,250,0.88)" fontSize="7.5">{svc}</text>
            </g>
          ))}

          {/* The URL exists only once it is running. */}
          <g opacity={on('cloud', 2) ? 1 : 0.14} style={{ transition: 'opacity 400ms var(--ease-standard)' }}>
            <rect x="478" y="284" width="116" height="18" rx="9" fill="rgba(72,203,203,0.1)" stroke="rgba(72,203,203,0.32)" strokeWidth="0.8" />
            <text x="536" y="296" textAnchor="middle" fill="rgba(111,220,220,0.95)" fontSize="7.5" fontFamily="ui-monospace, monospace">https://…orkastor.cloud</text>
          </g>

          {/* Expiry: the whole environment fades, which is the honest end state. */}
          <g opacity={on('cloud', 3) ? 1 : 0} style={{ transition: 'opacity 400ms var(--ease-standard)' }}>
            <text x="536" y="318" textAnchor="middle" fill="rgba(253,186,116,0.9)" fontSize="8" letterSpacing="1.2">TTL REACHED · DESTROYED</text>
          </g>

          {CL_STEPS.map((label, i) => (
            <g key={label} opacity={on('cloud', i) ? 1 : 0.26} style={{ transition: 'opacity 300ms var(--ease-standard)' }}>
              <text x={416 + i * 62} y="378" textAnchor="middle" fontSize="9.5" fontWeight={on('cloud', i) ? 700 : 500}
                    fill={on('cloud', i) ? 'var(--cloud-bright)' : 'rgba(245,248,250,0.68)'} letterSpacing="0.6">
                {label.toUpperCase()}
              </text>
              {i < 3 ? <line x1={416 + i * 62 + 26} y1="375" x2={416 + (i + 1) * 62 - 26} y2="375" stroke="rgba(72,203,203,0.35)" strokeWidth="1" /> : null}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default ProductBoundary;
