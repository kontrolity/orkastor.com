import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { OrkastorLogo } from '../brand/Logo';
import { Container } from '../ui';
import { PRODUCTS, LINKS } from '@/content/site';

/**
 * The company's navigation, not a product's.
 *
 * Both products sit under one Products group at the same level, each showing its
 * STATUS in the menu — a visitor should learn Domineta is invitation-only here,
 * before committing to a click, rather than at the end of one.
 *
 * ── `onDeep` IS A PROP, NOT A ROUTE SNIFF ───────────────────────────────────
 *
 * Pages whose first section is the deep navy panel pass `onDeep`; the unscrolled
 * bar is transparent, so its ink has to match what is actually behind it. Reading
 * the pathname instead would break the moment a page changed its own hero, and
 * would need updating in a file nobody edits when they redesign a page.
 *
 * Once scrolled the bar gets its own surface, so `onDeep` stops applying — the
 * ground under the text is the bar itself from then on.
 */
export function Navbar({ onDeep = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(false);
  const menuRef = useRef(null);
  const closeTimer = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes whichever is open, and a route-level click outside closes the
  // mobile sheet. Without the Escape handler the sheet is a keyboard trap.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setProducts(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const inv = onDeep && !scrolled;
  const ink = inv ? 'var(--deep-ink)' : 'var(--text)';
  const inkMuted = inv ? 'var(--deep-ink-muted)' : 'var(--text-2)';

  // Hover-open with a close DELAY. Without it, the 8px gap between the trigger
  // and the panel closes the menu as the pointer crosses it.
  const openNow = () => { window.clearTimeout(closeTimer.current); setProducts(true); };
  const closeSoon = () => { closeTimer.current = window.setTimeout(() => setProducts(false), 140); };

  return (
    <>
      {/* ⚠ The scrolled chrome moved from this inline style into .ork-nav /
          .is-scrolled. It had to: `backdrop-filter` was set inline, and an
          inline style cannot be overridden by a media query — so there was no
          way to turn the blur off on phones, where it is the most expensive
          thing in the header. See the mobile block in mono.css. */}
      <header
        className={`ork-nav fixed top-0 left-0 right-0 z-50 pt-[18px] sm:pt-[26px]${scrolled ? ' is-scrolled' : ''}`}
      >
        <Container wide className="ork-nav-inner h-[64px] flex items-center justify-between gap-4">
          <a href="/" aria-label="Orkastor home" style={{ color: ink }} className="shrink-0 inline-flex items-center leading-none">
            {/* 44, not 38: the mark is fine-stroked line art and at 38 in a
                64px bar it read as a faint smudge next to a solid wordmark.
                The lockup crop is 346x106, so 2x stays sharp up to ~53px —
                this keeps a margin under that ceiling. */}
            <OrkastorLogo size={44} />
          </a>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
              <button
                type="button"
                aria-expanded={products}
                aria-haspopup="true"
                onFocus={openNow}
                onClick={() => setProducts((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 text-[14px] font-medium rounded-full"
                style={{ color: inkMuted }}
              >
                Products
                <ChevronDown size={14} className="transition-transform" style={{ transform: products ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* ⚠ ALWAYS MOUNTED, toggled by a class. This was AnimatePresence
                  + motion.div, which pulled framer-motion into the main bundle
                  — 38 kB gzipped on every page of the site, for two fades.
                  .ork-pop does the same 160ms fade-and-rise in CSS, and
                  transitions `visibility` so the panel leaves the tab order
                  and the accessibility tree when closed rather than merely
                  being invisible. */}
              <div className={`ork-pop absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[368px]${products ? ' is-open' : ''}`}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 6, boxShadow: '0 20px 56px -16px rgba(5,11,18,0.34)' }}>
                      {PRODUCTS.map((p) => (
                        <a key={p.key} href={p.href}
                           {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                           className="block px-3.5 py-3 rounded-[10px]" style={{ transition: 'background-color 140ms' }}
                           onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                          <span className="flex items-center gap-2">
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: p.dot, flexShrink: 0 }} />
                            <span className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{p.name}</span>
                            <span className="ork-micro ml-auto" style={{ color: 'var(--text-3)' }}>{p.status}</span>
                          </span>
                          <span className="block ork-small mt-1" style={{ color: 'var(--text-2)', paddingLeft: 14 }}>{p.tagline}</span>
                        </a>
                      ))}
                    </div>
              </div>
            </div>

            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="px-3.5 h-9 inline-flex items-center text-[14px] font-medium rounded-full" style={{ color: inkMuted }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* The toggle was written but never mounted, because `forcedTheme`
              made it inert — next-themes ignores setTheme while a theme is
              forced, so a rendered control would have done nothing. The force
              is gone (see App.jsx), so it goes in. */}
          {/* "Sign in" sat here, linking to app.kubegraf.io. Removed from the
              header — both here and in the mobile sheet below, because they are
              one control at two breakpoints and leaving the mobile one would
              put it back on every phone. The footer's own Sign in link is
              untouched. */}
          {/* The ThemeToggle sat here, and in the mobile sheet below. Both
              are gone: the site is forced to light in App.jsx, so the control
              could not change anything. A dead switch on screen is worse than
              no switch. Restoring it is re-adding the import and these two
              call sites. */}

          {/* ⚠ 44x44, NOT `p-2`. It was 8px of padding around a 20px icon —
              a 36px target, under the 44px minimum this codebase holds itself
              to elsewhere (the hero CTA comment cites the same number). The
              icon is unchanged; the hit area grew around it.

              `-mr-3` pulls the BOX back so the icon still sits on the
              container's optical right edge: a 44px target aligned by its
              box would look inset next to the 20px glyph it contains. */}
          <button
            type="button"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center -mr-3"
            style={{ color: ink }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="ork-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </Container>
      </header>

      <div
        ref={menuRef}
        id="ork-mobile-nav"
        className={`ork-pop fixed left-4 right-4 top-[88px] sm:top-[96px] z-50 lg:hidden p-2${open ? ' is-open' : ''}`}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 60px -18px rgba(5,11,18,0.4)' }}
      >
            {/* Products becomes a titled group on mobile: a hover disclosure is a
                dead control without a pointer. */}
            <p className="ork-micro px-3 pt-3 pb-1" style={{ color: 'var(--text-3)' }}>Products</p>
            {PRODUCTS.map((p) => (
              <a key={p.key} href={p.href}
                 {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                 onClick={() => setOpen(false)} className="block px-3 py-3 rounded-[10px]">
                <span className="flex items-center gap-2">
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: p.dot }} />
                  <span className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{p.name}</span>
                  <span className="ork-micro ml-auto" style={{ color: 'var(--text-3)' }}>{p.status}</span>
                </span>
                <span className="block ork-small mt-0.5" style={{ color: 'var(--text-2)', paddingLeft: 14 }}>{p.tagline}</span>
              </a>
            ))}
            <div className="my-2" style={{ borderTop: '1px solid var(--border-soft)' }} />
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-3 text-[15px] font-medium rounded-[10px]" style={{ color: 'var(--text)' }}>
                {l.label}
              </a>
            ))}
      </div>
    </>
  );
}

export default Navbar;
