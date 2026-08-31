import React from 'react';
import { Mark, Wordmark, INK, PAPER } from '@/components/ork/brand/markGeometry';

/**
 * OrkastorMark — the mark plus the wordmark.
 *
 * The drawing lives in `ork/brand/markGeometry.jsx` and is shared with
 * `ork/brand/Logo.jsx` and `landing/OrkastorLogo.jsx`. It used to be inlined
 * here, in all three, and all three drifted to a retired glyph together. Do not
 * copy the paths back in.
 *
 * `light` says what the mark sits ON — a light background — not what colour the
 * mark is. That is the existing prop's meaning and the call sites depend on it.
 */
export default function OrkastorMark({
  size         = 32,
  showWordmark = true,
  light        = false,
  className    = '',
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* The small drawing inherits `currentColor`; the full one is an <img>
          and picks its own file, so setting colour here is harmless for it. */}
      <span style={{ color: light ? INK : PAPER, display: 'flex' }}>
        <Mark size={size} onLight={light} />
      </span>
      {showWordmark && <Wordmark size={size} onLight={light} />}
    </div>
  );
}
