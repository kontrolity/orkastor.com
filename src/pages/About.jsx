import React, { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';
import { Reveal } from '@/components/home/shared';

const VALUES = [
  {
    title: 'Zero trust by default',
    desc: 'Every AI-proposed fix requires a human to approve it. We will never build a system that acts on production without your explicit consent.',
  },
  {
    title: 'Your data stays yours',
    desc: 'Orkastor runs inside your environment. We have no visibility into your infrastructure, your incidents or your code. That is intentional.',
  },
  {
    title: 'Built for engineers, by engineers',
    desc: 'We have all been paged at 2am for an incident that took four hours to debug. Everything we build is aimed at making that never happen again.',
  },
  {
    title: 'Transparency over magic',
    desc: 'AI should show its work. Every root cause analysis includes a full evidence chain so you can verify — or override — what it found.',
  },
];

const STATS = [
  { value: '500+', label: 'Beta users' },
  { value: '18s', label: 'Mean resolution time' },
  { value: '80%', label: 'Faster MTTR' },
  { value: '0', label: 'Bytes leave your network' },
];

export default function About() {
  useEffect(() => {
    document.title = 'About – Orkastor';
  }, []);

  return (
    <div className="lp min-h-screen">
      <Nav />

      <main className="relative overflow-hidden">
        {/* Hero */}
        <section className="relative pt-[140px] sm:pt-[164px] pb-16 sm:pb-20 lp-hero-wash">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <div className="lp-eyebrow mb-5 justify-center">About Orkastor</div>
              <h1 className="lp-display text-[clamp(36px,5.4vw,68px)]">
                The AI platform for{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>modern infrastructure.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--lp-ink-2)' }}>
                Orkastor is a modular AI DevOps platform that runs entirely inside your own
                environment — detecting, diagnosing and resolving infrastructure incidents
                automatically, with full human oversight at every step.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section className="relative">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="lp-hairline" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 py-12 sm:py-14">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 80} className="flex flex-col items-center text-center px-4">
                  <div
                    className="w-full flex flex-col items-center"
                    style={i > 0 ? { borderLeft: '1px solid var(--lp-line-soft)' } : undefined}
                  >
                    <span
                      className="lp-display text-[clamp(34px,4.2vw,52px)]"
                      style={{ color: 'var(--lp-ink)', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {s.value}
                    </span>
                    <span
                      className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] max-w-[200px] leading-relaxed"
                      style={{ color: 'var(--lp-ink-3)' }}
                    >
                      {s.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="lp-hairline" />
          </div>
        </section>

        {/* Mission — editorial two-column */}
        <section className="relative py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <Reveal className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <div className="lp-eyebrow mb-4">Our mission</div>
                  <h2 className="lp-display text-[clamp(26px,3.4vw,40px)]">
                    Make production incidents{' '}
                    <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>a solved problem.</span>
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={100} className="lg:col-span-7 lg:col-start-6">
                <div className="space-y-6 text-[15.5px] sm:text-base leading-[1.75]" style={{ color: 'var(--lp-ink-2)' }}>
                  <p>
                    The average SRE team spends 30% of their time responding to incidents they
                    have already seen before. The tools exist to monitor, alert and even
                    diagnose — but nothing closes the loop automatically, safely, and inside
                    your own environment.
                  </p>
                  <p>
                    We are building a modular AI platform where each agent handles a specific
                    domain of ops work: Kubernetes reliability, cloud cost, security posture
                    and beyond. Every agent runs as an operator inside your cluster. No data
                    leaves. No black box. Every fix requires your approval.
                  </p>
                  <p>
                    KubeGraf is the first module. It is available today. The rest are coming.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative py-20 sm:py-28" style={{ background: 'var(--lp-bg-alt)' }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal className="mb-12">
              <div className="lp-eyebrow mb-4">What we believe</div>
              <h2 className="lp-display text-[clamp(26px,3.6vw,42px)]">
                Principles we won&apos;t{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>compromise on.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={(i % 2) * 90}>
                  <div className="lp-card lp-card-hover p-7 h-full">
                    <div className="lp-index mb-4">0{i + 1}</div>
                    <h3 className="text-[16px] font-semibold mb-2" style={{ letterSpacing: '-0.015em' }}>{v.title}</h3>
                    <p className="text-[14px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>{v.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 sm:py-28">
          <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <h2 className="lp-display text-[clamp(28px,4vw,46px)]">
                Ready to{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>close the loop?</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed max-w-md mx-auto" style={{ color: 'var(--lp-ink-2)' }}>
                Book a demo and see Orkastor run inside your own cluster.
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="https://kubegraf.io/book-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn-dark group"
                >
                  Book a demo
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
