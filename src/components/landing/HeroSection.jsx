import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Shield, Lock, Server, CheckCircle2, Zap } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/* ── Animated gradient mesh background ───────────────────────── */
function GradientMeshBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Blob 1 — violet, center-top */}
      <div
        className="blob-1 absolute rounded-full"
        style={{
          top: '-20%',
          left: '30%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(119,72,246,0.22) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Blob 2 — sky, bottom-right */}
      <div
        className="blob-2 absolute rounded-full"
        style={{
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Blob 3 — purple, left */}
      <div
        className="blob-3 absolute rounded-full"
        style={{
          top: '40%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
    </div>
  );
}

/* ── 3-Panel Dashboard Mockup ─────────────────────────────────── */
function DashboardMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden select-none relative"
      style={{
        background: '#0D0A1E',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 0 0 1px rgba(119,72,246,0.18), 0 80px 160px rgba(0,0,0,0.5), 0 0 120px rgba(119,72,246,0.15)',
      }}
    >
      {/* Animated top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #7748F6 30%, #0EA5E9 70%, transparent 100%)',
          backgroundSize: '200% auto',
          animation: 'shimmer-slide 3s linear infinite',
        }}
      />

      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28ca41' }} />
        <div className="flex-1 mx-4">
          <div
            className="mx-auto h-5 rounded-md flex items-center px-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              maxWidth: '260px',
            }}
          >
            <span className="text-[10px] font-mono text-slate-600">app.orkastor.com / production</span>
          </div>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono text-red-400/80">INCIDENT ACTIVE</span>
        </span>
      </div>

      {/* Top tab bar */}
      <div
        className="flex items-center gap-1 px-4 pt-3 pb-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        {['Overview', 'Incidents', 'RCA', 'SafeFix™'].map((tab, i) => (
          <div
            key={tab}
            className="px-4 py-2 text-[11px] font-medium rounded-t-lg cursor-pointer transition-all"
            style={
              i === 1
                ? {
                    background: 'rgba(119,72,246,0.12)',
                    borderBottom: '2px solid #7748F6',
                    color: '#A78BFA',
                  }
                : { color: '#4B5563' }
            }
          >
            {tab}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 mb-1">
          <div
            className="text-[10px] font-mono px-2 py-1 rounded"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            3 Active
          </div>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="grid grid-cols-3" style={{ minHeight: '290px' }}>

        {/* Panel 1: Live Incidents */}
        <div className="p-4 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#4B5563' }}>
            Live Incidents
          </div>
          {[
            { svc: 'api-server',   ns: 'production', status: 'CrashLoop', color: '#ef4444', active: true  },
            { svc: 'payment-svc',  ns: 'checkout',   status: 'OOMKilled', color: '#f59e0b', active: false },
            { svc: 'auth-worker',  ns: 'identity',   status: 'Degraded',  color: '#7748F6', active: false },
          ].map((inc, i) => (
            <div
              key={i}
              className="mb-2 p-2.5 rounded-xl cursor-pointer"
              style={{
                background: inc.active ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${inc.active ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: inc.color, boxShadow: `0 0 6px ${inc.color}` }} />
                <span className="text-[11px] font-mono text-white font-semibold truncate">{inc.svc}</span>
                {inc.active && (
                  <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                    Live
                  </span>
                )}
              </div>
              <div className="text-[9px] font-mono" style={{ color: '#4B5563' }}>
                {inc.ns} · {inc.status}
              </div>
            </div>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {[
              { label: 'MTTR', val: '18s', color: '#7748F6' },
              { label: 'Resolved', val: '142', color: '#0EA5E9' },
            ].map(s => (
              <div key={s.label} className="p-2 rounded-lg text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="text-base font-black font-mono" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#374151' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Root Cause Analysis */}
        <div className="p-4 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#4B5563' }}>
            Root Cause Analysis
          </div>
          <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-[11px] font-semibold text-white">Incident #2847</span>
              <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>ACTIVE</span>
            </div>
            <div className="text-[10px] font-mono" style={{ color: '#6B7280' }}>api-server · CrashLoopBackOff</div>
          </div>
          <div className="mb-2">
            <div className="text-[9px] font-medium mb-2" style={{ color: '#6B7280' }}>Confidence scores</div>
            {[
              { label: 'Deploy v2.3.1',      conf: '94%', color: '#7748F6', w: '94%' },
              { label: 'Memory limit 512Mi', conf: '91%', color: '#8B5CF6', w: '91%' },
              { label: 'Traffic spike +40%', conf: '88%', color: '#0EA5E9', w: '88%' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                <div className="flex-1 text-[9px] font-mono truncate" style={{ color: '#9CA3AF' }}>{c.label}</div>
                <span className="text-[9px] font-mono font-semibold" style={{ color: c.color }}>{c.conf}</span>
                <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: c.w, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[8px] font-mono" style={{ color: '#4B5563' }}>📋 Evidence chain: deploy → OOM → restart loop</div>
          </div>
        </div>

        {/* Panel 3: SafeFix */}
        <div className="p-4">
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#4B5563' }}>
            SafeFix™ Proposal
          </div>
          <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(119,72,246,0.07)', border: '1px solid rgba(119,72,246,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold" style={{ color: '#A78BFA' }}>Auto-Remediation</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                dry-run ✓
              </span>
            </div>
            <div className="font-mono text-[10px] p-2 rounded-lg mb-3"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', color: '#A78BFA' }}>
              limits.memory: 512Mi → 1Gi
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold"
                style={{ background: 'linear-gradient(135deg, rgba(119,72,246,0.4), rgba(93,53,212,0.4))', color: '#C4B5FD', border: '1px solid rgba(119,72,246,0.4)' }}>
                <CheckCircle2 className="w-3 h-3" />
                Approve
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-[10px]"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#4B5563', border: '1px solid rgba(255,255,255,0.06)' }}>
                Dismiss
              </button>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[9px] mb-2" style={{ color: '#4B5563' }}>Resolution timeline</div>
            <div className="flex items-center">
              {[
                { t: 'T+0s',  done: true,  label: 'Detect' },
                { t: 'T+3s',  done: true,  label: 'RCA'    },
                { t: 'T+8s',  done: true,  label: 'Fix'    },
                { t: 'T+18s', done: false, label: 'Done'   },
              ].map((item, i, arr) => (
                <React.Fragment key={item.t}>
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full"
                      style={{ background: item.done ? '#7748F6' : 'rgba(255,255,255,0.1)', boxShadow: item.done ? '0 0 6px rgba(119,72,246,0.6)' : 'none' }} />
                    <span className="text-[8px] font-mono mt-1" style={{ color: item.done ? '#7748F6' : '#374151' }}>{item.t}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 h-px mx-1"
                      style={{ background: item.done ? 'linear-gradient(90deg, #7748F6, rgba(119,72,246,0.3))' : 'rgba(255,255,255,0.06)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[9px] font-mono" style={{ color: '#34d399' }}>142 incidents auto-resolved this month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main HeroSection ─────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#130F27',
        minHeight: '100vh',
        paddingTop: 'calc(76px + var(--banner-height, 0px))',
      }}
    >
      <GradientMeshBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-24 w-full">

        {/* ── Centered text block ── */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">

          {/* Announcement pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8"
          >
            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: 'rgba(119,72,246,0.1)',
                border: '1px solid rgba(119,72,246,0.28)',
                color: '#A78BFA',
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{ background: '#7748F6' }}
              >
                New
              </span>
              KubēGraf v1.0 — AI SRE for Kubernetes
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="font-black tracking-[-0.04em] mb-6 text-white"
            style={{ fontSize: 'clamp(44px, 7vw, 84px)', lineHeight: 1.02 }}
          >
            AI-powered incident
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #7748F6 0%, #C4B5FD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              resolution.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="text-lg leading-relaxed mb-10 max-w-xl text-slate-400"
          >
            AI agents that detect, diagnose, and fix Kubernetes incidents —
            running entirely inside your own environment.
            Zero data exfiltration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-10"
          >
            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #7748F6 0%, #5D35D4 100%)',
                boxShadow: '0 4px 24px rgba(119,72,246,0.4), 0 1px 0 rgba(255,255,255,0.12) inset',
              }}
            >
              Get Early Access
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: '#CBD5E1',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              See KubēGraf ↗
            </a>
          </motion.div>

          {/* Inline stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
          >
            {[
              '18s avg MTTR',
              '142+ incidents resolved',
              'Zero data exfiltration',
              'SOC 2 ready',
            ].map((stat, i, arr) => (
              <React.Fragment key={stat}>
                <span className="text-slate-500">{stat}</span>
                {i < arr.length - 1 && <span className="text-slate-700 hidden sm:inline">·</span>}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* ── Full-width product mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 56, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Floating live badge */}
          <div
            className="absolute -top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: '#34d399',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live — Production
          </div>

          {/* Glow under the card */}
          <div
            className="absolute -inset-x-8 -bottom-8 h-24 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 80% at 50% 100%, rgba(119,72,246,0.2) 0%, transparent 70%)',
            }}
          />
          <DashboardMockup />
        </motion.div>
      </div>

      {/* Bottom fade to main bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #1E1A33)' }}
      />
    </section>
  );
}
