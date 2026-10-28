import React from 'react';

/**
 * The Innovate NI 2026 Gold recognition badge.
 *
 * ── THIS IS NOT INNOVATE NI'S OFFICIAL MARK ─────────────────────────────────
 *
 * It is set in Orkastor's own type, deliberately. No artwork was supplied by
 * the awarding body, and drawing something gold-and-laurel-shaped would have
 * produced a graphic that reads as their official badge without being it —
 * which is a claim about who endorsed what, not a styling choice.
 *
 * So this states the fact in words and nothing more. The wreath below is a
 * generic ornament, not a reproduction of any award body's device.
 *
 * ⚠ If Innovate NI supplies real badge artwork, replace the whole component
 * with their file rather than tinting this one to match it. Their mark is
 * theirs; an approximation of it is worse than plain text.
 *
 * ── WHY IT IS DESKTOP-ONLY ──────────────────────────────────────────────────
 *
 * The bar already carries the lockup, five nav items, a theme toggle and a
 * burger, and at 320px the lockup alone is 144px of a 320px line. There is no
 * honest way to fit this as well, and an award is the first thing that should
 * yield when space runs out — it is recognition, not navigation. Hidden below
 * `lg`, which is the same breakpoint the desktop nav itself appears at, so the
 * badge and the links arrive together rather than the badge surviving into a
 * layout the links have already left.
 */
export function AwardBadge({ className = '' }) {
  return (
    <span
      className={`ork-award ${className}`}
      /* A <span>, not a link. There is no announcement page to point at yet,
         and a badge that navigates nowhere is worse than one that plainly
         does not. Wrap it in an <a> when there is somewhere to go. */
      title="Gold Award — Innovate NI 2026"
    >
      <svg
        className="ork-award-wreath"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3.6l2.1 4.5 4.7.6-3.5 3.3.9 4.9-4.2-2.4-4.2 2.4.9-4.9L5.2 8.7l4.7-.6z" />
      </svg>
      <span>
        Gold<span className="ork-award-sep" aria-hidden="true"> · </span>
        <span className="ork-award-body">Innovate NI 2026</span>
      </span>
    </span>
  );
}

export default AwardBadge;
