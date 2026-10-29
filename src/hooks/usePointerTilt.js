import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Damped pointer tracking, written to CSS custom properties.
 *
 * Returns a ref to attach to the element the pointer is measured against.
 * While the pointer moves, that element gets `--px` and `--py` in the range
 * -1..1, measured from its own centre. Everything else — tilt, parallax
 * depth, highlight position — is CSS reading those two numbers.
 *
 * ── WHY A HOOK AND NOT A THIRD COPY ─────────────────────────────────────────
 *
 * This loop was written once in HeroAura.jsx, and the hero wanted it again
 * after that component stopped being rendered. The specific things it gets
 * right are not obvious and were each arrived at by measuring, so copying it
 * a third time would mean three places to get them wrong:
 *
 *   ⚠ SNAP ON ARRIVAL. A lerp approaches asymptotically and never actually
 *     reaches its target, so `cur === target` would never be true and the
 *     cheap idle guard in wake() could never fire. Assigning target to cur
 *     closes the gap exactly.
 *
 *   ⚠ THE LOOP IDLES. It is not a permanent rAF. It starts on pointer input
 *     and stops once it has arrived, so a page nobody is touching runs no
 *     animation frames from this.
 *
 *   ⚠ IT LOOKS BROKEN IN HEADLESS CHROME. rAF is throttled to roughly 17fps
 *     there, so a 12%-per-frame lerp takes about three seconds to converge
 *     instead of under one, and sampling mid-flight reads as "never
 *     settles". It does settle. That cost two wrong diagnoses before it was
 *     measured by counting rAF calls rather than watching values.
 *
 * ⚠ POINTER ONLY, NEVER TOUCH. Gated on (hover: hover) and (pointer: fine):
 * on a phone there is no pointer to follow, and a tilt driven by touch fires
 * once on tap and then sticks at that angle.
 *
 * ⚠ CursorLight in motion/Effects.jsx also listens to pointermove. That is
 * not duplication to collapse — it writes viewport coordinates for a global
 * light, this writes element-relative, damped coordinates for a transform.
 * Both are passive and both coalesce to one write per frame.
 *
 * @param {number} damping fraction of the remaining distance closed per
 *   frame. 0.12 glides; higher tracks more tightly and reads as snapping.
 */
export function usePointerTilt(damping = 0.12) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let idle = true;

    const write = () => {
      el.style.setProperty('--px', cur.x.toFixed(4));
      el.style.setProperty('--py', cur.y.toFixed(4));
    };

    const frame = () => {
      cur.x += (target.x - cur.x) * damping;
      cur.y += (target.y - cur.y) * damping;
      if (Math.abs(target.x - cur.x) < 0.0008 && Math.abs(target.y - cur.y) < 0.0008) {
        cur.x = target.x;
        cur.y = target.y;
        write();
        raf = 0;
        idle = true;
        return;
      }
      write();
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (cur.x === target.x && cur.y === target.y) return;
      if (idle) { idle = false; raf = requestAnimationFrame(frame); }
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      wake();
    };
    // Returning to centre when the pointer leaves the window matters: without
    // it the block stays frozen at whatever angle it held on the way out.
    const onLeave = () => { target.x = 0; target.y = 0; wake(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.removeProperty('--px');
      el.style.removeProperty('--py');
    };
  }, [reduced, damping]);

  return ref;
}

export default usePointerTilt;
