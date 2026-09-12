import React, { Suspense, lazy } from 'react';
import { Navbar } from '../nav/Navbar';
import { CursorLight, ScrollProgress } from '../motion/Effects';
import { useSeo } from '@/hooks/useSeo';

const Footer = lazy(() => import('./Footer'));

/**
 * The shell every route shares: theme scope, chrome, effects, footer, SEO.
 *
 * Exists so a new route cannot forget half of it — the previous site set
 * `document.title` per page and nothing else, so every route shipped the home
 * page's description, canonical and OG tags. One shell means one place that can
 * be wrong, instead of nine.
 *
 * `onDeep` is passed through to the nav for pages that open on a dark panel.
 */
export function Page({ seo, onDeep = false, children }) {
  useSeo(seo);
  return (
    <div className="ork min-h-screen relative">
      <CursorLight />
      <ScrollProgress />
      <Navbar onDeep={onDeep} />
      <main>{children}</main>
      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
}

/**
 * A product page's opening panel. It follows the page ground now — white in
 * light, the navy in dark — via --deep-bg, so the two products' pages are
 * still rooms in the same building whichever theme you are in.
 *
 * ── TWO ACCENT PROPS, NOT ONE ───────────────────────────────────────────────
 *
 * `accent` is a DISPLAY hex and is only ever a glow. `accentText` is what the
 * eyebrow and the second headline line are painted with. They were one prop,
 * and that prop was doing both jobs with the display value — which was
 * survivable on navy and is not on white: #48CBCB measures 1.85:1 there and
 * #FF8A3D 2.60:1, on a 60px headline line.
 *
 * `accent` must stay a literal hex because the glow appends an alpha pair to
 * it (`${accent}22`). Passing a `var(--x)` produces `var(--x)22`, which is not
 * a colour, and the whole gradient is dropped — silently, since an invalid
 * background just does not paint. That is why the old default never glowed.
 */
export function ProductHero({ eyebrow = undefined, title = undefined, titleB = undefined, sub = undefined, accent = '#48CBCB', accentText = 'var(--cloud-text)', children = undefined, badge = undefined }) {
  return (
    <section className="relative overflow-hidden"
             style={{ background: 'var(--deep-bg)', color: 'var(--deep-ink)' }}>
      <div aria-hidden="true" className="ork-grid" style={{ opacity: 0.5 }} />
      <div aria-hidden="true" className="absolute inset-0"
           style={{ background: `radial-gradient(ellipse 62% 46% at 22% -6%, ${accent}22, transparent 60%)` }} />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8 pt-[124px] pb-[80px] sm:pt-[148px] sm:pb-[96px]">
        <div className="flex items-center gap-3 mb-5">
          <span className="ork-micro" style={{ color: accentText }}>{eyebrow}</span>
          {badge}
        </div>
        <h1 className="ork-display-xl" style={{ color: 'var(--deep-ink)', maxWidth: 900 }}>
          {title}
          {titleB ? <><br /><span style={{ color: accentText }}>{titleB}</span></> : null}
        </h1>
        {sub ? <p className="ork-sub mt-6" style={{ color: 'var(--deep-ink-muted)', maxWidth: 640 }}>{sub}</p> : null}
        {children}
      </div>
    </section>
  );
}

export default Page;
