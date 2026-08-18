import React from 'react';

/**
 * Shared vocabulary for the Orkastor Cloud pages.
 *
 * Every claim on these pages traces back to the product and architecture
 * documents. Nothing here states an uptime figure, a price, a certification or
 * a customer count, because none of those exist yet — the product is in
 * development and the infrastructure cost floor is unmeasured.
 */

/** The generated hostname shape a customer gets. */
export const ENV_HOSTNAME = 'https://<env>.orkastor.cloud';

/** Regions Orkastor already operates. Not a roadmap — the current two. */
export const REGIONS = ['eu-north-1', 'us-east-1'];

/** One sentence we repeat verbatim, because a security reviewer will ask. */
export const ISOLATION_SENTENCE =
  'Each workload runs in its own microVM with its own guest kernel, on infrastructure shared with other customers.';

/** Availability status, stated the same way everywhere it appears. */
export const STATUS_LINE = 'In development. Not yet generally available, and not for production workloads.';

/**
 * A mono code / config block. The <pre> is wrapped in its own scroll container
 * so a long image reference can never push the page into horizontal scroll.
 * tabIndex makes the scroll region keyboard-reachable, which a scrollable
 * region needs to be.
 */
export function CodeBlock({ children, label }) {
  return (
    <div>
      {label && (
        <div className="lp-mono text-[10.5px] uppercase tracking-[0.16em] mb-2" style={{ color: 'var(--lp-ink-3)' }}>
          {label}
        </div>
      )}
      <div className="lpc-scroll rounded-xl" tabIndex={0} role="group" aria-label={label || 'Code sample'}>
        <pre className="lpc-code min-w-max">{children}</pre>
      </div>
    </div>
  );
}

/** Neutral callout for limits, caveats and honest framing. */
export function Note({ children, accent = false, title }) {
  return (
    <div className={`lpc-note ${accent ? 'lpc-note-accent' : ''}`}>
      {title && (
        <div className="text-[13px] font-semibold mb-1.5" style={{ letterSpacing: '-0.01em' }}>
          {title}
        </div>
      )}
      <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--lp-ink-2)' }}>
        {children}
      </div>
    </div>
  );
}

/** Small mono metadata chip. */
export function Chip({ children }) {
  return <span className="lpc-chip">{children}</span>;
}
