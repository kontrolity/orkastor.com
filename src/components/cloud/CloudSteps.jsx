import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionMarker } from '@/components/home/shared';
import { CodeBlock, REGIONS } from './shared';

/**
 * Four steps, matching the product's own lifecycle: create, deploy, observe,
 * expire. The rail styling intentionally mirrors the KubeGraf "how it works"
 * timeline on the home page so the two products read as one company — but the
 * timings are removed, because we have no measured provisioning latency to
 * quote. "In minutes" is the only claim the docs support.
 */
const STEPS = [
  {
    title: 'Create',
    body: 'Name it, pick a region, pick a TTL. The namespace is generated for you — never customer-supplied, so names cannot collide or impersonate.',
    mono: `region ${REGIONS.join(' | ')}   ttl 7d idle / 30d max`,
  },
  {
    title: 'Deploy',
    body: 'An image reference, a port, env vars. Or Deployment-shaped YAML if you would rather write it yourself. You get a generated HTTPS hostname with TLS already terminated.',
    mono: 'https://<env>.orkastor.cloud  →  Service  →  pod (RuntimeClass: kata)',
  },
  {
    title: 'Observe',
    body: 'Logs, metrics, events and AI-assisted investigation are pointed at the environment from the moment it exists. Because we operate the infrastructure, there is no agent to install and no credentials to negotiate.',
    mono: 'no agent · no scrape config · no credentials',
  },
  {
    title: 'Expire',
    body: 'A visible countdown, a warning before deletion, and one-click extend. TTL is enforced by the same reconciler that created the environment, so nothing quietly becomes permanent.',
    mono: 'warn → grace period → reclaim',
  },
];

export default function CloudSteps() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="03" label="How it works" />

        <Reveal className="max-w-3xl mb-14 sm:mb-16">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            Create, deploy, observe,{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
              expire.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
            An environment should be usable before it is understood. Deploying should not require learning
            Kubernetes — but everything underneath it stays Kubernetes.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-12 lg:gap-16 items-start">
          <ol className="list-none p-0 m-0 max-w-2xl">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70} as="li">
                <div className="relative flex gap-5 sm:gap-7 pb-10 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <span
                      className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[11px] font-bold lp-mono z-10"
                      style={{
                        background: 'var(--lp-surface)',
                        color: 'var(--lp-orange-deep)',
                        border: '1px solid rgba(255,122,31,0.35)',
                      }}
                    >
                      {i + 1}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="w-px flex-1 mt-2"
                        style={{ background: 'linear-gradient(180deg, rgba(255,122,31,0.35), var(--lp-line))' }}
                      />
                    )}
                  </div>
                  <div className="pt-1 min-w-0 flex-1">
                    <h3 className="text-[17px] font-semibold mb-1.5" style={{ letterSpacing: '-0.02em' }}>
                      {s.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed mb-3" style={{ color: 'var(--lp-ink-2)' }}>
                      {s.body}
                    </p>
                    {/* Own scroll container: these mono strings are longer than a
                        360px viewport and must not widen the page. */}
                    <div className="lpc-scroll rounded-lg">
                      <div
                        className="inline-block lp-mono text-[11.5px] px-3 py-1.5 rounded-lg whitespace-nowrap"
                        style={{
                          background: 'rgba(22,24,29,0.04)',
                          border: '1px solid var(--lp-line-soft)',
                          color: 'var(--lp-ink-2)',
                        }}
                      >
                        {s.mono}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={140} className="min-w-0 lg:sticky lg:top-24">
            <CodeBlock label="What a deploy looks like">
              <span className="lpc-c"># the short form</span>{'\n'}
              <span className="lpc-k">image</span>{': '}<span className="lpc-v">ghcr.io/acme/checkout:pr-482</span>{'\n'}
              <span className="lpc-k">port</span>{':  '}<span className="lpc-v">8080</span>{'\n'}
              <span className="lpc-k">env</span>{':\n'}
              {'  '}<span className="lpc-k">LOG_LEVEL</span>{': '}<span className="lpc-v">debug</span>{'\n\n'}
              <span className="lpc-c"># or bring your own Deployment —</span>{'\n'}
              <span className="lpc-c"># the RuntimeClass is applied and</span>{'\n'}
              <span className="lpc-c"># enforced by admission, not by you</span>{'\n'}
              <span className="lpc-k">apiVersion</span>{': '}<span className="lpc-v">apps/v1</span>{'\n'}
              <span className="lpc-k">kind</span>{': '}<span className="lpc-v">Deployment</span>{'\n'}
              <span className="lpc-k">spec</span>{':\n'}
              {'  '}<span className="lpc-k">replicas</span>{': '}<span className="lpc-v">2</span>
            </CodeBlock>
            <p className="mt-4 text-[13px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
              Manifests that try to leave the isolation envelope — <span className="lp-mono">hostPath</span>,{' '}
              <span className="lp-mono">hostNetwork</span>, <span className="lp-mono">privileged</span> — are
              rejected at admission rather than silently downgraded.{' '}
              <a
                href="/cloud/how-it-works#semantics"
                className="font-medium underline decoration-1 underline-offset-2 inline-flex items-center gap-0.5"
                style={{ color: 'var(--lp-orange-deep)' }}
              >
                What you keep, what you lose
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
