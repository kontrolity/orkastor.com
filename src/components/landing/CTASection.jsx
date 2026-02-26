import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Terminal, Shield, Lock, Zap } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 65%)' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-30"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 text-center">

        {/* ── Headline ── */}
        <motion.h2
          className="text-[clamp(32px,5vw,56px)] font-black tracking-[-0.04em] leading-[0.95] text-white mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
        >
          Start with KubēGraf Free
        </motion.h2>

        {/* ── Subheadline ── */}
        <motion.p
          className="text-base text-slate-400 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.14, ease: EASE_OUT_EXPO }}
        >
          Join the waitlist — early adopters get free tier access at launch.
        </motion.p>

        {/* ── Email form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: EASE_OUT_EXPO }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@company.com"
                required
                className="px-4 py-3.5 rounded-xl text-sm bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
              />
              <button
                type="submit"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-[15px] font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Get Early Access
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="py-5 px-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                You're on the list!
              </div>
              <p className="text-slate-500 text-xs">We'll reach out with early access details.</p>
            </div>
          )}

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mb-10">
            {[
              'Free tier at launch',
              'No credit card',
              'Runs inside your cluster',
            ].map(p => (
              <span key={p} className="flex items-center gap-1.5 text-slate-600 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Divider + secondary links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <div className="border-t border-white/[0.06] mb-6" />
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-10">
            <a href="#" className="hover:text-white transition-colors">Book a Demo</a>
            <span className="text-white/20">·</span>
            <a href="#" className="hover:text-white transition-colors">View Docs</a>
            <span className="text-white/20">·</span>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </motion.div>

        {/* ── Trust signals ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.38, ease: EASE_OUT_EXPO }}
        >
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-500 text-xs">
              <Icon className="w-3.5 h-3.5 text-slate-600" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* ── Install snippet ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.44 }}
        >
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
