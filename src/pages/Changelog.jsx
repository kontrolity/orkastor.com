import React from 'react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';

const ENTRIES = [
  {
    version: 'v1.2.0',
    date: 'February 2026',
    tag: 'Release',
    tagColor: 'teal',
    summary: 'Confidence-scored RCA, multi-cluster support and Helm chart improvements.',
    changes: [
      { type: 'new',  text: 'Confidence-scored root cause analysis — evidence chains now show percentage confidence per causal factor.' },
      { type: 'new',  text: 'Multi-cluster support — monitor and correlate incidents across up to 5 clusters in a single view.' },
      { type: 'new',  text: 'Helm chart v2: configurable resource limits, custom tolerations and topology spread constraints.' },
      { type: 'fix',  text: 'Fixed a race condition in the SafeFix™ rollback controller that could cause duplicate rollbacks under high load.' },
      { type: 'fix',  text: 'OOMKilled detection now correctly handles init containers.' },
      { type: 'perf', text: 'Reduced agent memory footprint by 35% through streaming log ingestion.' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'January 2026',
    tag: 'Release',
    tagColor: 'blue',
    summary: 'Dry-run validation, OPA policy integration and Slack incident threads.',
    changes: [
      { type: 'new',  text: 'Dry-run validation: every SafeFix™ proposal is now tested in dry-run mode before awaiting approval.' },
      { type: 'new',  text: 'OPA policy integration — block, audit or override any proposed fix using custom Rego policies.' },
      { type: 'new',  text: 'Slack integration: incidents and approvals surface as threaded Slack messages with one-click approve/reject.' },
      { type: 'new',  text: 'Automatic rollback: if post-fix metrics regress within 5 minutes, SafeFix™ reverts the change automatically.' },
      { type: 'fix',  text: 'Corrected CrashLoopBackOff detection for pods with custom restart policies.' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'December 2025',
    tag: 'GA',
    tagColor: 'emerald',
    summary: 'General availability of KubēGraf — AI SRE for Kubernetes.',
    changes: [
      { type: 'new',  text: 'AI Root Cause Analysis: correlates logs, metrics, Kubernetes events and recent deployments.' },
      { type: 'new',  text: 'SafeFix™ Auto-Remediation with mandatory human approval gate and full audit trail.' },
      { type: 'new',  text: 'Integrations: Datadog, Prometheus, PagerDuty, OpsGenie, GitHub and ArgoCD.' },
      { type: 'new',  text: 'Private AI inference — all LLM calls run inside your VPC with no external data egress.' },
      { type: 'new',  text: 'Orkastor CLI: brew install orkastor with watch, diagnose and fix subcommands.' },
    ],
  },
];

const TYPE_STYLES = {
  new:  { label: 'New',         className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  fix:  { label: 'Fix',         className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  perf: { label: 'Performance', className: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
};

const TAG_COLORS = {
  teal:    'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  blue:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

export default function Changelog() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
      <NavBar />

      <main className="relative pt-32 pb-24 px-5 sm:px-6 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
              Changelog
            </span>
            <h1 className="text-[clamp(36px,5vw,56px)] font-black tracking-[-0.03em] text-white mb-3">
              What's new
            </h1>
            <p className="text-slate-500 text-base">
              Every release, fix and improvement to KubēGraf and the Orkastor platform.
            </p>
          </div>

          {/* Entries */}
          <div className="space-y-12">
            {ENTRIES.map((entry) => (
              <div key={entry.version} className="relative pl-6 border-l border-white/[0.06]">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-slate-700 bg-[#050505]" />

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-white font-bold text-[15px]">{entry.version}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${TAG_COLORS[entry.tagColor]}`}>
                    {entry.tag}
                  </span>
                  <span className="text-slate-600 text-xs">{entry.date}</span>
                </div>

                <p className="text-slate-400 text-sm mb-5">{entry.summary}</p>

                {/* Change list */}
                <div className="space-y-2.5">
                  {entry.changes.map((change, i) => {
                    const style = TYPE_STYLES[change.type];
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${style.className}`}>
                          {style.label}
                        </span>
                        <p className="text-[13px] text-slate-400 leading-relaxed">{change.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
