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

/**
 * One line of copy, revealed a word at a time.
 *
 * Each WORD gets its own overflow-hidden mask and rises out of it, staggered.
 * Per-word rather than per-line because a whole sentence sliding up as one
 * block reads as a panel moving; words arriving in reading order read as
 * typesetting.
 *
 * ⚠ Split on spaces, and the spaces are re-added as real characters between
 * the masks. An `inline-block` per word collapses the whitespace between them,
 * so without this the headline renders as "Forteamswhorun".
 *
 * ⚠ NOT split per character. At 63px a per-letter stagger looks like a slot
 * machine, and it multiplies the element count by five for no extra legibility.
 */
function Words({ text, base = 0, step = 46, reduced, style, className = '' }) {
  if (reduced) return <span className={className} style={style}>{text}</span>;
  const words = text.split(' ');
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span className="ork-word-mask">
            <span className="ork-word" style={{ animationDelay: `${base + i * step}ms` }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * The rotating second line.
 *
 * All the alternates are stacked in ONE grid cell, so the widest sets the
 * headline's width and nothing reflows as they swap. Only the active one is
 * visible; it rises in word by word while the outgoing one lifts away.
 *
 * ⚠ The whole rotator is aria-hidden and the canonical line is rendered
 * separately for assistive tech. Without that a screen reader reads all four
 * alternates back to back as one run-on sentence, which is worse than no
 * rotation at all.
 */
function Rotator({ alts, canonical, base, reduced }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced || alts.length < 2) return undefined;
    const id = window.setInterval(() => setI((n) => (n + 1) % alts.length), 3800);
    return () => window.clearInterval(id);
  }, [reduced, alts.length]);

  if (reduced) return <span style={{ color: 'var(--cloud-bright)' }}>{canonical}</span>;

  return (
    <>
      <span className="ork-sr-only">{canonical}</span>
      <span className="ork-rotator" aria-hidden="true">
        {alts.map((t, n) => (
          <span key={t} className={`ork-rot-item ${n === i ? 'is-in' : ''}`}>
            {/* Re-keyed on the active index so the word stagger replays on
                every swap rather than only on first mount. */}
            <Words key={n === i ? `in-${i}` : `out-${n}`} text={t}
                   base={n === i ? base : 0} step={38}
                   style={{ color: 'var(--cloud-bright)' }} />
          </span>
        ))}
      </span>
    </>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const p = useHeroScroll(!reduced);
  const ref = useRef(null);

  // Re-keying on this replays the whole reveal when the hero comes back into
  // view. Without it the animation is a one-shot: scroll down, scroll back up,
  // and the hero is just sitting there having already happened.
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRun((n) => n + 1);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

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
            <p className="ork-eyebrow-live" style={{ marginBottom: 20 }}>
              <span className="ork-eyebrow-dot" aria-hidden="true" />
              <Words key={`eb-${run}`} text={HERO.eyebrow} base={120} step={26} reduced={reduced} />
            </p>

            {/* Two lines, two colours, one <h1>. The teal half carries its own
                colour rather than relying on a gradient-clip: a clipped span
                whose fallback is transparent is one unsupported property away
                from invisible text.

                ⚠ Each line is WIDE, not stacked. The copy column runs the full
                container now, so "For teams who run Kubernetes." sets on one
                line instead of breaking into two — four short centred lines
                read as a poem, not as a headline. It still wraps on a phone,
                which is correct; the wrapping was only wrong when there was
                room not to. */}
            <h1 className="ork-display-xl ork-h1" style={{ color: '#F5F8FA' }}>
              <Words key={`t1-${run}`} text={HERO.titleA} base={260} reduced={reduced} />
              <span className="ork-h1-line">
                <Rotator alts={HERO.titleBAlts} canonical={HERO.titleB} base={420} reduced={reduced} />
              </span>
            </h1>

            {/* Its own measure, centred inside the copy column. At the column's
                full width the sub would set wider than the headline above it,
                which reads as a mistake in a centred block. */}
            <p className="ork-sub" style={{ color: 'rgba(245,248,250,0.72)', marginTop: 24, maxWidth: 680, marginInline: 'auto' }}>
              <Words key={`sub-${run}`} text={HERO.sub} base={640} step={11} reduced={reduced} />
            </p>

            <div
              key={`cta-${run}`}
              className="flex flex-col sm:flex-row items-center sm:justify-center gap-3 mt-10 ork-hero-cta"
              style={reduced ? undefined : { animationDelay: '700ms' }}
            >
              <Button href="/kubegraf" accent="kg" magnetic>
                Explore KubeGraf <Arrow />
              </Button>
              <Button href="/cloud" variant="secondary" magnetic style={{ borderColor: 'rgba(245,248,250,0.24)', color: '#F5F8FA' }}>
                Explore Domineta <Arrow />
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
