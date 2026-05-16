import React from 'react';

/**
 * Reusable grain overlay. Drop inside any positioned container.
 * The body already has site-wide grain (index.css body::after);
 * this is for stronger localized grain on sections / cards.
 */
const NOISE_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.4 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)' opacity='0.9'/>
  </svg>`
)}`;

export default function GrainOverlay({
  opacity = 0.15,
  size = 220,
  blendMode = 'overlay',
  className = '',
  style,
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        mixBlendMode: blendMode,
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundSize: `${size}px ${size}px`,
        ...style,
      }}
    />
  );
}
