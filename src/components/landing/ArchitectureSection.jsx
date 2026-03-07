import React, { useRef, useEffect, useState, forwardRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Box, ScrollText, Activity, Rocket,
  Brain, Download, Database, Cpu, Target,
  Shield, DollarSign, Lock, Layers, GitMerge,
  Search, Wrench, Play, CheckCircle,
  ChevronRight, ArrowDown,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const COLORS = {
  source: '#0ea5e9',
  engine: '#6c47ff',
  product: '#8b5cf6',
  remediation: '#10b981',
};

/* ═══════════════════════════════════════════════════════════════════════════
 * Path computation helper
 * ═══════════════════════════════════════════════════════════════════════════ */
function computePath(cRect, fromEl, toEl) {
  if (!cRect || !fromEl || !toEl) return null;
  const a = fromEl.getBoundingClientRect();
  const b = toEl.getBoundingClientRect();

  const aCx = a.left - cRect.left + a.width / 2;
  const aCy = a.top - cRect.top + a.height / 2;
  const bCx = b.left - cRect.left + b.width / 2;
  const bCy = b.top - cRect.top + b.height / 2;

  const dx = Math.abs(bCx - aCx);
  const dy = Math.abs(bCy - aCy);
  const horiz = dx >= dy;

  let sx, sy, ex, ey;
  if (horiz) {
    sx = bCx > aCx ? a.right - cRect.left : a.left - cRect.left;
    sy = aCy;
    ex = bCx > aCx ? b.left - cRect.left : b.right - cRect.left;
    ey = bCy;
  } else {
    sx = aCx;
    sy = bCy > aCy ? a.bottom - cRect.top : a.top - cRect.top;
    ex = bCx;
    ey = bCy > aCy ? b.top - cRect.top : b.bottom - cRect.top;
  }

  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const d = horiz
    ? `M ${sx},${sy} C ${mx},${sy} ${mx},${ey} ${ex},${ey}`
    : `M ${sx},${sy} C ${sx},${my} ${ex},${my} ${ex},${ey}`;
  return d;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * BeamsOverlay — single SVG with all animated connection paths
 * Uses native SVG <animate> for flowing dot particles + glow filter
 * ═══════════════════════════════════════════════════════════════════════════ */
function BeamsOverlay({ containerRef, connections }) {
  const [paths, setPaths] = useState([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const recalc = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cRect = c.getBoundingClientRect();
    setDims({ w: cRect.width, h: cRect.height });

    const computed = connections
      .map((conn) => {
        const from = conn.from.current;
        const to = conn.to.current;
        if (!from || !to) return null;
        const d = computePath(cRect, from, to);
        if (!d) return null;
        return { ...conn, d };
      })
      .filter(Boolean);
    setPaths(computed);
  }, [containerRef, connections]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(recalc);
    ro.observe(c);
    recalc();
    // Recalculate after layout settles
    const t1 = setTimeout(recalc, 300);
    const t2 = setTimeout(recalc, 800);
    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [containerRef, recalc]);

  if (dims.w === 0 || paths.length === 0) return null;

  return (
    <motion.svg
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 5 }}
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="beam-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Arrowhead markers per color */}
        {Object.entries(COLORS).map(([key, color]) => (
          <marker
            key={key}
            id={`arrow-${key}`}
            markerWidth="6"
            markerHeight="5"
            refX="5"
            refY="2.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0.5 L0,4.5 L5.5,2.5 Z" fill={color} fillOpacity="0.7" />
          </marker>
        ))}
      </defs>

      {paths.map((p, i) => (
        <g key={i}>
          {/* Static track */}
          <path
            d={p.d}
            stroke={p.color}
            strokeWidth={1.5}
            strokeOpacity={0.08}
            strokeLinecap="round"
            fill="none"
          />
          {/* Colored base line with arrow */}
          <path
            d={p.d}
            stroke={p.color}
            strokeWidth={1.5}
            strokeOpacity={0.25}
            strokeLinecap="round"
            fill="none"
            markerEnd={`url(#arrow-${p.markerKey})`}
          />
          {/* Flowing dot particles with glow */}
          <path
            d={p.d}
            stroke={p.color}
            strokeWidth={2.5}
            strokeOpacity={0.8}
            strokeDasharray="3 18"
            strokeLinecap="round"
            fill="none"
            filter="url(#beam-glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-21"
              dur={`${p.duration || 2}s`}
              begin={`${p.delay || 0}s`}
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * ArchNode — Glass-morphism card with colored accent + glow
 * ═══════════════════════════════════════════════════════════════════════════ */
const ArchNode = forwardRef(({ icon: Icon, label, sublabel, color, highlight }, ref) => (
  <motion.div
    ref={ref}
    className="relative flex items-center gap-3 rounded-xl cursor-default select-none overflow-hidden"
    style={{
      padding: '12px 16px',
      background: `linear-gradient(135deg, ${color}08 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${color}20`,
      boxShadow: `0 0 24px -8px ${color}25, inset 0 1px 0 ${color}10`,
      backdropFilter: 'blur(8px)',
    }}
    whileHover={{
      scale: 1.05,
      y: -2,
      boxShadow: `0 0 36px -4px ${color}40, 0 0 0 1px ${color}30, inset 0 1px 0 ${color}15`,
    }}
    transition={{ duration: 0.2, ease: EASE }}
  >
    {/* Left color accent bar */}
    <div
      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
      style={{ background: `linear-gradient(180deg, ${color}, ${color}40)` }}
    />
    <div
      className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        color,
        boxShadow: `0 0 12px -4px ${color}30`,
      }}
    >
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <div className={`text-[13px] font-semibold truncate ${highlight ? 'text-white' : 'text-white/85'}`}>
        {label}
      </div>
      {sublabel && <div className="text-[11px] text-white/40 truncate">{sublabel}</div>}
    </div>
  </motion.div>
));

/* ═══════════════════════════════════════════════════════════════════════════
 * ColumnPanel — Grouped column with colored background panel
 * ═══════════════════════════════════════════════════════════════════════════ */
function ColumnPanel({ title, color, children }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: `linear-gradient(180deg, ${color}06 0%, transparent 100%)`,
        border: `1px solid ${color}12`,
      }}
    >
      <div className="text-center mb-4">
        <h3
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: `${color}` }}
        >
          {title}
        </h3>
        <div
          className="h-px w-12 mx-auto mt-2"
          style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
        />
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * EngineCard — Prominent central card with animated gradient border + pulse
 * ═══════════════════════════════════════════════════════════════════════════ */
