import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import OrkastorMark from '@/components/landing/OrkastorMark';
import { KUBEGRAF_URL, LOGIN_URL, SIGNUP_URL } from './shared';

/**
 * ── THE NAV IS THE PARENT'S NAV NOW ─────────────────────────────────────────
 *
 * It used to be eight flat links, five of which were KubeGraf's own sections
 * (#features, #security, #platform) and whose CTA was "Launch KubeGraf". So the
 * company's navigation was one product's navigation, and Orkastor Cloud was a
 * single word between them.
 *
 * Now: the two products sit together under one Products group, at the same
 * level, with their status visible before the click. Everything that was a
 * KubeGraf section anchor moved to /kubegraf with the argument it belongs to.
 *
 * `status` is rendered in the menu, not just stored. A visitor should learn that
 * Cloud is a waitlist here rather than after committing to a click.
 */
const PRODUCTS = [
  {
    label: 'KubeGraf',
    href: '/kubegraf',
    blurb: 'Observability + autonomous SRE for your own clusters',
    status: 'Live',
    accent: 'var(--lp-orange)',
  },
  {
    label: 'Orkastor Cloud',
    href: '/cloud',
    blurb: 'Dev and test environments we run for you',
    status: 'Waitlist',
    accent: 'var(--ork-teal)',
  },
];

const LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'About', href: '/about' },
];

/**
 * `onDark` — set by pages whose first section is the navy umbrella hero.
 *
 * The unscrolled nav is transparent, so its ink has to match whatever is behind
 * it. Before the redesign that was always cream. The home hero is navy now, and
 * a nav that kept `--lp-ink` there would be near-invisible dark-on-dark. It is a
 * PROP rather than a route check because /pricing and /about still open light,
 * and a component that guesses from the URL breaks the moment a page changes its
 * own hero.
 */
export default function Nav({ onDark = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  // Inverted only while transparent. Once the glass panel is behind it, the
  // surface is cream again whatever the page below is.
  const inv = onDark && !scrolled;
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
            <OrkastorMark size={40} showWordmark light={!inv} />
          </a>

          <nav
            className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
            style={inv ? { color: 'var(--ork-on-navy)' } : undefined}
          >
            {/* Products — hover AND focus, so it is reachable by keyboard. A
                hover-only disclosure is invisible to anyone tabbing. */}
            <div
              className="relative"
              onMouseEnter={() => setProdOpen(true)}
              onMouseLeave={() => setProdOpen(false)}
            >
              <button
                type="button"
                className={`px-3.5 py-2 text-[14px] font-medium whitespace-nowrap inline-flex items-center gap-1.5 ${inv ? '' : 'lp-navlink'}`}
                style={inv ? { color: 'var(--ork-on-navy)' } : undefined}
                aria-expanded={prodOpen}
                aria-haspopup="true"
                onFocus={() => setProdOpen(true)}
                onClick={() => setProdOpen((v) => !v)}
              >
                Products
                <ChevronDown size={14} className={`transition-transform ${prodOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {prodOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[340px]"
                  >
                    <div
                      className="rounded-2xl overflow-hidden p-1.5"
                      style={{
                        background: 'var(--lp-surface)',
                        border: '1px solid var(--lp-line)',
                        boxShadow: '0 18px 50px -12px rgba(11,42,74,0.28)',
                      }}
                    >
                      {PRODUCTS.map((pr) => (
                        <a
                          key={pr.label}
                          href={pr.href}
                          className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-black/[0.035]"
                        >
                          <span className="flex items-center gap-2 mb-0.5">
                            <span
                              className="w-[6px] h-[6px] rounded-full shrink-0"
                              style={{ background: pr.accent }}
                            />
                            <span className="text-[14px] font-semibold" style={{ color: 'var(--lp-ink)' }}>
                              {pr.label}
                            </span>
                            <span
                              className="ml-auto text-[10.5px] font-semibold uppercase"
                              style={{ letterSpacing: '0.08em', color: 'var(--lp-ink-3)' }}
                            >
                              {pr.status}
                            </span>
                          </span>
                          <span className="block text-[12.5px] leading-[1.45] pl-[14px]" style={{ color: 'var(--lp-ink-2)' }}>
                            {pr.blurb}
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className={`px-3.5 py-2 text-[14px] font-medium whitespace-nowrap ${inv ? '' : 'lp-navlink'}`}
                style={inv ? { color: 'var(--ork-on-navy)' } : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a
              href={LOGIN_URL}
              className={`px-3.5 py-2 text-[14px] font-medium ${inv ? '' : 'lp-navlink'}`}
              style={inv ? { color: 'var(--ork-on-navy)' } : undefined}
            >
              Log in
            </a>
            <a
              href={SIGNUP_URL}
              className="lp-btn-primary lp-btn-sm group"
            >
              Sign up
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button
            ref={toggleRef}
            className="lg:hidden p-2 -mr-2 rounded-lg"
            style={{ color: inv ? 'var(--ork-on-navy)' : 'var(--lp-ink)' }}
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
            {/* Products first, and labelled. On mobile there is no hover, so the
                desktop disclosure has to become a plain titled group — a
                dropdown that needs a pointer is a dead control on a phone. */}
            <p
              className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase"
              style={{ letterSpacing: '0.12em', color: 'var(--lp-ink-3)' }}
            >
              Products
            </p>
            {PRODUCTS.map((pr) => (
              <a
                key={pr.label}
                href={pr.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl transition-colors hover:bg-black/[0.04]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: pr.accent }} />
                  <span className="text-[15px] font-semibold" style={{ color: 'var(--lp-ink)' }}>{pr.label}</span>
                  <span
                    className="ml-auto text-[10.5px] font-semibold uppercase"
                    style={{ letterSpacing: '0.08em', color: 'var(--lp-ink-3)' }}
                  >
                    {pr.status}
                  </span>
                </span>
                <span className="block text-[12.5px] leading-[1.45] pl-[14px] mt-0.5" style={{ color: 'var(--lp-ink-2)' }}>
                  {pr.blurb}
                </span>
              </a>
            ))}

            <div className="my-2" style={{ borderTop: '1px solid var(--lp-line-soft)' }} />

            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[15px] font-medium rounded-xl transition-colors hover:bg-black/[0.04]"
                style={{ color: 'var(--lp-ink)' }}
              >
                {l.label}
              </a>
            ))}
            <div className="p-2 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--lp-line-soft)' }}>
              <a
                href={SIGNUP_URL}
                onClick={() => setOpen(false)}
                className="lp-btn-primary w-full"
              >
                Sign up
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href={LOGIN_URL}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[15px] font-medium rounded-xl text-center transition-colors hover:bg-black/[0.04]"
                style={{ color: 'var(--lp-ink)' }}
              >
                Log in
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
