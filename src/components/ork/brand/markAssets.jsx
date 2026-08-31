import React from 'react';

/**
 * The Orkastor mark, from the approved artwork.
 *
 * ── THESE ARE CROPS, NOT A REDRAW ───────────────────────────────────────────
 *
 * The files under /brand are cut straight out of the supplied brand sheet. The
 * sheet is flat art on a flat ground, so ink coverage per pixel was recovered as
 * an alpha channel — `alpha = (background - pixel) / (background - ink)` — which
 * keeps the artwork's own anti-aliasing and drops the sheet's grey ground.
 *
 * An earlier attempt vectorised this with potrace. It was faithful but it was
 * still a trace, so it went. Do not "improve" these by re-tracing them: the
 * point is that they are the artwork.
 *
 * ── WHY EACH SHAPE SHIPS TWICE ──────────────────────────────────────────────
 *
 * Raster art cannot inherit `currentColor`. The site is theme-switchable —
 * next-themes, `attribute="class"`, and there is a toggle in the nav — so a
 * single fixed tint would be wrong in one of the two themes, and which one is
 * the user's choice at runtime, not ours at build time.
 *
 * So both tints ship and CSS picks. See `.ork-art--*` in styles/orkastor.css.
 * That is deliberately not `mask-image` + currentColor, which would need one
 * file instead of two: where masks are unsupported the element renders as a
 * solid coloured rectangle, and a broken logo is a worse trade than 32KB.
 *
 * ── SIZING ──────────────────────────────────────────────────────────────────
 *
 * `size` is the HEIGHT. The art is not square and must not be squashed into a
 * square box, so width comes from the measured aspect ratio of each crop.
 */

/** Measured from the crops. width / height. */
export const MARK_RATIO   = 0.8633;   // 240 x 278
export const LOCKUP_RATIO = 3.7194;   // 1034 x 278

function Art({ base, ratio, size, alt, onLight }) {
  // ⚠ NO `display` HERE. The theme swap below is a stylesheet rule, and an
  // inline style beats a stylesheet rule without !important — setting
  // `display: block` here made `.dark .ork-art--light { display: none }` lose,
  // so BOTH tints rendered side by side in the nav. `display` belongs to the
  // .ork-art--* classes; only the single-image branch, which has no class, sets
  // it inline.
  const size2 = { height: size, width: Math.round(size * ratio) };

  // An explicit surface wins; otherwise the theme class decides.
  if (onLight !== undefined) {
    return (
      <img src={onLight ? `/brand/${base}.png` : `/brand/${base}-inverse.png`}
           style={{ ...size2, display: 'block' }} alt={alt} draggable="false" />
    );
  }
  return (
    <>
      <img className="ork-art--light" src={`/brand/${base}.png`}
           style={size2} alt={alt} draggable="false" />
      <img className="ork-art--dark" src={`/brand/${base}-inverse.png`}
           style={size2} alt="" aria-hidden="true" draggable="false" />
    </>
  );
}

/** The symbol on its own. */
export function Mark({ size = 32, onLight, alt = '' }) {
  return <Art base="mark" ratio={MARK_RATIO} size={size} alt={alt} onLight={onLight} />;
}

/** Symbol and wordmark as one piece of artwork, exactly as drawn. */
export function Lockup({ size = 32, onLight, alt = 'Orkastor' }) {
  return <Art base="lockup" ratio={LOCKUP_RATIO} size={size} alt={alt} onLight={onLight} />;
}

/** Whichever the caller wants. */
export function Logo({ size = 32, wordmark = true, onLight, alt = 'Orkastor' }) {
  return wordmark
    ? <Lockup size={size} onLight={onLight} alt={alt} />
    : <Mark   size={size} onLight={onLight} alt={alt} />;
}
