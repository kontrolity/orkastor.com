import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import OrkastorLogo from './OrkastorLogo';

const PERKS = [
  'Free tier available at launch',
  'No credit card required',
  'Runs entirely inside your cluster',
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
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Dual radial glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.14) 0%, transparent 65%)' }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 85% 5%, rgba(16,185,129,0.09) 0%, transparent 65%)' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Logo mark only */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <OrkastorLogo size={52} showWordmark={false} />
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          Ready to Eliminate{' '}
          <span className="text-gradient-brand">Alert Fatigue?</span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.14 }}
        >
          Join engineering teams who've cut incident response time by 3× and freed
          their SREs to build — not babysit infrastructure.
        </motion.p>

        {/* Email capture or success */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
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
            <div className="mb-6 py-5 px-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 inline-block">
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
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10"
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

        {/* Alternative: brew install */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.38 }}
        >
          <p className="text-slate-600 text-sm mb-3">Or start immediately:</p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-mono text-sm border border-white/[0.07] bg-black/50 backdrop-blur-sm">
            <Terminal className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500">$</span>
            <span className="text-blue-300">brew install orkastor</span>
            <span className="text-slate-700">&&</span>
            <span className="text-blue-300">orkastor init</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
