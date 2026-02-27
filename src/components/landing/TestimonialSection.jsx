import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

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
    accent: '#7c3aed',
  },
  {
    quote: "The runbook automation alone saved us 20+ engineer-hours per week. The CLI is a genuine joy to use — feels like it was designed by someone who actually does on-call.",
    author: 'Alex Kim',
    role: 'Staff Engineer',
    company: 'DataPipe',
    initials: 'AK',
    accent: '#a78bfa',
  },
  {
    quote: "We tried 3 other AIOps tools before Orkastor. None of them ran in our private cluster. The zero-data-exfiltration guarantee made the security review a non-event.",
    author: 'Priya Nair',
    role: 'Head of Platform',
    company: 'HealthStream',
    initials: 'PN',
    accent: '#f59e0b',
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
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

export default function TestimonialSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Faint purple glow */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 90% 30%, rgba(124,58,237,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
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

        {/* ── Featured testimonial ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="bento-card p-8 md:p-10 mb-4 relative"
        >
          {/* Glow corner */}
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 100% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)' }}
          />

          <Stars />

          <blockquote className="text-lg md:text-xl font-medium text-white/90 leading-relaxed mb-8 max-w-4xl">
            "{FEATURED.quote}"
          </blockquote>

          <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
            <InitialAvatar initials={FEATURED.initials} accent="#7c3aed" />
            <div>
              <div className="text-white font-semibold text-sm">{FEATURED.author}</div>
              <div className="text-slate-500 text-xs mt-0.5">{FEATURED.role} · {FEATURED.company}</div>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[10px] text-purple-400 font-medium">Verified customer</span>
            </div>
          </div>
        </motion.div>

        {/* ── Supporting testimonials ── */}
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
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
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
