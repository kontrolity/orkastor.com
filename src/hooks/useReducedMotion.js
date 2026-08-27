import { useEffect, useState } from 'react';

/**
 * Does this visitor want motion?
 *
 * The CSS in orkastor.css already neutralises transitions and hides
 * `[data-motion-loop]` under `prefers-reduced-motion`. This hook is for the
 * cases CSS cannot reach: a `requestAnimationFrame` loop, a pointer listener, a
 * framer-motion variant. Those keep running and keep costing battery even when
 * the result is invisible, so they have to be switched off in JS as well.
 *
 * Starts `false` — motion allowed — and corrects on mount. The alternative is
 * starting `true` and having every animation pop in one frame late on the
 * common path.
 *
 * Listens for changes: the OS setting can be toggled while the tab is open, and
 * a reader who turns it on mid-visit should not have to reload.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return reduced;
}

/**
 * Is this a pointer device that can actually hover?
 *
 * Guards the desktop-only enhancements — the cursor light, magnetic buttons,
 * hover-driven diagram states. `window.innerWidth` is the usual test and it is
 * the wrong one: a tablet in landscape is 1024px wide and has no cursor, so it
 * would get effects it can never trigger and pay for the listeners anyway.
 */
export function useHasPointer() {
  const [has, setHas] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHas(mq.matches);
    const on = (e) => setHas(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return has;
}
