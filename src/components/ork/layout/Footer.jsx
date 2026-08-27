import React from 'react';
import { Container } from '../ui';
import { OrkastorLogo } from '../brand/Logo';
import { EXTERNAL } from '@/content/site';

/**
 * One column PER PRODUCT, plus a company column.
 *
 * The old footer had a single "Product" column mixing both, which is part of how
 * the site came to read as one product with an appendix. It also linked "Pricing"
 * under Cloud — and Cloud has no published pricing, so that link promised
 * something that does not exist. Cloud's column here ends at the Console.
 */
const COLUMNS = [
  {
    title: 'KubeGraf',
    links: [
      { label: 'Overview', href: '/kubegraf' },
      { label: 'How it works', href: '/kubegraf#process' },
      { label: 'Security', href: '/kubegraf#security' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'kubegraf.io ↗', href: EXTERNAL.kubegrafSite, external: true },
      { label: 'Sign in ↗', href: EXTERNAL.kubegrafApp, external: true },
    ],
  },
  {
    title: 'Orkastor Cloud',
    links: [
      { label: 'Overview', href: '/cloud' },
      { label: 'How it works', href: '/cloud/how-it-works' },
      { label: 'The boundary', href: '/cloud#boundary' },
      { label: 'orkastor.cloud ↗', href: EXTERNAL.cloudSite, external: true },
      { label: 'Console ↗', href: EXTERNAL.cloudConsole, external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Docs', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Contact', href: `mailto:${EXTERNAL.email}` },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border-soft)' }}>
      <Container wide className="pt-16 pb-10">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          <div>
            <OrkastorLogo size={28} />
            <p className="ork-small mt-4" style={{ color: 'var(--text-2)', maxWidth: 300 }}>
              Infrastructure software for Kubernetes teams. KubeGraf works inside the clusters you
              own; Orkastor Cloud is infrastructure we operate.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              {/* --text-2, not --text-3: at 11px uppercase the lighter token
                  measured under 4.5:1 on this ground. */}
              <h2 className="ork-micro" style={{ color: 'var(--text-2)', marginBottom: 14 }}>{col.title}</h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener noreferrer' : undefined}
                      className="ork-small"
                      style={{ color: 'var(--text-2)' }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
             style={{ borderTop: '1px solid var(--border-soft)' }}>
          <p className="ork-small" style={{ color: 'var(--text-2)' }}>© 2026 Orkastor</p>
          <p className="ork-small" style={{ color: 'var(--text-2)' }}>
            KubeGraf® is a registered trademark of ORKASTOR LIMITED.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
