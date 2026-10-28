import React from 'react';
import { Award } from 'lucide-react';

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
 * So this states the fact in words. The medal is lucide's generic `Award`
 * glyph, not a reproduction of any award body's device.
 *
 * ⚠ THE ORNAMENT WAS TWO HAND-DRAWN LAUREL SPRIGS AND THEY DID NOT READ.
 * At 16px the curved stem and three leaves collapsed into a brown smudge
 * that looked like a feather — confirmed by rendering all the candidates at
 * final size and comparing. The replacement is lucide's Award rosette,
 * which is drawn for this size, carries a consistent stroke weight, and is
 * recognisable as an award at a glance. Do not swap it for another
 * hand-rolled path; if a bespoke mark is wanted, draw it at 16px and look
 * at it there before committing.
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
        {/* One icon, not a flanking pair: the inner block is centred as a
            whole, so a single mark leading the sentence balances without
            needing a mirrored twin that doubles the noise. */}
        <Award className="ork-banner-icon" size={15} strokeWidth={2} aria-hidden="true" />
        <p className="ork-banner-text">
          <span className="ork-banner-strong">Gold Award Recognition 2026</span>
          <span className="ork-banner-by"> by Innovate NI</span>
        </p>
      </div>
      {/* Decoration only, and the one thing here that moves. Disabled under
          prefers-reduced-motion in CSS — a sheen travelling across a fixed
          strip is in peripheral vision on every page of the site, which is
          exactly the case that setting exists for. */}
      <span className="ork-banner-sheen" aria-hidden="true" />
    </div>
  );
}

export default AwardBanner;
