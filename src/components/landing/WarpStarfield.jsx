import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WarpStarfield — Three.js hyperspace / warp-speed starfield.
 *
 * Each "star" is a LineSegment (2 vertices) where the back vertex sits
 * one trail-length behind the front. As uTime advances, particle z drifts
 * toward the camera, then wraps. The shader computes everything from a
 * per-streak seed so the JS loop only bumps the time uniform — flat 60fps
 * with 3000 streaks on integrated GPUs.
 *
 * Props
 *   intensity — 0..1 global brightness multiplier (default 0.9)
 *   speed     — world units per second (default 18)
 *   className — extra classes on the wrapper
 */
const PARTICLE_COUNT = 3000;
const FRUSTUM_RADIUS = 15.0;    // radial spread of the streak cylinder
const Z_NEAR = -55.0;           // farthest spawn (negative = away from camera)
const Z_FAR  =  4.5;            // wrap point near the camera
const TRAIL_LEN = 1.6;          // streak length (world units, scales with depth in projection)

const VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aIsFront;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uTrail;
  uniform float uFrustum;
  uniform float uZNear;
  uniform float uZFar;
  uniform float uIntensity;

  varying float vBright;
  varying float vHue;

  // Stable per-seed hash → 3 floats in 0..1
  vec3 hash3(float s) {
    return fract(sin(vec3(s, s + 1.37, s + 2.71) * vec3(127.1, 311.7, 74.7)) * 43758.5453);
  }

  void main() {
    vec3 h = hash3(aSeed * 100.0);

    // Polar position — sqrt(r) for uniform area distribution across the disk
    float ang = h.x * 6.2831853;
    float r   = sqrt(h.y) * uFrustum;

    // Per-particle z drifts forward with time, wraps within [uZNear, uZFar]
    float zRange = uZFar - uZNear;
    float zNow   = mod(h.z * zRange + uTime * uSpeed, zRange) + uZNear;

    // Back vertex sits one trail-length behind the front
    float z = aIsFront > 0.5 ? zNow : zNow - uTrail;

    vec3 pos = vec3(cos(ang) * r, sin(ang) * r, z);
    vec4 mv  = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // ── Per-vertex brightness ────────────────────────────────────
    // Normalized depth: 0 = just spawned (far), 1 = at wrap point (near)
    float zT = clamp((zNow - uZNear) / zRange, 0.0, 1.0);

    // Brightness ramps up sharply as the streak approaches the camera
    float depthBright = pow(zT, 1.6);

    // Smooth fade-in just after spawn and fade-out just before wrap —
    // hides the discontinuity of the modulo, no visible "popping"
    float spawnFade = smoothstep(0.0, 0.05, zT);
    float wrapFade  = 1.0 - smoothstep(0.93, 1.0, zT);

    // Per-streak random brightness variation
    float jitter = 0.55 + h.x * 0.55;

    vBright = depthBright * spawnFade * wrapFade * jitter * uIntensity;
    vHue    = h.y; // pass a hue index to the fragment shader
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying float vBright;
  varying float vHue;

  void main() {
    // Palette — mostly white-cool, sparse warm accents for the chromatic
    // dispersion seen in classic hyperspace shots
    vec3 white   = vec3(1.00, 1.00, 1.00);
    vec3 cool    = vec3(0.62, 0.78, 1.00);
    vec3 cyan    = vec3(0.38, 0.92, 1.00);
    vec3 red     = vec3(1.00, 0.40, 0.32);
    vec3 magenta = vec3(1.00, 0.45, 0.85);

    vec3 col;
    if      (vHue < 0.50) col = white;                      // 50% pure white
    else if (vHue < 0.75) col = mix(white, cool,    0.55);  // 25% cool tint
    else if (vHue < 0.88) col = mix(white, cyan,    0.65);  // 13% cyan
    else if (vHue < 0.96) col = mix(white, red,     0.70);  // 8% warm red
    else                  col = mix(white, magenta, 0.70);  // 4% magenta

    col *= vBright;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function WarpStarfield({
  intensity = 0.9,
  speed     = 18,
  className = '',
}) {
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
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return; // CSS fallback shows through
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    camera.position.set(0, 0, 5);

    // ── Build the line geometry ─────────────────────────────────
    const N = PARTICLE_COUNT;
    const positions = new Float32Array(N * 2 * 3); // 2 verts/streak, init zero
    const aSeed     = new Float32Array(N * 2);
    const aIsFront  = new Float32Array(N * 2);

    for (let i = 0; i < N; i++) {
      const seed = (i + 0.5) / N;
      aSeed[i * 2 + 0] = seed;
      aSeed[i * 2 + 1] = seed;
      aIsFront[i * 2 + 0] = 0;   // back vertex
      aIsFront[i * 2 + 1] = 1;   // front vertex
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aSeed',    new THREE.BufferAttribute(aSeed, 1));
    geom.setAttribute('aIsFront', new THREE.BufferAttribute(aIsFront, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTime:      { value: 0 },
        uSpeed:     { value: speed },
        uTrail:     { value: TRAIL_LEN },
        uFrustum:   { value: FRUSTUM_RADIUS },
        uZNear:     { value: Z_NEAR },
        uZFar:      { value: Z_FAR },
        uIntensity: { value: intensity },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const streaks = new THREE.LineSegments(geom, mat);
    scene.add(streaks);

    // ── Faint central glow (the "vanishing point") ──────────────
    const glowGeom = new THREE.PlaneGeometry(3, 3);
    const glowMat  = new THREE.ShaderMaterial({
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
        uniform float uTime;
        void main() {
          vec2 c = vUv - 0.5;
          float d = length(c);
          float a = 1.0 - smoothstep(0.0, 0.5, d);
          a = pow(a, 3.5);
          float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
          vec3 col = mix(vec3(0.65, 0.60, 0.80), vec3(1.0, 0.70, 0.80), pulse);
          gl_FragColor = vec4(col, a * 0.40 * pulse);
        }
      `,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    glow.position.set(0, 0, -2);
    scene.add(glow);

    container.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = true, focused = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(container);
    const onVis = () => { focused = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    // Subtle parallax — cursor nudges the camera, makes the streaks
    // feel like they react to the viewer
    const target  = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointer = (e) => {
      const rect = container.getBoundingClientRect();
      target.x = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width  - 0.5, -0.5, 0.5);
      target.y = THREE.MathUtils.clamp((e.clientY - rect.top)  / rect.height - 0.5, -0.5, 0.5);
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

      // Lerp camera offset for parallax
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      camera.position.x = current.x * 0.8;
      camera.position.y = current.y * 0.8;
      camera.lookAt(current.x * 0.4, current.y * 0.4, 0);

      mat.uniforms.uTime.value     = t;
      glowMat.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      geom.dispose();
      mat.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [intensity, speed]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative w-full h-full ${className}`}
      style={{
        // CSS fallback — reduced-motion / WebGL fail
        background:
          'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 20%),' +
          '#06060a',
      }}
    />
  );
}
