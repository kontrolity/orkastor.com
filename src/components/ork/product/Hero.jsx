import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Arrow } from '../ui';
import { HERO } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The home hero. Copy only.
 *
 * ── WHY THERE IS NO DIAGRAM HERE ────────────────────────────────────────────
 *
 * This used to carry <ProductBoundary />, an architecture drawing: a trunk
 * splitting to two products, a pod ring, a microVM with web/api/db chips, a
 * generated hostname, a TTL, and two four-step lifecycles. It was accurate and
 * it was the wrong thing to put first.
 *
 * orkastor.com is the company's marketing page. Somebody arriving here has not
 * decided they care yet, and a kernel boundary is an answer to a question they
 * have not asked. The architecture still exists for anyone who wants it — it is
 * on /kubegraf and /cloud, where a visitor has already chosen the subject.
 *
 * So the hero is the claim, and nothing else: who it is for, what it is, and
 * two ways in. Proof and the product cards follow immediately below, which is
 * where a marketing page should send attention next.
 *
 * ── WHAT CARRIES IT VISUALLY ────────────────────────────────────────────────
 *
 * An aurora: soft radial washes that drift on long, mutually-prime periods so
 * they never visibly repeat. Brand colours as light rather than as objects, so
 * nothing competes with the type. This replaced a scatter of small grey circles
 * that read as dust on the screen, several of which landed behind the headline.
 *
 * ── THE COPY ARRIVES TWICE ──────────────────────────────────────────────────
 *
 * On LOAD each word rises out of its own overflow-hidden mask, staggered in
 * reading order, and the second headline line rotates through alternates.
 *
 * On SCROLL the block drifts up and fades as the hero leaves. That is a
 * rAF-throttled scroll listener rather than `animation-timeline: scroll()`,
 * matching the decision already recorded in Effects.jsx.
 *
 * ⚠ All of it is movement only. Every word is in the DOM and readable from the
 * first frame — a visitor who arrives mid-sequence, or whose JS never runs, has
 * the whole hero.
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

      {/* Taller than it was. The hero used to end at the diagram, which gave
          it its height; without one, the same padding left the copy floating
          near the top with the logo bar crowding in under it. */}
      <Container wide className="relative pt-[132px] pb-[104px] sm:pt-[164px] sm:pb-[128px]">
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
              container, so "For teams who run Kubernetes." sets on one line
              instead of breaking into two — four short centred lines read as a
              poem, not as a headline. It still wraps on a phone, which is
              correct; the wrapping was only wrong when there was room not to. */}
          <h1 className="ork-display-xl ork-h1" style={{ color: '#F5F8FA' }}>
            <Words key={`t1-${run}`} text={HERO.titleA} base={260} reduced={reduced} />
            <span className="ork-h1-line">
              <Rotator alts={HERO.titleBAlts} canonical={HERO.titleB} base={420} reduced={reduced} />
            </span>
          </h1>

          {/* Its own measure, centred inside the copy column. At the column's
              full width the sub would set wider than the headline above it,
              which reads as a mistake in a centred block. */}
          <p className="ork-sub" style={{ color: 'rgba(245,248,250,0.72)', marginTop: 26, maxWidth: 680, marginInline: 'auto' }}>
            <Words key={`sub-${run}`} text={HERO.sub} base={640} step={11} reduced={reduced} />
          </p>

          <div
            key={`cta-${run}`}
            className="flex flex-col sm:flex-row items-center sm:justify-center gap-3 mt-11 ork-hero-cta"
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
      </Container>
    </section>
  );
}

export default Hero;