const ENGINE_STEPS = [
  { icon: Download, label: 'Data Ingestion', desc: 'Multi-source collector' },
  { icon: Database, label: 'RAG Knowledge Base', desc: 'Contextual retrieval' },
  { icon: Cpu, label: 'Multi-Model Reasoning', desc: 'LLM orchestration' },
  { icon: Target, label: 'Confidence Scoring', desc: 'Evidence-based ranking' },
];

const EngineCard = forwardRef(function EngineCard({ leftRef, rightRef }, ref) {
  return (
    <div className="relative h-full">
      {/* Animated gradient border wrapper */}
      <div
        className="absolute -inset-px rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${COLORS.engine}50, ${COLORS.source}30, ${COLORS.engine}50)`,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease infinite',
        }}
      />
      {/* Pulsing ambient glow */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.engine}12, transparent 70%)`,
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />
      <motion.div
        ref={ref}
        className="relative rounded-2xl p-5 h-full"
        style={{
          background: `linear-gradient(145deg, #1a1730 0%, #131316 50%, #0f1623 100%)`,
        }}
      >
        {/* Beam anchor points */}
        <div ref={leftRef} className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-px" />
        <div ref={rightRef} className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-px" />

        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.engine}30, ${COLORS.engine}10)`,
              boxShadow: `0 0 16px -4px ${COLORS.engine}40`,
            }}
          >
            <Brain size={16} style={{ color: COLORS.engine }} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">OrkaAI Engine</h4>
            <p className="text-[10px] text-white/30">Multi-model reasoning pipeline</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {ENGINE_STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{
                background: `${COLORS.engine}08`,
                border: `1px solid ${COLORS.engine}12`,
              }}
            >
              <div
                className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
                style={{ background: `${COLORS.engine}15`, color: COLORS.engine }}
              >
                <step.icon size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[12px] text-white/75 font-medium block truncate">{step.label}</span>
                <span className="text-[10px] text-white/30 block truncate">{step.desc}</span>
              </div>
              {i < ENGINE_STEPS.length - 1 && (
                <ChevronRight size={12} className="text-white/20 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
 * Node data
 * ═══════════════════════════════════════════════════════════════════════════ */
const SOURCES = [
  { icon: Box, label: 'Kubernetes', sublabel: 'Cluster state' },
  { icon: ScrollText, label: 'Logs & Events', sublabel: 'Log streams' },
  { icon: Activity, label: 'Metrics & Traces', sublabel: 'Telemetry data' },
  { icon: Rocket, label: 'Deployments', sublabel: 'GitOps events' },
];

const PRODUCTS = [
  { icon: Shield, label: 'KubeGraf', sublabel: 'AI SRE Platform', highlight: true },
  { icon: DollarSign, label: 'CostAI', sublabel: 'Cloud FinOps' },
  { icon: Lock, label: 'SecuBot', sublabel: 'Security Scanner' },
  { icon: Layers, label: 'InfraPilot', sublabel: 'IaC Management' },
  { icon: GitMerge, label: 'GitOps AI', sublabel: 'CI/CD Intelligence' },
];

const REMEDIATION = [
  { icon: Search, label: 'Root Cause', sublabel: 'AI diagnosis' },
  { icon: Wrench, label: 'SafeFix', sublabel: 'Patch generation' },
  { icon: Play, label: 'Dry-Run', sublabel: 'Safe validation' },
  { icon: CheckCircle, label: 'Apply', sublabel: 'Human-approved' },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * CSS keyframes (injected once)
 * ═══════════════════════════════════════════════════════════════════════════ */
const KEYFRAMES = `
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}
`;

/* ═══════════════════════════════════════════════════════════════════════════
 * Main Section
 * ═══════════════════════════════════════════════════════════════════════════ */
export default function ArchitectureSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [beamsReady, setBeamsReady] = useState(false);

  // Source refs
  const srcRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  // Engine anchors
  const engineLeftRef = useRef(null);
  const engineRightRef = useRef(null);
  // Product refs
  const prodRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  // Remediation refs
  const remRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Delay beams until entrance animations settle
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setBeamsReady(true), 1400);
      return () => clearTimeout(t);
    }
  }, [inView]);

  // Build connection descriptors
  const connections = beamsReady
    ? [
        // Sources → Engine
        ...srcRefs.map((ref, i) => ({
          from: ref, to: engineLeftRef,
          color: COLORS.source, markerKey: 'source',
          delay: i * 0.3, duration: 2.2 + i * 0.2,
        })),
        // Engine → Products
        ...prodRefs.map((ref, i) => ({
          from: engineRightRef, to: ref,
          color: COLORS.product, markerKey: 'product',
          delay: 1.0 + i * 0.2, duration: 2.0 + i * 0.15,
        })),
        // KubeGraf → RCA
        {
          from: prodRefs[0], to: remRefs[0],
          color: COLORS.remediation, markerKey: 'remediation',
          delay: 1.5, duration: 1.8,
        },
        // RCA → SafeFix → DryRun → Apply
        ...remRefs.slice(0, -1).map((ref, i) => ({
          from: ref, to: remRefs[i + 1],
          color: COLORS.remediation, markerKey: 'remediation',
          delay: 2.0 + i * 0.3, duration: 1.5,
        })),
      ]
    : [];

  const nodeVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, delay: i * 0.07, ease: EASE },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#131316' }}
    >
      <style>{KEYFRAMES}</style>

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,71,255,0.08) 0%, rgba(14,165,233,0.03) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5"
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            Architecture
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-black tracking-[-0.03em] text-white mb-5 max-w-4xl mx-auto">
            How{' '}
            <span className="text-gradient-brand">Orkastor</span>{' '}
            Works
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From AI reasoning to auto-remediation — see the full data flow across the Orkastor platform.
          </p>
        </motion.div>

        {/* ════ Desktop diagram ════ */}
        <div
          ref={containerRef}
          className="relative hidden lg:block rounded-2xl p-6 xl:p-8"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(108,71,255,0.01) 100%)',
            backgroundImage: `
              linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(108,71,255,0.01) 100%),
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 20px 20px',
            boxShadow: '0 0 80px -20px rgba(108,71,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Grid layout — nodes on a lower z-index */}
          <div className="relative" style={{ zIndex: 1 }}>
            <div className="grid grid-cols-[1fr_1.4fr_1fr_1fr] gap-5 xl:gap-6 items-stretch">
              {/* Col 1: Data Sources */}
              <ColumnPanel title="Data Sources" color={COLORS.source}>
                <div className="space-y-2.5">
                  {SOURCES.map((n, i) => (
                    <motion.div key={i} custom={i} variants={nodeVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                      <ArchNode ref={srcRefs[i]} icon={n.icon} label={n.label} sublabel={n.sublabel} color={COLORS.source} />
                    </motion.div>
                  ))}
                </div>
              </ColumnPanel>

              {/* Col 2: OrkaAI Engine */}
              <ColumnPanel title="AI Engine" color={COLORS.engine}>
                <motion.div custom={2} variants={nodeVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                  <EngineCard leftRef={engineLeftRef} rightRef={engineRightRef} />
                </motion.div>
              </ColumnPanel>

              {/* Col 3: Products */}
              <ColumnPanel title="Products" color={COLORS.product}>
                <div className="space-y-2.5">
                  {PRODUCTS.map((n, i) => (
                    <motion.div key={i} custom={i + 5} variants={nodeVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                      <ArchNode ref={prodRefs[i]} icon={n.icon} label={n.label} sublabel={n.sublabel} color={COLORS.product} highlight={n.highlight} />
                    </motion.div>
                  ))}
                </div>
              </ColumnPanel>

              {/* Col 4: Remediation */}
              <ColumnPanel title="Remediation" color={COLORS.remediation}>
                <div className="space-y-2.5">
                  {REMEDIATION.map((n, i) => (
                    <motion.div key={i} custom={i + 10} variants={nodeVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                      <ArchNode ref={remRefs[i]} icon={n.icon} label={n.label} sublabel={n.sublabel} color={COLORS.remediation} />
                    </motion.div>
                  ))}
                </div>
              </ColumnPanel>
            </div>
          </div>

          {/* SVG beams overlay — above the grid */}
          {beamsReady && (
            <BeamsOverlay containerRef={containerRef} connections={connections} />
          )}
        </div>

        {/* ════ Mobile diagram ════ */}
        <div className="lg:hidden space-y-5">
          {[
            { title: 'Data Sources', color: COLORS.source, nodes: SOURCES },
            { title: 'OrkaAI Engine', color: COLORS.engine, nodes: null },
            { title: 'Products', color: COLORS.product, nodes: PRODUCTS },
            { title: 'Remediation', color: COLORS.remediation, nodes: REMEDIATION },
          ].map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && (
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4" style={{ background: `linear-gradient(180deg, ${COLORS.engine}40, ${COLORS.engine}10)` }} />
                    <ArrowDown size={16} style={{ color: COLORS.engine }} />
                  </div>
                </div>
              )}
              <ColumnPanel title={group.title} color={group.color}>
                {group.nodes ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {group.nodes.map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: gi * 0.12 + i * 0.05, ease: EASE }}
                      >
                        <ArchNode icon={n.icon} label={n.label} sublabel={n.sublabel} color={group.color} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
                  >
                    <EngineCard leftRef={{ current: null }} rightRef={{ current: null }} />
                  </motion.div>
                )}
              </ColumnPanel>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
