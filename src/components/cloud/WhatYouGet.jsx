import React from 'react';
import { Activity, Clock, Globe, Hourglass, Layers, ShieldCheck } from 'lucide-react';
import { Reveal, SectionMarker } from '@/components/home/shared';
import { ENV_HOSTNAME } from './shared';

const ITEMS = [
  {
    icon: Clock,
    title: 'An environment in minutes',
    body: 'Name, region, TTL. One screen. No cluster to provision, no ingress config, no TLS certificate to chase.',
  },
  {
    icon: Globe,
    title: 'A real URL',
    body: `${ENV_HOSTNAME}, TLS terminated — reachable by a teammate, a designer or a webhook. The one thing local development cannot give you.`,
  },
  {
    icon: Layers,
    title: 'Kubernetes semantics',
    body: 'Deployments, Services, env vars, rolling updates, logs. What you test is shaped like what you ship.',
  },
  {
    icon: ShieldCheck,
    title: 'Hardware isolation',
    body: 'Each workload runs in its own microVM with its own guest kernel, on infrastructure shared with other customers. Stated plainly, because a security reviewer will ask.',
  },
  {
    icon: Activity,
    title: 'Observability with nothing to install',
    body: 'Logs, metrics, events and AI-assisted investigation are already pointed at the environment. No agent, no credentials, no Prometheus to stand up.',
  },
  {
    icon: Hourglass,
    title: 'A TTL you can see',
    body: 'A countdown, a one-click extend, and a warning before deletion. Environments do not quietly become permanent bills.',
  },
];

const USE_CASES = [
  ['PR preview environments', 'Open a pull request, get an environment a designer, a PM or an integration partner can open in a browser. Merged or closed, it disappears.'],
  ['Integration testing', 'Two services, real DNS between them, a real ingress — not a Compose file that drifts from production every month.'],
  ['Demos and trials', 'Sales or solutions engineering spins up a scenario without touching a shared cluster.'],
  ['Onboarding', 'A new engineer gets a working environment on day one instead of a wiki page.'],
  ['Load and failure experiments', 'Break something on purpose somewhere that breaking is free.'],
];

export default function WhatYouGet() {
  return (
    <section id="what-you-get" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="02" label="What you get" />

        <Reveal className="max-w-3xl mb-14 sm:mb-16">
          <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
            Six things, and no{' '}
            <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
              small print.
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(i % 3) * 80}>
                <div className="lp-card lp-card-hover p-6 h-full">
                  <span
                    className="w-10 h-10 rounded-xl inline-flex items-center justify-center mb-5"
                    style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                  >
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="text-[16px] font-semibold mb-2" style={{ letterSpacing: '-0.02em' }}>
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed break-words" style={{ color: 'var(--lp-ink-2)' }}>
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Where it earns its place — a plain list, not a "solutions" grid. */}
        <Reveal delay={100} className="mt-16 sm:mt-20">
          <h3 className="lp-display text-[clamp(22px,2.8vw,32px)] mb-8">Where it earns its place</h3>
          <dl className="max-w-3xl">
            {USE_CASES.map(([title, body]) => (
              <div key={title} className="lpc-row py-5 grid sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] gap-2 sm:gap-8">
                <dt className="text-[15px] font-semibold" style={{ letterSpacing: '-0.015em' }}>
                  {title}
                </dt>
                <dd className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-2)' }}>
                  {body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
