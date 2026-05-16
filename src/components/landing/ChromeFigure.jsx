import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

/**
 * ChromeFigure — Three.js Marching Cubes metaball bust.
 *
 * 6 metaballs stacked vertically suggest a head + neck + shoulders +
 * torso silhouette without modelling an actual human. A procedurally
 * generated chrome matcap gives the polished-mirror look on a black
 * background. Slow rotation + subtle breath = "alive but moody."
 *
 * Aesthetic match for the reference image (chrome humanoid bust on
 * void). Not photorealistic — captures the vibe.
 *
 * Performance:
 *  - MarchingCubes resolution 44 (~85k cells, single draw call)
 *  - Matcap material: no env map, no lights, no shadows — extremely cheap
 *  - IntersectionObserver pause, tab-blur pause, DPR clamp, 60fps cap
 *  - prefers-reduced-motion → single rendered frame, no rAF loop
 */
function generateChromeMatcap() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Pure black background outside the sphere
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);

  // ── Mid-tone sphere base (ambient) ───────────────────────────
  const base = ctx.createRadialGradient(size/2, size/2, size*0.08, size/2, size/2, size*0.5);
  base.addColorStop(0.0, '#8E929A');
  base.addColorStop(0.5, '#383D44');
  base.addColorStop(0.85, '#0A0C10');
  base.addColorStop(1.0, '#000000');
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();

  // ── Primary key light: top-left, large soft highlight ─────────
  const key = ctx.createRadialGradient(size*0.30, size*0.22, 0, size*0.30, size*0.22, size*0.33);
  key.addColorStop(0.0, 'rgba(255,255,255,1.00)');
  key.addColorStop(0.35, 'rgba(232,240,252,0.65)');
  key.addColorStop(0.7, 'rgba(160,180,210,0.18)');
  key.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = key;
  ctx.fillRect(0, 0, size, size);

  // ── Cool fill light: top-right ────────────────────────────────
  const fill = ctx.createRadialGradient(size*0.72, size*0.20, 0, size*0.72, size*0.20, size*0.22);
  fill.addColorStop(0.0, 'rgba(180,200,235,0.65)');
  fill.addColorStop(0.6, 'rgba(120,140,180,0.20)');
  fill.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, size, size);

  // ── Bottom rim: warm key from below right ─────────────────────
  const rim = ctx.createRadialGradient(size*0.68, size*0.86, 0, size*0.68, size*0.86, size*0.30);
  rim.addColorStop(0.0, 'rgba(255,245,235,0.55)');
  rim.addColorStop(0.6, 'rgba(200,180,160,0.18)');
  rim.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);

  // ── Sharp specular dots (mirror finish) ───────────────────────
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.beginPath(); ctx.arc(size*0.31, size*0.18, size*0.025, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(220,230,250,0.85)';
  ctx.beginPath(); ctx.arc(size*0.70, size*0.16, size*0.014, 0, Math.PI*2); ctx.fill();

  // ── Bottom black grounding (dark base shadow) ─────────────────
  const dark = ctx.createRadialGradient(size*0.45, size*0.95, 0, size*0.45, size*0.95, size*0.22);
  dark.addColorStop(0.0, 'rgba(0,0,0,0.85)');
  dark.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, size, size);

  // ── Clip to circular sphere shape ─────────────────────────────
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ── Metaball layout: head + neck + shoulders + torso ─────────── */
function placeBustBalls(effect, t) {
  effect.reset();
  const subtract = 12;
  const breath = Math.sin(t * 0.55) * 0.010;        // chest rise
  const sway   = Math.sin(t * 0.30) * 0.008;        // gentle x sway

  // Head (top)
  effect.addBall(0.50 + sway, 0.84 + breath * 0.3, 0.50, 0.155, subtract);
  // Jaw / chin connector
  effect.addBall(0.50 + sway, 0.72, 0.50, 0.090, subtract);
  // Neck
  effect.addBall(0.50 + sway, 0.63, 0.50, 0.065, subtract);
  // Left shoulder
  effect.addBall(0.33, 0.49 + breath, 0.50, 0.135, subtract);
  // Right shoulder
  effect.addBall(0.67, 0.49 + breath, 0.50, 0.135, subtract);
  // Chest
  effect.addBall(0.50, 0.45 + breath, 0.50, 0.180, subtract);
  // Torso lower
  effect.addBall(0.50, 0.25, 0.50, 0.190, subtract);
}

export default function ChromeFigure({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // ── Chrome matcap material ─────────────────────────────────
    const matcap = generateChromeMatcap();
    const material = new THREE.MeshMatcapMaterial({ matcap });

    // ── Marching cubes bust ────────────────────────────────────
    const resolution = 44;
    const effect = new MarchingCubes(resolution, material, true, false, 100000);
    effect.scale.set(2.0, 2.6, 2.0);
    effect.position.set(0, -0.2, 0);
    effect.isolation = 80;
    scene.add(effect);

    container.appendChild(renderer.domElement);
    const canvasEl = renderer.domElement;
    canvasEl.style.width  = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // On portrait viewports, scale down so the figure fits
      const fit = camera.aspect >= 1 ? 1 : Math.max(camera.aspect, 0.55);
      effect.scale.set(2.0 * fit, 2.6 * fit, 2.0 * fit);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = true, focused = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(container);
    const onVis = () => { focused = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    // Cursor parallax — small rotational nudge
    const target  = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointer = (e) => {
      const rect = container.getBoundingClientRect();
      target.x = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width  - 0.5, -0.5, 0.5);
      target.y = THREE.MathUtils.clamp((e.clientY - rect.top)  / rect.height - 0.5, -0.5, 0.5);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const renderFrame = (t) => {
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      effect.rotation.y = t * 0.10 + current.x * 0.45;
      effect.rotation.x = current.y * 0.18 + Math.sin(t * 0.20) * 0.025;

      placeBustBalls(effect, t);
      effect.update();

      renderer.render(scene, camera);
    };

    const start = performance.now();
    let raf, last = 0;
    const FRAME_MS = 1000 / 60;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !focused) return;
      if (now - last < FRAME_MS) return;
      last = now;
      renderFrame((now - start) / 1000);
    };

    if (reduceMotion) {
      // Single static frame
      renderFrame(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      matcap.dispose();
      material.dispose();
      // MarchingCubes uses internal buffer geometry; dispose if present
      if (effect.geometry) effect.geometry.dispose();
      renderer.dispose();
      if (canvasEl.parentNode === container) container.removeChild(canvasEl);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative w-full h-full ${className}`}
      style={{ background: '#000' }}
    />
  );
}
