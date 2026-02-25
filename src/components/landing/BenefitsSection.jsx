import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingDown, TrendingUp, Users, DollarSign } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const BENEFITS = [
  {
    icon: TrendingDown,
    stat: '85%',
    label: 'Reduction in Toil',
    description: 'Engineers spend less time on manual incident response and more time shipping features that matter.',
    accent: '#3b82f6',
  },
  {
    icon: TrendingUp,
    stat: '3×',
    label: 'Faster MTTR',
    description: 'Mean time to resolution drops dramatically when AI handles the investigation and first response automatically.',
    accent: '#10b981',
  },
  {
    icon: Users,
    stat: '1:50',
    label: 'SRE:Service Ratio',
    description: 'One SRE can confidently own 50+ services across cloud and Kubernetes when Orkastor handles routine monitoring and fixes around the clock.',
    accent: '#60a5fa',
  },
  {
    icon: DollarSign,
    stat: '$2.4M',
    label: 'Avg. Annual Savings',
    description: 'Reduced downtime costs, fewer SRE hires needed, and faster feature delivery compound into real ROI.',
    accent: '#34d399',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

export default function BenefitsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Dual glows */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 0% 30%, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 100% 80%, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-30"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
            Business Impact
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-3xl mx-auto">
            Real Results for{' '}
            <span className="text-gradient-brand">Engineering Teams</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Based on aggregate data from teams using Orkastor in production.
          </p>
        </motion.div>

        {/* ── Benefit cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                variants={itemVar}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bento-card group relative p-6 sm:p-8"
              >
                {/* Background radial glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 60% 60% at 20% 20%, ${b.accent}0a, transparent 70%)` }}
                />

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${b.accent}40, transparent)` }}
                />

                <div className="relative flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105"
                    style={{ background: `${b.accent}12`, borderColor: `${b.accent}28` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: b.accent }} />
                  </div>

                  <div>
                    <div className="text-[clamp(36px,4vw,52px)] font-black leading-none mb-1 tracking-[-0.03em] text-white text-glow-blue tabular-nums">
                      {b.stat}
                    </div>
                    <div className="text-white font-bold text-base mb-2">{b.label}</div>
                    <p className="text-slate-500 text-sm leading-relaxed">{b.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
