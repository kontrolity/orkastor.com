import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
