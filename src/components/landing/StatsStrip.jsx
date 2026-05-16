import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

function AnimatedNumber({ to, suffix = '', prefix = '', decimal = false }) {
  const count = useMotionValue(0);
  const display = useTransform(count, v =>
    prefix + (decimal ? v.toFixed(1) : Math.round(v)) + suffix
  );
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration: 1.8, ease: 'easeOut' });
    return controls.stop;
  }, [inView, count, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const STATS = [
  {
    value: 18,
    suffix: 's',
    label: 'Avg MTTR',
    sub: '↓ 80% from industry average',
    accentColor: '#FF8A3D',
    gradient: 'linear-gradient(90deg, #FF8A3D, #FF5D8F)',
  },
  {
    value: 142,
    suffix: '+',
    label: 'Incidents resolved',
    sub: 'per month, automatically',
    accentColor: '#E14EFF',
    gradient: 'linear-gradient(90deg, #E14EFF, #7B4DFF)',
  },
  {
    value: 99.9,
    suffix: '%',
    label: 'Uptime maintained',
    sub: 'across all monitored clusters',
    decimal: true,
    accentColor: '#38BDF8',
    gradient: 'linear-gradient(90deg, #38BDF8, #2DD4BF)',
  },
  {
    value: 2.4,
    prefix: '$',
    suffix: 'M',
    label: 'Avg saved / year',
    sub: 'in engineering toil costs',
    decimal: true,
    accentColor: '#2DD4BF',
    gradient: 'linear-gradient(90deg, #2DD4BF, #5EEAD4)',
  },
];

export default function StatsStrip() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--void-base)' }}
    >
      {/* Quiet spectral wash behind cards */}
      <div className="absolute inset-0 pointer-events-none bg-spectral-ambient opacity-60" />

      {/* Top separator — spectral seam */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,138,61,0.25) 25%, rgba(123,77,255,0.30) 50%, rgba(56,189,248,0.25) 75%, transparent 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section label */}
        <motion.p
          className="text-center text-xs font-mono tracking-[0.2em] uppercase mb-10"
          style={{ color: 'rgba(245,245,247,0.40)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Proven results in production
        </motion.p>

        {/* 4 stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              className="bento-card relative p-6 rounded-2xl overflow-hidden"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: stat.gradient }}
              />

              {/* Big number */}
              <div className="stat-number mb-2" style={{ color: stat.accentColor }}>
                <AnimatedNumber
                  to={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ''}
                  decimal={stat.decimal}
                />
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-white mb-1">
                {stat.label}
              </div>

              {/* Sub-label */}
              <div className="text-xs text-slate-600">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
      />
    </section>
  );
}
