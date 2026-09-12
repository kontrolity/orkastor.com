import React, { useEffect, useRef } from 'react';

/**
 * ClusterLattice — the hero's 3D object.
 *
 * Two nested icosahedral graphs turning against each other, with work moving
 * along their edges as pulses. It is a cluster drawn the way this design draws
 * everything else: hairlines, points, and nothing filled.
 *
 * ── WHY A WIREFRAME AND NOT A RENDER ────────────────────────────────────────
 *
 * The mono language is lines. It has no gradients, no texture, no rounded
 * corners and no fills, so a shaded solid in the hero would be the one object
 * on the page made of something the rest of the page is not made of. A
 * wireframe graph is the language in three dimensions rather than an exception
 * to it — and a node graph is also literally what the product watches.
 *
 * ── WHY NOT three.js, WHICH IS ALREADY A DEPENDENCY ─────────────────────────
 *
 * Because it is not in this bundle. `three` is imported only by the legacy
 * `components/landing/*` tree, and nothing routes there, so it currently costs
 * the site zero bytes. Importing it here would pull ~150KB gzipped onto the
 * critical path of a marketing page to draw 42 lines and 24 dots.
 *
 * What this needs is a rotation, a perspective divide and a depth sort. That is
 * the whole renderer, it is a few KB, and it starts on the first frame instead
 * of after a chunk downloads.
 *
 * ── IT READS ITS COLOURS FROM THE THEME, ONCE ───────────────────────────────
 *
 * Canvas cannot inherit CSS. So the tokens are read with getComputedStyle on
 * mount and re-read when <html>'s class changes — which is exactly when
 * next-themes swaps the theme, and nowhere near often enough to matter. Reading
 * them every frame would put a forced style recalculation inside rAF.
 *
 * ── IT STOPS WHEN NOBODY IS WATCHING ────────────────────────────────────────
 *
 * Gated three ways: it never animates under prefers-reduced-motion (a resolved
 * still frame is drawn instead, so the object is still there), it stops when
 * scrolled out of view, and it stops when the tab is hidden.
 */

/** Pulses in flight along edges at any moment. */
const PULSES = 7;

/* Icosahedron vertices, from the golden ratio. Chosen over a cube or a grid
   because 12 vertices and 30 edges read as a MESH from every angle — a cube
   collapses into a square twice per rotation, and a lattice of parallel lines
   moirés against a hairline design. */
const PHI = (1 + Math.sqrt(5)) / 2;

function icosahedron() {
  const v = [];
  for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) {
    v.push({ x: 0, y: s1, z: s2 * PHI });
    v.push({ x: s1, y: s2 * PHI, z: 0 });
    v.push({ x: s1 * PHI, y: 0, z: s2 });
  }
  const n = Math.hypot(1, PHI);
  const verts = v.map((p) => ({ x: p.x / n, y: p.y / n, z: p.z / n }));

  /* Edges are DERIVED, not tabulated: on a unit icosahedron every edge is the
     same length, so the 30 shortest pairs are exactly the edges. A hand-typed
     index table is 30 chances to make a typo that renders as a plausible-
     looking but wrong solid. */
  const edges = [];
  let min = Infinity;
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const d = Math.hypot(verts[i].x - verts[j].x, verts[i].y - verts[j].y, verts[i].z - verts[j].z);
      if (d < min - 1e-9) min = d;
    }
  }
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const d = Math.hypot(verts[i].x - verts[j].x, verts[i].y - verts[j].y, verts[i].z - verts[j].z);
      if (Math.abs(d - min) < 1e-6) edges.push([i, j]);
    }
  }
  return { verts, edges };
}

/** Deterministic PRNG — the object must be the same drawing on every load. */
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `#RRGGBB` or `rgb()/rgba()` to `r,g,b`, for interpolating alpha in canvas. */
function rgbTriplet(css, fallback) {
  if (!css) return fallback;
  const s = css.trim();
  const hex = s.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }
  const fn = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (fn) return `${Math.round(+fn[1])},${Math.round(+fn[2])},${Math.round(+fn[3])}`;
  return fallback;
}

