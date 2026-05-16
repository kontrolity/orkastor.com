import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SpectralVortex — Three.js scene that renders a tilted spiral of glowing
 * rings receding into a bright orb. Matches the reference: violet/magenta
 * top, amber/orange bottom, near-black interior, white rim, arcing trails
 * overhead, soft halo behind the orb.
 *
 * Performance:
 *  - 16 rings, low-poly torus (24 × 96)
 *  - Transparent canvas, additive trails/halo, no postprocessing bloom
 *  - Pauses when off-screen and on tab blur
 *  - 60fps cap, DPR clamped, reduced-motion = static fallback
 */
const RING_COUNT     = 16;
const BASE_RADIUS    = 1.55;
const BASE_TUBE      = 0.17;
const SHRINK         = 0.88;

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vPosView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosView = mv.xyz;
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const ringFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vPosView;

  uniform float uTime;
  uniform float uIndex;
  uniform float uCount;
  uniform float uPhase;

  vec3 spectralAt(float t) {
    vec3 amber   = vec3(1.000, 0.420, 0.120);
    vec3 orange  = vec3(1.000, 0.380, 0.180);
    vec3 rose    = vec3(1.000, 0.360, 0.560);
    vec3 magenta = vec3(0.882, 0.306, 1.000);
    vec3 violet  = vec3(0.482, 0.302, 1.000);
    vec3 indigo  = vec3(0.300, 0.260, 0.700);
    vec3 dark    = vec3(0.020, 0.020, 0.040);
    t = clamp(t, 0.0, 1.0);
    if (t < 0.15) return mix(amber, orange, t / 0.15);
    if (t < 0.30) return mix(orange, rose, (t - 0.15) / 0.15);
    if (t < 0.50) return mix(rose, magenta, (t - 0.30) / 0.20);
    if (t < 0.70) return mix(magenta, violet, (t - 0.50) / 0.20);
    if (t < 0.85) return mix(violet, indigo, (t - 0.70) / 0.15);
    return mix(indigo, dark, (t - 0.85) / 0.15);
  }

  void main() {
    // u: around the major circle of the torus (0..1, wraps)
    // v: around the tube cross-section
    float u = vUv.x;
    float v = vUv.y;

    // Map the major circumference so amber sits at the bottom (u≈0.5),
    // violet/magenta sits at the top (u≈0.0/1.0). Add slow drift.
    float ang = u + uPhase + uTime * 0.04;
    // Symmetric distance to 0.5 → bottom is brightest amber
    float distFromBottom = abs(fract(ang) - 0.5) * 2.0; // 0 at bottom, 1 at top
    float t = distFromBottom;

    vec3 col = spectralAt(t);

    // Depth darkening — back rings dim slightly so the front feels closer
    float depth = uIndex / max(uCount - 1.0, 1.0);
    col *= mix(1.10, 0.55, depth);

    // Rim light using view-space normal — adds bright outer edge
    vec3 viewDir = normalize(-vPosView);
    float facing = abs(dot(vNormalView, viewDir));
    float rim = pow(1.0 - facing, 3.0);
    col += vec3(1.0, 0.88, 1.0) * rim * 0.55;

    // Tube cross-section fade — concentrates color at the outer "fat" of the ring
    float tube = sin(v * 3.14159);
    col *= 0.55 + tube * 0.7;

    // Subtle dither to kill banding
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dither - 0.5) / 200.0;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const orbVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const orbFragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;

  void main() {
    vec3 viewDir = normalize(-vPos);
    float facing = max(dot(vNormal, viewDir), 0.0);

    vec3 hot    = vec3(1.00, 0.98, 1.00);  // bright center
    vec3 pink   = vec3(1.00, 0.55, 0.85);  // mid
    vec3 violet = vec3(0.65, 0.50, 1.00);  // edge violet
    vec3 blue   = vec3(0.55, 0.70, 1.00);  // halo blue

    vec3 col = mix(violet, pink, smoothstep(0.0, 0.45, facing));
    col = mix(col, hot, smoothstep(0.55, 1.0, facing));
    col = mix(col, blue, (1.0 - facing) * 0.30);

    // Soft pulse
    col *= 0.95 + 0.05 * sin(uTime * 1.3);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    // soft falloff
    float inner = 1.0 - smoothstep(0.0, 0.50, d);
    inner = pow(inner, 1.8);
    vec3 col = mix(vec3(0.55, 0.70, 1.00), vec3(1.00, 0.85, 0.95), inner);
    float pulse = 0.88 + 0.12 * sin(uTime * 0.9);
    gl_FragColor = vec4(col, inner * 0.85 * pulse);
  }
