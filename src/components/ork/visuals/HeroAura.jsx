import React, { useEffect, useRef } from 'react';
import { Mark } from '../brand/markAssets';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The hero's prismatic aura with the Orkastor mark floating in it.
 *
 * ── WHAT THIS IS, AND WHY IT IS NOT HeroField ───────────────────────────────
 *
 * HeroField.jsx is a full-bleed WebGL ground behind the whole hero, and its
 * own comment is emphatic that it must never read as an object: its colour
 * uniforms are multiplied down to 0.055-0.085 precisely so it stays a ground.
 *
 * This is the opposite thing on purpose. It IS an object: a bright, saturated
 * bloom with the mark sitting in the middle of it, occupying its own column.
 * The two do not fight because HeroField is dim and full-bleed while this is
 * local and bounded — but if the hero ever starts looking busy, this is the
 * newer of the two and the one to question.
 *
 * ── WHY CSS AND NOT A SHADER ────────────────────────────────────────────────
 *
 * HeroField priced three.js at 116 kB gzip to draw one quad and rewrote it in
 * raw WebGL. The same arithmetic applies here and lands differently: this
 * effect is five blurred radial blobs, which CSS does natively with no bytes
 * at all. A second WebGL context on the same page would also cost a second
 * rAF loop and a second GPU surface, for something gradients already do.
 *
 * ⚠ ONE blur on the parent, not five on the children. `filter: blur()` forces
 * each filtered element onto its own composited layer; blurring five layers
 * costs five surfaces and five blur passes a frame. The children are plain
 * painted divs inside one blurred parent, so it is one surface and one pass,
 * and the children animate by transform only — which never re-runs the blur.
 *
 * ── THE MOTION ──────────────────────────────────────────────────────────────
 *
 * Two independent things, both of which stop dead under prefers-reduced-
 * motion:
 *
 *   1. The blobs drift on long, mutually-prime periods (19/23/29/31/37s) so
 *      the composition never visibly repeats. This is the same trick the
 *      retired CSS aurora used and the reason it never looked looped.
 *
 *   2. The mark tilts toward the pointer in 3D. Damped by lerping toward the
 *      target each frame rather than following it, so it glides instead of
 *      snapping, and driven by ONE rAF loop that idles when nothing is
 *      moving — a pointermove listener that wrote transforms directly would
 *      lay out on every mouse event.
 *
 * ⚠ The tilt is pointer-only and is never armed on touch. `(hover: hover)`
 * gates it: on a phone there is no pointer to follow, and a tilt driven by
 * touch would fire once on tap and stick.
 */

/** Blob definition: [class, period in seconds]. Periods are mutually prime. */
const BLOBS = [
  ['a', 19],
  ['b', 23],
  ['c', 29],
  ['d', 31],
  ['e', 37],
];

export function HeroAura({ markSize = 100 }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const markRef = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    // Pointer tilt is a desktop affordance. See the note above.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const wrap = wrapRef.current;
    const mark = markRef.current;
    if (!wrap || !mark) return undefined;

    // target = where the pointer says we should be; cur = where we are.
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let idle = true;

    const write = () => {
      mark.style.transform =
        `perspective(680px) rotateX(${(-cur.y * 11).toFixed(2)}deg) ` +
        `rotateY(${(cur.x * 13).toFixed(2)}deg) translateZ(26px)`;
    };

    const frame = () => {
      // Lerp 12% of the remaining distance per frame: fast enough to feel
      // responsive, slow enough that the mark glides rather than tracks.
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;

      /* ⚠ SNAP, DO NOT JUST STOP. A lerp approaches its target
         asymptotically and never reaches it. Leaving `cur` a hair short
         works for this loop, but it means the pair are never exactly equal,
         so the cheap `cur === target` guard in wake() below can never fire
         and every future wake costs a frame to discover it has nothing to
         do. Assigning target to cur closes the gap exactly and makes that
         guard real.

         ⚠ IF YOU PROFILE THIS IN HEADLESS CHROME IT WILL LOOK BROKEN. rAF
         is throttled to roughly 17fps there, so a 12%-per-frame lerp takes
         three seconds to converge instead of under one, and sampling the
         transform mid-flight reads as "never settles". It does settle —
         confirmed by watching the values converge (12.11 -> 12.75 -> 12.94
         -> 12.98 deg) and by counting rAF calls, which sit at the page's
         baseline rate rather than at 60/s once the pointer stops. */
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
      // Nothing to animate toward: stay asleep.
      if (cur.x === target.x && cur.y === target.y) return;
      if (idle) { idle = false; raf = requestAnimationFrame(frame); }
    };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      // -1..1 from the centre of the aura, clamped so a pointer far across
      // the page does not drive the tilt past its intended range.
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
      wake();
    };
    const onLeave = () => { target.x = 0; target.y = 0; wake(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className={`ork-aura${reduced ? ' is-still' : ''}`} ref={wrapRef}>
      {/* aria-hidden: the bloom is decoration. The mark below it is too —
          the company is already named by the lockup in the nav and by the
          headline, so a second accessible name here would just repeat it. */}
      <div className="ork-aura-field" aria-hidden="true">
        {BLOBS.map(([k, period]) => (
          <span
            key={k}
            className={`ork-aura-blob ork-aura-blob--${k}`}
            style={reduced ? undefined : { animationDuration: `${period}s` }}
          />
        ))}
      </div>

      <div className="ork-aura-mark" ref={markRef}>
        <Mark size={markSize} alt="" />
      </div>
    </div>
  );
}

export default HeroAura;
