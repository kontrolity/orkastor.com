import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Reveal, KUBEGRAF_URL } from './shared';

/**
 * The two products, at equal weight. This is the section the redesign exists for.
 *
 * ── EQUAL WEIGHT IS THE WHOLE POINT, AND IT IS NOT THE SAME AS EQUAL CLAIMS ──
 *
 * Both cards get the same width, the same structure and the same number of
 * bullets, because the page's job is to tell a visitor which of the two they
 * want — and a layout that gives one product three times the pixels has already
 * answered that for them.
 *
 * What is NOT equal is the status, and that is deliberate. KubeGraf is live and
 * says so. Orkastor Cloud is a waitlist and says THAT, in the same badge slot,
 * in the same type size. Dressing a waitlist to look like a shipped product is
 * the one thing that would make the rest of this page untrustworthy — the
 * visitor finds out at the click, and then re-reads everything above it.
 *
 * ── WHERE EACH CARD SENDS YOU ───────────────────────────────────────────────
 *
 * KubeGraf's primary is kubegraf.io, the product's own site — not /kubegraf.
 * Someone who has decided should leave for the thing itself; /kubegraf is the
 * secondary, for someone still deciding.
 *
 * Cloud's primary is /cloud rather than orkastor.cloud, and that is the reverse
 * on purpose: there is no product to log into yet, so sending a visitor to a
 * console they cannot use would be a dead end. /cloud is where the argument and
 * the waitlist live.
 *
 * ── ACCENTS ─────────────────────────────────────────────────────────────────
 *
 * KubeGraf orange, Cloud teal, per the umbrella decision: the frame is
 * Orkastor's navy, the products keep their own colour inside it. The accent is
 * carried by the top rule and the eyebrow only — a fully tinted card would make
 * the two look like different sites rather than two products of one company.
 */

const PRODUCTS = [
  {
    key: 'kubegraf',
    name: 'KubeGraf',
    // `accent` paints the top rule only. `ink` is for anything readable — see
    // the token block in index.css for the measurements.
    accent: 'var(--lp-orange)',
    ink: 'var(--kg-accent-text)',
    status: { label: 'Live', tone: 'live' },
    line: 'Your clusters.',
    // "Observability" was the first word here and it is the one word its own doc
    // rules out: how-it-works.md §1 says "not a monitoring/observability tool (it
    // doesn't just draw graphs); the value is the action landing in the
    // customer's cluster and being verified." Led with the action instead.
    blurb:
      'An AI SRE for Kubernetes. It detects the incident, finds the root cause, and ships the fix — then verifies the fix actually landed.',
    points: [
      'One thin agent, outbound-only, no inbound ports and no cluster credentials held centrally',
      'Root cause and a change, not another dashboard of graphs',
      'Every fix is proposed for approval — autonomy is a dial you set, not a default',
    ],
    primary: { label: 'Go to kubegraf.io', href: KUBEGRAF_URL, external: true },
    secondary: { label: 'How it works', href: '/kubegraf' },
  },
  {
    key: 'cloud',
    name: 'Orkastor Cloud',
    accent: 'var(--ork-teal)',
    ink: 'var(--ork-accent-text)',
    status: { label: 'Waitlist', tone: 'soon' },
    line: 'Our clusters.',
    // The doc's own one-paragraph definition (§1): "a managed lower environment.
    // A customer points it at a container image and gets a running microservice
    // on a URL, in minutes, without owning a Kubernetes cluster or asking their
    // platform team for anything."
    blurb:
      'A managed lower environment. Point it at a container image and get a running service on a real URL in minutes — no cluster to own, no ticket to raise.',
    points: [
      'Kubernetes-real: Deployments, Services, ingress, rolling updates. What you test is shaped like what you ship',
      'Disposable by default — every environment states its expiry, so none becomes a permanent bill',
      'For dev, test, preview and demos. Explicitly not production, and priced that way',
    ],
    primary: { label: 'Read about Cloud', href: '/cloud' },
    secondary: { label: 'What you get', href: '/cloud/how-it-works' },
  },
];

