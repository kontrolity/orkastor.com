import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, ArrowUpRight } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';
import { useWaitlistModal } from './WaitlistModal';

const DISCORD_URL = 'https://discord.gg/GKpbU3pQ';

const DiscordIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.02.048.035.088.068.107a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

/* ── Nav structure ───────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: 'Product',
    items: [
      { label: 'Features',      href: '/#features' },
      { label: 'OrkaAI',        href: '/#platform' },
      { label: 'KubēGraf',      href: '/#kubegraf' },
      { label: 'Integrations',  href: '/#integrations' },
      { label: 'Pricing',       href: '/pricing' },
    ],
  },
  {
    label: 'Docs',
    items: [
      { label: 'Getting Started', href: '/docs' },
      { label: 'API Reference',   href: '/docs' },
      { label: 'CLI Reference',   href: '/docs' },
      { label: 'Changelog',       href: '/changelog' },
    ],
  },
  // Direct links (no dropdown)
  { label: 'Pricing',    href: '/pricing' },
  { label: 'KubēGraf',  href: 'https://kubegraf.io', external: true },
  { label: 'About',     href: '/about' },
];

/* ── Desktop dropdown panel ──────────────────────────────────── */
function DropdownPanel({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.13, ease: [0.4, 0, 0.2, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-44"
    >
      <div
        className="rounded-xl border border-white/[0.08] py-1.5"
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
function NavItem({ navItem, linkCls }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const hasDropdown = !!navItem.items;

  useEffect(() => {
    if (!hasDropdown) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [hasDropdown]);

  useEffect(() => {
    if (!hasDropdown) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [hasDropdown]);

  if (!hasDropdown) {
    return (
      <a
        href={navItem.href}
        target={navItem.external ? '_blank' : undefined}
        rel={navItem.external ? 'noopener noreferrer' : undefined}
        className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${linkCls}`}
      >
        {navItem.label}
        {navItem.external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
      </a>
    );
  }

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
        className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${linkCls}`}
      >
        {navItem.label}
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && <DropdownPanel items={navItem.items} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Mobile menu ─────────────────────────────────────────────── */
function MobileNavItem({ navItem, onClose }) {
  const [open, setOpen] = useState(false);

  if (!navItem.items) {
    return (
      <a
        href={navItem.href}
        target={navItem.external ? '_blank' : undefined}
        rel={navItem.external ? 'noopener noreferrer' : undefined}
        onClick={onClose}
        className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
      >
        {navItem.label}
        {navItem.external && <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all text-sm"
      >
        {navItem.label}
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
              {navItem.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors group"
                >
                  {item.label}
                  {item.external && <ArrowUpRight className="w-3 h-3 text-slate-600 shrink-0" />}
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
  const { setOpen: openWaitlist } = useWaitlistModal();
  const linkCls  = 'text-slate-400 hover:text-white hover:bg-white/[0.05]';
  const signInCls = 'text-slate-400 hover:text-white';

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
        className="fixed left-0 right-0 z-50 transition-all duration-300"
        style={scrolled
          ? { top: 'var(--banner-height, 0px)', background: 'rgba(19,19,22,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }
          : { top: 'var(--banner-height, 0px)', background: 'transparent', backdropFilter: 'none', borderBottom: '1px solid transparent' }
        }
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
              <NavItem key={item.label} navItem={item} linkCls={linkCls} />
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className={`text-sm transition-colors px-3 py-2 ${signInCls}`}>
              Sign In
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Join Orkastor Discord Community"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#5865F2' }}
            >
              <DiscordIcon className="w-4 h-4" />
              Discord
            </a>
            <button
              onClick={() => openWaitlist(true)}
              className="btn-clerk-primary inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm cursor-pointer"
            >
              Get Early Access
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
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
                navItem={item}
                onClose={() => setMenuOpen(false)}
              />
            ))}
            <div className="mt-2 pt-2 border-t border-white/[0.06] px-2 pb-1 space-y-2">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: '#5865F2' }}
                onClick={() => setMenuOpen(false)}
              >
                <DiscordIcon className="w-4 h-4" />
                Join Discord Community
              </a>
              <button
                onClick={() => { setMenuOpen(false); openWaitlist(true); }}
                className="btn-clerk-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold cursor-pointer"
              >
                Get Early Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
