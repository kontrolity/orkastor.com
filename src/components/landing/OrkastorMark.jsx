import React from 'react';

/**
 * OrkastorMark — the approved mark: an orca in an interrupted ring, navy to teal.
 *
 * ── THIS FILE WAS SHIPPING A MARK TWO GENERATIONS OLD ───────────────────────
 *
 * It drew the gen-2 "four-shape" glyph — a broken orbit ring, a launching arrow
 * and a spark — in a purple-to-blue gradient, a palette the brand uses nowhere.
 * `.orkastor-brand/check_brand.py` flagged every path and both gradient stops in
 * this file, plus the same drawing in `public/favicon.svg`.
 *
 * The retired hex values are deliberately not repeated here: the checker greps
 * for the literals, so quoting them in a comment re-fails the file it just
 * fixed. Read SPEC.md for what was retired.
 *
 * The geometry below is now copied from `.orkastor-brand/mark-small.svg`
 * verbatim, and the gradient is the canonical three stops:
 *
 *     #0B2A4A  0%   ->  #17608A  45%  ->  #48CBCB  100%
 *
 * ── TWO DRAWINGS, PICKED BY RENDERED SIZE ───────────────────────────────────
 *
 * SPEC keeps a full drawing (>= 48px) and a simplified one (<= 32px), because
 * the full one turns to mush below about 48px — which is the exact failure the
 * previous mark was redrawn to fix. It says to pick by RENDERED size, not by
 * surface, so this switches on `size` rather than on where it is used. A 40px
 * nav mark therefore gets the small drawing, deliberately.
 *
 * Only the small drawing is inlined. The full one is a 15KB potrace trace whose
 * paths sit inside a flipped transform, and inlining it would put a fragile
 * gradientTransform in a React file where the next person will "tidy" it and get
 * a flat black mark. Above 48px this renders `mark-full.svg` as an <img>, so
 * there is one copy of that artwork and it is the canonical file.
 *
 * The header this replaces claimed the geometry was "kept in sync by hand"
 * across three files. It was not — all three had drifted to the retired mark
 * together, which is why the checker exists.
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
      {size >= 48 ? (
        // Full drawing, straight from the canonical file — see the header for
        // why this is an <img> and not inlined.
        <img
          src="/brand/mark-full.svg"
          width={size}
          height={size}
          alt=""
          aria-hidden="true"
          style={{ display: 'block' }}
        />
      ) : (
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
            <linearGradient id={`${uid}g`} x1="5" y1="26" x2="27" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B2A4A" />
              <stop offset="45%" stopColor="#17608A" />
              <stop offset="100%" stopColor="#48CBCB" />
            </linearGradient>
          </defs>
          {/* The interrupted ring. The gap is the mark, not an accident. */}
          <path
            d="M19.9 29.1A13.6 13.6 0 1 0 12.1 29.1"
            fill="none"
            stroke={`url(#${uid}g)`}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* The orca, solid. */}
          <path
            d="M26.4 13.6C24.6 11.4 21.8 9.6 18.6 9.3C17.2 7.2 15.0 6.0 12.6 6.2C13.9 7.9 14.6 9.4 14.6 11.0C12.0 12.8 10.4 15.6 10.2 18.8C10.1 21.4 10.9 23.6 12.4 25.4C12.6 22.6 13.6 20.4 15.4 18.8C16.2 20.0 17.2 20.7 18.4 20.9C18.0 19.4 17.9 18.1 18.2 17.0C21.2 16.2 24.0 15.0 26.4 13.6 Z"
            fill={`url(#${uid}g)`}
          />
        </svg>
      )}

      {/*
        WORDMARK — solid, uppercase, letterspaced, ONE text node.

        This was `Orka` + `stor` in a 110deg purple-to-blue gradient across two
        spans. .orkastor-brand/SPEC.md retires exactly that treatment, and names
        this file's version as one of the three it is retiring. Two problems, not
        one:

          · it was a purple-to-blue gradient, a palette the brand does not use
            anywhere. The approved mark is navy -> teal, and the wordmark is not
            a gradient at all. (Hex values omitted on purpose — check_brand.py
            greps for the literals.)
          · splitting the word across two spans breaks the font's shaping run at
            the seam, so the kerning between "a" and "s" is wrong at every size.

        Per SPEC: one node, `color` = the surface's foreground. Navy on light,
        near-white on dark. No background-clip, so no WebKit fallback needed.
      */}
      {showWordmark && (
        <span
          style={{
            fontSize: `${(size * 0.5).toFixed(1)}px`,
            fontWeight: 700,
            // Uppercase and letterspaced per the approved artwork. Positive
            // tracking, not the -0.02em this carried — tight tracking is for
            // headlines, and it made the uppercase form read as one long glyph.
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            fontFamily: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
            lineHeight: 1,
            color: light ? '#0B2A4A' : '#EAF2F8',
          }}
        >
          Orkastor
        </span>
      )}
    </div>
  );
}
