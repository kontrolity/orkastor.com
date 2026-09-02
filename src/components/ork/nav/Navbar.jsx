import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { OrkastorLogo } from '../brand/Logo';
import { ThemeToggle } from './ThemeToggle';
import { Container } from '../ui';
import { PRODUCTS, LINKS, EXTERNAL } from '@/content/site';

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
  const ink = inv ? '#F5F8FA' : 'var(--text)';
  const inkMuted = inv ? 'rgba(245,248,250,0.72)' : 'var(--text-2)';

  // Hover-open with a close DELAY. Without it, the 8px gap between the trigger
  // and the panel closes the menu as the pointer crosses it.
  const openNow = () => { window.clearTimeout(closeTimer.current); setProducts(true); };
  const closeSoon = () => { closeTimer.current = window.setTimeout(() => setProducts(false), 140); };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          transition: 'background-color var(--duration-normal) var(--ease-standard), border-color var(--duration-normal) var(--ease-standard), backdrop-filter var(--duration-normal)',
          background: scrolled ? 'color-mix(in srgb, var(--bg) 82%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(150%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(150%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border-soft)' : 'transparent'}`,
        }}
      >
        <Container wide className="h-[64px] flex items-center justify-between gap-4">
          <a href="/" aria-label="Orkastor home" style={{ color: ink }} className="shrink-0">
            <OrkastorLogo size={28} />
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

              <AnimatePresence>
                {products ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[368px]"
                  >
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 6, boxShadow: '0 20px 56px -16px rgba(5,11,18,0.34)' }}>
                      {PRODUCTS.map((p) => (
                        <a key={p.key} href={p.href} className="block px-3.5 py-3 rounded-[10px]" style={{ transition: 'background-color 140ms' }}
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
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="px-3.5 h-9 inline-flex items-center text-[14px] font-medium rounded-full" style={{ color: inkMuted }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <ThemeToggle onDeep={inv} />
            <a href={EXTERNAL.kubegrafApp} className="text-[14px] font-medium" style={{ color: inkMuted }}>Sign in</a>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 -mr-2"
            style={{ color: ink }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </Container>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed left-4 right-4 top-[68px] z-50 lg:hidden p-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 60px -18px rgba(5,11,18,0.4)' }}
          >
            {/* Products becomes a titled group on mobile: a hover disclosure is a
                dead control without a pointer. */}
            <p className="ork-micro px-3 pt-3 pb-1" style={{ color: 'var(--text-3)' }}>Products</p>
            {PRODUCTS.map((p) => (
              <a key={p.key} href={p.href} onClick={() => setOpen(false)} className="block px-3 py-3 rounded-[10px]">
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
            <div className="flex items-center justify-between px-3 py-3 mt-1" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <a href={EXTERNAL.kubegrafApp} className="text-[15px] font-medium" style={{ color: 'var(--text)' }}>Sign in</a>
              <ThemeToggle />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
