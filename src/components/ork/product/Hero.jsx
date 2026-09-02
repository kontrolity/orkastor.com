import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Arrow } from '../ui';
import { ProductBoundary } from '../visuals/ProductBoundary';
import { HERO } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The home hero.
 *
 * ── WHY THE NODE GRAPH IS GONE ──────────────────────────────────────────────
 *
 * This used to render <Topology density="mid" />, a scatter of small grey
 * circles across the whole panel. At 0.7 opacity on a navy ground they did not
 * read as a network — they read as dust on the screen, or as an image that had
 * failed to finish loading. Several landed directly behind the headline and the
 * buttons, which is the one place a background must stay quiet.
 *
 * What replaced it is an aurora: soft radial washes that drift on long,
 * mutually-prime periods so they never visibly repeat. Same brand colours, but
 * as light rather than as objects, so nothing competes with the type.
 *
 * ── THE COPY ARRIVES TWICE ──────────────────────────────────────────────────
 *
 * On LOAD each line rises out of its own overflow-hidden mask, staggered. The
 * mask is what makes it read as typesetting rather than as a fade — the glyphs
 * are clipped by a box the width of the line, so they emerge rather than
 * appearing.
 *
 * On SCROLL the whole block drifts up and fades as the hero leaves. That is
 * driven by a rAF-throttled scroll listener rather than `animation-timeline:
 * scroll()`, matching the decision already recorded in Effects.jsx: the CSS
 * property is still not safe across the browsers this site supports.
 *
 * ⚠ Both effects are movement only. Every line is in the DOM and readable from
 * the first frame — a visitor who arrives mid-sequence, or whose JS never runs,
 * has the whole hero.
 */

/** Scroll progress through the hero, 0 at the top and 1 once it has left. */
function useHeroScroll(enabled) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;
    const read = () => {
      raf = 0;
      const h = window.innerHeight || 1;
      setP(Math.min(1, Math.max(0, window.scrollY / h)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    window.addEventListener('scroll', onScroll, { passive: true });
    read();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [enabled]);
  return p;
}

/** One masked line. The mask is the effect; the span inside does the moving. */
function Line({ children, delay, reduced, className = '', style }) {
  return (
    <span className="ork-line-mask">
      <span
        className={`ork-line ${className}`}
        style={reduced ? style : { ...style, animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const p = useHeroScroll(!reduced);
  const ref = useRef(null);

  // Parallax: the copy leaves a little faster than the page, the figure a
  // little slower. Small numbers on purpose — anything larger reads as the
  // layout being broken rather than as depth.
  const copyStyle = reduced ? undefined : {
    transform: `translate3d(0, ${p * -56}px, 0)`,
    opacity: 1 - Math.min(1, p * 1.25),
  };
  const figStyle = reduced ? undefined : {
    transform: `translate3d(0, ${p * 26}px, 0)`,
    opacity: 1 - Math.min(1, p * 1.1),
  };

  return (
    <section
      ref={ref}
      className="ork-hero relative overflow-hidden"
      style={{ background: 'linear-gradient(168deg, #0B2A4A 0%, #050B12 62%, #050B12 100%)', color: '#F5F8FA' }}
    >
      {/* ── ground: grid, aurora, vignette. All aria-hidden, all pure CSS. ── */}
      <div aria-hidden="true" className="ork-grid" style={{ opacity: 0.32 }} />
      <div aria-hidden="true" className="ork-aurora">
        <span className="ork-aurora-a" />
        <span className="ork-aurora-b" />
        <span className="ork-aurora-c" />
      </div>
      <div aria-hidden="true" className="ork-hero-vignette" />

      <Container wide className="relative pt-[112px] pb-[64px] sm:pt-[128px] sm:pb-[80px]">
        {/* ⚠ STACKED, NOT SIDE BY SIDE.
            The figure is the thing that explains the two products, and beside
            the copy it rendered about 560px wide — small enough that its 7.5px
            labels were sub-pixel and its two branches sat almost on top of each
            other. Widening its column instead broke the typography: the
            headline went to three ragged lines and the eyebrow wrapped.
            Full width below the copy gives it roughly 1200px, which is more
            than twice what it had, and lets the copy set at its natural
            measure. */}
        <div className="ork-hero-stack">
          <div className="ork-hero-copy" style={copyStyle}>
            <p className="ork-eyebrow-live" style={{ marginBottom: 18 }}>
              <span className="ork-eyebrow-dot" aria-hidden="true" />
              <Line delay={120} reduced={reduced}>{HERO.eyebrow}</Line>
            </p>

            {/* Two lines, two colours, one <h1>. The teal half carries its own
                colour rather than relying on a gradient-clip: a clipped span
                whose fallback is transparent is one unsupported property away
                from invisible text. */}
            <h1 className="ork-display-xl ork-h1" style={{ color: '#F5F8FA' }}>
              <Line delay={240} reduced={reduced}>{HERO.titleA}</Line>
              <Line delay={380} reduced={reduced} style={{ color: 'var(--cloud-bright)' }}>{HERO.titleB}</Line>
            </h1>

            <p className="ork-sub" style={{ color: 'rgba(245,248,250,0.72)', marginTop: 20, maxWidth: 560 }}>
              <Line delay={540} reduced={reduced}>{HERO.sub}</Line>
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 mt-9 ork-hero-cta"
              style={reduced ? undefined : { animationDelay: '700ms' }}
            >
              <Button href="/kubegraf" accent="kg" magnetic>
                Explore KubeGraf <Arrow />
              </Button>
              <Button href="/cloud" variant="secondary" magnetic style={{ borderColor: 'rgba(245,248,250,0.24)', color: '#F5F8FA' }}>
                Explore Orkastor Cloud <Arrow />
              </Button>
            </div>
          </div>

          {/* The diagram sits on a glass panel. Before, it floated directly on
              the gradient at opacities between 0.2 and 0.5 — legible on a good
              monitor, invisible on a laptop in daylight. The panel gives it its
              own ground so its contrast can come up without the hero getting
              louder. */}
          <div className="ork-hero-figure" style={figStyle}>
            <div className="ork-hero-figure-glow" aria-hidden="true" />
            <ProductBoundary />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
