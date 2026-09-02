import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useHasPointer } from '@/hooks/useReducedMotion';
import { CLOUD } from '@/content/site';

/**
 * The environment lifecycle, as a rail with a travelling pulse.
 *
 * Seven stages ending in DESTROY, and the environment visibly goes away at the
 * end before the loop restarts. That ending is the product — "environments
 * expire" is the first thing domineta.com's own limits section says, and a
 * lifecycle diagram that quietly loops back to RUN would be selling something
 * else.
 *
 * Driven by one interval and paused off-screen. Under reduced motion it renders
 * every stage as complete and static: the sequence is still readable as a
 * sequence, which is all it has to be.
 */
export function EnvironmentLifecycle({ className = '' }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const ref = useRef(null);
  const steps = CLOUD.lifecycle;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !live) return undefined;
    // A beat of dead air after DESTROY, so the disappearance registers before
    // the next environment appears. Without it the loop reads as a carousel.
    const id = window.setInterval(() => setI((v) => (v + 1) % (steps.length + 1)), 1150);
    return () => window.clearInterval(id);
  }, [reduced, live, steps.length]);

  const active = reduced ? steps.length - 1 : i;
  const gone = !reduced && i >= steps.length;

  return (
    <div ref={ref} className={className}>
      <div
        className="relative"
        style={{
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          background: 'var(--surface)', padding: '28px 24px 22px',
        }}
      >
        {/* The environment. Fades out entirely at TTL. */}
        <div
          style={{
            opacity: gone ? 0.12 : 1,
            transform: gone ? 'scale(0.985)' : 'none',
            transition: reduced ? 'none' : 'opacity 520ms var(--ease-standard), transform 520ms var(--ease-standard)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="ork-micro" style={{ color: 'var(--cloud-text)' }}>
              {gone ? 'Environment destroyed' : `pr-482-acme-7f3a9c21`}
            </span>
            {!gone && active >= 4 ? (
              <span className="ork-micro" style={{ color: 'var(--text-3)' }}>· running</span>
            ) : null}
          </div>

          <div
            style={{
              border: `1px solid ${active >= 1 ? 'var(--cloud)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', padding: 16,
              background: active >= 1 ? 'rgba(72,203,203,0.04)' : 'transparent',
              transition: reduced ? 'none' : 'all 460ms var(--ease-standard)',
            }}
          >
            <p className="ork-micro mb-3" style={{ color: active >= 2 ? 'var(--cloud-text)' : 'var(--text-3)' }}>
              microVM · guest kernel
            </p>
            <div className="flex flex-wrap gap-2">
              {['web :8080', 'api :3000', 'postgres'].map((s, k) => (
                <span key={s} className="ork-small"
                      style={{
                        padding: '5px 10px', borderRadius: 6,
                        border: '1px solid var(--border)',
                        color: active >= 3 ? 'var(--text)' : 'var(--text-3)',
                        background: active >= 3 ? 'rgba(72,203,203,0.07)' : 'transparent',
                        opacity: active >= 1 ? 1 : 0.35,
                        transition: reduced ? 'none' : `all 400ms var(--ease-standard) ${k * 60}ms`,
                      }}>
                  {s}
                </span>
              ))}
            </div>
            <p className="ork-mono ork-small mt-3"
               style={{ color: active >= 4 ? 'var(--cloud-text)' : 'var(--text-3)', opacity: active >= 4 ? 1 : 0.3, transition: 'all 400ms' }}>
              https://pr-482-acme-7f3a9c21.domineta.com
            </p>
            {active >= 5 ? (
              <p className="ork-small mt-2" style={{ color: 'var(--warn)' }}>TTL reached — grace period, then removal</p>
            ) : null}
          </div>
        </div>

        {/* The rail. */}
        <ol className="flex items-center gap-1 mt-6 flex-wrap" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {steps.map((s, k) => (
            <li key={s} className="flex items-center gap-1">
              <span className="ork-micro"
                    style={{
                      padding: '4px 8px', borderRadius: 999,
                      color: k <= active && !gone ? 'var(--cloud-text)' : 'var(--text-3)',
                      background: k === active && !gone ? 'rgba(72,203,203,0.12)' : 'transparent',
                      transition: reduced ? 'none' : 'all 320ms var(--ease-standard)',
                    }}>
                {s}
              </span>
              {k < steps.length - 1 ? <span aria-hidden="true" style={{ color: 'var(--border-strong)', fontSize: 10 }}>→</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Four use cases, each with its own miniature. Hover on desktop, always-on
 *  visuals otherwise — the miniature is the explanation, not a reward. */
export function UseCases({ className = '' }) {
  const hasPointer = useHasPointer();
  const [hot, setHot] = useState(-1);

  const minis = [
    // PR: a branch becoming an environment.
    (on) => (
      <svg viewBox="0 0 120 48" style={{ width: '100%', height: 48 }} aria-hidden="true">
        <line x1="10" y1="34" x2="60" y2="34" stroke="var(--border-strong)" strokeWidth="1" />
        <path d="M40 34 Q52 34 52 20 L74 20" fill="none" stroke={on ? 'var(--cloud)' : 'var(--border-strong)'} strokeWidth="1.2" style={{ transition: 'stroke 300ms' }} />
        <circle cx="24" cy="34" r="3" fill="var(--text-3)" />
        <circle cx="40" cy="34" r="3" fill="var(--text-3)" />
        <rect x="74" y="10" width="36" height="20" rx="4" fill={on ? 'rgba(72,203,203,0.14)' : 'transparent'} stroke={on ? 'var(--cloud)' : 'var(--border-strong)'} strokeWidth="1" style={{ transition: 'all 300ms' }} />
        <text x="92" y="24" textAnchor="middle" fontSize="6.5" fill="var(--text-2)">env</text>
      </svg>
    ),
    // Integration: three services inside one boundary.
    (on) => (
      <svg viewBox="0 0 120 48" style={{ width: '100%', height: 48 }} aria-hidden="true">
        <rect x="16" y="8" width="88" height="32" rx="5" fill="none" stroke={on ? 'var(--cloud)' : 'var(--border-strong)'} strokeWidth="1.1" style={{ transition: 'stroke 300ms' }} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={24 + i * 28} y="17" width="22" height="14" rx="3"
                fill={on ? 'rgba(72,203,203,0.16)' : 'transparent'} stroke="var(--border-strong)" strokeWidth="0.8"
                style={{ transition: `all 300ms ${i * 70}ms` }} />
        ))}
      </svg>
    ),
    // Agent: code going somewhere it can be run safely.
    (on) => (
      <svg viewBox="0 0 120 48" style={{ width: '100%', height: 48 }} aria-hidden="true">
        <circle cx="22" cy="24" r="8" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="22" y="27" textAnchor="middle" fontSize="6" fill="var(--text-3)">AI</text>
        <line x1="32" y1="24" x2="58" y2="24" stroke={on ? 'var(--cloud)' : 'var(--border-strong)'} strokeWidth="1.1" strokeDasharray={on ? undefined : '2 3'} style={{ transition: 'all 300ms' }} />
        <rect x="60" y="10" width="46" height="28" rx="5" fill={on ? 'rgba(72,203,203,0.12)' : 'transparent'} stroke={on ? 'var(--cloud)' : 'var(--border-strong)'} strokeWidth="1.2" style={{ transition: 'all 300ms' }} />
        <text x="83" y="27" textAnchor="middle" fontSize="6" fill="var(--text-2)">microVM</text>
      </svg>
    ),
    // Sandbox: a temporary box that leaves nothing behind.
    (on) => (
      <svg viewBox="0 0 120 48" style={{ width: '100%', height: 48 }} aria-hidden="true">
        <rect x="18" y="10" width="40" height="28" rx="5" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
        <rect x="66" y="10" width="40" height="28" rx="5" fill="none" stroke={on ? 'var(--cloud)' : 'var(--border-strong)'} strokeWidth="1.1"
              strokeDasharray={on ? '3 3' : undefined} opacity={on ? 0.55 : 1} style={{ transition: 'all 340ms' }} />
        <text x="86" y="27" textAnchor="middle" fontSize="6" fill="var(--text-3)">{on ? 'gone' : 'spike'}</text>
      </svg>
    ),
  ];

  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {CLOUD.useCases.map(([title, body], i) => {
        const on = hasPointer ? hot === i : true;
        return (
          <div
            key={title}
            onMouseEnter={hasPointer ? () => setHot(i) : undefined}
            onMouseLeave={hasPointer ? () => setHot(-1) : undefined}
            style={{
              padding: 20, borderRadius: 'var(--radius-md)',
              border: `1px solid ${on && hasPointer ? 'var(--cloud)' : 'var(--border)'}`,
              background: 'var(--surface)',
              transition: 'border-color 260ms var(--ease-standard)',
            }}
          >
            {minis[i](on)}
            <p className="ork-heading mt-3" style={{ color: 'var(--text)', fontSize: 15 }}>{title}</p>
            <p className="ork-small mt-2" style={{ color: 'var(--text-2)' }}>{body}</p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The limitations, as philosophy rather than a warnings box.
 *
 * The brief is right that this is a trust asset: a company that names its own
 * edges reads as one that knows where they are. So no red, no warning triangle,
 * no "coming soon" — each is a chip that expands into the reason, and the
 * reasons are the site's own words.
 *
 * Buttons, not divs. Each is expandable by keyboard and announces its state.
 */
export function Limitations({ className = '' }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-6">
        {CLOUD.limits.map(([chip], i) => (
          <button
            key={chip}
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(i)}
            className="ork-micro"
            style={{
              padding: '8px 14px', borderRadius: 999,
              border: `1px solid ${open === i ? 'var(--cloud)' : 'var(--border)'}`,
              background: open === i ? 'rgba(72,203,203,0.08)' : 'transparent',
              color: open === i ? 'var(--cloud-text)' : 'var(--text-2)',
              transition: 'all 220ms var(--ease-standard)',
            }}
          >
            {chip}
          </button>
        ))}
      </div>
      <div style={{ borderLeft: '2px solid var(--cloud)', paddingLeft: 18, minHeight: 92 }}>
        <p className="ork-heading" style={{ color: 'var(--text)' }}>{CLOUD.limits[open][1]}</p>
        <p className="ork-body mt-2" style={{ color: 'var(--text-2)', maxWidth: 620 }}>{CLOUD.limits[open][2]}</p>
      </div>
    </div>
  );
}