`;

const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function SpectralVortex({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return; // CSS fallback shows
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // Position the orb (head of the spiral) up and to the right
    const orbPos = new THREE.Vector3(1.95, 1.55, -1.4);

    // Group containing everything (so we can tilt/animate as a whole)
    const root = new THREE.Group();
    scene.add(root);

    // ── Rings ───────────────────────────────────────────────────
    const rings = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const tParam = i / (RING_COUNT - 1);              // 0..1, 0 = largest at bottom-left
      const scale  = Math.pow(SHRINK, i);
      const radius = BASE_RADIUS * scale;
      const tube   = BASE_TUBE   * scale;

      const geom = new THREE.TorusGeometry(radius, tube, 24, 128);
      const mat  = new THREE.ShaderMaterial({
        vertexShader:   ringVertex,
        fragmentShader: ringFragment,
        uniforms: {
          uTime:  { value: 0 },
          uIndex: { value: i },
          uCount: { value: RING_COUNT },
          uPhase: { value: i * 0.05 },
        },
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(geom, mat);

      // Position along an arcing curve from bottom-left → orb
      const ease = Math.pow(tParam, 1.05);
      ring.position.x = THREE.MathUtils.lerp(-1.55, orbPos.x, ease);
      ring.position.y = THREE.MathUtils.lerp(-1.85, orbPos.y, ease);
      ring.position.z = THREE.MathUtils.lerp( 0.20, orbPos.z, ease);

      // Tilt: smallest rings (near orb) face more toward camera, larger ones tilt down/back
      const tilt = THREE.MathUtils.lerp(1.05, 0.55, ease);
      ring.rotation.x = tilt;                 // primary tilt — rings face up-toward-camera
      ring.rotation.y = -0.25 + ease * 0.55;  // sweep across to face orb direction
      ring.rotation.z = -0.42 + ease * 0.30;  // rotate the gradient orientation slightly

      root.add(ring);
      rings.push(ring);
    }

    // ── Orb (head) ──────────────────────────────────────────────
    const orbGeom = new THREE.SphereGeometry(0.36, 48, 48);
    const orbMat  = new THREE.ShaderMaterial({
      vertexShader:   orbVertex,
      fragmentShader: orbFragment,
      uniforms: { uTime: { value: 0 } },
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);
    orb.position.copy(orbPos);
    root.add(orb);

    // ── Halo behind orb (additive billboard) ───────────────────
    const haloGeom = new THREE.PlaneGeometry(2.6, 2.6);
    const haloMat  = new THREE.ShaderMaterial({
      vertexShader:   haloVertex,
      fragmentShader: haloFragment,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.position.copy(orbPos);
    halo.position.z -= 0.05; // sit slightly behind the orb
    root.add(halo);

    // ── Arcing trail lines ──────────────────────────────────────
    const makeArc = (offsetX, offsetY, offsetZ, opacity = 0.6, thick = 0.013) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.20 + offsetX, -2.00 + offsetY, 0.30 + offsetZ),
        new THREE.Vector3(-1.10 + offsetX,  0.20 + offsetY, 0.20 + offsetZ),
        new THREE.Vector3( 0.30 + offsetX,  1.60 + offsetY, -0.40 + offsetZ),
        new THREE.Vector3( 1.50 + offsetX,  1.80 + offsetY, -1.10 + offsetZ),
        orbPos.clone(),
      ]);
      const geom = new THREE.TubeGeometry(curve, 96, thick, 8, false);
      const mat  = new THREE.MeshBasicMaterial({
        color:       0xffffff,
        transparent: true,
        opacity,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      });
      return new THREE.Mesh(geom, mat);
    };
    const arcs = [
      makeArc( 0.00,  0.05,  0.00, 0.65, 0.016),
      makeArc( 0.35,  0.25, -0.15, 0.42, 0.010),
      makeArc(-0.30,  0.18,  0.18, 0.40, 0.010),
      makeArc( 0.18, -0.12,  0.30, 0.32, 0.009),
    ];
    arcs.forEach(a => root.add(a));

    // ── Soft floor glow under the spiral ───────────────────────
    const floorGeom = new THREE.PlaneGeometry(6, 3);
    const floorMat  = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        void main() {
          vec2 c = vUv - vec2(0.5, 0.6);
          float d = length(c * vec2(0.9, 1.4));
          float a = 1.0 - smoothstep(0.0, 0.55, d);
          a = pow(a, 1.6);
          vec3 col = mix(vec3(1.0, 0.45, 0.20), vec3(0.65, 0.30, 1.0), smoothstep(0.0, 0.6, vUv.x));
          gl_FragColor = vec4(col, a * 0.55);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.position.set(-0.3, -2.4, 0.2);
    floor.rotation.x = -0.25;
    root.add(floor);

    // Initial root tilt — matches reference camera angle
    root.rotation.x = -0.06;
    root.rotation.z =  0.04;

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
      // Scale the scene down on tall (portrait) viewports so the orb stays in frame
      const fit = camera.aspect >= 1 ? 1 : Math.max(camera.aspect, 0.45);
      root.scale.setScalar(fit);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = true, focused = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(container);
    const onVis = () => { focused = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    // Pointer-driven parallax — gentle drift
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointer = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;
      target.x = THREE.MathUtils.clamp(cx, -0.5, 0.5);
      target.y = THREE.MathUtils.clamp(cy, -0.5, 0.5);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const start = performance.now();
    let raf, last = 0;
    const FRAME_MS = 1000 / 60;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !focused) return;
      if (now - last < FRAME_MS) return;
      last = now;
      const t = (now - start) / 1000;

      // Lerp parallax
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      root.rotation.y = current.x * 0.20 + Math.sin(t * 0.08) * 0.04;
      root.rotation.x = -0.06 + current.y * 0.12 + Math.sin(t * 0.06) * 0.025;

      // Update ring shaders — sweep the spectral gradient
      for (let i = 0; i < rings.length; i++) {
        const u = rings[i].material.uniforms;
        u.uTime.value  = t;
        u.uPhase.value = i * 0.05 + t * 0.045;
      }

      orbMat.uniforms.uTime.value  = t;
      haloMat.uniforms.uTime.value = t;

      // Orb breath
      const breath = 1.0 + Math.sin(t * 1.2) * 0.06;
      orb.scale.setScalar(breath);
      const haloBreath = 1.0 + Math.sin(t * 0.85) * 0.10;
      halo.scale.setScalar(haloBreath);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      rings.forEach(r => { r.geometry.dispose(); r.material.dispose(); });
      orb.geometry.dispose();   orb.material.dispose();
      halo.geometry.dispose();  halo.material.dispose();
      floor.geometry.dispose(); floor.material.dispose();
      arcs.forEach(a => { a.geometry.dispose(); a.material.dispose(); });
      renderer.dispose();
      if (canvasEl.parentNode === container) container.removeChild(canvasEl);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative w-full h-full ${className}`}
      style={{
        // CSS fallback (reduced-motion / WebGL fail) — radial spectral wash
        background:
          'radial-gradient(circle at 78% 22%, rgba(255,200,230,0.5), transparent 18%),' +
          'radial-gradient(circle at 65% 60%, rgba(123,77,255,0.35), transparent 50%),' +
          'radial-gradient(ellipse at 35% 90%, rgba(255,138,61,0.30), transparent 55%)',
      }}
    />
  );
}
