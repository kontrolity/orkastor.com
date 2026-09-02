import React from 'react';
import { Container, Section, SectionHead, Panel, Button, Arrow } from '../ui';
import { Reveal } from '../motion/Reveal';
import { CUSTOMERS, PARTNERS, TESTIMONIALS, OUTCOMES } from '@/content/proof';
import { EXTERNAL } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The logo band, directly under the hero.
 *
 * ── THE HEADING IS PRECISE ON PURPOSE ───────────────────────────────────────
 *
 * "Teams running KubeGraf in production", not "our customers". These logos were
 * earned by KubeGraf; Domineta is invitation-only and has none. Putting
 * them under a company-level "trusted by" would let one product's traction imply
 * the other's, which is the same overclaim this site has spent three PRs
 * removing.
 *
 * A static row, not a marquee. An animated logo strip is the reflex here and it
 * makes five names harder to read than five names sitting still — and with only
 * five there is nothing to scroll past.
 */
export function LogoBar() {
  return (
    <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-soft)', paddingTop: 40, paddingBottom: 40 }}>
      <Container wide>
        <Reveal>
          <p className="ork-micro text-center" style={{ color: 'var(--text-3)', marginBottom: 22 }}>
            Teams running KubeGraf in production
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {CUSTOMERS.map((c) => (
              // Wordmarks, not images: the logo files are KubeGraf's own assets
              // and are not in this repo. Setting them in the site's type is
              // honest and avoids hotlinking another host's images.
              <span key={c} className="ork-heading" style={{ color: 'var(--text-2)', fontSize: 17, letterSpacing: '-0.01em' }}>
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7">
            {PARTNERS.map((p) => (
              <span key={p} className="ork-micro" style={{ color: 'var(--text-3)', border: '1px solid var(--border)', padding: '5px 11px', borderRadius: 999 }}>
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * What you get, in outcome terms.
 *
 * This replaced the cluster, agent-roster, security-path, microVM and lifecycle
 * diagrams on the home page. Those are good, and they are the right thing on
 * /kubegraf and /cloud where a reader has already chosen to go deeper. On a
 * landing page they were nine sections of architecture aimed at somebody who had
 * not yet decided they cared.
 */
export function Outcomes() {
  return (
    <Section tone="alt" id="outcomes">
      <Container wide>
        <Reveal>
          <SectionHead
            eyebrow="What changes"
            title="Less time in the incident. Less time building the environment."
            sub="Both products remove the same thing from your week: the part of running Kubernetes that nobody was hired to do."
          />
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-5 mt-12">
          {OUTCOMES.map((o, i) => (
            <Reveal key={o.k} delay={i * 60}>
              <Panel className="p-7 h-full">
                <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 10 }}>{o.k}</p>
                <p className="ork-body" style={{ color: 'var(--text-2)' }}>{o.v}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/**
 * Testimonials, with a pulled line so the section is skimmable.
 *
 * Real quotes, real names, real companies — read off kubegraf.io and reproduced
 * verbatim. The pull-quote is a sentence taken FROM the quote, never a
 * paraphrase, so nothing is attributed to someone that they did not say.
 *
 * The source is linked at the foot. If a reader wants to check whether these are
 * real, the fastest thing the page can do is show them where they came from.
 */
export function Testimonials() {
  const reduced = useReducedMotion();
  return (
    <Section tone="page" id="customers">
      <Container wide>
        <Reveal>
          <SectionHead
            eyebrow="Customers"
            title="When production is on the line."
            sub="Three founders on what changed after KubeGraf went into their clusters."
          />
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-5 mt-12">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <Panel
                className="p-7 h-full flex flex-col"
                hover
                accent="var(--kg)"
                style={reduced ? undefined : { transition: 'border-color var(--duration-normal) var(--ease-standard)' }}
              >
                <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 16, fontSize: 17 }}>
                  “{t.pull}”
                </p>
                <p className="ork-small" style={{ color: 'var(--text-2)', marginBottom: 22 }}>{t.quote}</p>
                <div className="mt-auto flex items-center gap-3">
                  {/* An initial, not a stock headshot. A fake face beside a real
                      quote makes the quote look fake too. */}
                  <span
                    aria-hidden="true"
                    className="ork-heading inline-flex items-center justify-center shrink-0"
                    style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--kg-text)', fontSize: 14 }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="ork-small block" style={{ color: 'var(--text)', fontWeight: 600 }}>{t.name}</span>
                    <span className="ork-small block" style={{ color: 'var(--text-3)' }}>{t.role} · {t.company}</span>
                  </span>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-9">
            <p className="ork-small" style={{ color: 'var(--text-3)' }}>
              Quotes as published on{' '}
              <a href={EXTERNAL.kubegrafSite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cloud-text)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                kubegraf.io
              </a>. Domineta is invitation-only and has no customers to show yet.
            </p>
            <Button href={EXTERNAL.kubegrafSite} variant="secondary" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>
              More on kubegraf.io <Arrow />
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
