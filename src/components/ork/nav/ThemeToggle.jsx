import React, { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const OPTIONS = [
  { value: 'light',  Icon: Sun,     label: 'Light theme' },
  { value: 'dark',   Icon: Moon,    label: 'Dark theme' },
  { value: 'system', Icon: Monitor, label: 'Match system' },
];

/**
 * Three-state theme control: light · dark · system.
 *
 * ── WHY A SEGMENTED CONTROL AND NOT A SUN/MOON SWITCH ───────────────────────
 *
 * A two-state switch cannot express "follow my OS", so choosing dark at night
 * silently opts you out of ever following the system again. The brief asks for
 * system as a real option, which means three visible states, not two plus a
 * hidden default.
 *
 * ── THE HYDRATION GUARD IS NOT OPTIONAL ─────────────────────────────────────
 *
 * `resolvedTheme` is undefined until next-themes has read storage and the media
 * query. Rendering the active state before then marks the wrong segment for one
 * frame — and because the segment is the only affordance, that reads as the
 * control being broken. So until mounted this renders the same markup with no
 * active segment: same size, same position, no layout shift, nothing wrong
 * highlighted.
 */
export function ThemeToggle({ onDeep = false }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const line = onDeep ? 'rgba(255,255,255,0.16)' : 'var(--border)';
  const idle = onDeep ? 'rgba(245,248,250,0.55)' : 'var(--text-2)';

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="inline-flex items-center"
      style={{ border: `1px solid ${line}`, borderRadius: 999, padding: 2, gap: 2 }}
    >
      {OPTIONS.map(({ value, Icon, label }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className="inline-flex items-center justify-center"
            style={{
              width: 28, height: 26, borderRadius: 999,
              background: active ? (onDeep ? 'rgba(255,255,255,0.14)' : 'var(--surface)') : 'transparent',
              color: active ? (onDeep ? '#F5F8FA' : 'var(--text)') : idle,
              border: active && !onDeep ? '1px solid var(--border)' : '1px solid transparent',
              transition: 'background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
            }}
          >
            <Icon size={13} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
