import React from 'react';
import { Container } from '../ui';
import { OrkastorLogo } from '../brand/Logo';
import { EXTERNAL } from '@/content/site';

/**
 * One column PER PRODUCT, plus a company column.
 *
 * The old footer had a single "Product" column mixing both, which is part of how
 * the site came to read as one product with an appendix. It also linked "Pricing"
 * under Domineta — and Domineta has no published pricing, so that link promised
 * something that does not exist. Domineta's column here ends at the Console.
 */
const COLUMNS = [
  {
    title: 'KubeGraf',
    /* Overview, How it works and Security were deep links into /kubegraf and
       two of them into anchors on it. That page is gone, so the column is the
       product's own site and the pricing it publishes there — the only two
       destinations for KubeGraf that this site does not own and cannot let
       drift. A column of links to a page that 404s is worse than a short one. */
    links: [
      { label: 'kubegraf.io ↗', href: EXTERNAL.kubegrafSite, external: true },
      { label: 'Pricing ↗', href: EXTERNAL.kubegrafPricing, external: true },
    ],
  },
  /* Domineta's column was here. The product is unlisted — see the note in
     content/site.js. /cloud still renders for a direct URL. */
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
    /* ── INK FOOTER ───────────────────────────────────────────────────────
       Was `--bg-alt` with a hairline on top: a slightly-stepped ground that
       ended the page by fading out. The register this follows ends on a
       full-bleed near-black block instead, and on a warm page that block is
       the only hard stop there is — it is what makes the page feel finished
       rather than scrolled-off.

       ⚠ NO borderTop, still. The ground change is doing the work: --footer-bg
       is the darkest tone in the system and steps clearly off the page. A
       hairline on top of a visible change of ground is the double-draw this
       codebase avoids everywhere else (see .ork-seam). */
    <footer style={{ background: 'var(--footer-bg)', color: 'var(--text)' }}>
      <Container wide className="pt-24 pb-12">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          <div>
            <OrkastorLogo size={38} />
            {/* .ork-sub, not .ork-small: this is the one line of prose in the
                footer, and the rest of the site now sets prose in the serif.
                A sans caption here was the last place the old voice survived. */}
            <p className="ork-sub mt-5" style={{ color: 'var(--text-2)', maxWidth: 330 }}>
              Infrastructure software for Kubernetes teams. KubeGraf works inside the clusters you
              already own.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              {/* ⚠ --text-2, NOT --text-3. The original comment here warned
                  about exactly this on the old ink ground, and the warning
                  survives the change of ground: --text-3 measures 3.46:1 on
                  --footer-bg, and 11px uppercase is NORMAL text by WCAG
                  (large starts at 24px, or 18.66px bold), so it needs 4.5:1.
                  --text-2 is 6.59:1 here. The label being quieter than the
                  links is not worth failing contrast for; the size and the
                  caps already separate it. */}
              <h2 className="ork-micro" style={{ color: 'var(--text-2)', marginBottom: 16 }}>{col.title}</h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener noreferrer' : undefined}
                      className="ork-small ork-footer-link"
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

        <div className="mt-20 pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
             style={{ borderTop: '1px solid var(--footer-line)' }}>
          {/* --text-2 for the same reason as the column headers above: 13px
              is normal text and --text-3 does not clear 4.5:1 on this ground. */}
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
