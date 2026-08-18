import React from 'react';
import { Reveal, SectionMarker } from './shared';

/**
 * Orkastor Cloud on the home page.
 *
 * Placed directly after the Platform section on purpose. Platform ends on "one
 * engine, a family of agents" — so the natural next beat is the second thing in
 * that family, and a reader arrives here already primed for it. Putting it
 * earlier would interrupt the KubeGraf argument the page is built to make;
 * putting it after the FAQ would bury it.
 *
 * Deliberately COMPACT — three facts and a link, not a second landing page. The
 * full argument lives at /cloud, and duplicating it here would give the home page
 * two competing pitches and two places to keep in sync.
 *
 * Every claim is constrained by docs/orkastor-cloud-product.md: this is a LOWER
 * environment, pre-GA, with no price yet. So the copy leads with the status, says
 * "shared infrastructure" out loud rather than implying dedicated hosting, and
 * makes no uptime, SLA or pricing claim — the same rules the /cloud pages follow.
 * A home page that oversells it would undo that consistency at the first click.
 */

const FACTS = [
  {
    k: 'Minutes, not a quarter',
    v: 'Point it at a container image and get a service on a real HTTPS URL — no cluster to build, no ticket to raise.',
  },
  {
    k: 'Kubernetes-real',
    v: 'Deployments, Services, ingress, rolling updates. What you test is shaped like what you ship.',
  },
  {
    k: 'Disposable by default',
    v: 'Every environment carries a visible expiry. Nothing quietly becomes a permanent bill.',
  },
];

export default function CloudCallout() {
  return (
    <section
      id="cloud"
      className="relative py-20 sm:py-28 scroll-mt-20"
      style={{ background: 'var(--lp-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="08" label="Orkastor Cloud · In development" />

        <Reveal className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            A lower environment,{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
              without the cluster.
            </span>
          </h2>
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--lp-ink-2)' }}
          >
            Dev, test and sandbox environments you do not have to build or operate.
            Each workload runs in its own hardware-isolated microVM on infrastructure
            we run and share between customers — and because we run it, KubeGraf can
            investigate your workloads from the first deploy, with nothing to install.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {FACTS.map((f, i) => (
            <Reveal key={f.k} delay={i * 60}>
              <div className="lp-card h-full p-6 sm:p-7">
                <div className="lp-eyebrow mb-3">{f.k}</div>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: 'var(--lp-ink-2)' }}
                >
                  {f.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 sm:mt-12">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="/cloud" className="lp-btn-primary">
              Explore Orkastor Cloud
            </a>
            <a
              href="/cloud/how-it-works"
              className="text-sm font-semibold underline decoration-1 underline-offset-4 transition-colors"
              style={{ color: 'var(--lp-ink-2)' }}
            >
              How the isolation works
            </a>
          </div>
          {/* Status before invitation. A reader who discovers only after signing up
              that this is pre-GA has been misled by omission, and it costs nothing
              to say plainly. */}
          <p className="mt-4 text-xs sm:text-sm" style={{ color: 'var(--lp-ink-3)' }}>
            In development · waitlist open · not intended for production workloads
          </p>
        </Reveal>
      </div>
    </section>
  );
}
