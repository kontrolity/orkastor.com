import React from 'react';
import { ArrowUpRight, Linkedin, Twitter } from 'lucide-react';
import OrkastorMark from '@/components/landing/OrkastorMark';
import { CONTACT_EMAIL, DiscordIcon, DISCORD_URL, KUBEGRAF_URL } from './shared';
import { openCookiePreferences } from '@/components/CookieConsent';

/**
 * One column PER PRODUCT, not one "Product" column holding both.
 *
 * The old column listed KubeGraf, then three Cloud links, then `/#features` —
 * a home-page anchor for KubeGraf's features section that no longer exists there,
 * so it was a dead link the moment that argument moved to /kubegraf. Mixing two
 * products into one list is also what made the site read as one product with an
 * appendix.
 *
 * Two columns, each headed by the product's own name, is the footer telling the
 * same story as the nav and the split above it.
 */
const LINKS = {
  KubeGraf: [
    { label: 'Overview', href: '/kubegraf' },
    { label: 'How it works', href: '/kubegraf#how-it-works' },
    { label: 'Security', href: '/kubegraf#security' },
    { label: 'kubegraf.io', href: KUBEGRAF_URL, external: true },
  ],
  'Domineta': [
    { label: 'Overview', href: '/cloud' },
    { label: 'How it works', href: '/cloud/how-it-works' },
    { label: 'Join the waitlist', href: '/cloud#waitlist' },
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
    { label: 'Cookie Preferences', onClick: openCookiePreferences },
  ],
};

export default function Footer() {
  return (
    <footer className="relative" style={{ background: 'var(--lp-bg-alt)', borderTop: '1px solid var(--lp-line-soft)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 flex flex-col items-start">
            <OrkastorMark size={34} showWordmark light className="mb-4" />
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
              {/* ink-2, not ink-3: at 11px uppercase on the footer's #F3EFE7 the
                  lighter token measured 2.90:1 against a 4.5:1 requirement. */}
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: 'var(--lp-ink-2)' }}>
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((l) => {
                  const linkStyle = {
                    color: 'var(--lp-ink-2)',
                    onMouseEnter: (e) => { e.currentTarget.style.color = 'var(--lp-ink)'; },
                    onMouseLeave: (e) => { e.currentTarget.style.color = 'var(--lp-ink-2)'; },
                  };
                  return (
                    <li key={l.label}>
                      {l.onClick ? (
                        <button
                          type="button"
                          onClick={l.onClick}
                          className="text-[14px] inline-flex items-center gap-1 transition-colors"
                          style={{ color: linkStyle.color }}
                          onMouseEnter={linkStyle.onMouseEnter}
                          onMouseLeave={linkStyle.onMouseLeave}
                        >
                          {l.label}
                        </button>
                      ) : (
                        <a
                          href={l.href}
                          target={l.external ? '_blank' : undefined}
                          rel={l.external ? 'noopener noreferrer' : undefined}
                          className="text-[14px] inline-flex items-center gap-1 transition-colors"
                          style={{ color: linkStyle.color }}
                          onMouseEnter={linkStyle.onMouseEnter}
                          onMouseLeave={linkStyle.onMouseLeave}
                        >
                          {l.label}
                          {l.external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid var(--lp-line-soft)' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px]" style={{ color: 'var(--lp-ink-2)' }}>
            <span>© 2026 Orkastor. All rights reserved.</span>
            {/* An "All systems operational" indicator used to sit here. Removed:
                there is no status page behind it, and it read as an availability
                claim on pages for a product that is not generally available. */}
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
              style={{ color: 'var(--lp-orange-text)' }}
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
