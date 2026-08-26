import React from 'react';
import { Reveal } from './shared';

/**
 * What the two products share, and what they deliberately do not.
 *
 * ── WHY A PARENT PAGE OWES THIS SECTION ─────────────────────────────────────
 *
 * Once a visitor accepts there are two products, the next question is always the
 * same: are these actually one thing sold twice, or two unrelated things behind a
 * shared logo? Leaving it unanswered is what makes a multi-product company look
 * unfocused. So it is answered on the page rather than left to be inferred.
 *
 * ── EVERY ROW HERE IS TRUE TODAY ────────────────────────────────────────────
 *
 * The temptation on a section like this is to describe the integrated platform
 * you intend to have. The shared identity is real and shipped. The separation is
 * real: separate clusters, separate databases, separate APIs. So both columns
 * describe what exists.
 *
 * What is NOT claimed: that KubeGraf watches your Orkastor Cloud environments.
 * It is the obvious product idea and the obvious thing to put on this page, and
 * it does not exist. A visitor who signs up expecting it would find out on day
 * one, and the whole section would have been a lie for one plausible sentence.
 */

const SHARED = [
  ['One account', 'Sign in once. The same login works across both products — not two sign-ups, not two passwords.'],
  ['One company behind them', 'Same team, same security posture, same people answering support.'],
  ['One idea', 'Kubernetes should not need a full-time babysitter. Both products attack that, from opposite ends.'],
];

const SEPARATE = [
  ['Separate clusters', "KubeGraf's agent runs in yours. Cloud runs in ours, and never the reverse."],
  ['Separate data', 'Each product has its own database. Your cluster telemetry is not mixed with anything you host.'],
  ['Bought separately', 'Neither requires the other. Use one, the other, or both — nothing is bundled to force a pair.'],
];

function Column({ title, note, items, accent }) {
  return (
    <div
      className="rounded-2xl p-7 sm:p-8 h-full"
      style={{ background: 'var(--lp-surface)', border: '1px solid var(--lp-line)' }}
    >
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: accent }} />
        <h3 className="text-[17px] font-semibold" style={{ letterSpacing: '-0.015em', color: 'var(--lp-ink)' }}>
          {title}
        </h3>
      </div>
      <p className="text-[13.5px] leading-[1.55] mb-6 pl-[19px]" style={{ color: 'var(--lp-ink-3)' }}>
        {note}
      </p>
      <dl className="space-y-5 pl-[19px]">
        {items.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[14.5px] font-semibold mb-1" style={{ color: 'var(--lp-ink)' }}>{k}</dt>
            <dd className="text-[14px] leading-[1.6]" style={{ color: 'var(--lp-ink-2)' }}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function HowTheyRelate() {
  return (
    <section id="relate" className="relative py-20 sm:py-28 scroll-mt-20" style={{ background: 'var(--lp-bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p
            className="text-[12px] font-semibold uppercase mb-3"
            style={{ letterSpacing: '0.14em', color: 'var(--lp-ink-3)' }}
          >
            How they relate
          </p>
          <h2
            className="text-[28px] sm:text-[36px] font-semibold leading-[1.12] max-w-2xl"
            style={{ letterSpacing: '-0.022em', color: 'var(--lp-ink)' }}
          >
            Two products, one account, and a deliberate wall between them.
          </h2>
        </Reveal>

        <div className="mt-11 grid md:grid-cols-2 gap-5">
          <Reveal><Column title="What they share" note="Real today, not planned." items={SHARED} accent="var(--ork-teal)" /></Reveal>
          <Reveal delay={0.06}><Column title="What stays separate" note="By design, and enforced in the architecture." items={SEPARATE} accent="var(--ork-navy-2)" /></Reveal>
        </div>

        {/*
          Stated out loud because it is the question this section otherwise
          invites, and because the honest answer is "no". Saying it here costs one
          line; letting a visitor assume it costs their trust at first use.
        */}
        <Reveal delay={0.12}>
          <p
            className="mt-8 text-[13.5px] leading-[1.6] max-w-3xl"
            style={{ color: 'var(--lp-ink-3)' }}
          >
            To be clear about one thing people ask: KubeGraf does not monitor your
            Orkastor Cloud environments today. They are separate products with
            separate clusters, and we would rather say so than let it be assumed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
