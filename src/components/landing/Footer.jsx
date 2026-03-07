import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

const DISCORD_URL = 'https://discord.gg/GKpbU3pQ';

const DiscordIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.02.048.035.088.068.107a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const LINKS = {
  Product: [
    { label: 'Platform',     href: '/#platform' },
    { label: 'OrkaAI',       href: '/#platform' },
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
    { label: 'Documentation',      href: '/docs' },
    { label: 'API Reference',      href: '/docs' },
    { label: 'GitHub',             href: 'https://github.com/orkastor', external: true },
    { label: 'Discord Community',  href: DISCORD_URL, external: true },
    { label: 'Status Page',        href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#0A0A0E',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(108,71,255,0.05) 0%, transparent 70%)',
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
                { Icon: Github,      href: 'https://github.com/orkastor',             label: 'GitHub',    discord: false },
                { Icon: Twitter,     href: 'https://twitter.com/orkastor',             label: 'Twitter',   discord: false },
                { Icon: Linkedin,    href: 'https://linkedin.com/company/orkastor',    label: 'LinkedIn',  discord: false },
                { Icon: DiscordIcon, href: DISCORD_URL,                                label: 'Discord',   discord: true  },
              ].map(({ Icon, href, label, discord }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    color: discord ? '#fff' : '',
                    background: discord ? '#5865F2' : 'rgba(255,255,255,0.02)',
                    border: discord ? 'none' : '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={e => {
                    if (discord) {
                      e.currentTarget.style.background = '#4752c4';
                    } else {
                      e.currentTarget.style.color = '#6C47FF';
                      e.currentTarget.style.borderColor = 'rgba(108,71,255,0.35)';
                      e.currentTarget.style.background = 'rgba(108,71,255,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (discord) {
                      e.currentTarget.style.background = '#5865F2';
                    } else {
                      e.currentTarget.style.color = '';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
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
                      style={{ color: '#524770' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#524770')}
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
            <p className="text-xs" style={{ color: '#3D3460' }}>
              © 2025 Orkastor. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#3D3460' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
