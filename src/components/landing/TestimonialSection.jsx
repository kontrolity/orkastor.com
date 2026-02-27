import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const FEATURED = {
  quote: "Orkastor reduced our P0 response time from 45 minutes to under 2 minutes. The AI's root cause analysis is eerily accurate — it caught a memory leak we'd been chasing for months within 8 seconds. Our on-call rotation is finally sustainable.",
  author: 'Sarah Chen',
  role: 'Principal SRE',
  company: 'FinTech Corp',
  initials: 'SC',
};

const OTHERS = [
  {
    quote: "We were skeptical about AI making changes to production, but the approval workflows and audit trails gave us the confidence we needed. We now run in auto-fix mode for low-risk incidents.",
    author: 'Marcus Rodriguez',
    role: 'VP Engineering',
    company: 'CloudScale',
    initials: 'MR',
    accent: '#6C47FF',
  },
  {
    quote: "The runbook automation alone saved us 20+ engineer-hours per week. The CLI is a genuine joy to use — feels like it was designed by someone who actually does on-call.",
    author: 'Alex Kim',
    role: 'Staff Engineer',
    company: 'DataPipe',
    initials: 'AK',
    accent: '#0EA5E9',
  },
  {
    quote: "We tried 3 other AIOps tools before Orkastor. None of them ran in our private cluster. The zero-data-exfiltration guarantee made the security review a non-event.",
    author: 'Priya Nair',
    role: 'Head of Platform',
    company: 'HealthStream',
    initials: 'PN',
    accent: '#6C47FF',
  },
];

function Stars() {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function InitialAvatar({ initials, accent }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border"
      style={{
        background: accent ? `${accent}12` : 'rgba(255,255,255,0.06)',
        borderColor: accent ? `${accent}28` : 'rgba(255,255,255,0.12)',
        color: accent || '#94a3b8',
      }}
    >
      {initials}
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function TestimonialSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#131316' }}
    >
      {/* Faint glow */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 90% 30%, rgba(108,71,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            Social Proof
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-4 max-w-3xl mx-auto">
            Trusted by{' '}
            <span className="text-gradient-brand">Engineering Teams</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            From fintech to healthtech — teams that can't compromise on data privacy.
          </p>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="bento-card p-8 md:p-10 mb-4 relative"
        >
          {/* Corner glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 100% 0%, rgba(108,71,255,0.07) 0%, transparent 70%)',
            }}
          />

          <Stars />

          <blockquote className="text-lg md:text-xl font-medium text-white/90 leading-relaxed mb-8 max-w-4xl">
            "{FEATURED.quote}"
          </blockquote>

          <div
            className="flex items-center gap-4 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <InitialAvatar initials={FEATURED.initials} accent="#6C47FF" />
            <div>
              <div className="text-white font-semibold text-sm">{FEATURED.author}</div>
              <div className="text-slate-500 text-xs mt-0.5">{FEATURED.role} · {FEATURED.company}</div>
            </div>
            <div
              className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                border: '1px solid rgba(108,71,255,0.2)',
                background: 'rgba(108,71,255,0.06)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#6C47FF' }} />
              <span className="text-[10px] font-medium" style={{ color: '#A78BFA' }}>Verified customer</span>
            </div>
          </div>
        </motion.div>

        {/* Supporting testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {OTHERS.map(t => (
            <motion.div
              key={t.author}
              variants={itemVar}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bento-card group p-6"
            >
              <Stars />
              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <InitialAvatar initials={t.initials} accent={t.accent} />
                <div>
                  <div className="text-white font-medium text-sm">{t.author}</div>
                  <div className="text-slate-600 text-xs mt-0.5">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
