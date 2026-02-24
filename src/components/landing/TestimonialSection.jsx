import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

const FEATURED = {
  quote: "Orkastor reduced our P0 response time from 45 minutes to under 2 minutes. The AI's root cause analysis is eerily accurate — it caught a memory leak we'd been chasing for months within 8 seconds. Our on-call rotation is finally sustainable.",
  author: 'Sarah Chen',
  role: 'Principal SRE',
  company: 'FinTech Corp',
  avatar: 'SC',
  accentColor: '#3b82f6',
};

const OTHERS = [
  {
    quote: "We were skeptical about AI making changes to production, but the approval workflows and audit trails gave us the confidence we needed. We now run in auto-fix mode for low-risk incidents.",
    author: 'Marcus Rodriguez',
    role: 'VP Engineering',
    company: 'CloudScale',
    avatar: 'MR',
    accentColor: '#10b981',
  },
  {
    quote: "The runbook automation alone saved us 20+ engineer-hours per week. The CLI is a genuine joy to use — feels like it was designed by someone who actually does on-call.",
    author: 'Alex Kim',
    role: 'Staff Engineer',
    company: 'DataPipe',
    avatar: 'AK',
    accentColor: '#60a5fa',
  },
  {
    quote: "We tried 3 other AIOps tools before Orkastor. None of them ran in our private cluster. The zero-data-exfiltration guarantee made the security review a non-event.",
    author: 'Priya Nair',
    role: 'Head of Platform',
    company: 'HealthStream',
    avatar: 'PN',
    accentColor: '#34d399',
  },
];

function Avatar({ initials }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border text-slate-400"
      style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.14)' }}
    >
      {initials}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08 } }),
};

export default function TestimonialSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Emerald glow */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 90% 30%, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden" animate={inView ? 'show' : 'hidden'}
          variants={fadeUp} custom={0}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/[0.10] text-white/[0.30] mb-5">
            Social Proof
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Trusted by{' '}
            <span className="text-gradient-brand">Engineering Teams</span>
          </h2>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          className="card-specular relative p-8 md:p-10 rounded-2xl border border-white/[0.1] bg-white/[0.035] mb-5 overflow-hidden"
          initial="hidden" animate={inView ? 'show' : 'hidden'}
          variants={fadeUp} custom={1}
        >
          {/* Glow corner */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
          />

          <Quote className="w-10 h-10 mb-6 text-white/[0.15]" />

          <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8 max-w-4xl">
            "{FEATURED.quote}"
          </blockquote>

          <div className="flex items-center gap-4">
            <Avatar initials={FEATURED.avatar} />
            <div>
              <div className="text-white font-semibold">{FEATURED.author}</div>
              <div className="text-slate-500 text-sm">{FEATURED.role} · {FEATURED.company}</div>
            </div>
          </div>
        </motion.div>

        {/* Supporting testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OTHERS.map((t, i) => (
            <motion.div
              key={t.author}
              className="card-specular p-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.13] hover:bg-white/[0.04] transition-all duration-300"
              initial="hidden" animate={inView ? 'show' : 'hidden'}
              variants={fadeUp} custom={i + 2}
            >
              <Quote className="w-6 h-6 mb-4 text-white/[0.12]" />
              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar initials={t.avatar} />
                <div>
                  <div className="text-white font-medium text-sm">{t.author}</div>
                  <div className="text-slate-600 text-xs">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
