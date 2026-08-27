import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, Panel } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { ENTRIES } from '@/content/changelog';

/**
 * /changelog — the existing entries, restyled.
 *
 * Nothing invented and nothing removed. The brief says to use real data if it
 * exists and show an honest empty state if it does not; these entries predate
 * the redesign, so they are carried across verbatim from `content/changelog.js`
 * rather than retyped. If the list is ever empty, the empty state below is what
 * shows — not a placeholder release.
 */

const TYPE = {
  new:  { label: 'New',         ink: 'var(--cloud-text)' },
  fix:  { label: 'Fix',         ink: 'var(--kg-text)' },
  perf: { label: 'Performance', ink: 'var(--text-2)' },
};

export default function OrkChangelog() {
  return (
    <Page
      onDeep
      seo={{
        title: 'Changelog — Orkastor',
        description: 'What shipped, and when. Releases for KubeGraf and the Orkastor platform.',
        canonical: 'https://www.orkastor.com/changelog',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero eyebrow="Changelog" title="What shipped," titleB="and when." accent="#48CBCB" />

      <Section tone="page">
        <Container>
          {ENTRIES.length === 0 ? (
            <Panel className="p-10 text-center">
              <p className="ork-heading" style={{ color: 'var(--text)' }}>Nothing published here yet</p>
              <p className="ork-body mt-3" style={{ color: 'var(--text-2)' }}>
                Releases are announced in Discord first. This page will carry them once there is a
                feed to read from — we would rather leave it empty than fill it with placeholders.
              </p>
            </Panel>
          ) : (
            <div className="space-y-5">
              {ENTRIES.map((e, i) => (
                <Reveal key={e.version} delay={i * 60}>
                  <Panel className="p-7 sm:p-8">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
                      <span className="ork-mono ork-heading" style={{ color: 'var(--text)', fontSize: 17 }}>{e.version}</span>
                      <span className="ork-small" style={{ color: 'var(--text-3)' }}>{e.date}</span>
                      <span className="ork-micro" style={{ color: 'var(--text-2)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 999 }}>{e.tag}</span>
                    </div>
                    <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 20 }}>{e.summary}</p>
                    <ul className="space-y-2.5" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {e.changes.map((c) => {
                        const t = TYPE[c.type] ?? TYPE.perf;
                        return (
                          <li key={c.text} className="flex gap-3 ork-small" style={{ color: 'var(--text-2)' }}>
                            <span className="ork-micro shrink-0" style={{ color: t.ink, minWidth: 74, paddingTop: 2 }}>{t.label}</span>
                            <span>{c.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </Panel>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </Page>
  );
}
