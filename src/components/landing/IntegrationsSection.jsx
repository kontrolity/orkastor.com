import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ── Marquee data ─────────────────────────────────────────────── */
const ROW_1 = [
  { name: 'Kubernetes',   cat: 'Infra',      color: '#60a5fa' },
  { name: 'AWS',          cat: 'Cloud',      color: '#f59e0b' },
  { name: 'Google Cloud', cat: 'Cloud',      color: '#34d399' },
  { name: 'Azure',        cat: 'Cloud',      color: '#3b82f6' },
  { name: 'Datadog',      cat: 'Monitoring', color: '#a78bfa' },
  { name: 'Prometheus',   cat: 'Monitoring', color: '#f97316' },
  { name: 'Grafana',      cat: 'Monitoring', color: '#f97316' },
  { name: 'PagerDuty',    cat: 'Alerting',   color: '#2dd4bf' },
];

const ROW_2 = [
  { name: 'OpsGenie',  cat: 'Alerting',  color: '#60a5fa' },
  { name: 'Slack',     cat: 'Chat',      color: '#34d399' },
  { name: 'GitHub',    cat: 'DevOps',    color: '#e2e8f0' },
  { name: 'GitLab',    cat: 'DevOps',    color: '#f97316' },
  { name: 'ArgoCD',    cat: 'CI/CD',     color: '#f472b6' },
  { name: 'Terraform', cat: 'IaC',       color: '#3b82f6' },
  { name: 'Helm',      cat: 'Packaging', color: '#2dd4bf' },
  { name: 'Ansible',   cat: 'Config',    color: '#ef4444' },
];

/* ── Beam hub integrations ───────────────────────────────────── */
const LEFT_NODES  = [
  { name: 'K8s',     color: '#60a5fa' },
  { name: 'Datadog', color: '#a78bfa' },
  { name: 'AWS',     color: '#f59e0b' },
];
const RIGHT_NODES = [
  { name: 'Slack',  color: '#34d399' },
  { name: 'GitHub', color: '#e2e8f0' },
  { name: 'ArgoCD', color: '#f472b6' },
];

/* ── Single animated beam line ───────────────────────────────── */
function BeamLine({ delay = 0, reverse = false }) {
  return (
    <div className="relative flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }}>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-0.5 rounded-full"
        style={{
          width: '45%',
          background: reverse
            ? 'linear-gradient(270deg, transparent, rgba(59,130,246,0.9), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(59,130,246,0.9), transparent)',
        }}
        animate={{ x: reverse ? ['200%', '-200%'] : ['-200%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay }}
      />
    </div>
  );
}

/* ── Integration node circle ─────────────────────────────────── */
function IntNode({ node }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold border shrink-0"
      style={{
        background: `${node.color}15`,
        borderColor: `${node.color}30`,
        color: node.color,
      }}
    >
      {node.name.slice(0, 2)}
    </div>
  );
}

/* ── Center Orkastor hub ─────────────────────────────────────── */
function OrkHub() {
  return (
    <div
      className="relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0"
      style={{
        background: 'rgba(59,130,246,0.10)',
        borderColor: 'rgba(59,130,246,0.35)',
        boxShadow: '0 0 24px rgba(59,130,246,0.18)',
      }}
    >
      <span className="text-blue-400 font-black text-sm tracking-tight">ORK</span>
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-2xl animate-ping"
        style={{ background: 'rgba(59,130,246,0.06)', animationDuration: '3s' }}
      />
    </div>
  );
}

/* ── Full beam hub diagram ───────────────────────────────────── */
function BeamHub({ inView }) {
  return (
    <motion.div
      className="flex items-center justify-center max-w-2xl mx-auto mb-12 px-4"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.15, ease: EASE_OUT_EXPO }}
    >
      {/* Left nodes — reversed so closest to hub is rightmost */}
      {[...LEFT_NODES].reverse().map((node, i) => (
        <React.Fragment key={node.name}>
          <IntNode node={node} />
          <BeamLine delay={i * 0.5} reverse />
        </React.Fragment>
      ))}

      {/* Center hub */}
      <OrkHub />

      {/* Right nodes */}
      {RIGHT_NODES.map((node, i) => (
        <React.Fragment key={node.name}>
          <BeamLine delay={i * 0.5 + 0.25} />
          <IntNode node={node} />
        </React.Fragment>
      ))}
    </motion.div>
  );
}

/* ── Marquee components ──────────────────────────────────────── */
function IntegrationPill({ name, cat, color }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-200 shrink-0">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border shrink-0"
        style={{ background: `${color}15`, borderColor: `${color}30`, color }}
      >
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-white text-sm font-semibold leading-tight">{name}</div>
        <div className="text-slate-500 text-[10px] uppercase tracking-wider">{cat}</div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={reverse ? 'animate-marquee-right' : 'animate-marquee-left'}
        style={{ display: 'flex', gap: '12px', width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <IntegrationPill key={`${item.name}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function IntegrationsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: '#050505' }}
    >
      {/* Left/right fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #050505, transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #050505, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* ── Mono header ── */}
        <motion.p
          className="text-center text-xs font-mono tracking-[0.18em] uppercase text-slate-600 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          Works with your entire stack
        </motion.p>

        {/* ── Animated beam hub ── */}
        <BeamHub inView={inView} />
      </div>

      {/* ── Marquee rows — full width ── */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.65, delay: 0.25, ease: EASE_OUT_EXPO }}
      >
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <motion.p
          className="text-center text-slate-600 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          + 40 more integrations via webhooks and custom connectors
        </motion.p>
      </div>
    </section>
  );
}
