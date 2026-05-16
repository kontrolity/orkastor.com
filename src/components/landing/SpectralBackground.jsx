import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SpectralBackground — fullscreen-quad WebGL shader that renders
 * a slow, iridescent dispersion using simplex noise + the spectral
 * palette. Designed to feel "futuristic / 3D" without the cost of a
 * full scene. Renders only when on-screen (IntersectionObserver),
 * pauses on tab blur, throttles to 30fps, falls back gracefully if
 * WebGL is unavailable.
 *
 * Props
 *   intensity   — 0..1 (default 1)
 *   pointerLerp — 0..1 lerp speed for pointer follow (default 0.06)
 *   className   — extra classes for the wrapper
 */
const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uPointer;     // 0..1
  uniform float uIntensity;

  // ── Simplex noise (Ian McEwan / Stefan Gustavson) ──
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  // Spectral palette stops — sampled smoothly
  vec3 spectral(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 amber   = vec3(1.000, 0.541, 0.239);
    vec3 rose    = vec3(1.000, 0.365, 0.561);
    vec3 magenta = vec3(0.882, 0.306, 1.000);
    vec3 violet  = vec3(0.482, 0.302, 1.000);
    vec3 indigo  = vec3(0.357, 0.424, 1.000);
    vec3 cyan    = vec3(0.220, 0.741, 0.972);
    vec3 teal    = vec3(0.176, 0.831, 0.749);

    if (t < 0.16) return mix(amber, rose, t / 0.16);
    if (t < 0.33) return mix(rose, magenta, (t - 0.16) / 0.17);
    if (t < 0.50) return mix(magenta, violet, (t - 0.33) / 0.17);
    if (t < 0.66) return mix(violet, indigo, (t - 0.50) / 0.16);
    if (t < 0.83) return mix(indigo, cyan,   (t - 0.66) / 0.17);
    return mix(cyan, teal, (t - 0.83) / 0.17);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p  = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.04;
    vec2 q  = vec2(fbm(p * 1.5 + t),
                   fbm(p * 1.5 - t + 5.2));
    vec2 r  = vec2(fbm(p * 1.5 + q + vec2(1.7, 9.2) + t * 0.6),
                   fbm(p * 1.5 + q + vec2(8.3, 2.8) - t * 0.6));
    float n = fbm(p * 1.5 + r);

    // Pointer pulls the gradient toward the cursor
    vec2 pp = (uPointer - 0.5);
    pp.x *= uResolution.x / uResolution.y;
    float pd = exp(-length(p - pp) * 1.5);

    float hue = clamp(n * 0.5 + 0.5 + pd * 0.15, 0.0, 1.0);

    vec3 col = spectral(hue);

    // Soft falloff toward edges — keeps the void floor visible
    float radial = smoothstep(1.0, 0.0, length(p) * 0.85);
    col *= radial;

    // Mix into the deep void base so the wash sits over black
    vec3 voidBase = vec3(0.024, 0.024, 0.035);
    float blend  = 0.45 + 0.35 * radial;
    vec3 final   = mix(voidBase, col, blend * uIntensity);

    // Subtle dithering — kills banding on dark sections
    float dither = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    final += (dither - 0.5) / 255.0;

    gl_FragColor = vec4(final, 1.0);
  }
`;

export default function SpectralBackground({
  intensity = 1,
  pointerLerp = 0.06,
  className = '',
}) {
  const containerRef = useRef(null);
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    mesh: null,
    uniforms: null,
    raf: 0,
    last: 0,
    pointer: { x: 0.5, y: 0.5 },
    target:  { x: 0.5, y: 0.5 },
    visible: true,
    focused: true,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reduced motion → skip WebGL, the CSS mesh handles fallback
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return; // graceful: container shows CSS mesh fallback
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime:       { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer:    { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity:  { value: intensity },
    };

    const geom = new THREE.PlaneGeometry(2, 2);
    const mat  = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:   VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width  = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    stateRef.current = {
      ...stateRef.current,
      renderer, scene, camera, mesh, uniforms,
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointer = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      stateRef.current.target.x = Math.min(Math.max(x, 0), 1);
      stateRef.current.target.y = Math.min(Math.max(y, 0), 1);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => { stateRef.current.visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisChange = () => { stateRef.current.focused = !document.hidden; };
    document.addEventListener('visibilitychange', onVisChange);

    const FRAME_MS = 1000 / 60;
    const start = performance.now();
    const loop = (now) => {
      stateRef.current.raf = requestAnimationFrame(loop);
      if (!stateRef.current.visible || !stateRef.current.focused) return;
      if (now - stateRef.current.last < FRAME_MS) return;
      stateRef.current.last = now;

      const s = stateRef.current;
      s.pointer.x += (s.target.x - s.pointer.x) * pointerLerp;
      s.pointer.y += (s.target.y - s.pointer.y) * pointerLerp;
      uniforms.uPointer.value.set(s.pointer.x, s.pointer.y);
      uniforms.uTime.value = (now - start) / 1000;
      renderer.render(scene, camera);
    };
    stateRef.current.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisChange);
      io.disconnect();
      ro.disconnect();
      geom.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [intensity, pointerLerp]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`spectral-bg-root absolute inset-0 overflow-hidden ${className}`}
      style={{
        // CSS fallback (reduced-motion or WebGL fail) — keeps the vibe
        background:
          'radial-gradient(ellipse 60% 50% at 18% 22%, rgba(255,138,61,0.30), transparent 60%),' +
          'radial-gradient(ellipse 55% 45% at 82% 26%, rgba(123,77,255,0.28), transparent 60%),' +
          'radial-gradient(ellipse 65% 55% at 22% 84%, rgba(56,189,248,0.22), transparent 60%),' +
          'radial-gradient(ellipse 55% 45% at 80% 80%, rgba(45,212,191,0.18), transparent 60%),' +
          '#06060a',
      }}
    />
  );
}