function StatusBadge({ status, ink }) {
  const live = status.tone === 'live';
  return (
    <span
      className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[11px] font-semibold uppercase"
      style={{
        letterSpacing: '0.09em',
        // The readable value, not the display one: the bright teal measured
        // 1.81:1 on its own 12% tint and the bright green 2.96:1 on its.
        color: live ? 'var(--lp-green-text)' : ink,
        background: live ? 'rgba(23,163,74,0.10)' : 'rgba(72,203,203,0.12)',
        border: `1px solid ${live ? 'rgba(23,163,74,0.24)' : 'rgba(72,203,203,0.30)'}`,
      }}
    >
      {live ? (
        <span className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--lp-green-text)' }} />
      ) : null}
      {status.label}
    </span>
  );
}

export default function ProductSplit() {
  return (
    <section id="products" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p
            className="text-[12px] font-semibold uppercase mb-3"
            style={{ letterSpacing: '0.14em', color: 'var(--lp-ink-2)' }}
          >
            The two products
          </p>
          <h2
            className="text-[28px] sm:text-[36px] font-semibold leading-[1.12] max-w-2xl"
            style={{ letterSpacing: '-0.022em', color: 'var(--lp-ink)' }}
          >
            Whose cluster is it?
          </h2>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-[1.6]" style={{ color: 'var(--lp-ink-2)' }}>
            One works on infrastructure you own. The other <em>is</em> the
            infrastructure. That is the fastest way to tell which you want, and
            everything else follows from it.
          </p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.key} delay={0.06 * i}>
              <div
                className="relative h-full flex flex-col rounded-2xl overflow-hidden"
                style={{ background: 'var(--lp-surface)', border: '1px solid var(--lp-line)' }}
              >
                {/* The accent lives here and in the eyebrow. Nowhere else. */}
                <div style={{ height: 3, background: p.accent }} />

                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span
                      className="text-[12px] font-semibold uppercase"
                      style={{ letterSpacing: '0.13em', color: p.ink }}
                    >
                      {p.name}
                    </span>
                    <StatusBadge status={p.status} ink={p.ink} />
                  </div>

                  <p
                    className="text-[22px] sm:text-[25px] font-semibold leading-[1.2] mb-3"
                    style={{ letterSpacing: '-0.02em', color: 'var(--lp-ink)' }}
                  >
                    {p.line}
                  </p>

                  <p className="text-[15px] leading-[1.62] mb-6" style={{ color: 'var(--lp-ink-2)' }}>
                    {p.blurb}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[14px] leading-[1.55]" style={{ color: 'var(--lp-ink-2)' }}>
                        {/* A check that marks WHICH claims apply carries meaning,
                            so it needs the 3:1 graphics minimum. The bright teal
                            was 1.97:1 on white. */}
                        <Check size={15} className="shrink-0 mt-[3px]" style={{ color: p.ink }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* mt-auto so both cards' buttons sit on one line however the
                      bullet text wraps. Two cards whose CTAs disagree by 12px
                      read as one being an afterthought. */}
                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <a
                      href={p.primary.href}
                      {...(p.primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-1.5 h-[42px] px-5 rounded-full text-[14px] font-semibold transition-transform hover:-translate-y-[1px]"
                      style={{ background: 'var(--ork-navy)', color: 'var(--ork-on-navy)' }}
                    >
                      {p.primary.label}
                      {p.primary.external ? <ArrowUpRight size={15} /> : null}
                    </a>
                    <a
                      href={p.secondary.href}
                      className="inline-flex items-center gap-1.5 h-[42px] px-5 rounded-full text-[14px] font-semibold border transition-colors hover:bg-black/[0.03]"
                      style={{ borderColor: 'var(--lp-line)', color: 'var(--lp-ink)' }}
                    >
                      {p.secondary.label}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
