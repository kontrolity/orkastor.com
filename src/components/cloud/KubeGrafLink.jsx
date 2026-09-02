import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionMarker, KUBEGRAF_URL } from '@/components/home/shared';

/**
 * Why the two Orkastor products belong on one page: because we operate the
 * infrastructure, the observability is already pointed at the environment. The
 * claim is deliberately narrow — day-one visibility with nothing installed —
 * and stops short of promising detection quality we have not measured here.
 */
const CHAIN = [
  ['You run dev and test on Domineta', 'Your workloads, our infrastructure.'],
  ['KubeGraf can already see it', 'Logs, metrics, events and traces come from a stack we operate, so there is no agent to install and no credentials to negotiate.'],
  ['One account, one workspace', 'The environment appears as another cluster in the same console you would use for a production cluster.'],
];

export default function KubeGrafLink() {
  return (
    <section id="kubegraf" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="06" label="With KubeGraf" />

        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-12 lg:gap-16">
          <Reveal>
            <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
              Observability that is already{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
                switched on.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
              KubeGraf, our AI SRE product, normally needs an agent in your cluster before it can tell you
              anything. On Domineta that step does not exist — we operate the infrastructure, so
              incident detection, root-cause analysis and rightsizing work from the first deploy.
            </p>
            <a href={KUBEGRAF_URL} target="_blank" rel="noopener noreferrer" className="mt-8 lp-btn-ghost group">
              See what KubeGraf does
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>

          <Reveal delay={80}>
            <ol className="list-none m-0 p-0">
              {CHAIN.map(([title, body], i) => (
                <li key={title} className="lpc-row py-5 flex gap-4">
                  <span
                    className="lp-mono text-[11px] font-bold shrink-0 mt-0.5"
                    style={{ color: 'var(--lp-orange-deep)' }}
                  >
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold mb-1.5" style={{ letterSpacing: '-0.015em' }}>
                      {title}
                    </h3>
                    <p className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-2)' }}>
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
