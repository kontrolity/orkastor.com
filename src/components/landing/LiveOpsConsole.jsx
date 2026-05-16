import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, AlertTriangle, Search, Shield, CheckCircle2, Activity } from 'lucide-react';

/**
 * LiveOpsConsole — animated AI orchestration terminal.
 *
 * Cycles through a scripted sequence of OrkaAI events (Scanning → Anomaly
 * Detected → Root-Cause Analysis → SafeFix Proposal → Applied & Verified)
 * with a typewriter effect. The active line types out one character at a
 * time; once complete it scrolls up and the next line begins.
 *
 * Pure React + Framer Motion — no canvas, no Three.js. ~3 KB of code,
 * runs at idle priority (typewriter ticks at ~30 fps via setTimeout).
 */
const EVENTS = [
  {
    icon: Activity,
    prefix: '[scan]',
    text:   'Scanning 12 clusters · 1,247 pods · 47 namespaces',
    color:  '#7DD3FC',         // cool blue
    bg:     'rgba(125,211,252,0.08)',
    dur:    1800,
  },
  {
    icon: AlertTriangle,
    prefix: '[alert]',
    text:   'Anomaly: api-server-7d4f CrashLoopBackOff · prod',
    color:  '#FF8A3D',         // amber
    bg:     'rgba(255,138,61,0.10)',
    dur:    2100,
  },
  {
    icon: Search,
    prefix: '[rca]',
    text:   'Root cause: OOMKilled · memory 512Mi · confidence 94%',
    color:  '#E14EFF',         // magenta
    bg:     'rgba(225,78,255,0.10)',
    dur:    2400,
  },
  {
    icon: Shield,
    prefix: '[safefix]',
    text:   'Patch: memory 512Mi → 1Gi · dry-run PASSED · awaiting approval',
    color:  '#7B4DFF',         // violet
    bg:     'rgba(123,77,255,0.10)',
    dur:    2800,
  },
  {
    icon: CheckCircle2,
    prefix: '[done]',
    text:   'Approved · applied · verified healthy · resolved in 18s',
    color:  '#2DD4BF',         // teal
    bg:     'rgba(45,212,191,0.10)',
    dur:    2400,
  },
];

const TYPE_SPEED  = 22;   // ms per character
const PAUSE_AFTER = 800;  // ms hold after a line finishes typing

function useTypewriter(text, speed = TYPE_SPEED) {
  const [typed, setTyped] = useState('');
  const [done,  setDone]  = useState(false);
  useEffect(() => {
    setTyped('');
    setDone(false);
    let i = 0;
    let timeoutId;
    const tick = () => {
      i++;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        timeoutId = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };
    timeoutId = setTimeout(tick, speed);
    return () => clearTimeout(timeoutId);
  }, [text, speed]);
  return { typed, done };
}

function LogLine({ event, isActive }) {
  const Icon = event.icon;
  const { typed, done } = useTypewriter(isActive ? event.text : event.text, isActive ? TYPE_SPEED : 0);
  const display = isActive ? typed : event.text;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: isActive ? 1 : 0.45, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-2 font-mono text-[11px] leading-snug"
    >
      <Icon
        className="w-3 h-3 shrink-0 mt-[3px]"
        style={{ color: event.color }}
      />
      <span
        className="shrink-0 font-semibold tracking-wide"
        style={{ color: event.color }}
      >
        {event.prefix}
      </span>
      <span className="text-white/85 truncate">
        {display}
        {isActive && !done && (
          <span
            className="inline-block w-1.5 h-3 ml-0.5 align-middle animate-cursor-blink"
            style={{ background: event.color, verticalAlign: '-2px' }}
          />
        )}
      </span>
    </motion.div>
  );
}

export default function LiveOpsConsole({ className = '' }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Schedule the next line after current line's typewriter duration
    const current = EVENTS[activeIdx];
    const typingMs = current.text.length * TYPE_SPEED + PAUSE_AFTER;
    timeoutRef.current = setTimeout(() => {
      setActiveIdx(i => (i + 1) % EVENTS.length);
    }, typingMs);
    return () => clearTimeout(timeoutRef.current);
  }, [activeIdx]);

  // Show up to 4 lines: previous 3 (dimmed) + active. Older ones slide out.
  const visibleCount = 4;
  const visibleLines = [];
  for (let i = visibleCount - 1; i >= 0; i--) {
    const idx = (activeIdx - i + EVENTS.length) % EVENTS.length;
    visibleLines.push({ event: EVENTS[idx], key: `${activeIdx}-${idx}`, isActive: i === 0 });
  }

  const active = EVENTS[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl overflow-hidden backdrop-blur-md ${className}`}
      style={{
        background: 'rgba(8,8,12,0.82)',
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.12),' +
          'inset 0 1px 0 rgba(255,255,255,0.10),' +
          '0 22px 60px rgba(0,0,0,0.65),' +
          `0 0 80px ${active.bg.replace('0.10', '0.22').replace('0.08', '0.22')}`,
        transition: 'box-shadow 0.6s ease',
        minWidth: 360,
        width: '100%',
        maxWidth: 540,
      }}
    >
      {/* Top hairline — picks up the current line's color */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${active.color}, transparent)`,
          opacity: 0.7,
          transition: 'background 0.6s ease',
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="relative flex items-center justify-center w-5 h-5 rounded-md"
          style={{ background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' }}
        >
          <Cpu className="w-3 h-3 text-white/70" />
        </div>
        <span className="text-[11px] font-mono font-semibold tracking-wide text-white/80">OrkaAI</span>
        <span className="text-[10px] font-mono text-white/30">·</span>
        <span className="text-[10px] font-mono text-white/50">live-ops</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: active.color, opacity: 0.6 }} />
            <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: active.color }} />
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-white/55">streaming</span>
        </span>
      </div>

      {/* Log lines */}
      <div className="px-4 py-3 space-y-1.5 min-h-[120px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleLines.map(({ event, key, isActive }) => (
            <LogLine key={key} event={event} isActive={isActive} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer — incident counter, faint */}
      <div className="px-4 py-2 border-t flex items-center justify-between text-[10px] font-mono"
        style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
      >
        <span>142 incidents · 18s avg MTTR</span>
        <span>local inference · 0 egress</span>
      </div>
    </motion.div>
  );
}
