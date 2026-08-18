import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/home/shared';
import EnvironmentFigure from './EnvironmentFigure';
import { ISOLATION_SENTENCE, STATUS_LINE } from './shared';

const FACTS = [
  'Kubernetes semantics, operated by us',
  'One hardware-isolated microVM per workload',
  'Environments expire on a stated TTL',
];

export default function CloudHero() {
  return (
    <section className="relative overflow-hidden lp-hero-wash pt-[116px] sm:pt-[150px] pb-16 sm:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-12 lg:gap-16 items-center">
          {/* Copy column */}
          <div>
            <Reveal>
              {/* The status pill leads, not a launch announcement — the product
                  is not GA and the first thing a visitor reads should say so. */}
              <span className="lp-pill mb-6">
                <span className="lp-pill-tag">Cloud</span>
                In development · waitlist open
              </span>

              <h1 className="lp-display text-[clamp(34px,5.6vw,66px)]">
                A real environment in minutes,{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
                  without owning a cluster.
                </span>
              </h1>

              <p className="mt-6 text-[16.5px] sm:text-lg leading-relaxed max-w-xl" style={{ color: 'var(--lp-ink-2)' }}>
                Orkastor Cloud is a managed <strong style={{ color: 'var(--lp-ink)', fontWeight: 600 }}>lower
                environment</strong>. Point it at a container image and get a running microservice on a real
                HTTPS URL — no cluster to build, no ingress to configure, no ticket to file. For dev, test,
                integration and sandbox work.
              </p>

              <p className="mt-4 text-[15px] leading-relaxed max-w-xl" style={{ color: 'var(--lp-ink-2)' }}>
                Not for production. That is the design, not a gap —{' '}
                <a
                  href="#not-for"
                  className="font-medium underline decoration-1 underline-offset-2"
                  style={{ color: 'var(--lp-orange-deep)' }}
                >
                  here is everything it deliberately does not do
                </a>
                .
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a href="#waitlist" className="lp-btn-primary group">
                  Join the waitlist
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a href="/cloud/how-it-works" className="lp-btn-ghost group">
                  How it works, technically
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <ul className="mt-9 space-y-2.5">
                {FACTS.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]" style={{ color: 'var(--lp-ink-2)' }}>
                    <span
                      aria-hidden="true"
                      className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--lp-orange)' }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] leading-relaxed max-w-lg" style={{ color: 'var(--lp-ink-3)' }}>
                {STATUS_LINE} {ISOLATION_SENTENCE}
              </p>
            </Reveal>
          </div>

          {/* Figure column */}
          <Reveal delay={120} className="min-w-0">
            <EnvironmentFigure />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
