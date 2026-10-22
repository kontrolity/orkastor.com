import React, { useEffect, useRef } from 'react';

/**
 * The hero's WebGL field.
 *
 * ── WHY THIS IS A FIELD AND NOT AN OBJECT ───────────────────────────────────
 *
 * The hero carried a 3D object once — <ClusterLattice />, two nested
 * icosahedral wireframes — and Hero.jsx records why it went: three rounds went
 * into its size, weight and rotation, every one of them treating a symptom,
 * and the real problem was that an object is the wrong KIND of thing for a
 * hero whose design is type on an open ground. It also sat absolutely
 * positioned across the right, so every layout that put text there collided
 * with it.
 *
 * This is deliberately not that. It is a full-bleed ambient ground BEHIND the
 * copy: slow, low-contrast, no silhouette and no edges to balance against the
 * headline. It takes over the role the CSS aurora played. If it ever starts
 * reading as an object competing with the type, that is a bug — lower the
 * colour uniforms below, do not move the type.
 *
 * ── WHY RAW WebGL AND NOT three.js ──────────────────────────────────────────
 *
 * This was written against three.js first, because three is already a
 * dependency and it made the first version short. The build priced it:
 *
 *     HeroField (three.js)   463.95 kB   gzip 116.47 kB
 *     index (entry bundle)   134.67 kB   gzip  43.51 kB
 *
 * 116 kB gzip — nearly three times the whole entry bundle — to draw one
 * full-screen quad with one fragment shader. Scene graph, camera, geometry,
 * material system, loaders: none of it is used here. Lazy-loading made it not
 * block first paint, but it is still a download, on a marketing page whose
 * entire design argument is clarity and speed.
 *
 * So this is the same shader on the raw context. No scene, no camera, no
 * matrices. One buffer, one program, one draw call.
 *
 * ── PERFORMANCE, WHICH IS THE WHOLE RISK ────────────────────────────────────
 *
 *   - DPR capped at 1.5. The shader is fill-rate bound; on a 3x phone an
 *     uncapped buffer is four times the pixels for no visible gain.
 *   - Pauses when scrolled out of view AND when the tab is hidden. A hero
 *     animating in a background tab is a battery bug.
 *   - Draws at ~30fps by skipping alternate frames. Nothing here moves fast
 *     enough to need 60, and halving the frames halves the GPU time.
 *
 * ── IT IS ALLOWED TO NOT RUN ────────────────────────────────────────────────
 *
 * The hero's CSS ground sits underneath and this only fades in once a frame
 * is actually on the canvas. No WebGL, chunk never arrives, reduced motion,
 * context lost mid-session — in every case the hero still has its ground and
 * nothing pops or reflows. Hence mounting at opacity 0 and raising it from
 * inside the draw loop rather than being conditionally rendered.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/* Three lobes on mutually-prime periods so the loop never visibly repeats —
   the trick the CSS aurora used, kept because it worked. */
const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform vec2  uAspect;
uniform vec3  uA;
uniform vec3  uB;
uniform vec3  uC;

float lobe(vec2 uv, vec2 at, float r) {
  return smoothstep(r, 0.0, length((uv - at) * uAspect));
}

/* Cheap hash grain. Gradients this wide band visibly on an 8-bit display and
   a little noise is the standard fix; it costs one instruction. */
float grain(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  vec2 pa = vec2(0.26 + 0.07 * sin(t * 0.063), 0.70 + 0.05 * cos(t * 0.041));
  vec2 pb = vec2(0.78 + 0.06 * cos(t * 0.047), 0.34 + 0.06 * sin(t * 0.059));
  vec2 pc = vec2(0.52 + 0.09 * sin(t * 0.031), 0.86 + 0.04 * cos(t * 0.071));

  vec3 col = vec3(0.0);
  col += uA * lobe(uv, pa, 0.62) * 0.90;
  col += uB * lobe(uv, pb, 0.58) * 0.75;
  col += uC * lobe(uv, pc, 0.52) * 0.55;

  col += (grain(uv * 900.0 + t) - 0.5) * 0.012;

  /* Alpha tracks the colour's own strength, so the field lies ON the page
     ground where it is bright and disappears where it is not, instead of
     washing the whole hero to a flat tint. */
  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // Not thrown: a shader that will not compile is a reason to leave the CSS
    // ground showing, not a reason to break the page.
    console.warn('[HeroField] shader failed:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function HeroField({ className = '' }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      premultipliedAlpha: true,
    });
    // No WebGL. The hero's CSS ground is already there; an invisible layer is
    // the entire fallback.
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[HeroField] link failed:', gl.getProgramInfoLog(prog));
      return undefined;
    }
    gl.useProgram(prog);

    host.appendChild(canvas);

    // One triangle covering the viewport. A quad needs two triangles and a
    // seam runs down the diagonal between them on some drivers.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uAspect = gl.getUniformLocation(prog, 'uAspect');
    // Brand colours as LIGHT, well under full strength: the display tokens
    // (--kg orange, --cloud blue) read as additive washes. Nothing here is ink.
    gl.uniform3f(gl.getUniformLocation(prog, 'uA'), 1.000 * 0.085, 0.478 * 0.085, 0.122 * 0.085);
    gl.uniform3f(gl.getUniformLocation(prog, 'uB'), 0.184 * 0.070, 0.420 * 0.070, 1.000 * 0.070);
    gl.uniform3f(gl.getUniformLocation(prog, 'uC'), 0.075 * 0.055, 0.690 * 0.055, 0.647 * 0.055);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round((host.clientWidth || 1) * dpr));
      const h = Math.max(1, Math.round((host.clientHeight || 1) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      // Keeps the lobes round on a wide viewport instead of stretching to bars.
      gl.uniform2f(uAspect, Math.max(1, w / h), 1);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let onScreen = true;
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
    io.observe(host);

    // Context loss: stop drawing and let the CSS ground show through rather
    // than leaving a dead rectangle over the hero.
    let lost = false;
    const onLost = (e) => { e.preventDefault(); lost = true; host.style.opacity = '0'; };
    canvas.addEventListener('webglcontextlost', onLost);

    let raf = 0;
    let frame = 0;
    let faded = false;
    const start = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (lost || !onScreen || document.hidden) return;
      if ((frame++ & 1) === 0) return; // ~30fps

      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Raise the layer only once something is genuinely on it, so a slow
      // chunk or a dead context never shows as a flash of empty canvas.
      if (!faded) { faded = true; host.style.opacity = '1'; }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 900ms ease',
      }}
    />
  );
}
