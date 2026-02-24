import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'SafeFix',      href: '#safefix' },
  { label: 'CLI',          href: '#cli' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Docs',         href: '#' },
];

export default function NavBar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [visible, setVisible]     = useState(true);
  const lastScrollY               = React.useRef(0);

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
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-cyan/10 via-brand-violet/10 to-brand-cyan/10 border-b border-white/5 py-2 px-4 text-center text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/15 border border-blue-500/25 rounded-full text-blue-400 text-[11px] font-semibold tracking-wide uppercase">
            Private Beta
          </span>
          Now accepting early access — join 1,200+ SREs on the waitlist
          <a href="#cta" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
            Apply →
          </a>
        </span>
      </div>

      {/* Nav bar */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-[33px] left-0 right-0 z-50 transition-all duration-[400ms] ${
          scrolled
            ? 'glass-dark border-b border-white/[0.07]'
            : 'bg-transparent'
        }`}
      >
        {/* Specular bottom border on scroll */}
        {scrolled && (
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 30%, rgba(16,185,129,0.2) 70%, transparent 100%)',
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between">
          {/* Logo */}
          <a href="/" aria-label="Orkastor home">
            <OrkastorLogo size={48} showWordmark={true} />
          </a>

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
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
            transition={{ duration: 0.2 }}
            className="fixed top-[109px] left-3 right-3 z-50 glass-dark rounded-2xl p-4 md:hidden border border-white/[0.08]"
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all text-sm"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-white/[0.07]">
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
