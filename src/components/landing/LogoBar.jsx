import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/* Tool name → accent dot color */
const ROW_1 = [
  { name: 'Datadog',    color: '#7C3AED' },
  { name: 'PagerDuty',  color: '#06B6D4' },
  { name: 'Prometheus', color: '#F59E0B' },
  { name: 'Grafana',    color: '#F97316' },
  { name: 'Slack',      color: '#22C55E' },
  { name: 'OpsGenie',   color: '#3B82F6' },
  { name: 'Splunk',     color: '#EF4444' },
  { name: 'New Relic',  color: '#00D4AA' },
  { name: 'Kubernetes', color: '#6C47FF' },
  { name: 'ArgoCD',     color: '#F43F5E' },
  { name: 'Terraform',  color: '#818CF8' },
  { name: 'Helm',       color: '#0EA5E9' },
];

const ROW_2 = [
  { name: 'AWS',        color: '#F59E0B' },
  { name: 'GCP',        color: '#4285F4' },
  { name: 'Azure',      color: '#0078D4' },
  { name: 'GitHub',     color: '#94A3B8' },
  { name: 'GitLab',     color: '#FC6D26' },
  { name: 'Jira',       color: '#0052CC' },
  { name: 'VictorOps',  color: '#EF4444' },
  { name: 'Sentry',     color: '#7C3AED' },
  { name: 'Jaeger',     color: '#60A5FA' },
  { name: 'Vault',      color: '#FBBF24' },
  { name: 'Elastic',    color: '#00BFB3' },
  { name: 'Cilium',     color: '#F97316' },
];

function ToolPill({ name, color }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 whitespace-nowrap shrink-0"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {name}
    </span>
  );
}

function MarqueeRow({ tools, direction = 'left', speed = 32 }) {
  /* Duplicate for seamless loop */
  const doubled = [...tools, ...tools];

  return (
    <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
      <div
        className={direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}
        style={{
          display: 'flex',
          gap: '8px',
          width: 'max-content',
          animationDuration: `${speed}s`,
        }}
      >
        {doubled.map((tool, i) => (
          <ToolPill key={`${tool.name}-${i}`} name={tool.name} color={tool.color} />
        ))}
      </div>
    </div>
  );
}

export default function LogoBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section
      ref={ref}
      className="relative py-14 overflow-hidden"
      style={{
        backgroundColor: '#131316',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(108,71,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <motion.p
          className="text-center text-xs font-mono tracking-[0.22em] uppercase mb-8 px-5"
          style={{ color: '#3D3460' }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Used by teams running these tools
        </motion.p>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <MarqueeRow tools={ROW_1} direction="left"  speed={34} />
          <MarqueeRow tools={ROW_2} direction="right" speed={28} />
        </motion.div>
      </div>
    </section>
  );
}
