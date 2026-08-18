import React from 'react';

/**
 * The isolation boundary, drawn in CSS (no image service, no external asset).
 *
 * Reads top-down as the trust story: three tenants' pods, each sealed in its own
 * microVM with its own guest kernel, above one shared host whose kernel is on
 * the far side of a hardware boundary. The hatched host block is what makes the
 * point — the shared part is visibly *not* the part your code runs in.
 */

const VMS = [
  { label: 'your workload', mine: true },
  { label: 'another tenant', mine: false },
  { label: 'another tenant', mine: false },
];

export default function IsolationDiagram() {
  return (
    <figure className="m-0">
      <div className="lp-card p-4 sm:p-6" aria-hidden="true">
        {/* Tenant layer */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {VMS.map((vm, i) => (
            <div key={i} className="lpc-vm">
              <div
                className="lp-mono text-[9.5px] uppercase tracking-[0.12em] mb-2 truncate"
                style={{ color: 'var(--lp-ink-3)' }}
              >
                microVM
              </div>
              <div
                className="lpc-vm-guest mb-2"
                style={vm.mine ? undefined : { borderColor: 'var(--lp-line)', background: 'rgba(22,24,29,0.035)' }}
              >
                <div
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: vm.mine ? 'var(--lp-orange-deep)' : 'var(--lp-ink-2)' }}
                >
                  pod
                </div>
                <div className="text-[10px] leading-tight truncate" style={{ color: 'var(--lp-ink-3)' }}>
                  {vm.label}
                </div>
              </div>
              <div className="lp-mono text-[9.5px]" style={{ color: 'var(--lp-ink-3)' }}>
                guest kernel
              </div>
            </div>
          ))}
        </div>

        {/* The boundary itself */}
        <div className="relative my-4 sm:my-5">
          <div className="lp-hairline" style={{ background: 'var(--lp-line)' }} />
          <div className="flex justify-center">
            <span
              className="lp-mono text-[9.5px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full -mt-3 relative"
              style={{
                background: 'var(--lp-surface)',
                border: '1px solid var(--lp-line)',
                color: 'var(--lp-orange-deep)',
              }}
            >
              hardware boundary · KVM
            </span>
          </div>
        </div>

        {/* Shared host */}
        <div className="lpc-host p-3.5">
          <div className="text-[11.5px] font-semibold mb-1" style={{ letterSpacing: '-0.01em' }}>
            Shared bare-metal node
          </div>
          <div className="text-[11px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
            host kernel · operated by Orkastor · dedicated, tainted node pool
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-[12.5px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
        Three pods on one shared node, each inside its own microVM with its own guest kernel. A container
        escape lands the attacker in their own kernel, not on the host — which is the whole reason the
        boundary is virtualisation rather than Linux namespaces.
      </figcaption>
    </figure>
  );
}
