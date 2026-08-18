import React from 'react';
import { Reveal, SectionMarker } from '@/components/home/shared';

/**
 * The strongest material in the product doc: not "we cannot run containers" but
 * the distance between wanting an environment and having one, and the specific
 * way each usual workaround fails. Each card names one failure mode rather than
 * dismissing the tool — engineers use these tools and know their edges.
 */
const WORKAROUNDS = [
  {
    label: 'Local Docker Compose / kind',
    fails:
      'No real ingress, no real DNS, no cloud IAM, no realistic networking. "Works on my machine" survives all the way into CI.',
    tag: 'not reachable',
  },
  {
    label: 'A shared team dev cluster',
    fails:
      'Contention and drift. Nobody owns cleanup, cost grows, and no one can attribute it to a team or a change.',
    tag: 'nobody owns it',
  },
  {
    label: 'Spin up your own EKS',
    fails:
      'A quarter of setup — Karpenter, ingress, DNS, TLS, RBAC, cost controls — then a permanent operational tax for something used a few hours a week.',
    tag: 'a quarter of work',
  },
  {
    label: 'A PaaS',
    fails:
      'Fine until you need Kubernetes semantics. Then the environment you test in stops resembling the one you deploy to.',
    tag: 'diverges from prod',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="01" label="The problem" />

        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-12 lg:gap-16">
          <Reveal>
            <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
              The gap is not running containers. It is the{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
                distance
              </span>{' '}
              between wanting an environment and having one.
            </h2>
          </Reveal>

          <Reveal delay={80} className="space-y-5">
            <p className="text-[15.5px] sm:text-base leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
              For a team without a mature platform group, a shared dev cluster is a quarter of work: EKS,
              Karpenter, ingress, DNS, TLS, RBAC, cost controls, and someone on call for all of it.
            </p>
            <p className="text-[15.5px] sm:text-base leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
              For a team <em>with</em> a platform group, the cluster exists — but access to it is a ticket, and
              that ticket competes with production work. Either way, an engineer who wants to test a service
              against something realistic waits.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {WORKAROUNDS.map((w, i) => (
            <Reveal key={w.label} delay={(i % 2) * 80}>
              <div className="lp-card lp-card-hover p-6 h-full">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-[16px] font-semibold" style={{ letterSpacing: '-0.02em' }}>
                    {w.label}
                  </h3>
                  <span className="lp-index shrink-0">0{i + 1}</span>
                </div>
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--lp-ink-2)' }}>
                  {w.fails}
                </p>
                <span
                  className="lp-mono text-[10.5px] uppercase tracking-[0.14em]"
                  style={{ color: 'var(--lp-orange-deep)' }}
                >
                  {w.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p
            className="mt-12 sm:mt-14 lp-display text-[clamp(20px,2.6vw,30px)] max-w-2xl"
            style={{ fontWeight: 550 }}
          >
            Orkastor sits in that gap: Kubernetes-real, operated by someone else,{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
              disposable by default.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
