import React from 'react';

const TOOLS = [
  'Kubernetes', 'AWS', 'GCP', 'Azure', 'Prometheus', 'Grafana',
  'ArgoCD', 'Helm', 'Slack', 'PagerDuty', 'Terraform', 'OpenTelemetry',
];

export default function Integrations() {
  const row = [...TOOLS, ...TOOLS];
  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] mb-7" style={{ color: 'var(--lp-ink-3)' }}>
        Works with the stack you already run
      </p>
      <div className="lp-marquee-mask relative">
        <div className="flex w-max animate-marquee-left gap-3 pr-3">
          {row.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="lp-mono text-[13px] px-4 py-2 rounded-full whitespace-nowrap"
              style={{ background: 'var(--lp-surface)', border: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
