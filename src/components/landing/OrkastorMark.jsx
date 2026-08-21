import React from 'react';

/**
 * OrkastorMark — the current brand glyph: a broken orbit ring, a launching
 * arrow crossing it on the same diagonal, and a small trailing spark.
 *
 * Replaces OrkastorLogo (the hex-triad "Monitor · Analyze · Fix" mark) as the
 * mark actually used in the live Nav/Footer — OrkastorLogo predates the
 * reference art the product now ships with and read as a different brand
 * entirely next to it. OrkastorLogo itself is left in place (still imported
 * by the unused `landing/NavBar.jsx` / `landing/Footer.jsx`) rather than
 * deleted, since removing a whole design system wasn't asked for here.
 *
 * Same geometry as apps/orkastor's OrkastorMark.tsx (the Console) and
 * public/favicon.svg (this site's browser-tab icon) — kept in sync by hand
 * across the three since none of them can share a literal component.
 */
export default function OrkastorMark({
  size         = 32,
  showWordmark = true,
  light        = false,
  className    = '',
}) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Orkastor"
      >
        <defs>
          <linearGradient id={`${uid}g`} x1="4" y1="5" x2="28" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="55%" stopColor="#7C6FE8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {/* Orbit ring, broken where the arrow launches through it */}
        <path
          d="M12 6.3a9.9 9.9 0 1 0 9.9 12.9"
          fill="none"
          stroke={`url(#${uid}g)`}
          strokeWidth="4.6"
          strokeLinecap="round"
        />
        {/* Launching arrow, crossing the ring on the same diagonal */}
        <path
          d="M8.3 23.7 24.6 6.4"
          fill="none"
          stroke={`url(#${uid}g)`}
          strokeWidth="4.6"
          strokeLinecap="round"
        />
        <path d="M25.3 5.3 16.4 8.6 21.9 14.1Z" fill={`url(#${uid}g)`} />
        {/* Trailing spark */}
        <path
          d="M10.8 12.3 11.9 14.9 14.5 16 11.9 17.1 10.8 19.7 9.7 17.1 7.1 16 9.7 14.9Z"
          fill="#C4B5FD"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontSize: `${(size * 0.5625).toFixed(1)}px`,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          <span style={{ color: light ? '#0a0f1a' : '#ffffff' }}>Orka</span>
          <span
            style={{
              background: 'linear-gradient(110deg, #A855F7 0%, #7C6FE8 55%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            stor
          </span>
        </span>
      )}
    </div>
  );
}
