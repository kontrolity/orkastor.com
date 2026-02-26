import React, { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, Shield, Search, CheckCircle2, Server, Cpu } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

/* ── Bento card with spotlight ───────────────────────────────── */
function BentoCard({ className = '', children, accentColor }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`bento-card spotlight-card group p-6 ${className}`}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 w-full h-full rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 0% 0%, ${accentColor}14, transparent 60%)` }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ── Icon badge ──────────────────────────────────────────────── */
function IconBadge({ icon: Icon, color }) {
  return (
    <div
      className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 border shrink-0 transition-all duration-300 group-hover:scale-105"
      style={{ background: `${color}12`, borderColor: `${color}28` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
  );
}

export default function FeaturesGrid() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  /* ── Cursor spotlight ── */
  const handleMouseMove = useCallback((e) => {
    const cards = gridRef.current?.querySelectorAll('.spotlight-card');
    cards?.forEach(card => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const cards = gridRef.current?.querySelectorAll('.spotlight-card');
    cards?.forEach(card => {
      card.style.setProperty('--mouse-x', '-400px');
      card.style.setProperty('--mouse-y', '-400px');
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Top blue glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border border-white/[0.09] text-white/[0.28] mb-5">
            KubēGraf Features
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-4xl mx-auto">
            From Alert to{' '}
            <span className="text-gradient-brand">Resolution</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Unlike point solutions that only alert or only diagnose, Orkastor closes the full loop —
            everything runs inside your own environment.
          </p>
        </motion.div>

        {/* ── 12-col bento grid with cursor spotlight ── */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-12 gap-4"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          {/* ── Row 1 ── */}

          {/* Zero Exfiltration hero card */}
          <BentoCard className="col-span-12 md:col-span-7" accentColor="#2dd4bf">
            <IconBadge icon={Lock} color="#2dd4bf" />
            <h3 className="relative text-white font-bold text-xl mb-2.5 leading-snug">
              Private AI — Zero Data Exfiltration
            </h3>
            <p className="relative text-slate-500 text-sm leading-relaxed mb-5">
              AI inference runs inside your own VPC. No calls to OpenAI, Bedrock, or any external LLM.
              SOC 2, HIPAA, and PCI-DSS ready by design.
            </p>
            <div className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-teal-500/20 bg-teal-500/[0.06] font-mono text-[12px] text-teal-300">
              <Server className="w-3.5 h-3.5" />
              Your VPC. Your inference. Your data.
            </div>
          </BentoCard>

          {/* Stat cards stacked */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
            <motion.div
              variants={item}
              className="bento-card spotlight-card p-6 flex-1 flex flex-col justify-center"
            >
              <div className="shimmer-stat text-[52px] font-black leading-none tracking-[-0.03em] mb-1">
                80%
              </div>
              <div className="text-slate-500 text-sm font-medium">Faster MTTR</div>
              <div className="text-slate-700 text-xs mt-1">vs. manual incident response</div>
            </motion.div>
            <motion.div
              variants={item}
              className="bento-card spotlight-card p-6 flex-1 flex flex-col justify-center"
            >
              <div className="shimmer-stat text-[52px] font-black leading-none tracking-[-0.03em] mb-1">
                18s
              </div>
              <div className="text-slate-500 text-sm font-medium">Mean Resolution</div>
              <div className="text-slate-700 text-xs mt-1">alert to fix applied</div>
            </motion.div>
          </div>

          {/* ── Row 2 ── */}

          {/* SafeFix card */}
          <BentoCard className="col-span-12 md:col-span-5" accentColor="#3b82f6">
            <IconBadge icon={Shield} color="#3b82f6" />
            <h3 className="relative text-white font-bold text-lg mb-2.5 leading-snug">
              SafeFix™ Auto-Remediation
            </h3>
            <p className="relative text-slate-500 text-sm leading-relaxed">
              AI-generated fixes with mandatory human approval gate and automatic rollback
              if post-fix metrics regress.
            </p>
          </BentoCard>

          {/* RCA wide card */}
          <BentoCard className="col-span-12 md:col-span-7" accentColor="#8b5cf6">
            <IconBadge icon={Search} color="#8b5cf6" />
            <h3 className="relative text-white font-bold text-lg mb-2.5 leading-snug">
              AI Root Cause Analysis
            </h3>
            <p className="relative text-slate-500 text-sm leading-relaxed mb-5">
              Correlates signals across services and pinpoints the root cause with a full evidence chain.
            </p>
            <div className="relative space-y-2 p-3 rounded-xl border border-white/[0.06] bg-black/30">
              {[
                { label: 'Deploy v2.3.1',     conf: '94%', color: '#ef4444' },
                { label: 'OOMKilled (512Mi)', conf: '91%', color: '#f59e0b' },
                { label: 'Traffic +40%',      conf: '88%', color: '#3b82f6' },
              ].map((ev) => (
                <div key={ev.label} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ev.color }} />
                  <div className="flex-1 text-[11px] font-mono text-slate-400">{ev.label}</div>
                  <div className="text-[10px] font-semibold font-mono" style={{ color: ev.color }}>{ev.conf}</div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* ── Row 3 — 3 equal ── */}

          <BentoCard className="col-span-12 md:col-span-4" accentColor="#f59e0b">
            <IconBadge icon={CheckCircle2} color="#f59e0b" />
            <h3 className="relative text-white font-bold text-base mb-2">Human Approval Gate</h3>
            <p className="relative text-slate-500 text-xs leading-relaxed">
              Every AI-proposed fix requires explicit approval. No silent changes, no surprises.
              Full audit trail on every action.
            </p>
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" accentColor="#2dd4bf">
            <IconBadge icon={Cpu} color="#2dd4bf" />
            <h3 className="relative text-white font-bold text-base mb-2">Dry-Run Validation</h3>
            <p className="relative text-slate-500 text-xs leading-relaxed">
              Every proposed change is validated in dry-run mode before touching production —
              including OPA policy checks.
            </p>
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" accentColor="#60a5fa">
            <IconBadge icon={Server} color="#60a5fa" />
            <h3 className="relative text-white font-bold text-base mb-2">100% In-Environment</h3>
            <p className="relative text-slate-500 text-xs leading-relaxed">
              Runs as a Kubernetes operator inside your cluster. Zero external SaaS dependencies.
              Your data never leaves.
            </p>
          </BentoCard>

        </motion.div>
      </div>
    </section>
  );
}
