import React from 'react';
import { ArrowRight } from 'lucide-react';
import OrkastorMark from '@/components/landing/OrkastorMark';
import { Reveal } from './shared';

/**
 * The parent hero. Orkastor the company, not either product.
 *
 * ── WHY THIS REPLACED THE KUBEGRAF HERO ─────────────────────────────────────
 *
 * The home page opened with "Kubernetes that heals itself" and a SafeFix
 * terminal — a KubeGraf pitch. Orkastor Cloud appeared 3,000px down as a
 * three-fact callout. So the page read as one product with a side project, and a
 * visitor sent to orkastor.com to find out what the company does met an argument
 * for one of the two things it sells.
 *
 * The KubeGraf argument is not deleted, it MOVED — /kubegraf, intact. A visitor
 * who wants it is one click away, and it is no longer in the way of the visitor
 * who wanted the company.
 *
 * ── ON THE HEADLINE ─────────────────────────────────────────────────────────
 *
 * "Two products" is stated in the first line rather than implied by a layout the
 * reader has to scroll to understand. The split below is then a confirmation
 * instead of a surprise.
 *
 * No metric, no logo wall, no "trusted by". There is nothing here we can say
 * that is both impressive and true — Cloud has not shipped — and an unbacked
 * number at the top of a company page is the fastest way to make everything
 * under it read as marketing.
 */
export default function UmbrellaHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(72,203,203,0.16), transparent 62%),' +
          'linear-gradient(168deg, var(--ork-navy) 0%, var(--ork-navy-deep) 100%)',
        color: 'var(--ork-on-navy)',
      }}
    >
      {/* Hairline grid. Low-contrast on purpose: it should register as texture,
          not as a chart the reader tries to read. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(var(--ork-line-navy) 1px, transparent 1px),' +
            'linear-gradient(90deg, var(--ork-line-navy) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 78%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
        <Reveal>
          <div className="flex items-center gap-3 mb-7">
            <OrkastorMark className="h-9 w-9" />
            <span
              className="text-[12px] font-semibold uppercase"
              style={{ letterSpacing: '0.16em', color: 'var(--ork-teal)' }}
            >
              Orkastor
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1
            className="max-w-3xl text-[38px] sm:text-[54px] lg:text-[62px] font-semibold leading-[1.04]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Two products for the same problem:{' '}
            <span
              style={{
                background: 'linear-gradient(96deg, var(--ork-teal), #9BE7E7)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Kubernetes you don&rsquo;t want to babysit.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="mt-6 max-w-2xl text-[16.5px] sm:text-[18px] leading-[1.62]"
            style={{ color: 'var(--ork-on-navy-2)' }}
          >
            KubeGraf watches the clusters you already run and fixes what breaks.
            Orkastor Cloud runs the throwaway ones for you, so there is nothing to
            build in the first place. Same problem from two ends.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 h-[46px] px-6 rounded-full text-[14.5px] font-semibold transition-transform hover:-translate-y-[1px]"
              style={{ background: 'var(--ork-teal)', color: 'var(--ork-navy)' }}
            >
              See both products <ArrowRight size={16} />
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 h-[46px] px-6 rounded-full text-[14.5px] font-semibold border transition-colors"
              style={{ borderColor: 'var(--ork-line-navy)', color: 'var(--ork-on-navy)' }}
            >
              Why we build both
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
