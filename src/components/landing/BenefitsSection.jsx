import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingDown, TrendingUp, Users, DollarSign } from 'lucide-react';

const BENEFITS = [
  {
    icon: TrendingDown,
    stat: '85%',
    label: 'Reduction in Toil',
    description: 'Engineers spend less time on manual incident response and more time shipping features that matter.',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.12)',
  },
  {
    icon: TrendingUp,
    stat: '3×',
    label: 'Faster MTTR',
    description: 'Mean time to resolution drops dramatically when AI handles the investigation and first response automatically.',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.12)',
  },
  {
    icon: Users,
    stat: '1:50',
    label: 'SRE:Service Ratio',
    description: 'One SRE can confidently own 50+ services when Orkastor handles routine monitoring and fixes around the clock.',
    accentColor: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.10)',
  },
  {
    icon: DollarSign,
    stat: '$2.4M',
    label: 'Avg. Annual Savings',
    description: 'Reduced downtime costs, fewer SRE hires needed, and faster feature delivery compound into real ROI.',
    accentColor: '#34d399',
    glowColor: 'rgba(52,211,153,0.10)',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function BenefitsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Dual glows */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 0% 30%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 100% 80%, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-30"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden" animate={inView ? 'show' : 'hidden'}
          variants={fadeUp} custom={0}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/[0.10] text-white/[0.30] mb-5">
            Business Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            Real Results for{' '}
            <span className="text-gradient-brand">Engineering Teams</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Based on aggregate data from teams using Orkastor in production.
          </p>
        </motion.div>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                className="card-specular relative group p-5 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-300 overflow-hidden"
                initial="hidden" animate={inView ? 'show' : 'hidden'}
                variants={fadeUp} custom={i + 1}
              >
                {/* Background radial glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 60% 60% at 20% 20%, ${b.glowColor} 0%, transparent 70%)` }}
                />

                <div className="relative flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                    style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
                  >
                    <Icon className="w-7 h-7 text-slate-500" />
                  </div>

                  <div>
                    {/* Big stat */}
                    <div className="text-4xl sm:text-[52px] font-black leading-none mb-1 tracking-tight text-white">
                      {b.stat}
                    </div>
                    <div className="text-white font-bold text-lg mb-2">{b.label}</div>
                    <p className="text-slate-500 text-sm leading-relaxed">{b.description}</p>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${b.accentColor}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
