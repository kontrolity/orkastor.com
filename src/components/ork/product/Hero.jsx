import React from 'react';
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
 * failed to finish loading. Several of them landed directly behind the headline
 * and the buttons, which is the one place a background must stay quiet.
 *
 * What replaced it is an aurora: three very soft radial washes that drift on
 * long, mutually-prime periods so they never visibly repeat. It carries the same
 * brand colours the dots did — teal for Cloud, orange for KubeGraf — but as
 * light rather than as objects, so nothing competes with the type.
 *
 * Topology is still used by FinalCTA and CloudHowItWorks, where it sits behind
 * far less text. This is not a judgement on the component, only on this panel.
 *
 * ── THE LOAD SEQUENCE IS CSS, NOT JS ────────────────────────────────────────
 *
 * Each element gets an `animation-delay` and there is no orchestration code, no
 * state machine and nothing to get stuck half-finished if a render is
 * interrupted. Content is in the DOM and readable from the first frame — the
 * animation only moves it, so a visitor who arrives mid-sequence has the page.
 *
 * The panel is deep navy in BOTH themes. This is the control room; inverting it
 * in light mode would throw away the only place the brand navy lives, and the
 * brief is explicit that light must not be an inversion.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const enter = (delay) => (reduced ? undefined : { animation: `ork-enter 620ms var(--ease-emphasis) ${delay}ms both` });

  return (
    <section
      className="ork-hero relative overflow-hidden"
      style={{ background: 'linear-gradient(168deg, #0B2A4A 0%, #050B12 62%, #050B12 100%)', color: '#F5F8FA' }}
    >
      {/* ── ground ──────────────────────────────────────────────────────────
          Four layers, all aria-hidden, all pure CSS:
            grid      the existing hairline grid, dropped from 0.55 to 0.32 so
                      it sits under the aurora rather than through it
            aurora    three drifting washes (see .ork-aurora-* in orkastor.css)
            vignette  darkens the corners so the type always has a quiet ground
                      regardless of where the aurora happens to be
          Nothing here is an <svg> and nothing animates a layout property, so the
          whole background composites on the GPU. */}
      <div aria-hidden="true" className="ork-grid" style={{ opacity: 0.32 }} />
      <div aria-hidden="true" className="ork-aurora">
        <span className="ork-aurora-a" />
        <span className="ork-aurora-b" />
        <span className="ork-aurora-c" />
      </div>
      <div aria-hidden="true" className="ork-hero-vignette" />

      <Container wide className="relative pt-[116px] pb-[72px] sm:pt-[136px] sm:pb-[88px]">
        <div className="grid lg:grid-cols-[1.02fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <p className="ork-eyebrow-live" style={{ marginBottom: 18, ...enter(200) }}>
              <span className="ork-eyebrow-dot" aria-hidden="true" />
              {HERO.eyebrow}
            </p>

            {/* Two lines, two colours, one <h1>. The second line is the teal half
                and carries its own colour rather than relying on a
                gradient-clip: a clipped span whose fallback is transparent is
                one unsupported property away from invisible text. */}
            <h1 className="ork-display-xl ork-h1-sheen" style={{ color: '#F5F8FA', ...enter(300) }}>
              {HERO.titleA}
              <br />
              <span style={{ color: 'var(--cloud-bright)' }}>{HERO.titleB}</span>
            </h1>

            <p className="ork-sub" style={{ color: 'rgba(245,248,250,0.72)', marginTop: 22, maxWidth: 560, ...enter(450) }}>
              {HERO.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9" style={enter(550)}>
              <Button href="/kubegraf" accent="kg" magnetic>
                Explore KubeGraf <Arrow />
              </Button>
              <Button href="/cloud" variant="secondary" magnetic style={{ borderColor: 'rgba(245,248,250,0.24)', color: '#F5F8FA' }}>
                Explore Orkastor Cloud <Arrow />
              </Button>
            </div>
          </div>

          {/* The diagram now sits on a glass panel. Before, it floated directly
              on the gradient at opacities between 0.2 and 0.5, and the result
              was legible on a good monitor and invisible on a laptop in daylight
              — the one visual that has to do the explaining was the hardest
              thing on the page to read. The panel gives it its own ground and a
              contained edge, so its own contrast can come up without the whole
              hero getting louder. */}
          <div className="ork-hero-figure" style={enter(700)}>
            <div className="ork-hero-figure-glow" aria-hidden="true" />
            <ProductBoundary />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