export function ClusterLattice({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g2 = cv.getContext('2d');
    if (!g2) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = rng(20260908);

    const outer = icosahedron();
    const inner = icosahedron();

    /* Pulses ride an edge from one end to the other, then pick another. Each
       carries which shell it is on, so the two graphs stay visually separate
       rather than reading as one cloud of moving dots. */
    const pulses = Array.from({ length: PULSES }, () => ({
      shell: rand() < 0.62 ? 0 : 1,
      edge: Math.floor(rand() * outer.edges.length),
      t: rand(),
      speed: 0.16 + rand() * 0.26,
      dir: rand() < 0.5 ? 1 : -1,
    }));

    /* Theme colours, read once and on theme change. See the header. */
    let INK = '22,23,26', LINE = '167,169,171', ACCENT = '0,26,208';
    const readTheme = () => {
      const cs = getComputedStyle(cv);
      INK = rgbTriplet(cs.getPropertyValue('--text'), INK);
      LINE = rgbTriplet(cs.getPropertyValue('--border'), LINE);
      ACCENT = rgbTriplet(cs.getPropertyValue('--ork-accent'), ACCENT);
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      g2.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const FOCAL = 4.4;
    function project(p, ax, ay, s) {
      const cy = Math.cos(ay), sy = Math.sin(ay);
      const X = p.x * cy + p.z * sy;
      let Z = -p.x * sy + p.z * cy;
      const cx = Math.cos(ax), sx = Math.sin(ax);
      const Y = p.y * cx - Z * sx;
      Z = p.y * sx + Z * cx;
      const d = FOCAL / (FOCAL - Z);
      return { x: w / 2 + X * s * d, y: h / 2 + Y * s * d, d };
    }

    /* Scroll only TILTS the object. It does not translate or scale it: the hero
       copy already parallaxes away on scroll, and a second element moving on
       the same input reads as the page coming apart. */
    let tilt = 0;
    const onScroll = () => {
      const r = cv.getBoundingClientRect();
      const through = 1 - Math.max(0, Math.min(1, (r.bottom) / (window.innerHeight + r.height)));
      tilt = through * 0.5;
    };
    onScroll();

    let raf = 0, t0 = 0, elapsed = 0, last = 0;
    const INTRO = 1.4;
    const ease = (u) => 1 - Math.pow(1 - u, 3);

    function step(dt) {
      for (const p of pulses) {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.shell = rand() < 0.62 ? 0 : 1;
          p.edge = Math.floor(rand() * outer.edges.length);
          p.speed = 0.16 + rand() * 0.26;
          p.dir = rand() < 0.5 ? 1 : -1;
        }
      }
    }

    function shell(graph, ax, ay, s, alphaScale) {
      const P = graph.verts.map((v) => project(v, ax, ay, s));

      // Edges, far to near, so a near edge sits over the ones behind it.
      const order = graph.edges
        .map((e) => ({ e, d: (P[e[0]].d + P[e[1]].d) / 2 }))
        .sort((a, b) => a.d - b.d);
      g2.lineWidth = 1;
      for (const { e, d } of order) {
        // Depth is carried by ALPHA, not by line width. A hairline design has
        // exactly one stroke weight; varying it is what makes a wireframe read
        // as a 3D render instead of as a drawing.
        g2.strokeStyle = `rgba(${LINE},${Math.min(0.85, 0.30 * d * d) * alphaScale})`;
        g2.beginPath();
        g2.moveTo(P[e[0]].x, P[e[0]].y);
        g2.lineTo(P[e[1]].x, P[e[1]].y);
        g2.stroke();
      }

      // Vertices.
      for (const p of P.slice().sort((a, b) => a.d - b.d)) {
        g2.beginPath();
        g2.arc(p.x, p.y, 1.9 * p.d, 0, Math.PI * 2);
        g2.fillStyle = `rgba(${INK},${Math.min(0.55, 0.20 * p.d * p.d) * alphaScale})`;
        g2.fill();
      }
      return P;
    }

    function draw(time) {
      g2.clearRect(0, 0, w, h);
      const intro = reduced ? 1 : ease(Math.min(1, time / INTRO));
      g2.globalAlpha = intro;

      const s = Math.min(w, h) * 0.34 * (0.94 + 0.06 * intro);
      const ay = reduced ? 0.7 : 0.7 + time * 0.10;
      const ax = -0.22 + tilt + (reduced ? 0 : Math.sin(time * 0.07) * 0.06);

      // The inner shell counter-rotates and sits smaller, which is what gives
      // the object depth without any shading: two rates of parallax.
      const Pout = shell(outer, ax, ay, s, 1);
      const Pin = shell(inner, ax * 0.9, -ay * 0.62, s * 0.52, 0.7);

      // Pulses. The only saturated thing in the object, and the only thing
      // that says the graph is live rather than decorative.
      for (const p of pulses) {
        const g = p.shell === 0 ? outer : inner;
        const P = p.shell === 0 ? Pout : Pin;
        const e = g.edges[p.edge % g.edges.length];
        const u = p.dir > 0 ? p.t : 1 - p.t;
        const a = P[e[0]], b = P[e[1]];
        const x = a.x + (b.x - a.x) * u;
        const y = a.y + (b.y - a.y) * u;
        const d = a.d + (b.d - a.d) * u;
        // A short trail, so direction is readable at a glance.
        const back = Math.max(0, u - 0.18);
        const bx = a.x + (b.x - a.x) * back;
        const by = a.y + (b.y - a.y) * back;
        const grad = g2.createLinearGradient(bx, by, x, y);
        grad.addColorStop(0, `rgba(${ACCENT},0)`);
        grad.addColorStop(1, `rgba(${ACCENT},${0.85 * d})`);
        g2.strokeStyle = grad;
        g2.lineWidth = 1.4;
        g2.beginPath();
        g2.moveTo(bx, by);
        g2.lineTo(x, y);
        g2.stroke();

        g2.beginPath();
        g2.arc(x, y, 2.1 * d, 0, Math.PI * 2);
        g2.fillStyle = `rgba(${ACCENT},${Math.min(1, 0.9 * d)})`;
        g2.fill();
      }
      g2.globalAlpha = 1;
    }

    function frame(now) {
      if (!t0) { t0 = now; last = now; }
      const dt = Math.min(0.05, (now - last) / 1000);  // a backgrounded tab
      last = now;                                       // must not teleport
      elapsed = (now - t0) / 1000;
      step(dt);
      draw(elapsed);
      raf = requestAnimationFrame(frame);
    }

    let visible = true;
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      t0 = performance.now() - elapsed * 1000;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.01 });
    io.observe(cv);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => { resize(); draw(elapsed); });
    ro.observe(cv);

    // Under reduced motion this is the only draw: a resolved frame, with the
    // pulses sitting mid-edge. The object is present; it does not move.
    draw(0);
    start();
    return () => {
      stop(); io.disconnect(); ro.disconnect(); themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Decorative. The hero states everything this shows, in words.
  return <canvas ref={ref} className={className} aria-hidden="true" role="presentation" />;
}

export default ClusterLattice;
