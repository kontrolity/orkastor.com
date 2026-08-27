import React, { useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The ambient node graph. The site's infrastructure identity, in the background.
 *
 * ── SVG, NOT CANVAS ─────────────────────────────────────────────────────────
 *
 * The brief allows canvas and does not need it. This is a dozen static lines
 * with two CSS-animated dashes on them; a canvas would mean a rAF loop running
 * whether or not the section is on screen, plus a resize observer, to draw
 * something the compositor can already handle. SVG also keeps it in the theme:
 * strokes read `--topo-line`, so a theme switch repaints it for free.
 *
 * ── THE PULSE IS CSS, AND THERE ARE ONLY TWO ────────────────────────────────
 *
 * `stroke-dashoffset` on a path, staggered by `animation-delay`. Two at a time,
 * slowly, because the point is that infrastructure is quietly doing something —
 * not that it is busy. Twelve simultaneous pulses would read as loading.
 *
 * `data-motion-loop` means the CSS in orkastor.css removes them entirely under
 * `prefers-reduced-motion`, leaving the static graph, which still communicates.
 *
 * `density` drops node count on small screens. Mobile is not a scaled desktop:
 * the same 14 nodes in 390px is noise.
 */
export function Topology({ density = 'full', className = '', style = undefined, seed = 1 }) {
  const reduced = useReducedMotion();

  const { nodes, edges } = useMemo(() => {
    // A fixed pseudo-random layout. Deterministic so it does not reshuffle on
    // every render, and seedable so two instances on one page differ.
    let s = seed * 9301;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const count = density === 'low' ? 7 : density === 'mid' ? 11 : 15;
    const n = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 6 + rnd() * 88,
      y: 8 + rnd() * 84,
    }));
    // Connect each node to its nearest neighbour ahead of it — gives a graph
    // that looks like a network rather than a starburst.
    const e = [];
    for (let i = 0; i < n.length; i++) {
      let best = -1; let bd = Infinity;
      for (let j = 0; j < n.length; j++) {
        if (i === j) continue;
        const d = (n[i].x - n[j].x) ** 2 + (n[i].y - n[j].y) ** 2;
        if (d < bd && !e.some((k) => (k.a === j && k.b === i))) { bd = d; best = j; }
      }
      if (best >= 0) e.push({ a: i, b: best });
    }
    return { nodes: n, edges: e };
  }, [density, seed]);

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 100 100"
      /* `slice`, NOT `none`. `none` stretches the viewBox to the element box,
       * which turns every <circle> node into an oval — visible as squashed grey
       * blobs at wide aspect ratios. `slice` keeps the geometry round and crops
       * the overflow instead, which for a background graph costs nothing: there
       * is no edge of it anyone is meant to find. */
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
    >
      {edges.map((e, i) => {
        const a = nodes[e.a]; const b = nodes[e.b];
        return (
          <line
            key={`l${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="var(--topo-line)" strokeWidth="0.18" vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {/* Two travelling pulses. `pathLength=1` normalises the dash maths so one
          keyframe set works for lines of any length. */}
      {!reduced && edges.slice(0, 2).map((e, i) => {
        const a = nodes[e.a]; const b = nodes[e.b];
        return (
          <line
            key={`p${i}`}
            data-motion-loop=""
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="var(--cloud-bright)" strokeWidth="0.5" strokeLinecap="round"
            pathLength="1" strokeDasharray="0.08 0.92"
            vectorEffect="non-scaling-stroke"
            style={{ animation: `ork-pulse 7s linear ${i * 3.2}s infinite`, opacity: 0.5 }}
          />
        );
      })}

      {nodes.map((n) => (
        <circle key={`n${n.id}`} cx={n.x} cy={n.y} r="0.55" fill="var(--topo-node)" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export default Topology;
