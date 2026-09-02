import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useHasPointer } from '@/hooks/useReducedMotion';

/**
 * THE HERO DIAGRAM. Orkastor at the top, a signal splitting to two products,
 * each running its own loop.
 *
 * This is the one visual that has to do the explaining: a visitor should be able
 * to look at it for three seconds and know the two products are different
 * things. So the two branches are deliberately NOT symmetrical — KubeGraf's
 * cycle is detect→diagnose→fix→verify on a cluster that already exists; Domineta's
 * is create→isolate→run→expire on one that appears and then does not. Same
 * diagram, opposite shapes.
 *
 * ── TWO LAYOUTS, ONE SET OF BRANCHES ────────────────────────────────────────
 *
 * Wide: the branches sit side by side, which is the point — they are two halves
 * of one company, split at a boundary that runs across the whole figure.
 *
 * Narrow: they stack. Side by side on a phone, each branch got about 170 CSS
 * pixels, so a 12px label in the viewBox rendered at four device pixels. The
 * old 720-wide version had the same disease and was worse: 7.5px labels at
 * roughly three and a half. Stacking roughly doubles the scale, which is the
 * only fix that does not amount to hiding half the diagram.
 *
 * ⚠ That is why every branch is drawn in LOCAL coordinates and placed with a
 * transform. The two layouts differ only in the viewBox, the trunk and two
 * translate values. Before this, both branches were written out at absolute
 * coordinates and the two copies had already drifted — the step-connector rules
 * used different insets (24 vs 26) for identical type, so one row's rules were
 * two pixels shorter than the other's on every gap.
 *
 * ── INTERACTION, AND WHY IT IS NOT REQUIRED ─────────────────────────────────
 *
 * Hover promotes a branch and dims the other. On touch there is no hover, so
 * the branches simply both stay legible — the labels are always rendered, never
 * hover-gated. An interaction that is the only way to read the diagram is a
 * diagram that does not work on a phone.
 *
 * ── HOW THE ANIMATION IS DRIVEN ─────────────────────────────────────────────
 *
 * Two independent clocks, on purpose:
 *
 *   1. The CYCLE — a `setInterval` advancing a step index. The visual changes
 *      four times per cycle, so a rAF loop would be 60× the work for the same
 *      result. This is the part that carries meaning.
 *   2. The AMBIENT motion — flowing dashes, the ring sweep, the travelling
 *      packets. Declarative CSS and SMIL, no React state, so it costs nothing
 *      per frame on the main thread and cannot be stalled by a busy page.
 *
 * Both pause off-screen: the interval via IntersectionObserver, the ambient
 * motion by toggling a class that sets `animation-play-state: paused`.
 *
 * ⚠ Under reduced motion neither clock starts and the motion-only elements are
 * not rendered at all. The diagram draws its FINAL state — every step lit, the
 * microVM boundary closed, the bad pod healed — rather than its first, so a
 * visitor who never sees it move still gets the whole story.
 */

const KG_STEPS = ['Detect', 'Diagnose', 'Fix', 'Verify'];
const CL_STEPS = ['Create', 'Isolate', 'Run', 'Expire'];

const STEP_GAP = 88;
const RING_R = 86;      // the dashed cluster boundary
const POD_R = 62;       // where the pods sit on it

/** Below this the branches stack. Matches the app's own mobile breakpoint. */
const STACK_BELOW = 860;

