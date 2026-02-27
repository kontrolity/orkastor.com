import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Terminal, Shield, Lock, Zap } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

const EASE = [0.16, 1, 0.3, 1];

const TRUST = [
  { icon: Shield, label: 'SOC 2 Type II' },
  { icon: Lock,   label: 'Zero Exfiltration' },
  { icon: Zap,    label: '18s Mean Resolution' },
];

export default function CTASection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#131316' }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -5%, rgba(108,71,255,0.12) 0%, rgba(14,165,233,0.04) 45%, transparent 65%)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(108,71,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 60% 70% at 50% 0%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 50% 0%, black 0%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 text-center">

        {/* Headline */}
        <motion.h2
          className="font-black tracking-[-0.04em] leading-[0.95] text-white mb-4"
          style={{ fontSize: 'clamp(32px,5vw,56px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
        >
          Start with KubēGraf Free
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-base text-slate-400 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
        >
          Join the waitlist — early adopters get free tier access at launch.
        </motion.p>

        {/* Waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
          className="mb-6"
        >
          <WaitlistForm size="lg" />

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-6 mb-10">
            {[
              'Free tier at launch',
              'No credit card',
              'Runs inside your cluster',
            ].map(p => (
              <span key={p} className="flex items-center gap-1.5 text-slate-600 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#6C47FF' }} />
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Divider + secondary links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="mb-6" />
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-10">
            <a href="mailto:hello@orkastor.com" className="hover:text-white transition-colors">Book a Demo</a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <a href="/docs" className="hover:text-white transition-colors">View Docs</a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <a href="https://github.com/orkastor" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
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
          transition={{ duration: 0.5, delay: 0.44 }}
        >
          <div className="flex justify-center">
            <div
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 rounded-xl font-mono text-xs sm:text-sm max-w-[90vw] overflow-x-auto whitespace-nowrap"
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Terminal className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="text-slate-500">$</span>
              <span style={{ color: '#0EA5E9' }}>brew install orkastor</span>
              <span className="text-slate-700">&&</span>
              <span style={{ color: '#6C47FF' }}>orkastor init</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
