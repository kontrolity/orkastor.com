import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import OrkastorLogo from '@/components/landing/OrkastorLogo';
import { KUBEGRAF_URL } from './shared';

const LINKS = [
  { label: 'KubeGraf', href: '/#kubegraf' },
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Platform', href: '/#platform' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target) || toggleRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled
          ? {
              background: 'rgba(250,248,244,0.82)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              borderBottom: '1px solid var(--lp-line-soft)',
            }
          : { background: 'transparent', borderBottom: '1px solid transparent' }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-4">
          <a href="/" aria-label="Orkastor home" className="shrink-0">
            <OrkastorLogo size={38} showWordmark light />
          </a>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="lp-navlink px-3.5 py-2 text-[14px] font-medium"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href={KUBEGRAF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-dark lp-btn-sm group"
            >
              Launch KubeGraf
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button
            ref={toggleRef}
            className="lg:hidden p-2 -mr-2 rounded-lg"
            style={{ color: 'var(--lp-ink)' }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="fixed left-3 right-3 top-[76px] z-50 rounded-2xl p-2 lg:hidden"
            style={{
              background: 'rgba(255,255,255,0.97)',
              border: '1px solid var(--lp-line)',
              boxShadow: '0 20px 60px rgba(22,24,29,0.16)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[15px] font-medium rounded-xl transition-colors hover:bg-black/[0.04]"
                style={{ color: 'var(--lp-ink)' }}
              >
                {l.label}
              </a>
            ))}
            <div className="p-2 pt-3" style={{ borderTop: '1px solid var(--lp-line-soft)' }}>
              <a
                href={KUBEGRAF_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="lp-btn-dark w-full"
              >
                Launch KubeGraf
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
