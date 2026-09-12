import React from 'react';
import { Container, Button, Arrow, Badge } from '../ui';
import { Reveal } from '../motion/Reveal';
import { Topology } from '../visuals/Topology';

/**
 * The closing choice, framed as the boundary one last time.
 *
 * Two actions, not one, because there is no single next step that fits both
 * products — and a single "Get started" would have to pick one silently.
 * Domineta's says BY INVITATION on the card rather than after the click.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden"
             style={{ background: 'var(--deep-bg)', color: 'var(--deep-ink)', paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
      <div aria-hidden="true" className="ork-grid" style={{ opacity: 0.5 }} />
      <Topology density="low" seed={11} style={{ opacity: 0.55 }} />

      <Container wide className="relative">
        <Reveal>
          <p className="ork-micro" style={{ color: 'var(--cloud-text)', marginBottom: 14 }}>Choose your side of the boundary</p>
          <h2 className="ork-display-l" style={{ color: 'var(--deep-ink)', maxWidth: 720 }}>
            Two products. Two jobs. Pick the one that matches whose cluster it is.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 mt-12">
          <Reveal>
            <div style={{ border: '1px solid rgba(255,138,61,0.34)', borderRadius: 'var(--radius-lg)', padding: 28, height: '100%' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="ork-micro" style={{ color: 'var(--kg)' }}>KubeGraf</span>
                <Badge kind="live" onDeep>Live</Badge>
              </div>
              <p className="ork-heading" style={{ color: 'var(--deep-ink)', marginBottom: 8 }}>Your infrastructure</p>
              <p className="ork-body" style={{ color: 'var(--deep-ink-muted)', marginBottom: 22 }}>
                An AI SRE for the clusters you already run. Free for 14 days, no card.
              </p>
              <Button href="/kubegraf" accent="kg">Run AI SRE on your infrastructure <Arrow /></Button>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div style={{ border: '1px solid rgba(72,203,203,0.34)', borderRadius: 'var(--radius-lg)', padding: 28, height: '100%' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="ork-micro" style={{ color: 'var(--cloud-text)' }}>Domineta</span>
                <Badge kind="invite" onDeep>By invitation</Badge>
              </div>
              <p className="ork-heading" style={{ color: 'var(--deep-ink)', marginBottom: 8 }}>Our infrastructure</p>
              <p className="ork-body" style={{ color: 'var(--deep-ink-muted)', marginBottom: 22 }}>
                Ephemeral environments with a real kernel boundary. No self-serve sign-up yet.
              </p>
              <Button href="/cloud" accent="cloud">Get an environment <Arrow /></Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTA;
