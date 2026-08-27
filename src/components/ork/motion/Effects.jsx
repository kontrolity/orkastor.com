import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useHasPointer } from '@/hooks/useReducedMotion';

/**
 * A soft light that follows the cursor. Desktop only, and deliberately dim.
 *
 * Two rules keep it from becoming the gimmick the brief warns about:
 *
 *  1. It writes CSS VARIABLES, not React state. A pointermove handler that calls
 *     setState re-renders the tree at pointer frequency; writing --mx/--my on one
 *     element is a style recalculation on one node. On a page with this many SVG
 *     nodes that difference is the whole frame budget.
 *  2. `pointer-events: none` and `position: fixed` behind everything. It must
 *     never eat a click, which is the failure mode that makes these things get
 *     ripped out later.
 *
 * Off entirely for touch and for reduced motion — a light chasing a cursor that
 * does not exist is pure cost.
 */
export function CursorLight() {
  const reduced = useReducedMotion();
  const hasPointer = useHasPointer();
  const ref = useRef(null);

  useEffect(() => {
    if (reduced || !hasPointer) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (raf) return;
      // Coalesce to one write per frame. Pointer events fire faster than paint.
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
  }, [reduced, hasPointer]);

  if (reduced || !hasPointer) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-motion-loop=""
      /* Cast: custom properties are valid CSS but absent from React's
       * CSSProperties type, and the fallback values matter — without them the
       * gradient reads `at  ` until the first pointermove. */
      style={/** @type {any} */ ({
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        '--mx': '50vw', '--my': '33vh',
        background:
          'radial-gradient(420px circle at var(--mx) var(--my), var(--glow), transparent 65%)',
      })}
    />
  );
}

/**
 * A button that leans very slightly toward the pointer.
 *
 * Capped at 4px. The effect is meant to register as responsiveness, not as
 * movement — and past about 6px the target starts drifting out from under the
 * finger, which makes a primary CTA harder to hit. That is a real cost for a
 * decorative gain, so the cap is low and non-negotiable.
 *
 * Renders a plain wrapper when there is no pointer or motion is reduced, so the
 * child keeps its geometry and its click target exactly.
 */
export function Magnetic({ children, strength = 4, className = '', ...rest }) {
  const reduced = useReducedMotion();
  const hasPointer = useHasPointer();
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    el.style.transform = `translate3d(${clamp(dx) * strength}px, ${clamp(dy) * strength}px, 0)`;
  };
  const reset = () => { const el = ref.current; if (el) el.style.transform = 'translate3d(0,0,0)'; };

  if (reduced || !hasPointer) return <span className={className} {...rest}>{children}</span>;
  return (
    <span
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ display: 'inline-flex', transition: 'transform 220ms var(--ease-standard)', willChange: 'transform' }}
      {...rest}
    >
      {children}
    </span>
  );
}

/**
 * A hairline scroll-progress bar, fixed under the nav.
 *
 * Uses scroll position rather than a scroll-linked CSS animation because
 * `animation-timeline: scroll()` is still not safe to rely on across the
 * browsers this has to work in, and the fallback is no indicator at all.
 *
 * Hidden under reduced motion: it is a moving element whose information — how
 * far down a page you are — the scrollbar already carries.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    const read = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    read();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div aria-hidden="true" data-motion-loop="" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60, pointerEvents: 'none' }}>
      <div
        style={{
          height: '100%',
          width: `${pct * 100}%`,
          background: 'linear-gradient(90deg, var(--blue), var(--cloud-bright))',
          transition: 'width 90ms linear',
        }}
      />
    </div>
  );
}
