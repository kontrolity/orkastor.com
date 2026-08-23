import React from 'react';

/** The wordmark gradient. Shared verbatim with the Console and
 *  orkastor.cloud — the split sits at 52%, where "Orka" ends optically. */
const WORDMARK_GRADIENT_DARK =
  "linear-gradient(to right, rgba(250, 248, 244, 0.92) 0%, rgba(250, 248, 244, 0.92) 51%, #A855F7 52%, #7C6FE8 74%, #3B82F6 100%)";
const WORDMARK_GRADIENT_LIGHT =
  "linear-gradient(to right, #16181D 0%, #16181D 51%, #A855F7 52%, #7C6FE8 74%, #3B82F6 100%)";

/**
 * OrkastorMark — the brand glyph: an O, the initial, drawn at letterform weight
 * and interrupted once at the upper-right shoulder. The letter is the name; the
 * interruption is the product.
 *
 * It replaced a four-shape mark (a broken orbit ring, an arrow crossing it, an
 * arrowhead and a trailing spark) that carried more ideas than a mark can hold
 * and dissolved into a smudge below about 26px — under the size a favicon and a
 * nav mark are actually used at. The purple-to-blue gradient is unchanged, so
 * the brand does not reset: the form got simpler, the colour stayed.
 *
 * Circle at (16,16), r 11.4, stroke 4.6. The gap spans 42 degrees centred on 55,
 * which after the round caps is a 3.76px opening — still legible at 16px.
 *
 * Replaces OrkastorLogo (the hex-triad "Monitor · Analyze · Fix" mark) as the
 * mark actually used in the live Nav/Footer — OrkastorLogo predates the
 * reference art the product now ships with and read as a different brand
 * entirely next to it. OrkastorLogo itself is left in place (still imported
 * by the unused `landing/NavBar.jsx` / `landing/Footer.jsx`) rather than
 * deleted, since removing a whole design system wasn't asked for here.
 *
 * Same geometry as apps/orkastor's OrkastorMark.tsx (the Console),
 * public/favicon.svg (this site's browser-tab icon) and the inline copies in the
 * orkastor.cloud landing page — kept in sync by hand across the four, since none
 * of them can share a literal component. Change one, change all four.
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
          <linearGradient id={`${uid}g`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="55%" stopColor="#7C6FE8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {/* The O, interrupted once */}
        <path
          d="M18.76 4.94A11.4 11.4 0 1 0 25.45 9.63"
          fill="none"
          stroke={`url(#${uid}g)`}
          strokeWidth="4.6"
          strokeLinecap="round"
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
            // ONE text node with a directional gradient and a hard stop just
            // past "Orka". This used to be two spans, which breaks the font's
            // shaping run at the seam; KubeGraf's stylesheet records hitting
            // exactly that and solving it this way. `color` stays set so a
            // browser without background-clip shows a solid wordmark.
            color: light ? '#16181D' : 'rgba(250, 248, 244, 0.92)',
            backgroundImage: light ? WORDMARK_GRADIENT_LIGHT : WORDMARK_GRADIENT_DARK,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Orkastor
        </span>
      )}
    </div>
  );
}
