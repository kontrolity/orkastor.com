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
export const MARK_RATIO   = 0.9717;   // 103 x 106 — node-graph mark
export const LOCKUP_RATIO = 3.2642;   // 346 x 106 — node-graph lockup
// Ratios follow the ARTWORK, not the old chevron mark. Leaving them at the
// previous 0.8633 / 3.7194 would have stretched the new lockup ~13% wide,
// which on a wordmark reads as a bad font rather than as a bad image.

/** Intrinsic width of each 1x crop, in px. Feeds the `w` descriptors below. */
const NATURAL_W = { mark: 103, lockup: 346 };

/**
 * ── WHY THERE IS A -2x OF EACH FILE ─────────────────────────────────────────
 *
 * The 1x crops are 106px tall. The nav draws the lockup at 44px and the footer
 * at 48px, so a 2x screen needs at most 96px and the original DOWNSAMPLES —
 * sharp. A 3x screen needs 144px, so the same file is upscaled ~1.36x and the
 * mark's fine strokes go visibly soft. That is the whole defect: it is a phone
 * and browser-zoom problem, not a desktop one.
 *
 * The -2x files are the SAME ARTWORK resampled, not a redraw and not a trace —
 * the rule at the top of this file still stands. Premultiply, Lanczos,
 * unpremultiply, then a mild S-curve on alpha to pull the interpolated edge
 * ramp back to its original width. Premultiplication is not optional: the
 * transparent pixels carry RGB (0,0,0), so resampling straight alpha bleeds
 * black into every edge and the blue "stor" picks up a dark fringe.
 *
 * ⚠ 692px WIDE, NOT 1038. A 3x screen needs ~471px for the largest placement
 * we have, so 2x already clears it with room; a 3x file was generated, compared
 * at DPR 3, and was indistinguishable at twice the bytes. Do not "finish the
 * set" with a -3x unless something starts drawing the lockup above ~230px wide.
 *
 * ⚠ These add no real detail — there is none past the 1x crop to recover. They
 * win because the browser now DOWNSAMPLES instead of upscaling, and because
 * Lanczos beats the browser's upscale filter. If the original brand sheet ever
 * turns up, re-export from it and delete these.
 *
 * ⚠ The -2x files are PALETTE PNGs (256 colours), the 1x files are not. That
 * is a MOBILE budget decision, not a cosmetic one. Both tints of a lockup are
 * always fetched — `display: none` does not stop an <img> downloading — so a
 * 3x phone pays for two files. At 24-bit that was 144KB against the 51KB the
 * 1x pair costs, which is a bad trade on the device least able to afford it.
 * Quantised it is 31KB, so a phone now downloads LESS than before the -2x
 * existed and gets the sharper art. Compared at DPR 3 against the 24-bit
 * version: no banding, no visible difference at any size we draw.
 *
 * The 1x files are deliberately left 24-bit. They are the supplied artwork;
 * the -2x are derived, and only derived files get re-encoded.
 */
const SRCSET_CACHE = {};
function srcSet(base) {
  if (!SRCSET_CACHE[base]) {
    const key = base.replace('-inverse', '');
    const w = NATURAL_W[key];
    SRCSET_CACHE[base] = `/brand/${base}.png ${w}w, /brand/${base}-2x.png ${w * 2}w`;
  }
  return SRCSET_CACHE[base];
}

function Art({ base, ratio, size, alt, onLight }) {
  // ⚠ NO `display` HERE. The theme swap below is a stylesheet rule, and an
  // inline style beats a stylesheet rule without !important — setting
  // `display: block` here made `.dark .ork-art--light { display: none }` lose,
  // so BOTH tints rendered side by side in the nav. `display` belongs to the
  // .ork-art--* classes; only the single-image branch, which has no class, sets
  // it inline.
  const w = Math.round(size * ratio);
  const size2 = { height: size, width: w };

  /* `sizes` is the drawn width, so the browser multiplies it by the device
     ratio and picks from the `w` descriptors itself. At DPR 1 and 2 that
     resolves to the original file and nothing extra is fetched; only DPR 3
     pulls the -2x. Density descriptors (`1x, 2x`) would NOT do this — they
     ignore the drawn size, so a 2x laptop would download the big file to
     render a 44px logo the original already covers. */
  const common = { sizes: `${w}px`, draggable: 'false' };

  // An explicit surface wins; otherwise the theme class decides.
  if (onLight !== undefined) {
    const b = onLight ? base : `${base}-inverse`;
    return (
      <img src={`/brand/${b}.png`} srcSet={srcSet(b)} {...common}
           style={{ ...size2, display: 'block' }} alt={alt} />
    );
  }
  return (
    <>
      <img className="ork-art--light" src={`/brand/${base}.png`}
           srcSet={srcSet(base)} {...common} style={size2} alt={alt} />
      <img className="ork-art--dark" src={`/brand/${base}-inverse.png`}
           srcSet={srcSet(`${base}-inverse`)} {...common} style={size2}
           alt="" aria-hidden="true" />
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
