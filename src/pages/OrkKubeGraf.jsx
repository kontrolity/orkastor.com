import React from 'react';
import { Page, ProductHero } from '@/components/ork/layout/Page';
import { Container, Section, SectionHead, Panel, Badge, Button, Arrow } from '@/components/ork/ui';
import { Reveal } from '@/components/ork/motion/Reveal';
import { KubeGrafProcess, AgentNetwork, SecurityPath } from '@/components/ork/visuals/KubeGrafVisuals';
import { KUBEGRAF, EXTERNAL } from '@/content/site';

/**
 * /kubegraf — the product page for someone still deciding.
 *
 * It ends by handing over to kubegraf.io rather than trying to be a second
 * product site. Someone who has decided should leave for the product; this page
 * exists so a visitor comparing two products can read about both without a
 * cross-domain jump mid-comparison.
 */
export default function OrkKubeGraf() {
  return (
    <Page
      onDeep
      seo={{
        title: 'KubeGraf — an AI SRE for the clusters you already run | Orkastor',
        description:
          'KubeGraf detects Kubernetes incidents, finds the root cause across metrics, logs and ' +
          'events, and ships a dry-run-validated SafeFix you approve. One thin outbound-only agent.',
        canonical: 'https://www.orkastor.com/kubegraf',
        image: 'https://www.orkastor.com/og-image.png',
      }}
    >
      <ProductHero
        eyebrow="KubeGraf · your infrastructure"
        title={KUBEGRAF.headline}
        titleB={KUBEGRAF.headlineB}
        sub={KUBEGRAF.oneLine}
        accent="#FF8A3D"
        badge={<Badge kind="live" onDeep>Live</Badge>}
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-9">
          <Button href={EXTERNAL.kubegrafApp} accent="kg" magnetic target="_blank" rel="noopener noreferrer">
            Start free — 14 days <Arrow />
          </Button>
          <Button href="/pricing" variant="secondary" style={{ borderColor: 'rgba(245,248,250,0.24)', color: '#F5F8FA' }}>
            See pricing
          </Button>
        </div>
      </ProductHero>

      <Section tone="page" id="problem">
        <Container wide>
          <Reveal>
            <SectionHead eyebrow="The problem" title="Three on-call pains, on every cluster, on every team." />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-11">
            {KUBEGRAF.problems.map(([t, b], i) => (
              <Reveal key={t} delay={i * 70}>
                <Panel className="p-7 h-full">
                  <p className="ork-micro" style={{ color: 'var(--kg-text)', marginBottom: 12 }}>{String(i + 1).padStart(2, '0')}</p>
                  <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 10 }}>{t}</p>
                  <p className="ork-body" style={{ color: 'var(--text-2)' }}>{b}</p>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt" id="process">
        <Container wide>
          <Reveal>
            <SectionHead
              eyebrow="How it works"
              title="Detect. Investigate. Diagnose. Fix. Verify."
              sub="The value is not the graph. It is the change landing in your cluster and being checked afterwards."
            />
          </Reveal>
          <Reveal delay={70}><div className="mt-12"><KubeGrafProcess /></div></Reveal>
        </Container>
      </Section>

      <Section tone="page" id="agents">
        <Container wide>
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <Reveal>
              <SectionHead
                eyebrow="Multi-agent SRE"
                title="A roster of specialists, not one model."
                sub="Only the SRE agent may author and apply a change, and only after the others have had their say. Security can veto it. FinOps works independently."
              />
              <ul className="mt-8 space-y-3">
                {KUBEGRAF.agents.map((a) => (
                  <li key={a.name} className="flex items-baseline gap-3 ork-small" style={{ color: 'var(--text-2)' }}>
                    <span className="ork-mono" style={{ color: a.name === 'SRE' ? 'var(--kg-text)' : 'var(--text-3)', minWidth: 128 }}>{a.name}</span>
                    <span>{a.note}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80}><AgentNetwork /></Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="alt" id="security">
        <Container wide>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal delay={60}><SecurityPath /></Reveal>
            <Reveal>
              <SectionHead
                eyebrow="Security"
                title="Outbound only — and we say where the AI call goes."
                sub="No inbound ports, and no cluster credentials held centrally. The model call does leave your environment, through our gateway, on redacted telemetry."
              />
              <ul className="mt-8 space-y-4">
                {KUBEGRAF.security.map(([k, v]) => (
                  <li key={k}>
                    <p className="ork-small" style={{ color: 'var(--text)', fontWeight: 600 }}>{k}</p>
                    <p className="ork-small mt-1" style={{ color: 'var(--text-2)' }}>{v}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="page" id="deployment">
        <Container wide>
          <Reveal><SectionHead eyebrow="Two ways to run it" title="Same control plane, either side of your perimeter." /></Reveal>
          <div className="grid md:grid-cols-2 gap-5 mt-11">
            {[
              { t: 'SaaS', b: 'We run the control plane. You get a workspace, and a thin agent goes into each of your clusters.',
                pts: ['Nothing to operate', 'A workspace per team', 'Agent upgrades on your cadence'] },
              { t: 'Self-hosted', b: 'You run the same control plane in your own cluster, with local auth. One HTTPS egress for the AI gateway.',
                pts: ['Your infrastructure end to end', 'Local authentication', 'AI still routes through our gateway — there is no BYO-key mode'] },
            ].map(({ t, b, pts }, i) => (
              <Reveal key={t} delay={i * 70}>
                <Panel className="p-7 h-full">
                  <p className="ork-heading" style={{ color: 'var(--text)', marginBottom: 10 }}>{t}</p>
                  <p className="ork-body" style={{ color: 'var(--text-2)', marginBottom: 18 }}>{b}</p>
                  <ul className="space-y-2.5">
                    {pts.map((p) => (
                      <li key={p} className="flex gap-2.5 ork-small" style={{ color: 'var(--text-2)' }}>
                        <span aria-hidden="true" style={{ color: 'var(--kg-text)' }}>—</span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt" id="handover">
        <Container wide>
          <Reveal>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="ork-display-m" style={{ color: 'var(--text)' }}>Ready to look at the product itself?</p>
                <p className="ork-body mt-3" style={{ color: 'var(--text-2)', maxWidth: 520 }}>
                  KubeGraf has its own site and its own docs. This page exists so you can compare
                  both Orkastor products without leaving — the product lives over there.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button href={EXTERNAL.kubegrafSite} accent="kg" target="_blank" rel="noopener noreferrer" magnetic>
                  kubegraf.io ↗
                </Button>
                <Button href="/cloud" variant="secondary" style={{ color: 'var(--text)' }}>
                  Or see Orkastor Cloud <Arrow />
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </Page>
  );
}
