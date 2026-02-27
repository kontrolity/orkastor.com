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
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy',    href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#12102A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(141,111,222,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-14">

          {/* Brand col */}
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#8D6FDE';
                    e.currentTarget.style.borderColor = 'rgba(141,111,222,0.35)';
                    e.currentTarget.style.background = 'rgba(141,111,222,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category} className="md:col-span-1">
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.12em] mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm transition-colors duration-150"
                      style={{ color: '#4B5563' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#9CA3AF')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <OrkastorLogo size={18} showWordmark={false} />
            <p className="text-xs" style={{ color: '#374151' }}>
              © 2025 Orkastor. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#374151' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
