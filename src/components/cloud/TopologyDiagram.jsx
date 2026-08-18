import React from 'react';
import { REGIONS } from './shared';

/**
 * Topology, drawn in CSS boxes rather than SVG so it reflows on a 360px screen
 * instead of shrinking to unreadable text inside a fixed viewBox.
 *
 * Shows the one fact a technical reader most wants: the platform's own pods and
 * tenant pods are on different node pools, and the tenant pool is tainted so
 * neither can drift onto the other.
 */

const PLATFORM = ['control plane API', 'ingress / gateway', 'environment reconciler'];
const TENANTS = ['env-a4f19c', 'env-8b2d07', 'env-c71e55'];

export default function TopologyDiagram() {
  return (
    <figure className="m-0">
      <div className="lp-card p-4 sm:p-6" aria-hidden="true">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="lp-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: 'var(--lp-ink-3)' }}>
            one cluster per region
          </span>
          {REGIONS.map((r) => (
            <span key={r} className="lpc-chip">
              {r}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Platform pool */}
          <div className="rounded-xl p-3.5" style={{ border: '1px solid var(--lp-line)', background: 'var(--lp-bg-alt)' }}>
            <div className="text-[12px] font-semibold mb-1" style={{ letterSpacing: '-0.01em' }}>
              Node pool: platform
            </div>
            <div className="lp-mono text-[10px] mb-3" style={{ color: 'var(--lp-ink-3)' }}>
              general purpose · shared kernel
            </div>
            <ul className="list-none m-0 p-0 space-y-1.5">
              {PLATFORM.map((p) => (
                <li
                  key={p}
                  className="text-[11.5px] px-2.5 py-1.5 rounded-lg"
                  style={{ background: 'var(--lp-surface)', border: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Tenant pool */}
          <div
            className="rounded-xl p-3.5"
            style={{ border: '1px solid rgba(255,122,31,0.35)', background: 'var(--lp-orange-soft)' }}
          >
            <div className="text-[12px] font-semibold mb-1" style={{ letterSpacing: '-0.01em' }}>
              Node pool: tenant
            </div>
            <div className="lp-mono text-[10px] mb-3" style={{ color: 'var(--lp-orange-deep)' }}>
              bare metal · tainted · RuntimeClass: kata
            </div>
            <ul className="list-none m-0 p-0 space-y-1.5">
              {TENANTS.map((t) => (
                <li
                  key={t}
                  className="lp-mono text-[11px] px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2"
                  style={{ background: 'var(--lp-surface)', border: '1px solid rgba(255,122,31,0.28)', color: 'var(--lp-ink-2)' }}
                >
                  <span className="truncate">{t}</span>
                  <span className="text-[9.5px] shrink-0" style={{ color: 'var(--lp-ink-3)' }}>
                    microVM
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 text-[11.5px] leading-relaxed" style={{ borderTop: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-2)' }}>
          The taint is the point: a platform pod cannot be scheduled onto a tenant node, and a tenant
          workload cannot be scheduled beside a platform pod.
        </div>
      </div>

      <figcaption className="mt-4 text-[12.5px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
        One Kubernetes cluster per region, many tenant environments per cluster, each environment its own
        namespace on a dedicated node pool.
      </figcaption>
    </figure>
  );
}
