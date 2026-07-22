import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Code, Terminal, Layers, GitBranch, Zap } from 'lucide-react';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';
import { Reveal } from '@/components/home/shared';

const SECTIONS = [
  {
    icon: Zap,
    title: 'Getting Started',
    desc: 'Install Orkastor, connect your first cluster and watch your first incident get resolved in under 10 minutes.',
    links: ['Quickstart Guide', 'Installation', 'Configuration', 'First Cluster'],
  },
  {
    icon: BookOpen,
    title: 'Core Concepts',
    desc: 'Understand how Orkastor agents, modules and the SafeFix™ approval loop work together inside your environment.',
    links: ['Architecture Overview', 'Agent Model', 'SafeFix™ Workflow', 'Approval Gates'],
  },
  {
    icon: Layers,
    title: 'KubeGraf',
    desc: 'Deep-dive into the first Orkastor module — AI-powered SRE for Kubernetes, running entirely inside your cluster.',
    links: ['Overview', 'Root Cause Analysis', 'Auto-Remediation', 'Integrations'],
  },
  {
    icon: Code,
    title: 'API Reference',
    desc: 'Complete REST API documentation, webhook schemas, event types and authentication reference.',
    links: ['Authentication', 'Incidents API', 'Webhooks', 'Event Schema'],
  },
  {
    icon: Terminal,
    title: 'CLI Reference',
    desc: 'Every command, flag and configuration option for the Orkastor CLI, installable via Homebrew.',
    links: ['Install', 'orkastor watch', 'orkastor diagnose', 'orkastor fix'],
  },
  {
    icon: GitBranch,
    title: 'Integrations',
    desc: 'Connect Orkastor to your observability stack, alerting tools, CI/CD pipelines and chat platforms.',
    links: ['Kubernetes', 'Datadog', 'PagerDuty', 'Slack & GitHub'],
  },
];

export default function Docs() {
  useEffect(() => {
    document.title = 'Documentation – Orkastor';
  }, []);

  return (
    <div className="lp min-h-screen">
      <Nav />

      <main className="relative overflow-hidden lp-hero-wash pt-[140px] sm:pt-[160px] pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <Reveal className="text-center mb-12">
            <div className="lp-eyebrow mb-5 justify-center">Documentation</div>
            <h1 className="lp-display text-[clamp(34px,4.8vw,60px)]">
              Everything you need to{' '}
              <span className="lp-serif" style={{ color: 'var(--lp-orange-deep)' }}>ship.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg max-w-md mx-auto" style={{ color: 'var(--lp-ink-2)' }}>
              Guides, API reference and CLI docs for building with Orkastor.
            </p>

            {/* Search */}
            <div className="flex justify-center mt-8">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    background: 'var(--lp-surface)',
                    border: '1px solid var(--lp-line)',
                    color: 'var(--lp-ink)',
                    boxShadow: '0 1px 2px rgba(22,24,29,0.04)',
                  }}
                />
                <kbd
                  className="absolute right-3 top-1/2 -translate-y-1/2 lp-mono text-[10px] rounded px-1.5 py-0.5"
                  style={{ color: 'var(--lp-ink-3)', border: '1px solid var(--lp-line)' }}
                >
                  ⌘K
                </kbd>
              </div>
            </div>
          </Reveal>

          {/* Quick install */}
          <Reveal delay={80}>
            <div className="lp-card p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold mb-1.5">Get started in 2 minutes</p>
                <div className="flex items-center gap-2 lp-mono text-[13px]" style={{ color: 'var(--lp-ink-2)' }}>
                  <span style={{ color: 'var(--lp-ink-3)' }}>$</span>
                  <span style={{ color: 'var(--lp-orange-deep)' }}>brew install orkastor</span>
                  <span style={{ color: 'var(--lp-ink-3)' }}>&amp;&amp;</span>
                  <span style={{ color: 'var(--lp-green)' }}>orkastor init</span>
                </div>
              </div>
              <a href="#getting-started" className="lp-btn-ghost lp-btn-sm whitespace-nowrap group">
                Read the Quickstart
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>

          {/* Doc sections grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <Reveal key={section.title} delay={(i % 3) * 90}>
                  <div
                    id={
                      section.title === 'Getting Started'
                        ? 'getting-started'
                        : section.title === 'API Reference'
                          ? 'api-reference'
                          : undefined
                    }
                    className="lp-card lp-card-hover p-6 h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="w-10 h-10 rounded-xl inline-flex items-center justify-center"
                        style={{ background: 'var(--lp-orange-soft)', color: 'var(--lp-orange-deep)' }}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="lp-index">0{i + 1}</span>
                    </div>
                    <h3 className="text-[16px] font-semibold mb-1.5" style={{ letterSpacing: '-0.015em' }}>{section.title}</h3>
                    <p className="text-[13.5px] leading-relaxed mb-5" style={{ color: 'var(--lp-ink-2)' }}>{section.desc}</p>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            className="group/link flex items-center gap-2 text-[13px] transition-colors"
                            style={{ color: 'var(--lp-ink-2)' }}
                          >
                            <span
                              className="w-1 h-1 rounded-full shrink-0 transition-colors group-hover/link:!bg-[var(--lp-orange)]"
                              style={{ background: 'var(--lp-ink-3)' }}
                            />
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
