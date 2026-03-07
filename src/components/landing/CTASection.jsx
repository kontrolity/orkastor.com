import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Terminal, Shield, Lock, Zap } from 'lucide-react';

const DISCORD_URL = 'https://discord.gg/GKpbU3pQ';

const DiscordIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.02.048.035.088.068.107a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
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
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-10">
            <a href="mailto:hello@orkastor.com" className="hover:text-white transition-colors">Book a Demo</a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <a href="/docs" className="hover:text-white transition-colors">View Docs</a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <a href="https://github.com/orkastor" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#5865F2', fontSize: '0.8125rem' }}
            >
              <DiscordIcon className="w-3.5 h-3.5" />
              Discord Community
            </a>
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
