import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, Panel, Badge, Button, Arrow } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { KUBEGRAF, EXTERNAL } from '@/content/site';

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
 * Domineta has no published price and this page says so plainly rather
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
          'KubeGraf pricing, in full. No usage meter and no per-seat surprise.',
        canonical: 'https://www.orkastor.com/pricing',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="Pricing"
        title="One product has a price."
        titleB="The other has an invitation."
        sub="KubeGraf is live and self-serve. One plan, published in full, with a 14-day trial and no card required to start."
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
                  <Button href={EXTERNAL.kubegrafApp} accent="kg" target="_blank" rel="noopener noreferrer">
                    Start free <Arrow />
                  </Button>
                  <Button href={EXTERNAL.kubegrafPricing} variant="secondary" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>
                    Full pricing on kubegraf.io ↗
                  </Button>
                </div>
              </Panel>
            </Reveal>

            {/* Domineta's pricing panel was here. The product is unlisted;
                /cloud still renders for a direct URL. */}
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
