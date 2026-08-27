import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The one scroll-reveal in the system.
 *
 * ── WHY IntersectionObserver AND NOT framer-motion's whileInView ────────────
 *
 * framer-motion is already a dependency and its `whileInView` would do this in
 * one line. It also mounts a motion component per revealed element, and this
 * site reveals a lot of them. An observer with a shared callback costs one
 * listener for the page; `whileInView` costs a subscription each.
 *
 * ── ONCE, NEVER AGAIN ──────────────────────────────────────────────────────
 *
 * Unobserves on first intersection. A reveal that re-plays when you scroll back
 * up is a reveal that punishes re-reading, which is exactly what someone
 * comparing two products does.
 *
 * ── GROUPS, NOT PARAGRAPHS ─────────────────────────────────────────────────
 *
 * Wrap a block. Wrapping every `<p>` gives a page that assembles itself line by
 * line while the reader waits, and the brief rules it out for that reason. Use
 * `<Stagger>` when the children genuinely are a sequence.
 *
 * Under reduced motion this renders its children with no wrapper behaviour at
 * all: visible, immediately, no transform to undo.
 */
/* eslint-disable react/prop-types */
/**
 * @param {{ children?: any, as?: any, delay?: number, y?: number, blur?: boolean,
 *           className?: string, style?: any, [key: string]: any }} props
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 24,
  blur = true,
  className = '',
  style = undefined,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) { setShown(true); return undefined; }
    const el = ref.current;
    if (!el) return undefined;
    // Already on screen at mount (above the fold, or a deep link): show without
    // waiting for a scroll that may never come.
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        obs.unobserve(entry.target);
      },
      // -12% bottom margin so an element reveals just before it is fully in
      // view, rather than after the reader has already looked at it.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      data-motion-static=""
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translate3d(0,${y}px,0) scale(0.985)`,
        filter: blur && !shown ? 'blur(6px)' : 'none',
        transition: reduced
          ? 'none'
          : `opacity var(--duration-slow) var(--ease-standard) ${delay}ms,` +
            `transform var(--duration-slow) var(--ease-standard) ${delay}ms,` +
            `filter var(--duration-slow) var(--ease-standard) ${delay}ms`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * A sequence. One observer for the group, a per-child delay.
 *
 * `step` is 60ms by default: enough to read as ordered, short enough that the
 * last of six children is not 600ms behind the first. Anything above ~100ms and
 * a six-item grid feels like it is loading rather than arriving.
 */
export function Stagger({ children, step = 60, className = '', y = 20, ...rest }) {
  const items = React.Children.toArray(children);
  // Index as the key: `child.key` is not on the ReactNode union, and Stagger's
  // children are a static list that is never reordered, so index is stable.
  return (
    <div className={className} {...rest}>
      {items.map((child, i) => (
        <Reveal key={i} delay={i * step} y={y}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

export default Reveal;
