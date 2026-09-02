import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, SectionHead, Panel, Badge, Button, Arrow } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { KernelBoundary } from '@/components/ork/visuals/KernelBoundary';
import { EnvironmentLifecycle, UseCases, Limitations } from '@/components/ork/visuals/CloudVisuals';
import { CLOUD, EXTERNAL } from '@/content/site';

/**
 * /cloud — the Domineta page.
 *
 * Leads with the boundary, because that is what the product's own site leads
 * with and it is the actual differentiator: most platforms in this space put
 * your code in a container beside everyone else's on one host kernel.
 *
 * The CTA is honest throughout: there is no self-serve sign-up, so nothing here
 * says "start free". The limits section is a first-class part of the page rather
 * than fine print.
 */
export default function OrkCloud() {
  return (
    <Page
      onDeep
      seo={{
        title: 'Domineta — ephemeral environments with a real kernel boundary',
        description:
          'A complete dev or test environment inside its own microVM, with its own guest kernel. ' +
          'Point it at a container image and get an HTTPS URL in minutes. Access by invitation.',
        canonical: 'https://www.orkastor.com/cloud',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="Domineta · our infrastructure"
        title={CLOUD.headline}
        titleB={CLOUD.headlineB}
        sub={CLOUD.oneLine}
        accent="#48CBCB"
        badge={<Badge kind="invite" onDeep>By invitation</Badge>}
      >
        <p className="ork-micro mt-8" style={{ color: 'rgba(72,203,203,0.85)' }}>{CLOUD.strap}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button href={EXTERNAL.cloudConsole} accent="cloud" magnetic target="_blank" rel="noopener noreferrer">
            Sign in to the Console <Arrow />
          </Button>
          <Button href="/cloud/how-it-works" variant="secondary" style={{ borderColor: 'rgba(245,248,250,0.24)', color: '#F5F8FA' }}>
            How it works
          </Button>
        </div>
        <p className="ork-small mt-5" style={{ color: 'rgba(245,248,250,0.5)', maxWidth: 520 }}>{CLOUD.access}</p>
      </ProductHero>

      <Section tone="page" id="boundary">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="The boundary"
              title="Every environment gets its own kernel."
              sub="Most platforms in this space put your code in a container next to everyone else's, sharing one host kernel. That is a namespace — a scheduling construct, never designed to hold against code that is actively trying to leave."
            />
          </Reveal>
          <Reveal delay={80}><div className="mt-12"><KernelBoundary /></div></Reveal>
        </Container>
      </Section>

      <Section tone="alt" id="isolation">
        <Container wide>
          <div className="grid md:grid-cols-2 gap-5">
            <Reveal>
              <Panel className="p-7 h-full">
                <p className="ork-micro" style={{ color: 'var(--cloud-text)', marginBottom: 12 }}>Hardware isolation</p>
                <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 10 }}>Kata Containers, on metal we operate</p>
                <p className="ork-body" style={{ color: 'var(--text-2)' }}>{CLOUD.isolation.primary}</p>
              </Panel>
            </Reveal>
            <Reveal delay={70}>
              {/* Named, not averaged away. This is the difference the product's own
                  site publishes about itself, and hiding it here would be worse
                  than not mentioning it at all. */}
              <Panel className="p-7 h-full">
                <p className="ork-micro" style={{ color: 'var(--warn)', marginBottom: 12 }}>Where it differs</p>
                <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 10 }}>Trial and Dev plans use gVisor</p>
                <p className="ork-body" style={{ color: 'var(--text-2)' }}>{CLOUD.isolation.caveat}</p>
              </Panel>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="page" id="lifecycle">
        <Container wide>
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 items-center">
            <Reveal>
              <SectionHead
                eyebrow="Lifecycle"
                title="A whole environment, not a container."
                sub="A frontend, an API and a real datastore, started together, addressed on one hostname, and thrown away together."
              />
            </Reveal>
            <Reveal delay={80}><EnvironmentLifecycle /></Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="alt" id="use-cases">
        <Container wide>
          <Reveal><SectionHead eyebrow="Where it earns its place" title="Environments that should not become infrastructure projects." /></Reveal>
          <Reveal delay={70}><div className="mt-11"><UseCases /></div></Reveal>
        </Container>
      </Section>

      <Section tone="page" id="limits">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="Designed with boundaries"
              title="We made the trade-offs explicit."
              sub="These are decisions, not gaps waiting to be filled. Better to know now than to find out at the wrong moment."
            />
          </Reveal>
          <Reveal delay={70}><div className="mt-11"><Limitations /></div></Reveal>
        </Container>
      </Section>

      <Section tone="alt" id="status">
        <Container wide>
          <Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                ['Status', 'Being built in the open', 'eu-north-1'],
                ['Access', 'By invitation', 'No self-serve sign-up'],
                ['Pricing', 'Not published', 'The Console shows the exact cost before you create an environment'],
              ].map(([k, v, n]) => (
                <Panel key={k} className="p-6">
                  <p className="ork-micro" style={{ color: 'var(--text-3)', marginBottom: 10 }}>{k}</p>
                  <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 6, fontSize: 17 }}>{v}</p>
                  <p className="ork-small" style={{ color: 'var(--text-2)' }}>{n}</p>
                </Panel>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
    </Page>
  );
}
