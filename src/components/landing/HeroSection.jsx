import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle2, Zap } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ── Product UI Mockup ──────────────────────────────────────── */
function ProductMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/[0.09]"
      style={{
        background: '#111111',
        boxShadow: '0 0 80px rgba(124,58,237,0.15), 0 32px 64px rgba(0,0,0,0.6)',
      }}
    >
      {/* Titlebar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[11px] font-mono text-slate-600">orkastor / production</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono text-red-400/80">ACTIVE</span>
        </span>
      </div>

      <div className="p-4 space-y-3">

        {/* Incident header */}
        <div
          className="p-3 rounded-xl border"
          style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.20)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white text-xs font-semibold">Incident #2847</span>
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
            >
              ACTIVE
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">api-server · CrashLoopBackOff</div>
          <div className="text-[10px] font-mono text-slate-600 mt-0.5">namespace: production · restarts: 7</div>
        </div>

        {/* RCA panel */}
        <div
          className="p-3 rounded-xl border"
          style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2.5">
            Root Cause Analysis
          </div>
          {/* Confidence bar */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '94%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">94% conf</span>
          </div>
          {/* Causes */}
          {[
            { label: 'Deploy v2.3.1',      conf: '94%', width: '94%', color: '#a78bfa' },
            { label: 'Memory limit 512Mi', conf: '91%', width: '91%', color: '#7c3aed' },
            { label: 'Traffic +40%',       conf: '88%', width: '88%', color: '#f59e0b' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
              <div className="flex-1 text-[10px] font-mono text-slate-400">{c.label}</div>
              <div className="text-[10px] font-mono font-semibold" style={{ color: c.color }}>{c.conf}</div>
              <div className="w-12 h-1 rounded-full bg-white/[0.07] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: c.width, background: c.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* SafeFix panel */}
        <div
          className="p-3 rounded-xl border"
          style={{ background: 'rgba(124,58,237,0.07)', borderColor: 'rgba(124,58,237,0.25)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-purple-300">SafeFix™ Proposal</span>
            </div>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ background: 'rgba(52,211,153,0.10)', borderColor: 'rgba(52,211,153,0.20)', color: '#34d399' }}
            >
              dry-run ✓
            </span>
          </div>
          <div
            className="rounded-lg p-2 mb-2.5 font-mono text-[10px] border"
            style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.06)', color: '#c4b5fd' }}
          >
            limits.memory: 512Mi → 1Gi
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background: 'rgba(124,58,237,0.30)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.40)' }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Approve Fix
            </button>
            <button
              className="flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* Timeline strip */}
      <div
        className="px-4 pb-4 pt-1 flex items-center gap-0"
      >
        {[
          { label: 'T+0s',  active: true  },
          { label: 'T+3s',  active: true  },
          { label: 'T+8s',  active: true  },
          { label: 'T+18s', active: false },
        ].map((t, i, arr) => (
          <React.Fragment key={t.label}>
            <div className="flex flex-col items-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: t.active ? '#f59e0b' : 'rgba(255,255,255,0.15)' }}
              />
              <span className="text-[9px] font-mono mt-1" style={{ color: t.active ? '#f59e0b' : '#475569' }}>
                {t.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className="flex-1 h-px mx-1" style={{ background: 'rgba(100,116,139,0.30)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const STATS = [
  { val: '80%',  label: 'Faster MTTR' },
  { val: '0',    label: 'Bytes leave your network' },
  { val: '18s',  label: 'Mean resolution' },
  { val: '100%', label: 'Human-approved fixes' },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-[76px]"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Single purple radial glow — top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-5%', right: '-5%',
          width: '700px', height: '600px',
          background: 'radial-gradient(ellipse 55% 50% at 80% 10%, rgba(124,58,237,0.10) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="flex mb-8"
            >
              <a href="https://kubegraf.io/" target="_blank" rel="noopener noreferrer" className="badge-pill group">
                <span className="pill-tag">New</span>
                KubēGraf v1.0 — in-environment AI SRE for Kubernetes
                <ChevronRight className="w-3.5 h-3.5 text-purple-400/60 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="font-black tracking-[-0.04em] leading-[0.88] mb-6"
              style={{
                fontSize: 'clamp(44px, 5.5vw, 72px)',
                color: '#f5f5f5',
              }}
            >
              AI-powered incident<br />resolution.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: EASE_OUT_EXPO }}
              className="text-base leading-relaxed mb-10 max-w-sm"
              style={{ color: '#737373' }}
            >
              AI agents that run inside your own environment —
              no data leaves your network.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <a
                href="#cta"
                className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold hover:scale-[1.02] active:scale-[0.99] transition-transform"
              >
                Get Early Access
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://kubegraf.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all"
              >
                See KubēGraf ↗
              </a>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.36 }}
              className="flex flex-wrap items-center"
            >
              {STATS.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div className="text-center px-4 py-2">
                    <div className="shimmer-stat text-2xl font-black tabular-nums">
                      {s.val}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="w-px h-7 bg-white/[0.07] hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — ProductMockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: EASE_OUT_EXPO }}
          >
            <ProductMockup />
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
      />
    </section>
  );
}
