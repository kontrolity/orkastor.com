import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { DiscordIcon, DISCORD_URL, KUBEGRAF_URL, Reveal } from './shared';

export default function CTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div
            className="lp-inverted relative overflow-hidden rounded-3xl px-6 py-16 sm:px-16 sm:py-20 text-center"
            style={{
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 24px 64px rgba(232,93,4,0.30)',
            }}
          >
            {/* depth: light bloom above, deep ember below */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 60% at 50% -15%, rgba(255,255,255,0.22), transparent 60%),' +
                  'radial-gradient(ellipse 70% 65% at 50% 120%, rgba(140,48,0,0.45), transparent 65%)',
              }}
            />
            <div
              className="absolute inset-0 lp-dot-grid pointer-events-none opacity-[0.12]"
              style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)' }}
            />

            <div className="relative">
              <div className="lp-eyebrow mb-4 justify-center" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Get started today
              </div>
              <h2 className="lp-display text-[clamp(30px,4.6vw,54px)] max-w-2xl mx-auto" style={{ color: '#fff' }}>
                Let the next incident{' '}
                <span className="lp-serif" style={{ color: 'var(--lp-ink)' }}>fix itself.</span>
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,248,240,0.88)' }}>
                Install KubeGraf in your cluster in minutes. Free to start —
                and your data never leaves your network.
              </p>

              {/* Three steps to green — sets expectations before the click */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-2.5 max-w-2xl mx-auto">
                {[
                  ['1', 'Create your account'],
                  ['2', 'Connect a cluster'],
                  ['3', 'Watch incidents resolve'],
                ].map(([n, label], i, arr) => (
                  <React.Fragment key={n}>
                    <div
                      className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }}
                    >
                      <span
                        className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[11px] font-bold shrink-0 lp-mono"
                        style={{ background: '#fff', color: 'var(--lp-orange-deep)' }}
                      >
                        {n}
                      </span>
                      <span className="text-[13px] font-semibold text-left leading-tight" style={{ color: '#fff' }}>{label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <span aria-hidden="true" className="hidden sm:flex items-center text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href={KUBEGRAF_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-paper group">
                  Try KubeGraf free
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn-ghost"
                  style={{ borderColor: 'rgba(255,255,255,0.45)', color: '#fff', background: 'transparent' }}
                >
                  <DiscordIcon className="w-4 h-4" />
                  Talk to the team
                </a>
              </div>

              {/* Friction reducers — answer the last objections at the button */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px]" style={{ color: 'rgba(255,248,240,0.85)' }}>
                {['No credit card required', 'Free tier included', 'Your data stays in your network'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#fff' }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
