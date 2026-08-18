import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionMarker } from '@/components/home/shared';
import IsolationDiagram from './IsolationDiagram';
import { Note } from './shared';

/** The four layers a buyer asks about first. All nine are on the technical page. */
const LAYERS = [
  ['Kernel', 'A Kata microVM per pod, applied through a RuntimeClass. A container escape leaves the attacker inside their own guest kernel.'],
  ['Network', 'Default-deny NetworkPolicy, egress through an allowlist, and no pod-to-pod traffic across environments.'],
  ['Identity', 'A ServiceAccount per environment with no cloud role reachable, and the instance metadata service blocked at the network layer.'],
  ['Admission', 'The isolation envelope is enforced, not offered. A manifest cannot opt out of it — omitting the RuntimeClass is rejected, not accepted.'],
];

export default function IsolationSection() {
  return (
    <section id="isolation" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionMarker index="04" label="Isolation" />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-12 lg:gap-16 items-start">
          <div>
            <Reveal>
              <h2 className="lp-display text-[clamp(28px,4.4vw,50px)]">
                Shared infrastructure, with a{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
                  hardware
                </span>{' '}
                boundary.
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
                Your workloads run on clusters we operate, alongside other customers' workloads. We would
                rather write that sentence here than have you find it in a security review. What makes it
                defensible is where the boundary sits: each pod gets its own guest kernel on hardware
                virtualisation, not a namespace on a shared one.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-8">
              <dl className="m-0">
                {LAYERS.map(([name, body]) => (
                  <div key={name} className="lpc-row py-4">
                    <dt
                      className="lp-mono text-[10.5px] uppercase tracking-[0.16em] mb-1.5"
                      style={{ color: 'var(--lp-orange-deep)' }}
                    >
                      {name}
                    </dt>
                    <dd className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-2)' }}>
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120} className="mt-8">
              <Note title="What we are not claiming">
                A shared cluster is a deliberate trade, taken because a cluster per customer is the wrong
                shape at dev-environment prices. It is not a stronger boundary than dedicated
                infrastructure, and we do not describe it as one. Regulated data does not belong here.
              </Note>
              <a
                href="/cloud/how-it-works#isolation"
                className="mt-6 lp-btn-ghost group"
              >
                All nine layers, in detail
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={100} className="min-w-0 lg:sticky lg:top-24">
            <IsolationDiagram />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
