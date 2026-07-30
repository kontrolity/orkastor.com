import React, { useEffect, useRef } from 'react';

/**
 * PixelField — generative pixel-mosaic band, motion-matched to the
 * reference capture: a turbulent plume streaming diagonally up-right
 * with hot chains along its spine, streak-aligned speckle in the calm
 * zone, a persistent cursor hotspot (core → rim → halo), and a ragged
 * dissolving bottom edge over a fully covered field.
 *
 * Two anisotropic noise fields drive it:
 *   plume  — low-frequency mass that defines the warm region
 *   streak — high-frequency, advected faster along the same diagonal;
 *            carves speckle clusters and the hot chains
 *
 * Perf: single canvas at 30fps, pauses offscreen; reduced motion
 * renders one static frame.
 */

const CELL = 13;
const GAP = 1;
const FPS = 30;

/* palette (brand mapping of the reference's blue/black/yellow/red/lime) */
const C_BASE = '#F0E8DB';   // sand base field
const C_INK = '#1E212A';    // speckle clusters
const C_AMBER = '#F5A623';  // plume mass
const C_ORANGE = '#FF7A1F'; // plume ridge
const C_RED = '#DC2828';    // hot chains / hotspot core
const C_GREEN = '#7ED957';  // rim accents

function makeNoise() {
  const hash = (x, y) => {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >> 13)) * 1274126177;
    return (((h ^ (h >> 16)) >>> 0) % 1024) / 1024;
  };
  const smooth = (t) => t * t * (3 - 2 * t);
  const layer = (x, y) => {
    const xi = Math.floor(x); const yi = Math.floor(y);
    const xf = smooth(x - xi); const yf = smooth(y - yi);
    const a = hash(xi, yi); const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1); const d = hash(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x, y) =>
    0.60 * layer(x, y) +
    0.28 * layer(x * 2.03 + 40, y * 2.03 + 40) +
    0.12 * layer(x * 4.1 + 90, y * 4.1 + 90);
}

function cellJitter(i, j) {
  let h = (i * 7349 + j * 9151) | 0;
  h = (h ^ (h >> 11)) * 2654435761;
  return ((((h ^ (h >> 15)) >>> 0) % 1000) / 1000 - 0.5);
}

export default function PixelField({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const noise = makeNoise();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let running = false;
    let last = 0;
    let W = 0; let H = 0; let cols = 0; let rows = 0;
    const pointer = { x: -1e5, y: -1e5, heat: 0 };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
    };

    const draw = (now) => {
      const T = now * 0.001; // seconds
      ctx.clearRect(0, 0, W, H);

      for (let j = 0; j < rows; j++) {
        const yNorm = j / rows;
        for (let i = 0; i < cols; i++) {
          // ragged bottom teeth (transparent below a wobbling boundary)
          const edge = 0.68 + 0.28 * noise(i * 0.11 + 31.7, T * 0.35);
          if (yNorm > edge) continue;

          // 45° flow coordinates: u along the up-right diagonal
          const u = (i + j) * 0.5;
          const w = (j - i) * 0.5;
          const jit = cellJitter(i, j);

          // plume mass — drifts along the diagonal, slowly evolving
          let p = noise(u * 0.085 - T * 0.55, w * 0.19 + T * 0.06);
          p += (i / cols) * 0.14 - 0.04 + jit * 0.10;

          // streak field — same direction, advected ~2.5× faster,
          // squashed across-flow so features elongate into streaks
          const s = noise(u * 0.20 - T * 1.35, w * 0.55 + 7.3) + jit * 0.14;

          // color decision, reference structure:
          let color;
          if (p < 0.46) {
            color = s > 0.64 ? C_INK : C_BASE;            // calm zone + speckle
          } else if (p < 0.60) {
            color = s > 0.46 ? C_AMBER : C_BASE;          // dithered plume edge
          } else {
            if (s > 0.90 && p > 0.72) color = C_GREEN;    // rare rim sparks
            else if (s > 0.70) color = C_RED;             // hot chains on spine
            else if (s > 0.56) color = C_ORANGE;          // ridge
            else color = C_AMBER;                          // plume body
          }

          // cursor hotspot — persistent rings: core / rim / halo
          if (pointer.heat > 0.02) {
            const dx = i * CELL + CELL / 2 - pointer.x;
            const dy = j * CELL + CELL / 2 - pointer.y;
            const h = pointer.heat * Math.exp(-(dx * dx + dy * dy) / 7000);
            if (h > 0.62) color = C_RED;
            else if (h > 0.42) color = C_GREEN;
            else if (h > 0.22) color = C_AMBER;
          }

          ctx.fillStyle = color;
          ctx.fillRect(i * CELL, j * CELL, CELL - GAP, CELL - GAP);
        }
      }
      if (pointer.heat > 0 && pointer.heat < 1) pointer.heat *= 0.94;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    resize();
    draw(400); // first paint (only paint under reduced motion)

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduced) {
        if (!running) { running = true; raf = requestAnimationFrame(loop); }
      } else if (running) {
        running = false; cancelAnimationFrame(raf);
      }
    }, { threshold: 0.05 });
    io.observe(canvas);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.heat = 1;             // held at full strength while hovering
    };
    const onLeave = () => { pointer.heat = 0.99; }; // start decay
    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave, { passive: true });

    const ro = new ResizeObserver(() => { resize(); draw(last || 400); });
    ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
