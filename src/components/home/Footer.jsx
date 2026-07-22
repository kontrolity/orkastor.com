import React from 'react';
import { ArrowUpRight, Linkedin, Twitter } from 'lucide-react';
import OrkastorLogo from '@/components/landing/OrkastorLogo';
import { CONTACT_EMAIL, DiscordIcon, DISCORD_URL, KUBEGRAF_URL } from './shared';

const LINKS = {
  Product: [
    { label: 'KubeGraf', href: KUBEGRAF_URL, external: true },
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/docs#api-reference' },
    { label: 'Discord Community', href: DISCORD_URL, external: true },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative" style={{ background: 'var(--lp-bg-alt)', borderTop: '1px solid var(--lp-line-soft)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 flex flex-col items-start">
            <OrkastorLogo size={34} showWordmark light theme="orange" className="mb-4" />
            <p className="text-[13.5px] leading-relaxed max-w-[250px] mb-5" style={{ color: 'var(--lp-ink-2)' }}>
              AI agents for infrastructure operations — starting with KubeGraf,
              the AI SRE platform for Kubernetes.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { Icon: Twitter, href: 'https://twitter.com/orkastor', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com/company/orkastor', label: 'LinkedIn' },
                { Icon: DiscordIcon, href: DISCORD_URL, label: 'Discord' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all"
                  style={{ background: 'var(--lp-surface)', border: '1px solid var(--lp-line-soft)', color: 'var(--lp-ink-3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lp-orange-deep)'; e.currentTarget.style.borderColor = 'rgba(255,122,31,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lp-ink-3)'; e.currentTarget.style.borderColor = 'var(--lp-line-soft)'; }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: 'var(--lp-ink-3)' }}>
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener noreferrer' : undefined}
                      className="text-[14px] inline-flex items-center gap-1 transition-colors"
                      style={{ color: 'var(--lp-ink-2)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lp-ink)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lp-ink-2)'; }}
                    >
                      {l.label}
                      {l.external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
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
          style={{ borderTop: '1px solid var(--lp-line-soft)' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px]" style={{ color: 'var(--lp-ink-3)' }}>
            <span>© 2026 Orkastor. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--lp-green)' }} />
              All systems operational
            </span>
          </div>
          <p
            className="text-[12.5px] px-4 py-1.5 rounded-full text-center"
            style={{ background: 'var(--lp-orange-soft)', border: '1px solid rgba(255,122,31,0.22)', color: 'var(--lp-ink-2)' }}
          >
            <a
              href={KUBEGRAF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: 'var(--lp-orange-deep)' }}
            >
              KubeGraf<sup style={{ fontSize: '0.6em' }}>®</sup>
            </a>{' '}
            is a registered trademark of ORKASTOR LIMITED.
          </p>
        </div>
      </div>

      {/* Ghost wordmark — quiet signature closing the page */}
      <div aria-hidden="true" className="overflow-hidden select-none pointer-events-none">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="lp-ghost-wordmark text-center translate-y-[18%]">Orkastor</div>
        </div>
      </div>
    </footer>
  );
}
