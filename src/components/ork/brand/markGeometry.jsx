import React from 'react';

/**
 * The Orkastor mark, in one place.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 *
 * Three components drew the mark independently and all three drifted to the
 * same retired glyph together, which is the drift `.orkastor-brand/check_brand.py`
 * was written to catch. There is now one drawing and they all import it.
 *
 * ── TWO DRAWINGS, PICKED BY RENDERED SIZE ───────────────────────────────────
 *
 * The full mark is six nested chevrons around a central counter. Below about
 * 48px the chevron gaps close up and it fills in as a solid blob — the same
 * failure every previous generation of this mark hit. So there are two:
 *
 *   · MarkSmall  — inlined below. The counter and the two horizontal points,
 *                  nothing else. Legible at 16px.
 *   · mark-full  — /brand/mark-full.svg, served as an <img>. A potrace trace of
 *                  the approved artwork, 4 subpaths, ~7KB. Not inlined: it would
 *                  triple the size of every component that shows a logo.
 *
 * Pick by RENDERED size, not by surface. A 40px nav mark gets the small drawing
 * deliberately.
 *
 * ── COLOUR ──────────────────────────────────────────────────────────────────
 *
 * Solid, no gradient. This generation does not have one. The small drawing uses
 * `currentColor` so it inherits; the full drawing is an <img> and cannot, so it
 * ships in two files and the caller picks by background.
 */

/** Sampled from the approved artwork. */
export const INK     = '#100F22';
export const PAPER   = '#F5F6FA';
export const INDIGO  = '#1F1352';

/** Above this rendered size, use the full drawing. */
export const FULL_AT = 48;

export function MarkSmall({ size = 32, title = 'Orkastor', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      {...rest}
    >
      {/* The counter — an elongated hexagonal ring. evenodd keeps it open. */}
      <path
        d="M 16.00,1.60 L 21.60,5.60 L 21.60,26.40 L 16.00,30.40 L 10.40,26.40 L 10.40,5.60 Z M 16.00,7.00 L 18.50,9.40 L 18.50,22.60 L 16.00,25.00 L 13.50,22.60 L 13.50,9.40 Z"
        fillRule="evenodd"
      />
      {/* The horizontal points — what keeps the silhouette hexagonal, not round. */}
      <path d="M 1.40,16.00 L 7.40,11.70 L 7.40,20.30 Z" />
      <path d="M 30.60,16.00 L 24.60,11.70 L 24.60,20.30 Z" />
      {/* One chevron per side. The rest of the full mark's nesting is dropped. */}
      <path d="M 9.40,16.00 L 12.80,10.40 L 10.40,10.40 L 7.00,16.00 L 10.40,21.60 L 12.80,21.60 Z" />
      <path d="M 22.60,16.00 L 19.20,10.40 L 21.60,10.40 L 25.00,16.00 L 21.60,21.60 L 19.20,21.60 Z" />
    </svg>
  );
}

/**
 * `onLight` says what the mark sits ON, not what colour it is. On a light
 * surface the mark is ink; on a dark one it is paper.
 */
export function MarkFull({ size = 64, onLight = true }) {
  return (
    <img
      src={onLight ? '/brand/mark-full.svg' : '/brand/mark-full-inverse.svg'}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
}

/** The mark at whichever drawing the size calls for. */
export function Mark({ size = 32, onLight = true, title = 'Orkastor' }) {
  return size >= FULL_AT
    ? <MarkFull size={size} onLight={onLight} />
    : <MarkSmall size={size} title={title} />;
}

/**
 * The wordmark. ONE text node, always.
 *
 * It used to be `Orka` + `stor` in two spans. Splitting a word across two
 * elements breaks the font's shaping run at the seam — KubeGraf's own
 * stylesheet records hitting exactly that, where wrapping "Graf" separately
 * made the e-macron and G overlap. It survived here only because "a|s" is not a
 * risky kerning pair, and it would have broken the day the font changed.
 *
 * Title case, not uppercase: that is what the approved artwork shows.
 */
export function Wordmark({ size = 32, onLight = true, color }) {
  return (
    <span
      style={{
        fontSize: `${(size * 0.58).toFixed(1)}px`,
        fontWeight: 600,
        letterSpacing: '-0.005em',
        fontFamily: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
        lineHeight: 1,
        color: color ?? (onLight ? INK : PAPER),
      }}
    >
      Orkastor
    </span>
  );
}
