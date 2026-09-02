import React from 'react';
import { Chip } from './shared';

/**
 * Hero figure: two environments as the product would render them.
 *
 * Two deliberate choices:
 *  1. The provisioning row shows NO URL. The architecture doc's rule is that a
 *     pending environment must never be rendered as ready — a UI that shows a
 *     hostname before it resolves teaches customers that the UI lies. The
 *     marketing figure follows the same rule as the product.
 *  2. Nothing here is a real button. Everything is a span styled as product
 *     chrome, so there is no interactive element that does nothing when clicked.
 */

const READY = {
  name: 'checkout-pr-482',
  region: 'eu-north-1',
  host: 'checkout-pr-482.domineta.com',
  image: 'ghcr.io/acme/checkout:pr-482',
  ttlLabel: 'expires in 5d 4h',
  ttlPercent: 62,
};

const PENDING = {
  name: 'ledger-integration',
  region: 'us-east-1',
  image: 'ghcr.io/acme/ledger:6f31c02',
};

function Dot({ color, pulse = false }) {
  return (
    <span
      aria-hidden="true"
      className={`w-1.5 h-1.5 rounded-full shrink-0 ${pulse ? 'animate-pulse' : ''}`}
      style={{ background: color }}
    />
  );
}

export default function EnvironmentFigure() {
  return (
    <figure className="m-0">
      <div className="lp-window" aria-hidden="true">
        <div className="lp-window-bar">
          <span className="flex items-center gap-1.5">
            {['#E5E7EB', '#E5E7EB', '#E5E7EB'].map((c, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="lp-mono text-[11px] ml-2" style={{ color: 'var(--lp-ink-3)' }}>
            Environments
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {/* Ready environment */}
          <div className="lp-card p-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
              <span className="text-[14px] font-semibold" style={{ letterSpacing: '-0.015em' }}>
                {READY.name}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(23,163,74,0.10)', color: 'var(--lp-green)', border: '1px solid rgba(23,163,74,0.28)' }}
              >
                <Dot color="var(--lp-green)" />
                Ready
              </span>
              <Chip>{READY.region}</Chip>
            </div>

            {/* The URL is the thing local development cannot give you, so it is
                the most prominent line in the figure. */}
            <div className="lpc-scroll -mx-1 px-1 mb-3">
              <div className="lp-mono text-[12.5px] min-w-max" style={{ color: 'var(--lp-orange-deep)' }}>
                https://{READY.host}
              </div>
            </div>

            <div className="lpc-scroll -mx-1 px-1 mb-4">
              <div className="lp-mono text-[11.5px] min-w-max" style={{ color: 'var(--lp-ink-3)' }}>
                image {READY.image} · port 8080
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="lpc-ttl-track flex-1">
                <div className="lpc-ttl-fill" style={{ width: `${READY.ttlPercent}%` }} />
              </div>
              <span className="lp-mono text-[11px] whitespace-nowrap" style={{ color: 'var(--lp-ink-2)' }}>
                {READY.ttlLabel}
              </span>
              <span
                className="text-[11px] font-semibold px-2 py-1 rounded-md whitespace-nowrap"
                style={{ background: 'rgba(22,24,29,0.04)', border: '1px solid var(--lp-line)', color: 'var(--lp-ink-2)' }}
              >
                Extend
              </span>
            </div>
          </div>

          {/* Provisioning environment — no hostname shown on purpose */}
          <div className="lp-card p-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
              <span className="text-[14px] font-semibold" style={{ letterSpacing: '-0.015em' }}>
                {PENDING.name}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,159,10,0.10)', color: '#B26A00', border: '1px solid rgba(245,159,10,0.30)' }}
              >
                <Dot color="var(--lp-amber)" pulse />
                Provisioning
              </span>
              <Chip>{PENDING.region}</Chip>
            </div>
            <div className="lpc-scroll -mx-1 px-1 mb-2">
              <div className="lp-mono text-[11.5px] min-w-max" style={{ color: 'var(--lp-ink-3)' }}>
                image {PENDING.image}
              </div>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
              No URL until it resolves. Pending is never rendered as ready.
            </p>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-[12.5px] leading-relaxed" style={{ color: 'var(--lp-ink-3)' }}>
        An illustration of the environment list, not a screenshot of a shipped product: one environment
        ready with an HTTPS hostname, an image reference and a visible
        time-to-live it can extend; one still provisioning, deliberately shown without a URL.
      </figcaption>
    </figure>
  );
}