function useStacked() {
  // Client-only SPA, so reading the width during the first render is safe and
  // avoids a layout flash on phones. `undefined` would render wide, then flip.
  const [stacked, setStacked] = useState(
    () => (typeof window === 'undefined' ? false : window.innerWidth < STACK_BELOW),
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${STACK_BELOW - 1}px)`);
    const onChange = () => setStacked(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return stacked;
}

export function ProductBoundary({ className = '' }) {
  const reduced = useReducedMotion();
  const hasPointer = useHasPointer();
  const stacked = useStacked();
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
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1600);
    return () => window.clearInterval(id);
  }, [reduced, live]);

  const motion = !reduced;
  const dim = (side) => (hot && hot !== side ? 0.3 : 1);
  const on = (side, i) => (reduced ? true : step >= i && (!hot || hot === side));
  // The step the cycle is ON right now, as opposed to the ones it has passed.
  const at = (side, i) => !reduced && step === i && (!hot || hot === side);

  // ── layout ───────────────────────────────────────────────────────────────
  const L = stacked
    ? { w: 460, h: 940, trunkX: 230, trunkTop: 8, trunkEnd: 104, boundaryY: 126,
        kg: [230, 152], cl: [230, 566], edge: 18 }
    : { w: 1000, h: 560, trunkX: 500, trunkTop: 8, trunkEnd: 118, boundaryY: 176,
        kg: [250, 196], cl: [750, 196], edge: 24 };

  // Branch paths double as animateMotion tracks, so they are declared once.
  const branchPath = (toX, toY) => (stacked
    ? `M${L.trunkX} ${L.trunkEnd} L${L.trunkX} ${toY - 26}`
    : `M${L.trunkX} ${L.trunkEnd} L${L.trunkX} ${L.trunkEnd + 20} `
      + `Q${L.trunkX} ${L.trunkEnd + 34} ${L.trunkX + (toX < L.trunkX ? -14 : 14)} ${L.trunkEnd + 34} `
      + `L${toX + (toX < L.trunkX ? 14 : -14)} ${L.trunkEnd + 34} `
      + `Q${toX} ${L.trunkEnd + 34} ${toX} ${L.trunkEnd + 48} L${toX} ${toY}`);

  const kgPath = branchPath(L.kg[0], L.kg[1]);
  const clPath = branchPath(L.cl[0], L.cl[1]);

  const hoverProps = (side) => (hasPointer
    ? { onMouseEnter: () => setHot(side), onMouseLeave: () => setHot(null) }
    : {});

  return (
    <div ref={ref} className={`ork-pb ${live && motion ? 'is-live' : ''} ${className}`} style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${L.w} ${L.h}`} role="img" aria-labelledby="ork-boundary-title"
           style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <title id="ork-boundary-title">
          Orkastor splits into two products. KubeGraf works inside clusters you already own,
          cycling through detect, diagnose, fix and verify. Domineta is infrastructure
          Orkastor operates, cycling through create, isolate, run and expire.
        </title>

        <defs>
          <linearGradient id="obTrunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cloud-bright)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--cloud-bright)" stopOpacity="0.2" />
          </linearGradient>
          {/* The ring sweep. SVG has no conic gradient, so this is a linear one
              painted onto a quarter arc that rotates — indistinguishable here. */}
          <linearGradient id="obSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--kg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--kg)" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="obKgGlow">
            <stop offset="0%" stopColor="rgba(255,138,61,0.20)" />
            <stop offset="100%" stopColor="rgba(255,138,61,0)" />
          </radialGradient>
          <radialGradient id="obClGlow">
            <stop offset="0%" stopColor="rgba(72,203,203,0.18)" />
            <stop offset="100%" stopColor="rgba(72,203,203,0)" />
          </radialGradient>
        </defs>

        {/* Territory glows, so each half reads as its own ground. */}
        <ellipse cx={L.kg[0]} cy={L.kg[1] + 164} rx="210" ry="180" fill="url(#obKgGlow)"
                 opacity={dim('kg')} style={{ transition: 'opacity 260ms var(--ease-standard)' }} />
        <ellipse cx={L.cl[0]} cy={L.cl[1] + 164} rx="210" ry="180" fill="url(#obClGlow)"
                 opacity={dim('cloud')} style={{ transition: 'opacity 260ms var(--ease-standard)' }} />

        {/* ── Orkastor, the trunk ─────────────────────────────────────────── */}
        <g>
          <rect x={L.trunkX - 85} y={L.trunkTop} width="170" height="46" rx="23"
                fill="rgba(5,11,18,0.5)" stroke="rgba(245,248,250,0.5)" strokeWidth="1.2" />
          <text x={L.trunkX} y={L.trunkTop + 29} textAnchor="middle" fill="#F5F8FA"
                fontSize="16" fontWeight="600" letterSpacing="2.2">ORKASTOR</text>
          <line x1={L.trunkX} y1={L.trunkTop + 46} x2={L.trunkX} y2={L.trunkEnd}
                stroke="url(#obTrunk)" strokeWidth="1.6" />
          {motion ? (
            <line className="ork-pb-flow" x1={L.trunkX} y1={L.trunkTop + 46} x2={L.trunkX} y2={L.trunkEnd}
                  stroke="var(--cloud-bright)" strokeWidth="2.6" strokeLinecap="round"
                  pathLength="100" strokeDasharray="14 86" />
          ) : null}
          <text x={L.trunkX} y={L.trunkTop + 84} textAnchor="middle" fill="rgba(245,248,250,0.6)"
                fontSize="11" letterSpacing="1.8">INFRASTRUCTURE</text>
        </g>

        {/* ── The split, plus a packet riding each branch ─────────────────── */}
        <path d={kgPath} fill="none" stroke="rgba(245,248,250,0.34)" strokeWidth="1.4" opacity={dim('kg')} />
        {!stacked ? (
          <path d={clPath} fill="none" stroke="rgba(245,248,250,0.34)" strokeWidth="1.4" opacity={dim('cloud')} />
        ) : null}
        {motion ? (
          <>
            <Packet path={kgPath} fill="var(--kg)" opacity={dim('kg')} />
            {!stacked ? <Packet path={clPath} fill="var(--cloud-bright)" opacity={dim('cloud')} begin="1.45s" /> : null}
          </>
        ) : null}

        {/* ── THE BOUNDARY. The one line the whole site is built around. ──── */}
        <g>
          <line className={motion ? 'ork-pb-boundary' : undefined}
                x1={L.edge} y1={L.boundaryY} x2={L.w - L.edge} y2={L.boundaryY}
                stroke="rgba(72,203,203,0.3)" strokeWidth="1.2" strokeDasharray="4 7" />
          <text x={L.edge} y={L.boundaryY - 8} fill="rgba(245,248,250,0.6)" fontSize="10.5" letterSpacing="2">THE BOUNDARY</text>
        </g>

        <g transform={`translate(${L.kg[0]}, ${L.kg[1]})`} opacity={dim('kg')}
           style={{ transition: 'opacity 260ms var(--ease-standard)', cursor: hasPointer ? 'default' : 'auto' }}
           {...hoverProps('kg')}>
          <KgBranch on={(i) => on('kg', i)} at={(i) => at('kg', i)} step={step} motion={motion} />
        </g>

        <g transform={`translate(${L.cl[0]}, ${L.cl[1]})`} opacity={dim('cloud')}
           style={{ transition: 'opacity 260ms var(--ease-standard)' }}
           {...hoverProps('cloud')}>
          <ClBranch on={(i) => on('cloud', i)} at={(i) => at('cloud', i)} />
        </g>
      </svg>
    </div>
  );
}

