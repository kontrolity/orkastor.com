import React from 'react';
import { Mark, Wordmark, INK, PAPER } from '@/components/ork/brand/markGeometry';

/**
 * OrkastorLogo — the landing surfaces' logo.
 *
 * ── WHAT THIS REPLACED ──────────────────────────────────────────────────────
 *
 * A 250-line "Hex-Triad Intelligence Mark (v4)": a hexagon frame, three
 * coloured nodes at alternating vertices, a workflow triangle, radial spokes,
 * two blur filters and a glowing core, in three switchable palettes
 * (blue-teal-emerald, orange, mosaic). It was a diagram of a product, not a
 * mark, and it dissolved into a coloured smudge at the 18px this file is
 * actually called at.
 *
 * The `theme` prop is still accepted so no call site breaks, and it is ignored.
 * No call site ever passed it. The mark is one solid colour now.
 *
 * The drawing itself lives in `ork/brand/markGeometry.jsx`, shared with
 * `OrkastorMark.jsx` and `ork/brand/Logo.jsx`. Do not inline the paths here —
 * three independent copies is exactly how the previous mark went stale.
 */
export default function OrkastorLogo({
  size         = 32,
  showWordmark = true,
  className    = '',
  light        = false,
  // eslint-disable-next-line no-unused-vars
  theme        = 'default',
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span style={{ color: light ? INK : PAPER, display: 'flex' }}>
        <Mark size={size} onLight={light} />
      </span>
      {showWordmark && <Wordmark size={size} onLight={light} />}
    </div>
  );
}
