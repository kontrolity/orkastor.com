import React from 'react';

/**
 * OrkastorLogo — Hex-Triad Intelligence Mark (v4 · Blue-Teal-Emerald theme)
 *
 * Design concept: AI-powered Kubernetes SRE — Monitor · Analyze · Fix
 *
 * Structure (64×64 canvas, center 32,32):
 *   ① Outer hexagon frame    → Kubernetes cluster / container orchestration
 *   ② Three active nodes at alternating vertices (0° / 120° / 240°)
 *        Monitor (blue, top) · Analyze (teal, lower-right) · Fix (emerald, lower-left)
 *   ③ Equilateral triangle   → closed AI workflow loop
 *   ④ Radial spokes          → intelligence dispatched to all three functions
 *   ⑤ Central glowing core  → always-on AI engine inside your cluster
 *
 * Color flow: Electric Blue → Teal → Emerald
 *   Blue  = precision intelligence, data collection (Monitor)
 *   Teal  = AI processing, transitioning raw signal to insight (Analyze)
 *   Emerald = healthy system, problem resolved, success (Fix)
 */

const pt = (deg, r) => {
  const θ = (deg * Math.PI) / 180;
  return [+(32 + r * Math.sin(θ)).toFixed(3), +(32 - r * Math.cos(θ)).toFixed(3)];
};

const R_HEX  = 27;
const R_NODE = 25;

const HEX_PTS = Array.from({ length: 6 }, (_, i) => pt(i * 60, R_HEX));
const hexPath = 'M ' + HEX_PTS.map(([x, y]) => `${x},${y}`).join(' L ') + ' Z';

const NODES = [
  { angle: 0,   color: '#60a5fa', label: 'Monitor' },  // blue-400   – top
  { angle: 120, color: '#2dd4bf', label: 'Analyze' },  // teal-400   – lower-right
  { angle: 240, color: '#34d399', label: 'Fix'     },  // emerald-400– lower-left
];
const nodePts = NODES.map(n => pt(n.angle, R_NODE));
const triPath = 'M ' + nodePts.map(([x, y]) => `${x},${y}`).join(' L ') + ' Z';

export default function OrkastorLogo({
  size         = 32,
  showWordmark = true,
  className    = '',
  light        = false,
}) {
  const uid = React.useId().replace(/:/g, '');
  const textColor = light ? '#0a0f1a' : '#f8fafc';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Orkastor"
      >
        <defs>
          {/* Per-node radial halo */}
          {NODES.map((n, i) => {
            const [nx, ny] = nodePts[i];
            return (
              <radialGradient
                key={i}
                id={`${uid}nh${i}`}
                cx={nx} cy={ny} r="10"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={n.color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0"   />
              </radialGradient>
            );
          })}

          {/* Spoke gradients: center → node */}
          {NODES.map((n, i) => {
            const [nx, ny] = nodePts[i];
            return (
              <linearGradient
                key={i}
                id={`${uid}sp${i}`}
                x1="32" y1="32" x2={nx} y2={ny}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor="#bfdbfe" stopOpacity="0.7" />
                <stop offset="100%" stopColor={n.color}  stopOpacity="0.4" />
              </linearGradient>
            );
          })}

          {/* Triangle stroke: Blue → Teal → Emerald */}
          <linearGradient
            id={`${uid}tri`}
            x1={nodePts[0][0]} y1={nodePts[0][1]}
            x2={nodePts[1][0]} y2={nodePts[1][1]}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#60a5fa" />
            <stop offset="50%"  stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          {/* Node glow */}
          <filter id={`${uid}glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Center core glow */}
          <filter id={`${uid}cg`} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Center radial: white → blue → teal */}
          <radialGradient id={`${uid}cd`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff"  stopOpacity="1"   />
            <stop offset="55%"  stopColor="#60a5fa"  stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#2dd4bf"  stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* ── ① Outer hexagon frame ── */}
        <path d={hexPath} stroke={`url(#${uid}tri)`} strokeWidth="1.4" strokeOpacity="0.75" />

        {/* ── ③ Internal AI workflow triangle ── */}
        <path
          d={triPath}
          fill="rgba(96,165,250,0.04)"
          stroke={`url(#${uid}tri)`}
          strokeWidth="0.9"
          strokeOpacity="0.6"
        />

        {/* ── ④ Radial spokes: center → nodes ── */}
        {NODES.map((_, i) => {
          const [nx, ny] = nodePts[i];
          return (
            <line
              key={i}
              x1="32" y1="32"
              x2={nx} y2={ny}
              stroke={`url(#${uid}sp${i})`}
              strokeWidth="0.9"
            />
          );
        })}

        {/* ── ② Node halos ── */}
        {NODES.map((n, i) => {
          const [nx, ny] = nodePts[i];
          return <circle key={i} cx={nx} cy={ny} r="10" fill={`url(#${uid}nh${i})`} />;
        })}

        {/* ── ② Active nodes: ring + bright core ── */}
        {NODES.map((n, i) => {
          const [nx, ny] = nodePts[i];
          return (
            <g key={i} filter={`url(#${uid}glow)`}>
              <circle cx={nx} cy={ny} r="4.5" fill={`${n.color}20`} stroke={n.color} strokeWidth="1.25" />
              <circle cx={nx} cy={ny} r="1.8" fill={n.color} />
            </g>
          );
        })}

        {/* ── ⑤ Central AI core ── */}
        <circle cx="32" cy="32" r="5.5" fill={`url(#${uid}cd)`} filter={`url(#${uid}cg)`} />
        <circle cx="32" cy="32" r="2" fill="white" fillOpacity="0.96" />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontSize: `${(size * 0.5625).toFixed(1)}px`,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          {/* "Orka" — clean white, like Rootly's solid wordmark */}
          <span style={{ color: light ? '#0a0f1a' : '#ffffff' }}>Orka</span>
          {/* "stor" — brand violet accent */}
          <span
            style={light ? { color: '#0a0f1a' } : {
              background: 'linear-gradient(135deg, #6C47FF 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >stor</span>
        </span>
      )}
    </div>
  );
}