/** A dot travelling from the trunk down to a product, fading in and out at the ends. */
function Packet({ path, fill, opacity, begin }) {
  return (
    <circle r="3.4" fill={fill} opacity={opacity}>
      <animateMotion dur="2.9s" begin={begin} repeatCount="indefinite" path={path}
                     keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
      <animate attributeName="opacity" dur="2.9s" begin={begin} repeatCount="indefinite"
               values="0;1;1;0" keyTimes="0;0.12;0.8;1" />
    </circle>
  );
}

/**
 * KubeGraf: a cluster that already exists. Fixed ring of pods, continuously
 * swept, one of them unhealthy until the cycle reaches its fix step.
 *
 * Local coordinates: (0,0) is the branch anchor, y grows downward from the
 * product title.
 */
function KgBranch({ on, at, step, motion }) {
  return (
    <g>
      <text y="26" textAnchor="middle" fill="var(--kg)" fontSize="17" fontWeight="700" letterSpacing="2.2">KUBEGRAF</text>
      <text y="49" textAnchor="middle" fill="rgba(245,248,250,0.7)" fontSize="11" letterSpacing="1.6">YOUR INFRASTRUCTURE</text>

      <circle cy="172" r={RING_R} fill="none" stroke="rgba(255,138,61,0.2)" strokeWidth="1" strokeDasharray="3 6" />
      <circle cy="172" r={POD_R} fill="none" stroke="rgba(255,138,61,0.12)" strokeWidth="1" />
      {motion ? (
        <g className="ork-pb-sweep" style={{ transformOrigin: `0px 172px` }}>
          <path d={`M0 ${172 - RING_R} A${RING_R} ${RING_R} 0 0 1 ${RING_R} 172`}
                fill="none" stroke="url(#obSweep)" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      ) : null}

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(ang) * POD_R;
        const y = 172 + Math.sin(ang) * POD_R;
        const bad = i === 2;              // the incident, and the pod the cycle acts on
        const fixed = bad && on(2);
        return (
          <g key={i}>
            <rect x={x - 11} y={y - 11} width="22" height="22" rx="5"
                  fill={bad ? (fixed ? 'rgba(74,222,128,0.92)' : 'rgba(248,113,113,0.92)') : 'rgba(245,248,250,0.34)'}
                  style={{ transition: 'fill 400ms var(--ease-standard)' }} />
            {bad && !fixed && motion ? (
              <rect className="ork-pb-alarm" x={x - 17} y={y - 17} width="34" height="34" rx="8"
                    fill="none" stroke="rgba(248,113,113,0.6)" strokeWidth="1.4" />
            ) : null}
            {/* One ring at the moment of the fix. Keyed on the step so React
                remounts it and it replays every cycle rather than once. */}
            {bad && fixed && motion ? (
              <circle key={`heal-${step}`} className="ork-pb-heal" cx={x} cy={y} r="12"
                      fill="none" stroke="rgba(74,222,128,0.85)" strokeWidth="2" />
            ) : null}
          </g>
        );
      })}
      {/* Below the ring, not inside it: at this radius the centre is where the
          pods are, and a label there read as another node. */}
      <text y="286" textAnchor="middle" fill="rgba(245,248,250,0.52)" fontSize="10" letterSpacing="1.7">A CLUSTER YOU ALREADY RUN</text>

      <StepRow steps={KG_STEPS} colour="var(--kg)" rule="rgba(255,138,61,0.35)" on={on} at={at} />
    </g>
  );
}

