import React from 'react';
import { ArrowRight } from 'lucide-react';
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
 * ── ON THE HEADLINE, AND THE FALSE COMMON THREAD IT USED TO CARRY ───────────
 *
 * This said "Two products for the same problem" and closed on "Same problem from
 * two ends." Wrong on the facts, and it is the specific failure April Dunford
 * names for multi-product positioning: an umbrella that does not reflect the real
 * market position "wastes credibility and confuses visitors". Her advice for
 * products solving different problems is to position them separately and let the
 * reader self-select.
 *
 * The products solve DIFFERENT problems, and their own docs say so:
 *
 *   KubeGraf (kubegraf-api/docs/how-it-works.md §1) — "an AI-SRE platform for
 *   Kubernetes — it detects incidents, finds root cause, and ships the fix." The
 *   problem is the toil of keeping clusters you ALREADY RUN healthy. That doc
 *   also says, in as many words, "not a monitoring/observability tool".
 *
 *   Orkastor Cloud (docs/orkastor-cloud-product.md §2) — "the gap is not 'we
 *   cannot run containers.' It is the distance between wanting an environment and
 *   having one." The problem is not having a cluster, and not wanting to build
 *   one.
 *
 * Two problems, for two states a team can be in. So the headline names the
 * AUDIENCE split instead of a shared problem — the thread that is actually true,
 * and it doubles as the self-select.
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
        {/*
          NO EYEBROW HERE, and it is a deliberate removal rather than an omission.
          This carried `<OrkastorMark className="h-9 w-9" />` next to a `<span>`
          reading "Orkastor" — and OrkastorMark renders its OWN wordmark by
          default, so the word was drawn twice, overlapping, then squashed into a
          36px box by the h-9/w-9 utilities (which size the mark's flex wrapper,
          not the svg inside it).
          It is not re-added with showWordmark={false} because the nav sits 60px
          above with the same word in it. Two ORKASTORs stacked is redundant even
          when they are not overlapping.
        */}
        <Reveal delay={0.05}>
          {/*
            `color` IS REQUIRED HERE. index.css has
            `.lp h1, .lp h2, .lp h3, .lp h4 { color: var(--lp-ink) }` — a class
            selector, so it beats the colour this section inherits down from its
            own inline style. Without it the first line rendered #16181D on navy:
            legible as a dark smudge and nothing else, while the gradient span
            beside it looked fine. That shipped, and it is why the headline read
            as only its teal half.
          */}
          <h1
            className="max-w-3xl text-[38px] sm:text-[54px] lg:text-[62px] font-semibold leading-[1.04]"
            style={{ letterSpacing: '-0.03em', color: 'var(--ork-on-navy)' }}
          >
            For teams who run Kubernetes.{' '}
            {/*
              `color` is the TEAL, not transparent, and the clip paints over it.
              A gradient-clipped span whose fallback colour is transparent is one
              unsupported property away from invisible text — so the fallback is
              the colour it would have been anyway.
            */}
            <span
              style={{
                background: 'linear-gradient(96deg, var(--ork-teal), #9BE7E7)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'var(--ork-teal)',
              }}
            >
              And teams who would rather not.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="mt-6 max-w-2xl text-[16.5px] sm:text-[18px] leading-[1.62]"
            style={{ color: 'var(--ork-on-navy-2)' }}
          >
            <strong style={{ fontWeight: 600, color: 'var(--ork-on-navy)' }}>KubeGraf</strong>{' '}
            is an AI SRE for the clusters you already have: it detects incidents,
            finds the root cause and ships the fix.{' '}
            <strong style={{ fontWeight: 600, color: 'var(--ork-on-navy)' }}>Orkastor Cloud</strong>{' '}
            is a managed environment for the ones you would rather not build &mdash;
            point it at a container image and get a real URL in minutes. Two
            products, two different jobs.
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
