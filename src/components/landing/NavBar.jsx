import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, ChevronRight, ExternalLink,
  Lock, Shield, Search, CheckCircle2,
  Activity, Layers, GitBranch,
  LayoutGrid, Terminal, Map,
  BookOpen, Code, Github, Zap,
} from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

/* ── Nav item data ───────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: 'Features',
    items: [
      {
        icon: Lock,
        color: '#2dd4bf',
        title: 'Private AI — Zero Exfiltration',
        desc: 'AI inference inside your VPC. No external LLM calls.',
        href: '#features',
      },
      {
        icon: Shield,
        color: '#3b82f6',
        title: 'SafeFix™ Auto-Remediation',
        desc: 'AI-generated fixes with mandatory human approval gate.',
        href: '#safefix',
      },
      {
        icon: Search,
        color: '#8b5cf6',
        title: 'AI Root Cause Analysis',
        desc: 'Confidence-scored evidence chains across all signals.',
        href: '#features',
      },
      {
        icon: CheckCircle2,
        color: '#f59e0b',
        title: 'Human Approval Gate',
        desc: 'No silent changes. Full audit trail on every action.',
        href: '#safefix',
      },
    ],
  },
  {
    label: 'KubēGraf',
    items: [
      {
        icon: Activity,
        color: '#2dd4bf',
        title: 'Overview',
        desc: 'AI SRE for Kubernetes — in-cluster monitoring & auto-fix.',
        href: '#kubegraf',
      },
      {
        icon: ExternalLink,
        color: '#34d399',
        title: 'Try KubēGraf Free',
        desc: 'Deploy inside your cluster in minutes.',
        href: 'https://kubegraf.io',
        external: true,
      },
      {
        icon: Layers,
        color: '#60a5fa',
        title: 'Integrations',
        desc: 'Kubernetes, AWS, Datadog, PagerDuty + 40 more.',
        href: '#integrations',
      },
      {
        icon: GitBranch,
        color: '#94a3b8',
        title: 'Changelog',
        desc: 'Latest releases and what\'s new in KubēGraf.',
        href: '#',
      },
    ],
  },
  {
    label: 'Platform',
    items: [
      {
        icon: LayoutGrid,
        color: '#3b82f6',
        title: 'Module Overview',
        desc: 'All current and upcoming Orkastor modules.',
        href: '#platform',
      },
      {
        icon: Zap,
        color: '#2dd4bf',
        title: 'Integrations',
        desc: 'Works with your entire DevOps stack.',
        href: '#integrations',
      },
      {
        icon: Terminal,
        color: '#94a3b8',
        title: 'CLI Reference',
        desc: 'Install and configure via homebrew.',
        href: '#',
      },
      {
        icon: Map,
        color: '#a78bfa',
        title: 'Roadmap',
        desc: 'See what\'s coming next on the platform.',
        href: '#',
      },
    ],
  },
  {
    label: 'Docs',
    items: [
      {
        icon: BookOpen,
        color: '#3b82f6',
        title: 'Documentation',
        desc: 'Get started guides, tutorials and concepts.',
        href: '#',
      },
      {
        icon: Code,
        color: '#60a5fa',
        title: 'API Reference',
        desc: 'REST API and webhook integration docs.',
        href: '#',
      },
      {
        icon: Github,
        color: '#e2e8f0',
        title: 'GitHub',
        desc: 'Operators, examples and community.',
        href: '#',
      },
      {
        icon: Activity,
        color: '#34d399',
        title: 'Status Page',
        desc: 'Real-time system health and incidents.',
        href: '#',
      },
    ],
  },
];

/* ── Desktop dropdown panel ──────────────────────────────────── */
function DropdownPanel({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      /* pt-3 creates transparent buffer so mouse can travel to panel */
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-72"
    >
      <div className="glass-dark rounded-2xl border border-white/[0.09] shadow-2xl shadow-black/60 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors duration-150 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border"
                style={{
                  background: `${item.color}14`,
                  borderColor: `${item.color}28`,
                  color: item.color,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-white/80 group-hover:text-white flex items-center gap-1.5 transition-colors duration-150">
                  {item.title}
                  {item.external && <ExternalLink className="w-2.5 h-2.5 opacity-40" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
              </div>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Desktop nav item with dropdown ─────────────────────────── */
function NavItem({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  /* Close on Escape */
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
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 opacity-40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-sub"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-3 pt-1 pb-1 space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        background: `${item.color}14`,
                        borderColor: `${item.color}28`,
                        color: item.color,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                        {item.title}
                        {item.external && <ExternalLink className="w-2.5 h-2.5 opacity-40" />}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{item.desc}</div>
                    </div>
                  </a>
                );
              })}
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
      {/* ── Nav bar ── */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[400ms] ${
          scrolled ? 'glass-dark border-b border-white/[0.07]' : 'bg-transparent'
        }`}
      >
        {/* Specular bottom border on scroll */}
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

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} label={item.label} items={item.items} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2"
            >
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
            transition={{ duration: 0.2 }}
            className="fixed top-[76px] left-3 right-3 z-50 glass-dark rounded-2xl p-2 md:hidden border border-white/[0.08] max-h-[calc(100vh-100px)] overflow-y-auto"
          >
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                label={item.label}
                items={item.items}
                onClose={() => setMenuOpen(false)}
              />
            ))}
            <div className="mt-2 pt-2 border-t border-white/[0.07] px-2 pb-1">
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
