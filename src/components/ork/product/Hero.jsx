import React from 'react';
import { Container, Button, Arrow } from '../ui';
import { Topology } from '../visuals/Topology';
import { ProductBoundary } from '../visuals/ProductBoundary';
import { HERO } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The home hero.
 *
 * ── THE LOAD SEQUENCE IS CSS, NOT JS ────────────────────────────────────────
 *
 * The brief asks for a staggered entrance under a second. Each element gets an
 * `animation-delay` and there is no orchestration code, no state machine and
 * nothing to get stuck half-finished if a render is interrupted. Content is in
 * the DOM and readable from the first frame — the animation only moves it, so a
 * visitor who arrives mid-sequence has already got the page.
 *
 * Total: 700ms to the diagram, which starts its own loop after. Nothing blocks
 * interaction at any point.
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
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(168deg, #0B2A4A 0%, #050B12 62%, #050B12 100%)', color: '#F5F8FA' }}
    >
      {/* Ground: the grid, a teal bloom, and the node graph. All aria-hidden. */}
      <div aria-hidden="true" className="ork-grid" style={{ opacity: 0.55 }} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -8%, rgba(72,203,203,0.15), transparent 62%)' }}
      />
      <Topology density="mid" seed={3} style={{ opacity: 0.7 }} />

      <Container wide className="relative pt-[116px] pb-[72px] sm:pt-[136px] sm:pb-[88px]">
        <div className="grid lg:grid-cols-[1.02fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <p className="ork-micro" style={{ color: 'var(--cloud-bright)', marginBottom: 18, ...enter(200) }}>
              {HERO.eyebrow}
            </p>

            {/* Two lines, two colours, one <h1>. The second line is the teal half
                and carries its own colour rather than relying on a
                gradient-clip: a clipped span whose fallback is transparent is
                one unsupported property away from invisible text. */}
            <h1 className="ork-display-xl" style={{ color: '#F5F8FA', ...enter(300) }}>
              {HERO.titleA}
              <br />
              <span style={{ color: 'var(--cloud-bright)' }}>{HERO.titleB}</span>
            </h1>

            <p className="ork-sub" style={{ color: 'rgba(245,248,250,0.66)', marginTop: 22, maxWidth: 560, ...enter(450) }}>
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

          <div style={enter(700)}>
            <ProductBoundary />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