/**
 * Domineta: an environment that appears, gets a kernel boundary, runs,
 * and goes away. The microVM border DRAWS ITSELF from the isolate step — a
 * boundary being established, rather than a box being faded in.
 */
function ClBranch({ on, at }) {
  return (
    <g>
      <text y="26" textAnchor="middle" fill="var(--cloud-bright)" fontSize="17" fontWeight="700" letterSpacing="2.2">DOMINETA</text>
      <text y="49" textAnchor="middle" fill="rgba(245,248,250,0.7)" fontSize="11" letterSpacing="1.6">OUR INFRASTRUCTURE</text>

      <rect x="-110" y="92" width="220" height="168" rx="14"
            fill={on(2) ? 'rgba(72,203,203,0.05)' : 'transparent'}
            stroke="rgba(72,203,203,0.55)" strokeWidth="1.6"
            pathLength="1" strokeDasharray="1"
            style={{
              strokeDashoffset: on(1) ? 0 : 1,
              transition: 'stroke-dashoffset 800ms var(--ease-standard), fill 500ms var(--ease-standard), opacity 400ms var(--ease-standard)',
              opacity: on(0) ? 1 : 0.12,
            }} />
      <text y="82" textAnchor="middle" fill="rgba(72,203,203,0.82)" fontSize="10" letterSpacing="1.7">MICROVM · GUEST KERNEL</text>

      {['web', 'api', 'db'].map((svc, i) => (
        <g key={svc} opacity={on(0) ? 1 : 0.1}
           style={{ transition: `opacity 420ms ${120 * i}ms var(--ease-standard)` }}>
          <rect x={-84 + i * 58} y="126" width="46" height="32" rx="7"
                fill="rgba(72,203,203,0.16)" stroke="rgba(72,203,203,0.4)" strokeWidth="1" />
          <text x={-61 + i * 58} y="147" textAnchor="middle" fill="rgba(245,248,250,0.9)" fontSize="11">{svc}</text>
        </g>
      ))}

      {/* The URL exists only once it is running. */}
      <g opacity={on(2) ? 1 : 0.12} style={{ transition: 'opacity 420ms var(--ease-standard)' }}>
        <rect x="-96" y="182" width="192" height="30" rx="15"
              fill="rgba(72,203,203,0.1)" stroke="rgba(72,203,203,0.34)" strokeWidth="1" />
        <text y="202" textAnchor="middle" fill="rgba(111,220,220,0.96)" fontSize="11"
              fontFamily="ui-monospace, monospace">https://…domineta.com</text>
      </g>

      {/* Expiry. The honest end state: it is gone, not parked. */}
      <g opacity={on(3) ? 1 : 0} style={{ transition: 'opacity 420ms var(--ease-standard)' }}>
        <text y="240" textAnchor="middle" fill="rgba(253,186,116,0.92)" fontSize="11" letterSpacing="1.7">TTL REACHED · DESTROYED</text>
      </g>

      <StepRow steps={CL_STEPS} colour="var(--cloud-bright)" rule="rgba(72,203,203,0.35)" on={on} at={at} />
    </g>
  );
}

/** The four-step footer. Both branches render identical machinery, so it lives once. */
function StepRow({ steps, colour, rule, on, at }) {
  const x = (i) => (i - 1.5) * STEP_GAP;
  return (
    <g>
      {steps.map((label, i) => (
        <g key={label} opacity={on(i) ? 1 : 0.26} style={{ transition: 'opacity 300ms var(--ease-standard)' }}>
          {/* The pill marks the step the cycle is ON, not the ones it has passed. */}
          <rect x={x(i) - 38} y="314" width="76" height="26" rx="13" fill={colour}
                opacity={at(i) ? 0.14 : 0} style={{ transition: 'opacity 300ms var(--ease-standard)' }} />
          <text x={x(i)} y="332" textAnchor="middle" fontSize="12" fontWeight={on(i) ? 700 : 500}
                fill={on(i) ? colour : 'rgba(245,248,250,0.68)'} letterSpacing="1">
            {label.toUpperCase()}
          </text>
          {i < 3 ? <line x1={x(i) + 34} y1="327" x2={x(i + 1) - 34} y2="327" stroke={rule} strokeWidth="1" /> : null}
        </g>
      ))}
    </g>
  );
}

export default ProductBoundary;
