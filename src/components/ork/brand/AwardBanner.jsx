import React from 'react';

/**
 * The Innovate NI 2026 Gold Award banner — the strip above the nav.
 *
 * ── THIS IS NOT INNOVATE NI'S OFFICIAL MARK ─────────────────────────────────
 *
 * It is set in Orkastor's own type, deliberately. No artwork was supplied by
 * the awarding body, and drawing something gold-and-laurel-shaped would have
 * produced a graphic that reads as their official badge without being it —
 * which is a claim about who endorsed what, not a styling choice.
 *
 * So this states the fact in words. The two sprigs are a generic ornament,
 * not a reproduction of any award body's device.
 *
 * ⚠ If Innovate NI supplies real badge artwork, put their file in here rather
 * than restyling this to resemble it. Their mark is theirs; an approximation
 * of it is worse than plain text.
 *
 * ── IT REPLACED A PILL IN THE NAV ───────────────────────────────────────────
 *
 * The first version was a compact chip beside the lockup, hidden below `lg`
 * because the bar had no room for it. A full-width strip has the opposite
 * property: it has all the room it needs at every width, so the award now
 * survives on a phone, where the chip could not. That is the real argument
 * for the banner over the chip, beyond it simply being larger.
 *
 * ── WHAT IT COSTS, AND WHERE THAT IS PAID ───────────────────────────────────
 *
 * It is inside the FIXED header, so it is on screen permanently and takes its
 * height from every page's first fold. That height is --ork-banner-h, and
 * `.ork main` is padded by exactly it — one rule, rather than re-tuning the
 * top padding of every hero on the site. If you change the height, change it
 * in the variable and nothing else needs touching.
 */
export function AwardBanner() {
  return (
    <div className="ork-banner" role="complementary" aria-label="Award recognition">
      <div className="ork-banner-inner">
        <Sprig />
        <p className="ork-banner-text">
          <span className="ork-banner-strong">Gold Award Recognition 2026</span>
          <span className="ork-banner-by"> by Innovate NI</span>
        </p>
        <Sprig flip />
      </div>
      {/* Decoration only, and the one thing here that moves. Disabled under
          prefers-reduced-motion in CSS — a sheen travelling across a fixed
          strip is in peripheral vision on every page of the site, which is
          exactly the case that setting exists for. */}
      <span className="ork-banner-sheen" aria-hidden="true" />
    </div>
  );
}

/** A laurel sprig. Generic ornament — see the note above. */
function Sprig({ flip = false }) {
  return (
    <svg
      className={`ork-banner-sprig${flip ? ' is-flipped' : ''}`}
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M11.5 1.5C7 4 4.5 8 5 16.5" />
      <path d="M10.4 4.4c-2 .1-3.2 1-3.7 2.6 1.8.5 3-.1 3.7-2.6z" />
      <path d="M8.6 8.1c-2 .1-3.2 1-3.7 2.6 1.8.5 3-.1 3.7-2.6z" />
      <path d="M7.6 12c-2 .1-3.2 1-3.7 2.6 1.8.5 3-.1 3.7-2.6z" />
    </svg>
  );
}

export default AwardBanner;
