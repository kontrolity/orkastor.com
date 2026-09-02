import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';
import { Reveal } from '@/components/home/shared';
import FaqAccordion from '@/components/cloud/FaqAccordion';
import TopologyDiagram from '@/components/cloud/TopologyDiagram';
import IsolationDiagram from '@/components/cloud/IsolationDiagram';
import { Chip, CodeBlock, ISOLATION_SENTENCE, Note, REGIONS, STATUS_LINE } from '@/components/cloud/shared';

const TOC = [
  ['boundary', 'The tenant boundary'],
  ['where', 'Where it runs'],
  ['isolation', 'Isolation, layer by layer'],
  ['semantics', 'Kubernetes semantics you keep'],
  ['ttl', 'TTL and expiry'],
  ['observability', 'Observability'],
  ['limits', 'Limits and honest caveats'],
  ['faq', 'Questions'],
];

/** The three candidate boundaries, and what each actually separates. */
const BOUNDARIES = [
  {
    name: 'Namespace + policy',
    separates: 'Linux namespaces and cgroups — on a shared host kernel',
    verdict: 'Not used here',
    why: 'One container-escape CVE becomes a cross-tenant breach. "We patch quickly" is not an isolation boundary.',
  },
  {
    name: 'gVisor',
    separates: 'Userspace syscall interception — reduces host-kernel surface, does not remove it',
    verdict: 'Fallback only',
    why: 'Cheap for CPU-bound work, costly on I/O. If it were ever used for a cohort, the weaker boundary would be documented as weaker.',
  },
  {
    name: 'Kata microVM',
    separates: 'A per-workload guest kernel on hardware virtualisation (KVM)',
    verdict: 'The choice',
    why: 'Built to make microVMs behave like pods, so RuntimeClass gives untrusted pods a guest kernel while Services, scheduling and rolling updates stay ordinary Kubernetes.',
  },
];

/** All nine layers from the architecture document, in order. */
const LAYERS = [
  ['Kernel', 'A Kata microVM per pod, selected by RuntimeClass', 'A container escape leaves the attacker inside their own guest kernel, not on the host'],
  ['Node', 'A dedicated, tainted bare-metal node pool', 'A tenant workload cannot be scheduled beside a platform pod'],
  ['Namespace', 'One namespace per environment, with a ResourceQuota and LimitRange', 'One tenant exhausting CPU, memory, storage or pod count'],
  ['Network', 'Default-deny NetworkPolicy, egress allowlist, no pod-to-pod traffic across namespaces', 'Lateral movement, and exfiltration to an attacker-controlled host'],
  ['Identity', 'A ServiceAccount per namespace, with no cloud IAM role reachable', 'A tenant assuming a cloud role and reading our account'],
  ['Metadata', 'The instance metadata service blocked at the network layer', 'The classic path from pod, to node credentials, to cluster'],
  ['Admission', 'Policy enforces RuntimeClass and rejects hostPath, hostNetwork, privileged, hostPID and capability adds', 'A manifest that opts out of the boundary'],
  ['Registry', 'Images pulled through a proxy we operate, scanned and digest-pinned', 'A known-vulnerable or tampered base image'],
  ['Data', 'Per-environment encrypted volumes; no shared volumes, no shared secret store', 'One tenant reading another tenant’s data at rest'],
];

const KEEP = [
  'Deployments and rolling updates',
  'Services and in-namespace DNS',
  'Environment variables and config',
  'Container logs and events',
  'Ingress with TLS on a generated hostname',
  'Resource requests and limits, inside your quota',
];

const REJECTED = [
  'hostPath volumes',
  'hostNetwork and hostPID',
  'privileged containers and added capabilities',
  'A manifest without the enforced RuntimeClass',
  'Traffic to another environment',
  'A customer-chosen namespace name',
];

