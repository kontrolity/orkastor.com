import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Terminal, Shield, Lock, Zap } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const PERKS = [
  'Free tier available at launch',
  'No credit card required',
  'Runs entirely inside your cluster',
];

const TRUST = [
  { icon: Shield, label: 'SOC 2 Type II' },
  { icon: Lock,   label: 'Zero Exfiltration' },
  { icon: Zap,    label: '18s Mean Resolution' },
];

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Top radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.14) 0%, transparent 65%)' }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 85% 5%, rgba(16,185,129,0.08) 0%, transparent 65%)' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* Beam lines */}
      <div className="beam-line" style={{ top: '20%', animationDelay: '0s' }} />
      <div className="beam-line" style={{ top: '70%', animationDelay: '2s', opacity: 0.3 }} />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">

        {/* Logo mark */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        >
          <OrkastorLogo size={52} showWordmark={false} />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-[clamp(36px,6vw,76px)] font-black tracking-[-0.04em] leading-[0.95] text-white mb-5"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
        >
          AI SRE That Stays{' '}
          <span className="text-gradient-brand">Inside Your Walls.</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, delay: 0.14, ease: EASE_OUT_EXPO }}
        >
          While every other AI SRE tool sends your infrastructure data to an external LLM,
          Orkastor's inference runs inside your own environment —
          with 3× faster resolution and{' '}
          <span className="text-slate-200 font-medium">zero data exfiltration.</span>
        </motion.p>

        {/* Email capture */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: EASE_OUT_EXPO }}
        >
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@company.com"
                required
                className="flex-1 px-4 py-3.5 rounded-xl text-sm bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
              />
              <button
                type="submit"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-bold whitespace-nowrap hover:scale-[1.02] active:scale-[0.99] transition-transform"
              >
                Get Early Access
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="mb-6 py-5 px-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] inline-block">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg mb-1">
                <CheckCircle2 className="w-5 h-5" />
                You're on the list!
              </div>
              <p className="text-slate-400 text-sm">We'll reach out shortly with early access details.</p>
            </div>
          )}
        </motion.div>

        {/* Perks */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {PERKS.map(p => (
            <span key={p} className="flex items-center gap-1.5 text-slate-600 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {p}
            </span>
          ))}
        </motion.div>

        {/* Section divider */}
        <motion.div
          className="section-divider mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        />

        {/* Trust signals row */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE_OUT_EXPO }}
        >
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-500 text-xs">
              <Icon className="w-3.5 h-3.5 text-slate-600" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Install snippet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <p className="text-slate-600 text-sm mb-3">Or start immediately:</p>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 rounded-xl font-mono text-xs sm:text-sm border border-white/[0.07] bg-black/50 backdrop-blur-sm max-w-[90vw] overflow-x-auto whitespace-nowrap">
              <Terminal className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="text-slate-500">$</span>
              <span className="text-blue-300">brew install orkastor</span>
              <span className="text-slate-700">&&</span>
              <span className="text-teal-400">orkastor init</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
