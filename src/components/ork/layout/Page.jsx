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
 * A product page's opening panel. Deep in both themes, like the home hero, so
 * the two products' pages feel like rooms in the same building.
 */
export function ProductHero({ eyebrow = undefined, title = undefined, titleB = undefined, sub = undefined, accent = 'var(--cloud-bright)', children = undefined, badge = undefined }) {
  return (
    <section className="relative overflow-hidden"
             style={{ background: 'linear-gradient(168deg, #0B2A4A 0%, #050B12 70%)', color: '#F5F8FA' }}>
      <div aria-hidden="true" className="ork-grid" style={{ opacity: 0.5 }} />
      <div aria-hidden="true" className="absolute inset-0"
           style={{ background: `radial-gradient(ellipse 62% 46% at 22% -6%, ${accent}22, transparent 60%)` }} />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8 pt-[124px] pb-[80px] sm:pt-[148px] sm:pb-[96px]">
        <div className="flex items-center gap-3 mb-5">
          <span className="ork-micro" style={{ color: accent }}>{eyebrow}</span>
          {badge}
        </div>
        <h1 className="ork-display-xl" style={{ color: '#F5F8FA', maxWidth: 900 }}>
          {title}
          {titleB ? <><br /><span style={{ color: accent }}>{titleB}</span></> : null}
        </h1>
        {sub ? <p className="ork-sub mt-6" style={{ color: 'rgba(245,248,250,0.66)', maxWidth: 640 }}>{sub}</p> : null}
        {children}
      </div>
    </section>
  );
}

export default Page;
