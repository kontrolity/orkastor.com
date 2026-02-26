import React from 'react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';

const TEAM = [
  {
    name: 'Puvendhan Ramasamy',
    role: 'Founder & CEO',
    bio: 'Previously SRE lead at a FTSE 100 fintech. Spent years fighting Kubernetes incidents manually before building Orkastor to fix that.',
    initials: 'PR',
    color: '#3b82f6',
  },
  {
    name: 'Alex Chen',
    role: 'Co-Founder & CTO',
    bio: 'Built distributed systems at scale for a decade. Obsessed with making AI agents that actually work inside real production environments.',
    initials: 'AC',
    color: '#2dd4bf',
  },
  {
    name: 'Sara Okonkwo',
    role: 'Head of Product',
    bio: 'Former platform engineer turned product. Believes the best DevOps tooling is the kind engineers actually want to use.',
    initials: 'SO',
    color: '#8b5cf6',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Engineering',
    bio: 'Open-source contributor and Kubernetes SIG member. Passionate about building software that runs reliably at 3am.',
    initials: 'MW',
    color: '#f59e0b',
  },
];

const VALUES = [
  {
    title: 'Zero trust by default',
    desc: 'Every AI-proposed fix requires a human to approve it. We will never build a system that acts on production without your explicit consent.',
  },
  {
    title: 'Your data stays yours',
    desc: 'Orkastor runs inside your environment. We have no visibility into your infrastructure, your incidents or your code. That is intentional.',
  },
  {
    title: 'Built for engineers, by engineers',
    desc: 'We have all been paged at 2am for an incident that took four hours to debug. Everything we build is aimed at making that never happen again.',
  },
  {
    title: 'Transparency over magic',
    desc: 'AI should show its work. Every root cause analysis includes a full evidence chain so you can verify — or override — what it found.',
  },
];

const STATS = [
  { value: '2024', label: 'Founded' },
  { value: '4',    label: 'Team members' },
  { value: '500+', label: 'Beta users' },
  { value: '18s',  label: 'Mean resolution time' },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
      <NavBar />

      <main className="relative overflow-hidden">

        {/* ── Hero ── */}
        <section className="relative pt-36 pb-24 px-5 sm:px-6">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-6">
              About Orkastor
            </span>
            <h1 className="text-[clamp(38px,5.5vw,64px)] font-black tracking-[-0.03em] leading-[1.02] text-white mb-6">
              We got tired of<br />
              <span className="text-gradient-brand">fighting fires manually.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
              Orkastor started as an internal tool at a fintech SRE team. After watching the same
              incidents repeat themselves week after week, we decided to build the AI agent we
              always wished existed — one that runs inside your environment and actually closes
              the loop from alert to fix.
            </p>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-y border-white/[0.05]" style={{ backgroundColor: '#070707' }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="shimmer-stat text-[36px] sm:text-[42px] font-black tracking-[-0.03em] leading-none mb-2">
                    {s.value}
                  </div>
                  <div className="text-slate-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-24 px-5 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              Our Mission
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-black tracking-[-0.03em] text-white mt-4 mb-6 leading-[1.1]">
              Make production incidents a solved problem.
            </h2>
            <div className="space-y-5 text-slate-400 text-base leading-relaxed">
              <p>
                The average SRE team spends 30% of their time responding to incidents they have
                already seen before. The tools exist to monitor, alert and even diagnose — but
                nothing closes the loop automatically, safely, and inside your own environment.
              </p>
              <p>
                We are building a modular AI platform where each agent handles a specific domain
                of ops work: Kubernetes reliability, cloud cost, security posture and beyond.
                Every agent runs as an operator inside your cluster. No data leaves. No black box.
                Every fix requires your approval.
              </p>
              <p>
                KubēGraf is the first module. It is available today. The rest are coming.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 px-5 sm:px-6 border-t border-white/[0.05]" style={{ backgroundColor: '#070707' }}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                What we believe
              </span>
              <h2 className="text-[clamp(28px,4vw,40px)] font-black tracking-[-0.03em] text-white mt-4">
                Principles we won't compromise on.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <div key={v.title} className="bento-card p-7">
                  <div className="text-[11px] font-mono text-slate-700 mb-3">
                    0{i + 1}
                  </div>
                  <h3 className="text-white font-semibold text-[15px] mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-24 px-5 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                The team
              </span>
              <h2 className="text-[clamp(28px,4vw,40px)] font-black tracking-[-0.03em] text-white mt-4">
                Built by people who've been paged.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TEAM.map((member) => (
                <div key={member.name} className="bento-card p-6">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold border mb-5"
                    style={{
                      background: `${member.color}14`,
                      borderColor: `${member.color}28`,
                      color: member.color,
                    }}
                  >
                    {member.initials}
                  </div>
                  <div className="text-white font-semibold text-[14px] mb-0.5">{member.name}</div>
                  <div className="text-slate-600 text-[11px] uppercase tracking-wider font-medium mb-4">
                    {member.role}
                  </div>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Company ── */}
        <section className="py-20 px-5 sm:px-6 border-t border-white/[0.05]" style={{ backgroundColor: '#070707' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[clamp(24px,3.5vw,36px)] font-black tracking-[-0.03em] text-white mb-4">
              We're Kontrolity Ltd.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Orkastor is a product of Kontrolity Ltd., incorporated in England & Wales.
              We are a small, focused team with a single goal: make production reliability
              something that is handled automatically, safely, and transparently.
            </p>
            <a
              href="/#cta"
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.99] transition-transform"
            >
              Join the waitlist
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
