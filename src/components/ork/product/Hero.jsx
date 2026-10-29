import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Container, Button, Arrow } from '../ui';
import { HERO, EXTERNAL } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* Lazy so three.js stays out of the entry bundle — a visitor who bounces
   above the fold never pays for it. Never rendered under reduced motion, so
   that setting also means the chunk is never fetched. */
const HeroField = lazy(() => import('@/components/ork/visuals/HeroField'));

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
/**
 * `*marked*` runs, for the headline's underline. See HERO.titleA.
 *
 * Splits ONE word into segments so punctuation can sit outside the rule:
 * `*why*.` becomes an underlined "why" followed by a plain ".". Without that
 * the underline runs beneath the full stop, which reads as a typo.
 */
function segments(word) {
  const out = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m = re.exec(word);
  while (m) {
    if (m.index > last) out.push({ t: word.slice(last, m.index), u: false });
    out.push({ t: m[1], u: true });
    last = m.index + m[0].length;
    m = re.exec(word);
  }
  if (last < word.length) out.push({ t: word.slice(last), u: false });
  return out.length ? out : [{ t: word, u: false }];
}

/**
 * The same string with its markers removed.
 *
 * ⚠ EVERY path that renders the raw text must go through this. A screen
 * reader given the unstripped string says "star why star", and the
 * reduced-motion branch would print the asterisks on the page.
 */
export function plainText(s) {
  return s.replace(/\*/g, '');
}

