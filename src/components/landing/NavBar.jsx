import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

/* ── Nav data — sections with optional headings ──────────────── */
const NAV_ITEMS = [
  {
    label: 'Features',
    width: 'w-[320px]',
    sections: [
      {
        heading: 'Core Capabilities',
        items: [
          {
            title: 'Private AI & Zero Exfiltration',
            desc: 'AI inference runs entirely inside your VPC — zero external LLM calls.',
            href: '#features',
          },
          {
            title: 'AI Root Cause Analysis',
            desc: 'Correlates logs, metrics, events and deployments into a confidence-scored evidence chain.',
            href: '#features',
          },
          {
            title: 'SafeFix™ Auto-Remediation',
            desc: 'AI-generated fixes, dry-run validated, applied only after your explicit approval.',
            href: '#safefix',
          },
          {
            title: 'Dry-Run Validation',
            desc: 'Every proposed change tested against your OPA policies before touching production.',
            href: '#safefix',
          },
        ],
      },
      {
        heading: 'Safety & Control',
        items: [
          {
            title: 'Human Approval Gate',
            desc: 'Immutable audit trail on every action. No silent changes, ever.',
            href: '#safefix',
          },
          {
            title: '100% In-Environment',
            desc: 'Runs as a Kubernetes operator inside your cluster, zero external SaaS dependencies.',
            href: '#platform',
          },
        ],
      },
    ],
  },
  {
    label: 'KubēGraf',
    width: 'w-[300px]',
    sections: [
      {
        heading: 'Product',
        items: [
          {
            title: 'Overview',
            desc: 'In-cluster AI SRE for Kubernetes — monitoring, correlation and auto-fix.',
            href: '#kubegraf',
          },
          {
            title: 'Integrations',
            desc: 'Works with Kubernetes, Prometheus, Datadog, PagerDuty, Slack and 40+ more.',
            href: '#integrations',
          },
          {
            title: 'Changelog',
            desc: 'Latest releases, bug fixes and performance improvements.',
            href: '#',
          },
        ],
      },
      {
        heading: 'Get Started',
        items: [
          {
            title: 'Try KubēGraf Free',
            desc: 'Deploy inside your cluster in under 5 minutes. No credit card required.',
            href: 'https://kubegraf.io',
            external: true,
          },
          {
            title: 'Read the Docs',
            desc: 'Installation guides, configuration reference and API documentation.',
            href: '#',
          },
        ],
      },
    ],
  },
  {
    label: 'Platform',
    width: 'w-[300px]',
    sections: [
      {
        heading: 'Modules',
        items: [
          {
            title: 'KubēGraf',
            desc: 'AI SRE for Kubernetes.',
            href: '#kubegraf',
            badge: 'Live',
          },
          {
            title: 'CostAI',
            desc: 'Cloud cost intelligence, anomaly detection and rightsizing.',
            href: '#platform',
            badge: 'Soon',
          },
          {
            title: 'SecuBot',
            desc: 'Security posture monitoring, drift detection and compliance.',
            href: '#platform',
            badge: 'Soon',
          },
          {
            title: 'NetSentinel',
            desc: 'Network anomaly detection and automated incident response.',
            href: '#platform',
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'Developer',
        items: [
          {
            title: 'CLI Reference',
            desc: 'Full command reference, flags and examples for the Orkastor CLI.',
            href: '#',
          },
          {
            title: 'Integrations',
            desc: 'Connectors for every tool in your DevOps stack.',
            href: '#integrations',
          },
          {
            title: 'Roadmap',
            desc: 'Public roadmap — see what the team is building next.',
            href: '#',
          },
        ],
      },
    ],
  },
  {
    label: 'Docs',
    width: 'w-[300px]',
    sections: [
      {
        heading: 'Documentation',
        items: [
          {
            title: 'Getting Started',
            desc: 'Up and running in under 5 minutes with the quickstart guide.',
            href: '#',
          },
          {
            title: 'API Reference',
            desc: 'Complete REST API, webhooks and event schema reference.',
            href: '#',
          },
          {
            title: 'CLI Reference',
            desc: 'All commands, subcommands, flags and configuration options.',
            href: '#',
          },
          {
            title: 'Architecture',
            desc: 'How Orkastor components work inside your Kubernetes cluster.',
            href: '#',
          },
        ],
      },
      {
        heading: 'Community',
        items: [
          {
            title: 'GitHub',
            desc: 'Source code, open issues and community contributions.',
            href: '#',
            external: true,
          },
          {
            title: 'Status Page',
            desc: 'Live system health, uptime history and incident reports.',
            href: '#',
          },
          {
            title: 'Community Slack',
            desc: 'Join 500+ DevOps engineers and SRE practitioners.',
            href: '#',
            external: true,
          },
        ],
      },
    ],
  },
];

/* ── Desktop dropdown panel ──────────────────────────────────── */
function DropdownPanel({ sections, width }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
      /* pt-3: transparent buffer so mouse can travel from trigger to panel */
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 ${width}`}
    >
      <div
        className="rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{
          background: 'rgba(8, 8, 10, 0.96)',
          backdropFilter: 'blur(24px) saturate(160%)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
      >
        {sections.map((section, si) => (
          <div key={si}>
            {si > 0 && (
              <div className="mx-3 border-t border-white/[0.05]" />
            )}

            {/* Section heading */}
            <div className="px-4 pt-3 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                {section.heading}
              </span>
            </div>

            {/* Items */}
            <div className="px-2 pb-2">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="flex items-start justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors duration-100 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors duration-100">
                        {item.title}
                      </span>
                      {item.external && (
                        <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 group-hover:text-slate-500 mt-0.5 leading-snug transition-colors duration-100">
                      {item.desc}
                    </p>
                  </div>

                  {item.badge && (
                    <span
                      className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${
                        item.badge === 'Live'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                          : 'bg-white/[0.04] text-slate-600 border border-white/[0.07]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Desktop nav item with dropdown ─────────────────────────── */
function NavItem({ label, sections, width }) {
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
        {open && <DropdownPanel sections={sections} width={width} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Mobile accordion item ───────────────────────────────────── */
function MobileNavItem({ label, sections, onClose }) {
  const [open, setOpen] = useState(false);

  /* Flatten all items across sections for mobile */
  const allItems = sections.flatMap((s) => s.items);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all text-sm"
      >
        <span>{label}</span>
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
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-2 pt-0.5 pb-2 space-y-0.5">
              {allItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium text-slate-400 group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                      {item.external && (
                        <ArrowUpRight className="w-3 h-3 text-slate-600 shrink-0" />
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                        item.badge === 'Live'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                          : 'bg-white/[0.04] text-slate-600 border border-white/[0.07]'
                      }`}
                    >
                      {item.badge}
                    </span>
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
              <NavItem
                key={item.label}
                label={item.label}
                sections={item.sections}
                width={item.width}
              />
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

      {/* ── Mobile menu ── */}
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
              background: 'rgba(8, 8, 10, 0.97)',
              backdropFilter: 'blur(24px) saturate(160%)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                label={item.label}
                sections={item.sections}
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
