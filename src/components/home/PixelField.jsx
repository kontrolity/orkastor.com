import React, { useEffect, useRef } from 'react';

/**
 * PixelField — generative pixel-mosaic band (inspired by dithered
 * heatmap art). A grid of cells colored by layered value noise that
 * drifts over time, with a ragged dissolving bottom edge and a
 * cursor-reactive hotspot. Rendered in brand colors so it reads as
 * cluster telemetry: ink field, warm signal ridges, red incident
 * hotspots, rare green "resolved" sparks.
 *
 * Perf: single canvas, ~2–3k fillRects/frame at 24fps, paused when
 * offscreen. prefers-reduced-motion renders one static frame.
 */

const CELL = 13;      // cell pitch (px)
const GAP = 1;        // gap between cells
const FPS = 24;

// value → color ramp (paper stays transparent below the floor)
function ramp(v) {
  if (v < 0.40) return null;
  if (v < 0.58) return '#1E212A';   // ink
  if (v < 0.74) return '#F5A623';   // amber
  if (v < 0.88) return '#FF7A1F';   // orange
  if (v < 0.95) return '#DC2828';   // red hotspot
  return '#4ADE80';                 // green core — the fix landing
}

/* Static per-cell hash for dither jitter — granular color mixing at
   band boundaries, like classic ordered dithering. */
function cellJitter(i, j) {
  let h = (i * 7349 + j * 9151) | 0;
  h = (h ^ (h >> 11)) * 2654435761;
  return ((((h ^ (h >> 15)) >>> 0) % 1000) / 1000 - 0.5) * 0.16;
}

/* Cheap deterministic value noise: hash → smooth bilinear, 3 octaves */
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
    0.55 * layer(x, y) +
    0.30 * layer(x * 2.1 + 40, y * 2.1 + 40) +
    0.15 * layer(x * 4.3 + 90, y * 4.3 + 90);
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
    const pointer = { x: -1, y: -1, heat: 0 };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const tz = t * 0.000045;
      for (let j = 0; j < rows; j++) {
        const yNorm = j / rows;
        for (let i = 0; i < cols; i++) {
          // drifting field, sheared so ridges travel diagonally
          let v = noise(i * 0.055 + tz * 14, j * 0.11 - tz * 5 + i * 0.012);
          v += cellJitter(i, j);                 // dither grain
          v += (1 - yNorm) * 0.11;               // fuller toward the top edge
          // ragged bottom: fade with a noise-modulated boundary
          const edge = 0.62 + 0.33 * noise(i * 0.09 + 31.7, tz * 8);
          if (yNorm > edge) continue;
          v *= 1 - Math.max(0, (yNorm - (edge - 0.28)) / 0.28) * 0.75;
          // cursor heat
          if (pointer.heat > 0.01) {
            const dx = i * CELL - pointer.x; const dy = j * CELL - pointer.y;
            const d2 = dx * dx + dy * dy;
            v += pointer.heat * Math.exp(-d2 / 5200) * 0.55;
          }
          const color = ramp(v);
          if (!color) continue;
          ctx.fillStyle = color;
          ctx.fillRect(i * CELL, j * CELL, CELL - GAP, CELL - GAP);
        }
      }
      pointer.heat *= 0.96;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    resize();
    draw(1); // first paint (also the only paint under reduced motion)

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
      pointer.heat = 1;
    };
    const onLeave = () => { pointer.heat = 0.4; };
    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave, { passive: true });

    const ro = new ResizeObserver(() => { resize(); draw(last || 1); });
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
