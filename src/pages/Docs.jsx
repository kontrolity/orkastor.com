import React from 'react';
import { ArrowRight, BookOpen, Code, Terminal, Layers, GitBranch, Zap } from 'lucide-react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';

const SECTIONS = [
  {
    icon: Zap,
    color: '#2dd4bf',
    title: 'Getting Started',
    desc: 'Install Orkastor, connect your first cluster and watch your first incident get resolved in under 10 minutes.',
    links: ['Quickstart Guide', 'Installation', 'Configuration', 'First Cluster'],
  },
  {
    icon: BookOpen,
    color: '#3b82f6',
    title: 'Core Concepts',
    desc: 'Understand how Orkastor agents, modules and the SafeFix™ approval loop work together inside your environment.',
    links: ['Architecture Overview', 'Agent Model', 'SafeFix™ Workflow', 'Approval Gates'],
  },
  {
    icon: Layers,
    color: '#8b5cf6',
    title: 'KubēGraf',
    desc: 'Deep-dive into the first Orkastor module — AI-powered SRE for Kubernetes, running entirely inside your cluster.',
    links: ['Overview', 'Root Cause Analysis', 'Auto-Remediation', 'Integrations'],
  },
  {
    icon: Code,
    color: '#f59e0b',
    title: 'API Reference',
    desc: 'Complete REST API documentation, webhook schemas, event types and authentication reference.',
    links: ['Authentication', 'Incidents API', 'Webhooks', 'Event Schema'],
  },
  {
    icon: Terminal,
    color: '#60a5fa',
    title: 'CLI Reference',
    desc: 'Every command, flag and configuration option for the Orkastor CLI, installable via Homebrew.',
    links: ['Install', 'orkastor watch', 'orkastor diagnose', 'orkastor fix'],
  },
  {
    icon: GitBranch,
    color: '#94a3b8',
    title: 'Integrations',
    desc: 'Connect Orkastor to your observability stack, alerting tools, CI/CD pipelines and chat platforms.',
    links: ['Kubernetes', 'Datadog', 'PagerDuty', 'Slack & GitHub'],
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
      <NavBar />

      <main className="relative pt-32 pb-24 px-5 sm:px-6 overflow-hidden">
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
              Documentation
            </span>
            <h1 className="text-[clamp(36px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-4">
              Everything you need to ship.
            </h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Guides, API reference and CLI docs for building with Orkastor.
            </p>

            {/* Search */}
            <div className="flex justify-center mt-8">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border border-white/[0.09] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 border border-white/[0.07] rounded px-1.5 py-0.5">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Quick install */}
          <div className="bento-card p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">Get started in 2 minutes</p>
              <div className="flex items-center gap-2 font-mono text-[13px]">
                <span className="text-slate-600">$</span>
                <span className="text-blue-300">brew install orkastor</span>
                <span className="text-slate-700">&&</span>
                <span className="text-teal-400">orkastor init</span>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/[0.09] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all whitespace-nowrap"
            >
              Read the Quickstart
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Doc sections grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="bento-card p-6 group hover:border-white/[0.12] transition-colors">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border mb-4"
                    style={{ background: `${section.color}12`, borderColor: `${section.color}25`, color: section.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-white font-semibold text-[15px] mb-2">{section.title}</h3>
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-5">{section.desc}</p>
                  <ul className="space-y-1.5">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-white transition-colors group/link"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-700 group-hover/link:bg-blue-500 transition-colors shrink-0" />
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