const FAQ = [
  [
    'Is this production hosting?',
    'No. There is no SLA, no multi-AZ high availability per environment, and nothing inside an environment is backed up. It is a lower environment for dev, test, integration and sandbox work. If your users would notice it going away, it does not belong here.',
  ],
  [
    'Who else is running on the machine?',
    `Other customers. ${ISOLATION_SENTENCE} A shared cluster is a deliberate trade — a cluster per customer is a stronger boundary and the wrong shape at dev-environment prices — and the layered controls above exist because of it.`,
  ],
  [
    'Can I run a database in an environment?',
    'You can run one. It is not a managed service, it is not backed up, and an expiring environment takes it with it. Treat data inside an environment as disposable, and keep anything you would miss somewhere else.',
  ],
  [
    'What happens when the TTL expires?',
    'You get a warning before deletion, a grace period, and one-click extend at any point. Expiry is enforced by the same reconciler that created the environment, so an environment cannot quietly become permanent — and a surprise deletion is treated as the trust failure it would be.',
  ],
  [
    'Can I use my own domain or TLS certificate?',
    'Not in v1. Hostnames are generated under domineta.com with TLS terminated for you.',
  ],
  [
    'Which regions?',
    `${REGIONS.join(' and ')} — the regions we already operate. Each additional region is a new cluster and a new set of operational commitments, so we would rather run two well than list six.`,
  ],
  [
    'What uptime should I expect?',
    'We are not publishing a number, because we do not have one measured on this product yet, and an invented figure would be worse than silence. What we will commit to is that the non-goals on this page stay on this page.',
  ],
  [
    'When can I use it, and what does it cost?',
    'It is in development. The first cohort is small and starts internally, and the isolation boundary gets an external security review before any non-employee workload runs on it. Pricing follows a measurement of real infrastructure density rather than preceding it.',
  ],
];

function SectionHeading({ id, children }) {
  return (
    <h2 id={id} className="lp-display text-[clamp(24px,3.2vw,34px)] scroll-mt-24 mb-5">
      {children}
    </h2>
  );
}

