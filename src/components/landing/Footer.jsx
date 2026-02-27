import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

const LINKS = {
  Product: [
    { label: 'Platform',     href: '/#platform' },
    { label: 'KubēGraf',     href: 'https://kubegraf.io', external: true },
    { label: 'Integrations', href: '/#integrations' },
    { label: 'Pricing',      href: '/pricing' },
    { label: 'Changelog',    href: '/changelog' },
  ],
  Company: [
    { label: 'About',   href: '/about' },
    { label: 'Blog',    href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: 'mailto:hello@orkastor.com' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference',  href: '/docs' },
    { label: 'GitHub',         href: 'https://github.com/orkastor', external: true },
    { label: 'Status Page',    href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy',    href: '#' },
    { label: 'Terms of Service',  href: '#' },
    { label: 'Cookie Policy',     href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.07] overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(59,130,246,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-14">

          {/* ── Brand col ── */}
          <div className="md:col-span-2">
            <OrkastorLogo size={30} showWordmark className="mb-5" />
            <p className="text-slate-600 text-sm leading-relaxed mb-5 max-w-[240px]">
              The AI DevOps &amp; Cloud Orchestration platform. Modular AI agents for
              Kubernetes, cloud costs, security, and beyond — all running inside your environment.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Github,   href: 'https://github.com/orkastor', label: 'GitHub' },
                { Icon: Twitter,  href: 'https://twitter.com/orkastor', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com/company/orkastor', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-slate-600 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.07] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category} className="md:col-span-1">
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.12em] mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-slate-600 hover:text-slate-300 text-sm transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <OrkastorLogo size={18} showWordmark={false} />
            <p className="text-slate-700 text-xs">
              © 2025 Orkastor. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
