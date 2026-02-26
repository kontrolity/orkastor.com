import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, ArrowUpRight } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

/* ── Nav data ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: 'Features',
    items: [
      { label: 'Overview',              href: '#features' },
      { label: 'SafeFix™ Workflow',     href: '#safefix' },
      { label: 'Root Cause Analysis',   href: '#features' },
      { label: 'Integrations',          href: '#integrations' },
    ],
  },
  {
    label: 'KubēGraf',
    items: [
      { label: 'Overview',        href: '#kubegraf' },
      { label: 'Documentation',   href: '#' },
      { label: 'Changelog',       href: '#' },
      { label: 'Try Free',        href: 'https://kubegraf.io', external: true },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'All Modules',    href: '#platform' },
      { label: 'Integrations',   href: '#integrations' },
      { label: 'CLI Reference',  href: '#' },
      { label: 'Roadmap',        href: '#' },
    ],
  },
  {
    label: 'Docs',
    items: [
      { label: 'Getting Started', href: '#' },
      { label: 'API Reference',   href: '#' },
      { label: 'GitHub',          href: '#', external: true },
      { label: 'Changelog',       href: '#' },
    ],
  },
];

/* ── Desktop dropdown panel ──────────────────────────────────── */
function DropdownPanel({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.13, ease: [0.4, 0, 0.2, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-48"
    >
      <div
        className="rounded-xl border border-white/[0.08] py-1.5 overflow-hidden"
        style={{
          background: 'rgba(10, 10, 12, 0.97)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className="flex items-center justify-between px-4 py-2 text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors duration-100 group"
          >
            {item.label}
            {item.external && (
              <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
            )}
          </a>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Desktop nav item ────────────────────────────────────────── */
function NavItem({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
          open
            ? 'text-white bg-white/[0.06]'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
        }`}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && <DropdownPanel items={items} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Mobile accordion item ───────────────────────────────────── */
function MobileNavItem({ label, items, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all text-sm"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 opacity-40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="sub"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-2 pt-0.5 pb-2">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors group"
                >
                  {item.label}
                  {item.external && (
                    <ArrowUpRight className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main NavBar ─────────────────────────────────────────────── */
export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible]   = useState(true);
  const lastScrollY              = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setVisible(y < lastScrollY.current || y < 80);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[400ms] ${
          scrolled ? 'glass-dark border-b border-white/[0.07]' : 'bg-transparent'
        }`}
      >
        {scrolled && (
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 30%, rgba(16,185,129,0.2) 70%, transparent 100%)' }}
          />
        )}

        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between">

          {/* Logo */}
          <a href="/" aria-label="Orkastor home">
            <OrkastorLogo size={48} showWordmark={true} />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} label={item.label} items={item.items} />
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
              Sign In
            </a>
            <a
              href="#cta"
              className="btn-shimmer inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Early Access
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[76px] left-3 right-3 z-50 rounded-2xl p-2 md:hidden border border-white/[0.08] max-h-[calc(100vh-100px)] overflow-y-auto"
            style={{
              background: 'rgba(10, 10, 12, 0.97)',
              backdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                label={item.label}
                items={item.items}
                onClose={() => setMenuOpen(false)}
              />
            ))}
            <div className="mt-2 pt-2 border-t border-white/[0.06] px-2 pb-1">
              <a
                href="#cta"
                onClick={() => setMenuOpen(false)}
                className="btn-shimmer w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
              >
                Get Early Access
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