export default function CloudHowItWorks() {
  useEffect(() => {
    document.title = 'How Domineta works — isolation, regions and TTL';
  }, []);

  return (
    <div className="lp min-h-screen">
      <a href="#main" className="lp-skip">
        Skip to content
      </a>
      <Nav />

      <main id="main" tabIndex={-1}>
        {/* Header */}
        <section className="relative overflow-hidden lp-hero-wash pt-[116px] sm:pt-[150px] pb-12 sm:pb-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal className="max-w-3xl">
              <div className="lp-eyebrow mb-5">Domineta · Technical detail</div>
              <h1 className="lp-display text-[clamp(32px,5vw,58px)]">
                How it works, one{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>
                  level down.
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
                Written for whoever has to approve this: where the tenant boundary sits, what the shared
                infrastructure means, which Kubernetes semantics survive, and when your environment
                disappears.
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
                {STATUS_LINE} This page describes the architecture as designed; anything not yet proven is
                labelled as such.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
            {/* In-page navigation. Hidden below lg, where the document order is
                already the fastest way through. */}
            <nav aria-label="On this page" className="hidden lg:block lg:sticky lg:top-24">
              <div className="lp-mono text-[10.5px] uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--lp-ink-3)' }}>
                On this page
              </div>
              {TOC.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="lpc-toc-link">
                  {label}
                </a>
              ))}
            </nav>

            <article className="min-w-0">
              {/* 1 — Boundary */}
              <section className="pt-4">
                <SectionHeading id="boundary">The tenant boundary</SectionHeading>
                <p className="text-[15.5px] leading-relaxed mb-4" style={{ color: 'var(--lp-ink-2)' }}>
                  A customer pushing an arbitrary container image is untrusted code by definition — not
                  malicious by assumption, but a compromised dependency in someone's image is
                  indistinguishable from an attacker. So the boundary has to hold against hostile intent.
                </p>
                <p className="text-[15.5px] leading-relaxed mb-6" style={{ color: 'var(--lp-ink-2)' }}>
                  Three candidates exist, and they are not interchangeable.
                </p>

                {/* Comparison table: scrolls inside itself on narrow screens. */}
                <div className="lpc-scroll rounded-xl" tabIndex={0} role="group" aria-label="Comparison of isolation boundaries">
                  <table className="w-full min-w-[620px] border-collapse text-left">
                    <caption className="sr-only">Isolation boundary options and the decision taken</caption>
                    <thead>
                      <tr>
                        {['Boundary', 'What separates tenants', 'Decision'].map((h) => (
                          <th
                            key={h}
                            scope="col"
                            className="lp-mono text-[10.5px] uppercase tracking-[0.14em] font-semibold py-3 pr-5 align-bottom"
                            style={{ color: 'var(--lp-ink-3)', borderBottom: '1px solid var(--lp-line)' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {BOUNDARIES.map((b) => (
                        <tr key={b.name}>
                          <th
                            scope="row"
                            className="py-4 pr-5 align-top text-[14px] font-semibold"
                            style={{ borderBottom: '1px solid var(--lp-line-soft)', letterSpacing: '-0.015em' }}
                          >
                            {b.name}
                          </th>
                          <td
                            className="py-4 pr-5 align-top text-[13.5px] leading-relaxed"
                            style={{ borderBottom: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}
                          >
                            {b.separates}
                          </td>
                          <td
                            className="py-4 align-top text-[13.5px] leading-relaxed"
                            style={{ borderBottom: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}
                          >
                            <span
                              className="lp-mono text-[10.5px] uppercase tracking-[0.12em] block mb-1.5"
                              style={{ color: b.verdict === 'The choice' ? 'var(--lp-orange-deep)' : 'var(--lp-ink-3)' }}
                            >
                              {b.verdict}
                            </span>
                            {b.why}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-[16px] font-semibold mb-2.5" style={{ letterSpacing: '-0.02em' }}>
                      Why Kata and not Firecracker directly
                    </h3>
                    <p className="text-[14.5px] leading-relaxed mb-4" style={{ color: 'var(--lp-ink-2)' }}>
                      It is a question of shape, not preference. Firecracker dominates ephemeral execution,
                      where a sandbox lives for one run and sub-second boot is the product. Domineta
                      hosts long-running microservices with Services, DNS and rolling deploys — Kubernetes-shaped
                      work. Kata exists to make microVMs behave like pods, so{' '}
                      <Chip>RuntimeClass: kata</Chip> gives an untrusted pod its own guest kernel while the rest
                      of the platform keeps using ordinary scheduling.
                    </p>
                    <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
                      The cost of that choice is real: a microVM needs nested virtualisation, which on our
                      current cloud means bare-metal nodes and a memory floor per environment. That is why the
                      tenant node pool is separate, and why environments carry a TTL rather than living
                      forever.
                    </p>
                  </div>
                  <IsolationDiagram />
                </div>
              </section>

              {/* 2 — Where it runs */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="where">Where it runs</SectionHeading>
                <p className="text-[15.5px] leading-relaxed mb-6" style={{ color: 'var(--lp-ink-2)' }}>
                  One Kubernetes cluster per region, many environments per cluster, in{' '}
                  {REGIONS.join(' and ')} — the regions we already operate. A cluster per customer is the
                  stronger boundary and is what production hosting would look like; at dev-environment price
                  points the control-plane cost and provisioning latency make it the wrong product. The shared
                  cluster is the trade, and every control in the next section exists to make it defensible.
                </p>
                <TopologyDiagram />
                <div className="mt-6">
                  <Note title="Region availability is a promise, not a flag">
                    Each new region is a new cluster, a new autoscaler installation and a new set of quotas
                    to watch. We would rather operate two regions until they are boring than list a map of
                    six.
                  </Note>
                </div>
              </section>

              {/* 3 — Isolation layers */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="isolation">Isolation, layer by layer</SectionHeading>
                <p className="text-[15.5px] leading-relaxed mb-6" style={{ color: 'var(--lp-ink-2)' }}>
                  Isolation is not one control. Each layer below assumes the one above it has already failed.
                </p>

                <dl className="m-0">
                  {LAYERS.map(([layer, control, contains]) => (
                    <div key={layer} className="lpc-row py-5 grid sm:grid-cols-[minmax(0,120px)_minmax(0,1fr)] gap-2 sm:gap-8">
                      <dt
                        className="lp-mono text-[10.5px] uppercase tracking-[0.14em] pt-0.5"
                        style={{ color: 'var(--lp-orange-deep)' }}
                      >
                        {layer}
                      </dt>
                      <dd className="m-0 min-w-0">
                        <p className="text-[14.5px] font-medium leading-relaxed mb-1.5">{control}</p>
                        <p className="text-[13.5px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-3)' }}>
                          Contains: {contains}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  <Note accent title="Admission is what makes the boundary non-optional">
                    A RuntimeClass a customer could omit is not isolation. Policy defaults it, enforces it,
                    and rejects any manifest that would place a workload outside the envelope — so the
                    security model never depends on customers being careful.
                  </Note>
                  <Note accent title="Metadata blocking is the highest-value single control">
                    The most common real path from code execution in a pod to cloud credentials is the
                    instance metadata service. It is blocked at the network layer for tenant namespaces, and
                    that is something to test rather than assume.
                  </Note>
                </div>
              </section>

              {/* 4 — Semantics */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="semantics">Kubernetes semantics you keep</SectionHeading>
                <p className="text-[15.5px] leading-relaxed mb-8" style={{ color: 'var(--lp-ink-2)' }}>
                  The point of a lower environment is that it resembles the place you deploy. So the objects
                  are real Kubernetes objects — you are not writing to an abstraction that will diverge from
                  production in six months. What you give up is precisely the set of things that would let a
                  workload step outside its own microVM.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <h3 className="text-[15px] font-semibold mb-4" style={{ letterSpacing: '-0.015em' }}>
                      Kept
                    </h3>
                    <ul className="list-none m-0 p-0 space-y-2.5">
                      {KEEP.map((k) => (
                        <li key={k} className="flex items-start gap-2.5 text-[14px]" style={{ color: 'var(--lp-ink-2)' }}>
                          <span
                            aria-hidden="true"
                            className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: 'var(--lp-orange)' }}
                          />
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-4" style={{ letterSpacing: '-0.015em' }}>
                      Rejected at admission
                    </h3>
                    <ul className="list-none m-0 p-0 space-y-2.5">
                      {REJECTED.map((r) => (
                        <li key={r} className="flex items-start gap-2.5 text-[14px]" style={{ color: 'var(--lp-ink-2)' }}>
                          <span
                            aria-hidden="true"
                            className="mt-[10px] w-3 h-px shrink-0"
                            style={{ background: 'var(--lp-ink-3)' }}
                          />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <CodeBlock label="Rejected, not silently downgraded">
                    <span className="lpc-c"># this manifest does not deploy —</span>{'\n'}
                    <span className="lpc-c"># admission refuses it and says why</span>{'\n'}
                    <span className="lpc-k">spec</span>{':\n'}
                    {'  '}<span className="lpc-k">hostNetwork</span>{': '}<span className="lpc-v">true</span>{'\n'}
                    {'  '}<span className="lpc-k">volumes</span>{':\n'}
                    {'    - '}<span className="lpc-k">hostPath</span>{': {'}<span className="lpc-k">path</span>{': '}<span className="lpc-v">/var/run</span>{'}'}{'\n\n'}
                    <span className="lpc-c"># error: hostNetwork and hostPath are not</span>{'\n'}
                    <span className="lpc-c"># permitted in a tenant environment</span>
                  </CodeBlock>
                </div>
              </section>

              {/* 5 — TTL */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="ttl">TTL and expiry</SectionHeading>
                <p className="text-[15.5px] leading-relaxed mb-4" style={{ color: 'var(--lp-ink-2)' }}>
                  Environments are ephemeral by contract, not by convention. Each one carries an idle window
                  and an absolute maximum lifetime, both visible in the UI as a countdown, both extendable.
                  Expiry is enforced by the same reconciler that created the environment, so there is no path
                  where an environment quietly persists and bills.
                </p>
                <p className="text-[15.5px] leading-relaxed mb-6" style={{ color: 'var(--lp-ink-2)' }}>
                  This is a cost control and an honesty mechanism at once: a lower environment that never
                  expires is just an unmanaged cluster with better branding.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    ['Idle window', '7 days', 'Planned default — no traffic and no deploys for this long marks an environment for expiry.'],
                    ['Absolute maximum', '30 days', 'Planned default — extendable, so long-lived work is a decision someone makes rather than a drift.'],
                    ['Before deletion', 'Warn, then grace', 'A warning first, then a grace period. Deleting real work by surprise is a trust failure, not a tidy-up.'],
                  ].map(([label, value, body]) => (
                    <div key={label} className="lp-card p-5">
                      <div className="lp-mono text-[10.5px] uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--lp-ink-3)' }}>
                        {label}
                      </div>
                      <div className="lp-display text-[26px] mb-2" style={{ color: 'var(--lp-orange-deep)' }}>
                        {value}
                      </div>
                      <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-2)' }}>
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[13px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
                  The two figures above are the intended defaults and are labelled as planned because the
                  product has not shipped. Whatever they turn out to be, they will be stated before you
                  create an environment, not after.
                </p>
              </section>

              {/* 6 — Observability */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="observability">Observability</SectionHeading>
                <p className="text-[15.5px] leading-relaxed mb-4" style={{ color: 'var(--lp-ink-2)' }}>
                  Because we operate the infrastructure, telemetry exists before you ask for it. Logs,
                  metrics, events and traces come from a stack we run, so there is no agent to install, no
                  scrape configuration to write and no credentials to negotiate. Incident detection,
                  root-cause analysis and rightsizing from KubeGraf work on the first deploy.
                </p>
                <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
                  The environment shows up as another cluster in the same console you would use for a
                  production cluster — one account, one workspace, one bill. That is the whole reason both
                  products live under one roof.
                </p>
              </section>

              {/* 7 — Limits */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="limits">Limits and honest caveats</SectionHeading>
                <ul className="list-none m-0 p-0">
                  {[
                    'No production SLA and no multi-AZ high availability per environment.',
                    'No managed or backed-up databases. Anything you run inside an environment is disposable.',
                    'No custom domains and no customer-supplied TLS.',
                    'No networking between environments.',
                    'No GPU in v1.',
                    'No compliance certifications are claimed for this product, and regulated or personal data should not be placed in it.',
                    'The isolation boundary gets an external security review before any non-employee workload runs on it. Until then, the first cohort is internal.',
                  ].map((item) => (
                    <li key={item} className="lpc-row py-4 flex gap-3.5 text-[14.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
                      <span aria-hidden="true" className="mt-[11px] w-3 h-px shrink-0" style={{ background: 'var(--lp-ink-3)' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 8 — FAQ */}
              <section className="pt-16 sm:pt-20">
                <SectionHeading id="faq">Questions</SectionHeading>
                <FaqAccordion items={FAQ} />
              </section>

              {/* CTA */}
              <section className="pt-16 sm:pt-20">
                <div className="lp-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="max-w-md">
                    <h2 className="text-[19px] font-semibold mb-2" style={{ letterSpacing: '-0.02em' }}>
                      Want an environment when the first cohort opens?
                    </h2>
                    <p className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--lp-ink-2)' }}>
                      There is no price to quote yet. Join the waitlist and you will hear the numbers when
                      they are measured.
                    </p>
                  </div>
                  <a href="/cloud#waitlist" className="lp-btn-primary group shrink-0">
                    Join the waitlist
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
