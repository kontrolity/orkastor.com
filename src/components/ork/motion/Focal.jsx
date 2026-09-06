import React, { useEffect, useRef } from 'react';

/**
 * Focal — copy stays dim until scroll brings it into a band near the middle
 * of the viewport, then lights. It is the one motion idea doing real work on
 * the reference site: in a 7,500px document it tells you where you are.
 *
 * ── WHY AN OBSERVER AND NOT `animation-timeline: scroll()` ──────────────────
 * Scroll-driven CSS animations are still Chromium-only. A hero that animates
 * in one browser and sits inert in the others is worse than one that animates
 * in none, so this is an IntersectionObserver with a rootMargin that carves
 * the focal band out of the viewport.
 *
 * ── IT NEVER HIDES ANYTHING ────────────────────────────────────────────────
 * The dim state is opacity .34, not 0, and `prefers-reduced-motion` pins it
 * lit. Every word is in the DOM and legible from the first frame — a visitor
 * whose JS never runs gets the whole page, just without the choreography.
 */
export function Focal({ children, as: As = 'div', once = false, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // No observer at all under reduced motion: the CSS already pins it lit,
    // so running one would only toggle a class nothing reads.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-lit');
          if (once) io.disconnect();
        } else if (!once) {
          el.classList.remove('is-lit');
        }
      },
      // Top 18% and bottom 22% are outside the band, so content lights as it
      // reaches reading position rather than the instant it clips the edge.
      { rootMargin: '-18% 0px -22% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <As ref={ref} className={`ork-focal ${className}`} {...rest}>
      {children}
    </As>
  );
}

/**
 * The dotted field plus its accent pool. Decorative and inert: aria-hidden,
 * pointer-events none, and it paints from two background-images rather than
 * from a canvas of individual dots.
 */
export function DotField({ aura = true, className = '' }) {
  return (
    <>
      {aura ? <div className={`ork-aura ${className}`} aria-hidden="true" /> : null}
      <div className={`ork-dotfield ${className}`} aria-hidden="true" />
    </>
  );
}
