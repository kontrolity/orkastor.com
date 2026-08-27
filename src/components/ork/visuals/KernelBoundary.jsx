import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * THE SIGNATURE INTERACTION. Two architectures, one draggable divider.
 *
 * Left: containers sharing the host kernel. Right: one microVM per environment,
 * each with its own guest kernel. Dragging the divider reveals more of one.
 *
 * ── IT IS AN <input type="range">, AND THAT IS THE WHOLE ACCESSIBILITY STORY ─
 *
 * The obvious build is a div with pointerdown/move/up. That gives you something
 * no keyboard can move, no screen reader can announce, and no touch device
 * handles without fighting the page scroll.
 *
 * A visually-hidden range input over the full width gets, for free: arrow-key
 * stepping, Home/End, a real focus ring, an announced value, and correct touch
 * behaviour including not stealing vertical scroll. The visible divider is
 * painted from its value. This is the one control on the site that would have
 * been genuinely inaccessible if built the obvious way.
 *
 * ── MOBILE ─────────────────────────────────────────────────────────────────
 *
 * The diagram stays legible at any divider position, and both labels are always
 * rendered. Under reduced motion the divider sits at 50% and the transition is
 * removed — the comparison is a static side-by-side, which still communicates.
 */
export function KernelBoundary({ className = '' }) {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(52);
  const wrapRef = useRef(null);

  // Nudge toward the microVM side once, on first view, to hint it is draggable.
  const [hinted, setHinted] = useState(false);
  useEffect(() => {
    if (reduced || hinted) return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setHinted(true);
      const t = window.setTimeout(() => setPos(64), 420);
      return () => window.clearTimeout(t);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, hinted]);

  const onKeyHint = useCallback(() => {}, []);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative' }}>
      <div
        style={{
          position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          border: '1px solid var(--border)', background: 'var(--surface)',
        }}
      >
        <svg viewBox="0 0 720 268" role="img" aria-labelledby="kb-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <title id="kb-title">
            A comparison of two architectures. Container environments share one host kernel
            through namespaces. Each Orkastor Cloud environment runs in its own microVM with its
            own guest kernel, above a host kernel neither reaches. Drag the divider to reveal
            more of either.
          </title>

          {/*
            TWO FULL-WIDTH LAYERS, STACKED, TOP ONE CLIPPED. This is what a
            reveal slider is, and the first attempt was not: it drew the two
            architectures side by side in different x ranges and then clipped,
            so the divider cut through the middle of the microVM diagram's words
            and read as broken text rather than as a wipe.

            Both compositions now occupy the same 720-wide canvas and are
            centred in it, so any divider position shows a coherent left and a
            coherent right.
          */}

          {/* ── LAYER 1 (under): containers on one shared kernel ─────────── */}
          <g>
            <text x="30" y="28" className="ork-mono" fill="var(--text-3)" fontSize="9" letterSpacing="1.4">CONTAINER ENVIRONMENT</text>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={30 + i * 166} y="48" width="150" height="62" rx="6" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
                <text x={105 + i * 166} y="72" textAnchor="middle" fill="var(--text-2)" fontSize="9.5">app {i + 1}</text>
                <text x={105 + i * 166} y="90" textAnchor="middle" fill="var(--text-3)" fontSize="7.5" letterSpacing="0.9">namespace</text>
                <line x1={105 + i * 166} y1="110" x2={105 + i * 166} y2="132" stroke="rgba(248,113,113,0.42)" strokeWidth="1" />
              </g>
            ))}
            <rect x="30" y="132" width="660" height="36" rx="6" fill="rgba(248,113,113,0.07)" stroke="rgba(248,113,113,0.42)" strokeWidth="1" />
            <text x="360" y="155" textAnchor="middle" fill="var(--warn)" fontSize="10" fontWeight="600" letterSpacing="1.2">ONE SHARED HOST KERNEL</text>
            <text x="30" y="196" fill="var(--text-3)" fontSize="8.5">A namespace is a scheduling construct. It was never designed to hold</text>
            <text x="30" y="211" fill="var(--text-3)" fontSize="8.5">against code that is actively trying to leave.</text>
          </g>

          {/* ── LAYER 2 (over, clipped): one microVM per environment ─────── */}
          <defs>
            <clipPath id="kbClip">
              <rect x={(pos / 100) * 720} y="0" width={Math.max(0, 720 - (pos / 100) * 720)} height="268" />
            </clipPath>
          </defs>
          <g clipPath="url(#kbClip)">
            <rect x="0" y="0" width="720" height="268" fill="var(--surface)" />
            <text x="30" y="28" className="ork-mono" fill="var(--cloud-text)" fontSize="9" letterSpacing="1.4">ORKASTOR ENVIRONMENT</text>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={30 + i * 166} y="48" width="150" height="120" rx="8" fill="rgba(72,203,203,0.05)" stroke="var(--cloud)" strokeWidth="1.3" />
                <text x={105 + i * 166} y="68" textAnchor="middle" fill="var(--text-2)" fontSize="9">env {String.fromCharCode(65 + i)}</text>
                {['web', 'api', 'db'].map((svc, j) => (
                  <g key={svc}>
                    <rect x={40 + i * 166 + j * 44} y="80" width="38" height="19" rx="4" fill="rgba(72,203,203,0.12)" stroke="rgba(72,203,203,0.38)" strokeWidth="0.7" />
                    <text x={59 + i * 166 + j * 44} y="93" textAnchor="middle" fill="var(--text-2)" fontSize="7">{svc}</text>
                  </g>
                ))}
                <rect x={40 + i * 166} y="110" width="130" height="24" rx="4" fill="rgba(72,203,203,0.17)" stroke="var(--cloud)" strokeWidth="0.9" />
                <text x={105 + i * 166} y="126" textAnchor="middle" fill="var(--cloud-text)" fontSize="7" fontWeight="600" letterSpacing="0.7">ITS OWN GUEST KERNEL</text>
                <text x={105 + i * 166} y="152" textAnchor="middle" fill="var(--text-3)" fontSize="7.5" letterSpacing="1.1">MICROVM</text>
              </g>
            ))}
            <rect x="30" y="132" width="660" height="36" rx="6" fill="none" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 4" opacity="0" />
            <text x="30" y="196" fill="var(--text-3)" fontSize="8.5">Bare metal below, whose host kernel none of them reaches. A container escape</text>
            <text x="30" y="211" fill="var(--text-3)" fontSize="8.5">lands the attacker inside their own kernel, not on the host.</text>
          </g>

          {/* The divider. */}
          <line x1={(pos / 100) * 720} y1="0" x2={(pos / 100) * 720} y2="268" stroke="var(--cloud)" strokeWidth="1.6"
                style={{ transition: reduced ? 'none' : 'all 320ms var(--ease-standard)' }} />
          <circle cx={(pos / 100) * 720} cy="238" r="13" fill="var(--surface)" stroke="var(--cloud)" strokeWidth="1.4"
                  style={{ transition: reduced ? 'none' : 'all 320ms var(--ease-standard)' }} />
          <text x={(pos / 100) * 720} y="242" textAnchor="middle" fill="var(--cloud-text)" fontSize="11"
                style={{ transition: reduced ? 'none' : 'all 320ms var(--ease-standard)' }}>⇄</text>
        </svg>

        {/* The real control. Visually hidden, fully functional, spans the box. */}
        <input
          type="range"
          min="14" max="86" step="1"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          onKeyDown={onKeyHint}
          aria-label="Reveal more of the container architecture or the Orkastor microVM architecture"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'ew-resize', margin: 0,
            // `touch-action: pan-y` lets a vertical swipe still scroll the page,
            // which a plain drag handler would have swallowed.
            touchAction: 'pan-y',
          }}
        />
      </div>

      <p className="ork-small mt-3" style={{ color: 'var(--text-3)' }}>
        Drag, or use the arrow keys. Not a scorecard against a named competitor — two
        architectures, either of which can be the right one.
      </p>
    </div>
  );
}

export default KernelBoundary;
