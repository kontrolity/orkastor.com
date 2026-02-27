import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, CheckCircle2, ExternalLink } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const CHECKLIST = [
  {
    title: 'Multi-Source Correlation',
    desc: 'Fuses logs, metrics, events, deployments into a single causal timeline.',
  },
  {
    title: 'SafeFix™ Auto-Remediation',
    desc: 'AI-generated fixes with human approval gate before touching production.',
  },
  {
    title: 'Dry-Run Validation',
    desc: 'Every change validated in dry-run mode before it touches production.',
  },
  {
    title: 'Confidence-Scored RCA',
    desc: 'Evidence chain with percentage confidence for every root cause finding.',
  },
];

const KUBETERM_LINES = [
  { delay: 0,    text: '$ orkastor diagnose --namespace production',  color: '#9CA3AF' },
  { delay: 600,  text: 'Fetching events, logs, metrics...',           color: '#4B5563' },
  { delay: 1200, text: '✓ 12 signals correlated across 3 sources',    color: '#2DD4BF' },
  { delay: 1900, text: '',                                             color: '' },
  { delay: 2200, text: '⚠  payment-svc CrashLoopBackOff (94% conf)', color: '#F59E0B' },
  { delay: 2700, text: '   cause: OOMKill → memory limit 256Mi',      color: '#6B7280' },
  { delay: 3200, text: '   correlated with: deploy v3.2.1 @ 14:03',   color: '#4B5563' },
  { delay: 3900, text: '',                                             color: '' },
  { delay: 4200, text: '⟳ SafeFix™ generating patch...',              color: '#0EA5E9' },
  { delay: 5100, text: '  patch: resources.limits.memory → 512Mi',    color: '#E2E8F0' },
  { delay: 5700, text: '  dry-run: PASSED · no policy violations',    color: '#4B5563' },
  { delay: 6400, text: '',                                             color: '' },
  { delay: 6700, text: '✓ Approved · applying to production...',      color: '#34D399' },
  { delay: 7400, text: '✓ Resolved · incident closed in 14s',         color: '#34D399' },
];

function KubeTerminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const timers = [];
    setVisibleLines([]);
    const schedule = () => {
      KUBETERM_LINES.forEach((line, i) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, i]);
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, line.delay);
        timers.push(t);
      });
      const total = KUBETERM_LINES[KUBETERM_LINES.length - 1].delay + 2600;
      const loop = setTimeout(() => { setVisibleLines([]); schedule(); }, total);
      timers.push(loop);
    };
    schedule();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal-window w-full">
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-red-500/80" />
        <span className="terminal-dot bg-amber-500/80" />
        <span className="terminal-dot bg-emerald-500/80" />
        <div className="ml-3 flex items-center gap-2 text-xs font-mono" style={{ color: '#4B5563' }}>
          <Terminal className="w-3 h-3" />
          kubēgraf — production
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[11px] font-mono" style={{ color: '#0D9488' }}>live</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12.5px] leading-relaxed space-y-px h-52 sm:h-60 overflow-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {KUBETERM_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${
              visibleLines.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            }`}
            style={{ color: line.color || 'transparent' }}
          >
            {line.text || '\u00A0'}
          </div>
        ))}
        {visibleLines.length > 0 && visibleLines.length < KUBETERM_LINES.length && (
          <span
            className="inline-block w-1.5 h-3.5 animate-cursor-blink"
            style={{ background: '#0EA5E9' }}
          />
        )}
      </div>
    </div>
  );
}

export default function KubeGrafSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="kubegraf"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#131316' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(108,71,255,0.08) 0%, rgba(14,165,233,0.03) 50%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-6"
              style={{
                border: '1px solid rgba(108,71,255,0.3)',
                color: 'rgba(167,139,250,0.8)',
                background: 'rgba(108,71,255,0.07)',
              }}
            >
              Flagship Module
            </span>

            <h2
              className="font-black tracking-[-0.03em] text-white mb-4 leading-[1.05]"
              style={{ fontSize: 'clamp(32px,4.5vw,52px)' }}
            >
              KubēGraf —<br />
              <span className="text-gradient-brand">AI SRE for Kubernetes</span>
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
              The first Orkastor module: monitors your Kubernetes clusters in real time,
              correlates signals across every source, and resolves incidents — all inside your VPC.
            </p>

            <div className="space-y-5 mb-8">
              {CHECKLIST.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#6C47FF' }} />
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-clerk-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px]"
            >
              Try KubēGraf Free
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Right column — terminal */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
          >
            <KubeTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
