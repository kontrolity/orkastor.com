import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const ROW_1 = [
  { name: 'Kubernetes',   cat: 'Infra',      color: '#0EA5E9' },
  { name: 'AWS',          cat: 'Cloud',      color: '#F59E0B' },
  { name: 'Google Cloud', cat: 'Cloud',      color: '#34D399' },
  { name: 'Azure',        cat: 'Cloud',      color: '#3B82F6' },
  { name: 'Datadog',      cat: 'Monitoring', color: '#6C47FF' },
  { name: 'Prometheus',   cat: 'Monitoring', color: '#F97316' },
  { name: 'Grafana',      cat: 'Monitoring', color: '#F97316' },
  { name: 'PagerDuty',    cat: 'Alerting',   color: '#2DD4BF' },
];

const ROW_2 = [
  { name: 'OpsGenie',  cat: 'Alerting',  color: '#0EA5E9' },
  { name: 'Slack',     cat: 'Chat',      color: '#34D399' },
  { name: 'GitHub',    cat: 'DevOps',    color: '#E2E8F0' },
  { name: 'GitLab',    cat: 'DevOps',    color: '#F97316' },
  { name: 'ArgoCD',    cat: 'CI/CD',     color: '#F472B6' },
  { name: 'Terraform', cat: 'IaC',       color: '#6C47FF' },
  { name: 'Helm',      cat: 'Packaging', color: '#2DD4BF' },
  { name: 'Ansible',   cat: 'Config',    color: '#EF4444' },
];

function IntegrationPill({ name, cat, color }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shrink-0 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.background = `${color}08`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border shrink-0"
        style={{ background: `${color}15`, borderColor: `${color}30`, color }}
      >
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-white text-sm font-semibold leading-tight">{name}</div>
        <div className="text-[10px] uppercase tracking-wider" style={{ color: '#4B5563' }}>{cat}</div>
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
      style={{ backgroundColor: '#1E1A33' }}
    >
      {/* Left/right fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #1E1A33, transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #1E1A33, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <motion.p
          className="text-center text-xs font-mono tracking-[0.18em] uppercase mb-10"
          style={{ color: '#374151' }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Works with your entire stack
        </motion.p>
      </div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
      >
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <motion.p
          className="text-center text-sm mt-8"
          style={{ color: '#374151' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          + 40 more integrations via webhooks and custom connectors
        </motion.p>
      </div>
    </section>
  );
}