function Words({ text, base = 0, step = 46, reduced, style, className = '' }) {
  if (reduced) {
    // Still marked up — the underline is typography, not motion, so it
    // survives prefers-reduced-motion. Only the stagger is dropped.
    return (
      <span className={className} style={style}>
        {text.split(' ').map((w, i) => (
          <React.Fragment key={`${w}-${i}`}>
            {segments(w).map((sg, j) => (
              sg.u ? <span key={j} className="ork-u">{sg.t}</span> : <React.Fragment key={j}>{sg.t}</React.Fragment>
            ))}
            {i < text.split(' ').length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </span>
    );
  }
  const words = text.split(' ');
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span className="ork-word-mask">
            <span className="ork-word" style={{ animationDelay: `${base + i * step}ms` }}>
              {segments(w).map((sg, j) => (
                sg.u ? <span key={j} className="ork-u">{sg.t}</span> : <React.Fragment key={j}>{sg.t}</React.Fragment>
              ))}
            </span>
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
    /* 3800 -> 5600ms. At 3.8s the line changed while the reader was still
       on the first one; the rotation stopped being a flourish and became an
       interruption. 5.6s is long enough to finish reading both lines before
       anything moves. */
    const id = window.setInterval(() => setI((n) => (n + 1) % alts.length), 5600);
    return () => window.clearInterval(id);
  }, [reduced, alts.length]);

  /* No italic here any more. The headline is a grotesk now (see .ork-mono-h1),
     and a sans italic is a mechanical oblique rather than a drawn cut — it
     reads as a browser faking a style it does not have. The second line is
     distinguished by colour alone, which is what the reference does. */
  if (reduced) return <Words text={canonical} reduced style={{ color: 'var(--rotator-ink)' }} />;

  return (
    <>
      {/* plainText, not the raw string: a screen reader given the markers
          reads "star why star". */}
      <span className="ork-sr-only">{plainText(canonical)}</span>
      <span className="ork-rotator" aria-hidden="true">
        {alts.map((t, n) => (
          <span key={t} className={`ork-rot-item ${n === i ? 'is-in' : ''}`}>
            {/* Re-keyed on the active index so the word stagger replays on
                every swap rather than only on first mount. */}
            <Words key={n === i ? `in-${i}` : `out-${n}`} text={t}
                   base={n === i ? base : 0} step={38}
                   style={{ color: 'var(--rotator-ink)' }} />
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
    transform: `translate3d(0, ${p * -34}px, 0)`,
    opacity: 1 - Math.min(1, p * 1.05),
  };

  return (
    <section
      ref={ref}
      /* ⚠ NO .ork-atmos HERE ANY MORE. The hero used to own its field; the
         field is now fixed behind the entire document (.ork-field, mounted
         in Layout). Keeping a second one here would paint a section-sized
         gradient on top of the page-sized one, and the seam where they met
         would be the most visible edge on the site. */
      className="ork-mono-hero ork-hero relative overflow-hidden"
    >
      {/* ── THE FIELD ──────────────────────────────────────────────────────
          A WebGL ambient ground, NOT the object that used to live here.

          Hero.jsx's own history is the argument: <ClusterLattice /> was an
          object positioned across the right of the section, it collided with
          every layout that put text there, and it was removed because an
          object is the wrong kind of thing for a hero built on type and open
          ground. This is full-bleed, behind the copy, with no silhouette to
          balance against the headline — the same role the CSS aurora plays,
          rendered better.

          It layers ON TOP of nothing: .ork-field is fixed behind the whole
          document and this sits above it but below the copy, confined to the
          hero. If this ever starts reading as a thing rather than as light,
          lower the uniforms in HeroField.jsx — do not move the type.

          Suspense fallback is null on purpose. The CSS aurora is already the
          hero's ground, so there is nothing to stand in for while the chunk
          loads, and a placeholder would only flash. */}
      {!reduced && (
        <Suspense fallback={null}>
          <HeroField className="ork-hero-field" />
        </Suspense>
      )}
      {/* ── THE 3D OBJECT IS GONE FROM THE HERO ───────────────────────────
          <ClusterLattice className="ork-hero-lattice" /> rendered here: two
          nested icosahedral wireframes with pulses running their edges.

          It is removed rather than tuned again. Three rounds went into its
          size, its line weight, its pulse count and its rotation, and every
          one of them was treating a symptom. The design this hero now follows
          puts NOTHING in its hero but type on an open ground — the object was
          not badly balanced against that, it was the wrong kind of thing for
          it. A wireframe graph belongs on /cloud and /kubegraf, where a
          reader has already asked a question it answers.

          It also kept colliding with the copy. The canvas is absolutely
          positioned across the right of the section, so every layout that put
          text there overlapped it, and every layout that did not left a large
          object balancing two lines of headline.

          ⚠ NOT DELETED. ClusterLattice.jsx and .ork-hero-lattice both stay on
          disk, under the same rule as the retired `.lp` pages: restoring it
          is re-adding the import and this one line. */}

      {/* Taller than it was. The hero used to end at the diagram, which gave
          it its height; without one, the same padding left the copy floating
          near the top with the logo bar crowding in under it. */}
      {/* Padding was pt-138/206 to hang the copy at the bottom of a 100vh
          section. The section is centred now, so that top padding is dead
          height — it only has to clear the fixed navbar. */}
      <Container wide className="relative pt-[96px] pb-[52px] sm:pt-[112px] sm:pb-[64px] w-full">
        {/* ── CENTRED, per the reference ──────────────────────────────────
            .ork-hero-copy--left is dropped rather than overridden: the base
            class is already the centred layout, and .ork-rotator is already
            justify-items:center.

            ⚠ mono.css carries a bug note saying centring made the rotating
            second line step left and right as alternates cycled. That was a
            MISMATCH, not centring itself — a centred rotator under a
            left-aligned first line, so the two lines disagreed about their
            axis. With the whole block centred both lines share one centre,
            and differing alternate widths are symmetric about it, which is
            what a centred headline is supposed to do. Verified by measuring
            the h1's centre across a full rotation; it does not move. */}
        <div className="ork-hero-copy" style={copyStyle}>
          {/* The eyebrow ("INFRASTRUCTURE, WITHOUT THE OPERATING TAX") was
              here. The reference opens straight on the headline, and the
              line it carried is a positioning claim that the headline and
              standfirst already make between them — kept in content/site.js
              as HERO.eyebrow, so restoring it is re-adding this block. The
              status descriptors that now sit under the CTAs do the job the
              eyebrow was really doing: telling you this is real and running. */}

          {/* Two lines, two colours, one <h1>. The second line carries its own
              colour rather than relying on a gradient-clip: a clipped span
              whose fallback is transparent is one unsupported property away
              from invisible text. (It is no longer teal — see --rotator-ink.)

              ⚠ Each line is WIDE, not stacked. The copy column runs the full
              container so each line sets on one line instead of breaking into
              two — four short lines read as a poem, not as a headline. It
              still wraps on a phone, which is correct; the wrapping was only
              wrong when there was room not to.

              That constraint got EASIER, not harder, with the new copy: the
              longest alternate is now 30 characters against the old 37, so
              both lines clear the container with more room than before. */}
          <div className="ork-hero-grid">
          {/* ⚠ ONE LINE, AND <Rotator> IS GONE FROM THE RENDER. The headline
              was two lines — a static first and a rotating second cycling
              four alternates. It is now a single positioning line, so there
              is no second line for the rotator to animate.

              Rotator, HERO.titleB and HERO.titleBAlts all REMAIN on disk.
              site.js says why they are kept; restoring the two-line headline
              is re-adding the span below, which is left here as a comment
              rather than described in prose so it can be pasted back:

                <span className="ork-h1-line ork-h1-accent">
                  <Rotator alts={HERO.titleBAlts} canonical={HERO.titleB}
                           base={420} reduced={reduced} />
                </span>

              The word reveal still runs — `base={260}` is unchanged — so the
              headline arrives the same way it always did, just without the
              cycling line underneath. */}
          <h1 className="ork-mono-h1">
            <Words key={`t1-${run}`} text={HERO.titleA} base={260} reduced={reduced} />
          </h1>

          {/* The standfirst sits between the headline and the buttons —
              the one position it cannot be skipped from, since you pass it on
              the way to the only two controls on the screen.

              It was briefly a right-hand column, copying the reference. That
              laid it over the hero's 3D object; the object has since gone
              (see above), so the collision is moot, but the stacked order is
              the better reading anyway and stays. */}
          <p className="ork-mono-sub ork-hero-lead">
            <Words key={`sub-${run}`} text={HERO.sub} base={640} step={11} reduced={reduced} />
          </p>
          </div>

          <div
            key={`cta-${run}`}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-10 ork-hero-cta"
            style={reduced ? undefined : { animationDelay: '700ms' }}
          >
            {/* Was /kubegraf, this site's own KubeGraf page. That page is gone
                — the product has its own site, kept current by the team that
                ships it, and a second one here was copy that could drift. */}
            <Button href={EXTERNAL.kubegrafSite} accent="kg" target="_blank" rel="noopener noreferrer">
              Explore KubeGraf <Arrow />
            </Button>
            {/* Was "Explore Domineta". The hero now has one product, so the
                second CTA points at the thing a visitor most likely wants
                next rather than at an unlisted one.

                It pointed at /pricing, which no longer exists, and then at
                kubegraf.io's root — which made both CTAs the same URL once
                the primary went external. It now names the page it promises. */}
            <Button href={EXTERNAL.kubegrafPricing} variant="secondary" target="_blank" rel="noopener noreferrer">
              See pricing <Arrow />
            </Button>
          </div>

          {/* ── STATUS LINE ────────────────────────────────────────────────
              The reference puts short factual descriptors directly under its
              CTAs — "Live in production", and two properties of the product.
              It is the last thing read before a click, so it carries the
              facts most likely to stop one: whether this is real, whose
              infrastructure it touches, and what it opens.

              A <ul>, not three spans: these are a list, and the separators
              are CSS so a screen reader does not read "dot" between them. */}
          <ul
            className="ork-hero-status"
            style={reduced ? undefined : { animationDelay: '820ms' }}
          >
            <li>Live in production</li>
            <li>Your clusters, your keys</li>
            <li>No inbound ports</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
