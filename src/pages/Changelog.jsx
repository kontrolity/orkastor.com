import React, { useEffect } from 'react';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';
import { Reveal } from '@/components/home/shared';

const ENTRIES = [
  {
    version: 'v1.2.0',
    date: 'February 2026',
    tag: 'Release',
    summary: 'Confidence-scored RCA, multi-cluster support and Helm chart improvements.',
    changes: [
      { type: 'new', text: 'Confidence-scored root cause analysis — evidence chains now show percentage confidence per causal factor.' },
      { type: 'new', text: 'Multi-cluster support — monitor and correlate incidents across up to 5 clusters in a single view.' },
      { type: 'new', text: 'Helm chart v2: configurable resource limits, custom tolerations and topology spread constraints.' },
      { type: 'fix', text: 'Fixed a race condition in the SafeFix™ rollback controller that could cause duplicate rollbacks under high load.' },
      { type: 'fix', text: 'OOMKilled detection now correctly handles init containers.' },
      { type: 'perf', text: 'Reduced agent memory footprint by 35% through streaming log ingestion.' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'January 2026',
    tag: 'Release',
    summary: 'Dry-run validation, OPA policy integration and Slack incident threads.',
    changes: [
      { type: 'new', text: 'Dry-run validation: every SafeFix™ proposal is now tested in dry-run mode before awaiting approval.' },
      { type: 'new', text: 'OPA policy integration — block, audit or override any proposed fix using custom Rego policies.' },
      { type: 'new', text: 'Slack integration: incidents and approvals surface as threaded Slack messages with one-click approve/reject.' },
      { type: 'new', text: 'Automatic rollback: if post-fix metrics regress within 5 minutes, SafeFix™ reverts the change automatically.' },
      { type: 'fix', text: 'Corrected CrashLoopBackOff detection for pods with custom restart policies.' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'December 2025',
    tag: 'GA',
    summary: 'General availability of KubeGraf — AI SRE for Kubernetes.',
    changes: [
      { type: 'new', text: 'AI Root Cause Analysis: correlates logs, metrics, Kubernetes events and recent deployments.' },
      { type: 'new', text: 'SafeFix™ Auto-Remediation with mandatory human approval gate and full audit trail.' },
      { type: 'new', text: 'Integrations: Datadog, Prometheus, PagerDuty, OpsGenie, GitHub and ArgoCD.' },
      { type: 'new', text: 'Private AI inference — all LLM calls run inside your VPC with no external data egress.' },
      { type: 'new', text: 'Orkastor CLI: brew install orkastor with watch, diagnose and fix subcommands.' },
    ],
  },
];

const TYPE_STYLES = {
  new: { label: 'New', bg: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)', border: 'rgba(255,122,31,0.22)' },
  fix: { label: 'Fix', bg: 'rgba(22,24,29,0.04)', color: 'var(--lp-ink-2)', border: 'var(--lp-line)' },
  perf: { label: 'Perf', bg: 'rgba(23,163,74,0.08)', color: 'var(--lp-green)', border: 'rgba(23,163,74,0.22)' },
};

export default function Changelog() {
  useEffect(() => {
    document.title = 'Changelog – Orkastor';
  }, []);

  return (
    <div className="lp min-h-screen">
      <Nav />

      <main className="relative overflow-hidden lp-hero-wash pt-[140px] sm:pt-[160px] pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <Reveal className="mb-14">
            <div className="lp-eyebrow mb-5">Changelog</div>
            <h1 className="lp-display text-[clamp(34px,4.8vw,56px)]">
              What&apos;s{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>new.</span>
            </h1>
            <p className="mt-4 text-base" style={{ color: 'var(--lp-ink-2)' }}>
              Every release, fix and improvement to KubeGraf and the Orkastor platform.
            </p>
          </Reveal>

          {/* Entries */}
          <div className="space-y-14">
            {ENTRIES.map((entry, idx) => (
              <Reveal key={entry.version} delay={idx * 60}>
                <article className="relative pl-7 sm:pl-9" style={{ borderLeft: '1px solid var(--lp-line)' }}>
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full"
                    style={{
                      background: idx === 0 ? 'var(--lp-orange)' : 'var(--lp-bg)',
                      border: idx === 0 ? 'none' : '2px solid var(--lp-ink-3)',
                    }}
                  />

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="lp-mono text-[15px] font-semibold" style={{ color: 'var(--lp-ink)' }}>{entry.version}</span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                    >
                      {entry.tag}
                    </span>
                    <span className="text-[12.5px]" style={{ color: 'var(--lp-ink-3)' }}>{entry.date}</span>
                  </div>

                  <p className="text-[14.5px] mb-5" style={{ color: 'var(--lp-ink-2)' }}>{entry.summary}</p>

                  {/* Change list */}
                  <div className="space-y-2.5">
                    {entry.changes.map((change, i) => {
                      const style = TYPE_STYLES[change.type];
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <span
                            className="shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap"
                            style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                          >
                            {style.label}
                          </span>
                          <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>{change.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
