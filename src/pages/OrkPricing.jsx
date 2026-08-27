import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, SectionHead, Panel, Badge, Button, Arrow } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { KUBEGRAF, CLOUD, EXTERNAL } from '@/content/site';

/**
 * /pricing — KubeGraf's, because that is the only product with a price.
 *
 * ── THE TWO THINGS THIS PAGE USED TO GET WRONG ──────────────────────────────
 *
 * 1. It listed plans that do not match kubegraf.io. This page said "Business"
 *    and "Custom" with "5 clusters"; kubegraf.io says PRO at $399 with 3
 *    clusters. Same product, two packagings — a prospect who opened both learned
 *    the company does not know its own pricing. The numbers here now come from
 *    the product's own live page and nowhere else.
 *
 * 2. It claimed KubeGraf runs "with zero external AI calls". The architecture
 *    routes AI through KubeGraf's gateway to Amazon Bedrock, so that is not what
 *    happens. The claim is gone.
 *
 * Orkastor Cloud has no published price and this page says so plainly rather
 * than inventing a tier or hiding the product.
 */
export default function OrkPricing() {
  const p = KUBEGRAF.pricing;
  return (
    <Page
      onDeep
      seo={{
        title: 'Pricing — KubeGraf | Orkastor',
        description:
          `KubeGraf ${p.plan} is ${p.price}${p.per}, with ${p.offer.toLowerCase()}. ` +
          'Orkastor Cloud pricing is not published yet — access is by invitation.',
        canonical: 'https://www.orkastor.com/pricing',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="Pricing"
        title="One product has a price."
        titleB="The other has an invitation."
        sub="KubeGraf is live and self-serve. Orkastor Cloud is still being built in the open, and the measurements a rate depends on are not finished."
        accent="#48CBCB"
      />

      <Section tone="page">
        <Container wide>
          <div className="grid lg:grid-cols-2 gap-5">
            <Reveal>
              <Panel className="p-8 h-full flex flex-col" style={{ borderColor: 'rgba(255,138,61,0.4)' }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="ork-micro" style={{ color: 'var(--kg-text)' }}>KubeGraf · {p.plan}</span>
                  <Badge kind="live">Live</Badge>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="ork-display-l" style={{ color: 'var(--text)' }}>{p.price}</span>
                  <span className="ork-body" style={{ color: 'var(--text-2)' }}>{p.per}</span>
                  <span className="ork-small" style={{ color: 'var(--text-3)', textDecoration: 'line-through' }}>{p.was}</span>
                </div>
                <p className="ork-small mt-2" style={{ color: 'var(--kg-text)' }}>{p.offer}</p>
                <p className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{p.trial}</p>

                <ul className="mt-8 space-y-3">
                  {p.includes.map((f) => (
                    <li key={f} className="flex gap-3 ork-small" style={{ color: 'var(--text-2)' }}>
                      <span aria-hidden="true" style={{ color: 'var(--kg-text)' }}>—</span><span>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="ork-small mt-6" style={{ color: 'var(--text-3)' }}>{p.note}</p>

                <div className="mt-auto pt-8 flex flex-wrap gap-3">
                  <Button href={EXTERNAL.kubegrafApp} accent="kg" magnetic target="_blank" rel="noopener noreferrer">
                    Start free <Arrow />
                  </Button>
                  <Button href={EXTERNAL.kubegrafPricing} variant="secondary" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>
                    Full pricing on kubegraf.io ↗
                  </Button>
                </div>
              </Panel>
            </Reveal>

            <Reveal delay={70}>
              <Panel className="p-8 h-full flex flex-col" style={{ borderColor: 'rgba(72,203,203,0.4)' }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="ork-micro" style={{ color: 'var(--cloud-text)' }}>Orkastor Cloud</span>
                  <Badge kind="invite">By invitation</Badge>
                </div>

                <p className="ork-display-m" style={{ color: 'var(--text)' }}>Not published</p>
                <p className="ork-body mt-4" style={{ color: 'var(--text-2)' }}>{CLOUD.pricing}</p>

                <ul className="mt-8 space-y-3">
                  {[
                    'No self-serve sign-up while it is being built in the open',
                    'The Console shows the exact cost of an environment before you create it',
                    'One region, eu-north-1',
                  ].map((f) => (
                    <li key={f} className="flex gap-3 ork-small" style={{ color: 'var(--text-2)' }}>
                      <span aria-hidden="true" style={{ color: 'var(--cloud-text)' }}>—</span><span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8 flex flex-wrap gap-3">
                  <Button href="/cloud" accent="cloud" magnetic>Read about Cloud <Arrow /></Button>
                  <Button href={EXTERNAL.cloudConsole} variant="secondary" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>
                    Console ↗
                  </Button>
                </div>
              </Panel>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <p className="ork-small mt-8" style={{ color: 'var(--text-3)', maxWidth: 760 }}>
              KubeGraf figures above are the ones published on kubegraf.io. If the two ever
              disagree, kubegraf.io is the product's own page and it wins.
            </p>
          </Reveal>
        </Container>
      </Section>
    </Page>
  );
}
