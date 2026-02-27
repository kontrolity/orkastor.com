import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const COMPANIES = [
  'Cloudflare',
  'Hashicorp',
  'Databricks',
  'Confluent',
  'Grafana Labs',
  'Temporal',
  'Vercel',
  'PlanetScale',
];

export default function LogoBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section
      ref={ref}
      className="relative py-14"
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
          background:
            'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(108,71,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <motion.p
          className="text-center text-xs font-mono tracking-[0.22em] uppercase mb-9"
          style={{ color: '#374151' }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Trusted by engineering teams at
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {COMPANIES.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE }}
              className="font-semibold text-sm tracking-tight transition-colors duration-200 cursor-default"
              style={{ color: '#374151' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6C47FF')}
              onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
            >
              {name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
