import React from 'react';
import { Magnetic } from '../motion/Effects';

/** Page gutter + max width. One place, so sections cannot disagree by 8px. */
export function Container({ children, className = '', wide = false, ...rest }) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${wide ? 'max-w-[1180px]' : 'max-w-[1080px]'} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/**
 * A major section.
 *
 * `tone` picks the ground: page, alt (the banded one), or deep (the dark
 * infrastructure panel that stays dark in BOTH themes — see below).
 *
 * `deep` exists because a few sections are the control room regardless of theme:
 * the hero, the boundary, the final CTA. Inverting those in light mode would
 * throw away the one place the brand's navy actually lives. They set their own
 * text colours rather than inheriting, because `.ork` light text on a deep ground
 * would be invisible — the same cascade trap that shipped a half-invisible
 * headline earlier in this project.
 */
export function Section({ children, tone = 'page', id = undefined, className = '', ...rest }) {
  // `deep` is literal rather than tokenised on purpose: it must NOT flip with the
  // theme, so it cannot read --navy/--bg, which do.
  const style = tone === 'deep'
    ? { background: 'linear-gradient(168deg, #0B2A4A 0%, #050B12 100%)', color: '#F5F8FA' }
    : { background: tone === 'alt' ? 'var(--bg-alt)' : 'var(--bg)' };
  return (
    <section
      id={id}
      data-tone={tone}
      className={`relative ${className}`}
      style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)', ...style }}
      {...rest}
    >
      {children}
    </section>
  );
}

/** Eyebrow + title + optional standfirst. Uses --text-2, never --text-3, for
 *  the standfirst: it is body copy, and --text-3 is for labels. */
export function SectionHead({ eyebrow = undefined, title = undefined, sub = undefined, align = 'left', onDeep = false, className = '' }) {
  const muted = onDeep ? 'rgba(245,248,250,0.62)' : 'var(--text-2)';
  const label = onDeep ? 'var(--cloud-bright)' : 'var(--text-2)';
  return (
    <header className={`${align === 'center' ? 'text-center mx-auto' : ''} ${className}`} style={{ maxWidth: align === 'center' ? 720 : 760 }}>
      {eyebrow ? <p className="ork-micro" style={{ color: label, marginBottom: 12 }}>{eyebrow}</p> : null}
      {title ? <h2 className="ork-display-m" style={{ color: onDeep ? '#F5F8FA' : 'var(--text)' }}>{title}</h2> : null}
      {sub ? <p className="ork-sub" style={{ color: muted, marginTop: 14 }}>{sub}</p> : null}
    </header>
  );
}

/**
 * Button.
 *
 * `primary` is solid, `secondary` is a hairline ghost, `quiet` is text-only.
 * `accent` tints primary per product so a KubeGraf CTA and a Cloud CTA are
 * tellable apart without reading them.
 *
 * The arrow moves 3px on hover and the whole control lifts 1px. Both are
 * transform-only, so neither triggers layout.
 */
/* eslint-disable react/prop-types */
/**
 * @param {{ as?: any, variant?: string, accent?: string, magnetic?: boolean,
 *           children?: any, className?: string, style?: any,
 *           [key: string]: any }} props
 */
export function Button({
  as: Tag = 'a', variant = 'primary', accent = undefined, magnetic = false,
  children = undefined, className = '', style = undefined, ...rest
}) {
  const accents = {
    kg:    { bg: 'var(--kg)',           fg: '#1A0A00' },
    cloud: { bg: 'var(--cloud-bright)', fg: '#04222A' },
  };
  const a = accents[accent];
  const base = 'group inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none';
  const size = 'h-[46px] px-6 text-[14.5px]';

  const variants = {
    primary: {
      background: a ? a.bg : 'var(--text)',
      color: a ? a.fg : 'var(--bg)',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'transparent',
      color: 'inherit',
      border: '1px solid var(--border-strong)',
    },
    quiet: { background: 'transparent', color: 'inherit', border: '1px solid transparent' },
  };

  const el = (
    <Tag
      className={`${base} ${size} ${className}`}
      style={{
        borderRadius: 999,
        transition: 'transform var(--duration-fast) var(--ease-standard), background-color var(--duration-normal) var(--ease-standard), border-color var(--duration-normal) var(--ease-standard)',
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      {...rest}
    >
      {children}
    </Tag>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** An arrow that slides on the parent's hover. Pair with Button. */
export function Arrow({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`transition-transform duration-200 group-hover:translate-x-[3px] ${className}`}
      style={{ display: 'inline-block' }}
    >
      →
    </span>
  );
}

/**
 * Status pill. `live` and `invite` are the only two states the company has, and
 * they are the two the brief insists must never be blurred together.
 *
 * The colours come from the readable tokens, not the display ones: this is text.
 */
export function Badge({ kind = 'live', children, onDeep = false }) {
  const map = {
    live:   { fg: onDeep ? '#4ADE80' : 'var(--ok)',         bg: 'rgba(22,101,52,0.10)',   bd: 'rgba(22,101,52,0.26)', dot: true },
    invite: { fg: onDeep ? '#6FDCDC' : 'var(--cloud-text)', bg: 'rgba(23,96,138,0.10)',   bd: 'rgba(23,96,138,0.26)', dot: false },
    neutral:{ fg: onDeep ? 'rgba(245,248,250,0.7)' : 'var(--text-2)', bg: 'transparent',  bd: 'var(--border)',        dot: false },
  };
  const s = map[kind] ?? map.neutral;
  return (
    <span
      className="ork-micro inline-flex items-center gap-1.5"
      style={{
        height: 24, padding: '0 10px', borderRadius: 999,
        color: s.fg, background: onDeep ? 'rgba(255,255,255,0.06)' : s.bg, border: `1px solid ${onDeep ? 'rgba(255,255,255,0.16)' : s.bd}`,
        letterSpacing: '0.1em',
      }}
    >
      {s.dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: s.fg }} /> : null}
      {children}
    </span>
  );
}

/** A hairline panel. The card layer, without the shadow pile-up the brief bans. */
export function Panel({ children, className = '', hover = false, accent = undefined, style = undefined, ...rest }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color var(--duration-normal) var(--ease-standard), transform var(--duration-normal) var(--ease-standard)',
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.borderColor = accent || 'var(--border-strong)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
