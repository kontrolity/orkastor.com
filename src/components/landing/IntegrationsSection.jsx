import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

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
      style={{ backgroundColor: '#000000' }}
    >
      {/* Left/right fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #000000, transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #000000, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* ── Simple mono header ── */}
        <motion.p
          className="text-center text-xs font-mono tracking-[0.18em] uppercase text-slate-600 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          Works with your entire stack
        </motion.p>
      </div>

      {/* ── Marquee rows — full width ── */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={inView ? { opacity: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.65, delay: 0.1, ease: EASE_OUT_EXPO }}
      >
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <motion.p
          className="text-center text-slate-600 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          + 40 more integrations via webhooks and custom connectors
        </motion.p>
      </div>
    </section>
  );
}
