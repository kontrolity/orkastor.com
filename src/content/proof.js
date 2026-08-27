/**
 * SOCIAL PROOF — every item here is published on kubegraf.io and attributed.
 *
 * ── WHERE THIS CAME FROM, AND WHY THAT MATTERS ──────────────────────────────
 *
 * Read off kubegraf.io on 2026-08-27. Nothing here is invented, and nothing was
 * upgraded on the way across: the names, roles and companies are the ones the
 * product's own site publishes, and the quotes are verbatim.
 *
 * ── THE ONE THING TO BE CAREFUL ABOUT ───────────────────────────────────────
 *
 * These are KUBEGRAF's customers. Orkastor Cloud is invitation-only and has
 * none. So the section that renders this says "teams running KubeGraf" rather
 * than "our customers" — letting logos earned by one product imply traction for
 * the other is the exact overclaim this site has been cleaning up.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ───────────────────────────────────────────
 *
 * kubegraf.io also carries an ROI model: "$304K total cost · single P0 incident"
 * against a with-KubeGraf figure. That is a CALCULATOR — its own page frames it
 * as "here is what that speed is worth", not as a measured customer outcome.
 * Reprinting "$304K saved" as a flat claim would turn a model into a result, so
 * the model is linked rather than quoted. Same reasoning as the four unsourced
 * figures removed from the old /about.
 */

export const PROOF_SOURCE = 'https://kubegraf.io';

/** The logo marquee, verbatim from kubegraf.io's "teams trust KubēGraf" band. */
export const CUSTOMERS = ['Finden', 'Grovyn', 'Neufology', 'The Cloud Market', 'DeadlineMate'];

/** Programmes and partners kubegraf.io displays. */
export const PARTNERS = ['Spendbase', 'Inception Program'];

export const TESTIMONIALS = [
  {
    name: 'Randeep Wilkhu',
    role: 'Founder & CEO',
    company: 'Finden',
    quote:
      'Every hour an engineer spends chasing an incident is an hour not spent on the product, and ' +
      'that trade-off was getting harder to justify. Now the investigation is largely done by the ' +
      'time someone opens it, and the fix arrives with the reasoning attached, so approving it takes ' +
      'a minute rather than an afternoon. It paid for itself inside the first quarter, but the change ' +
      'I would point to is that my team is building again instead of firefighting.',
    pull: 'My team is building again instead of firefighting.',
  },
  {
    name: 'Narasimha Uppala',
    role: 'Founder & CTO',
    company: 'Neufology',
    quote:
      'When something breaks across services, the first ten minutes are the expensive ones — you are ' +
      'guessing which one failed while it spreads. We can see how our services actually connect now, ' +
      'and KubeGraf is usually pointing at the right one before we are. Hours of investigation are ' +
      'now minutes.',
    pull: 'Hours of investigation are now minutes.',
  },
  {
    name: 'Aman K.A',
    role: 'Founder & CEO',
    company: 'Grovyn',
    quote:
      'Standing up a new cluster used to be days of wrestling Helm charts, and the result was only ' +
      'ever as consistent as whoever happened to build it that week. We pull Argo CD, Flux and our ' +
      'ingress straight in now, so a cluster takes an afternoon and comes out the same every time. ' +
      'It adapted to how we already work rather than asking us to change, which is not what I ' +
      'expected going in.',
    pull: 'A cluster takes an afternoon, and comes out the same every time.',
  },
];

/**
 * OUTCOMES — what a customer gets, in their words rather than the
 * architecture's.
 *
 * This is the replacement for the deep technical sections on the home page. The
 * speed figures are the ones kubegraf.io states about its own product; the rest
 * is benefit framing with no number attached, because inventing one is how the
 * old /about ended up with four unsourced metrics.
 */
export const OUTCOMES = [
  {
    k: 'The investigation is already done',
    v: 'The incident arrives with a root cause and a proposed fix attached, so the first thing you do is approve something — not start looking.',
  },
  {
    k: 'Fixes land, and get checked',
    v: 'A change is proposed, dry-run validated, and verified against the live cluster afterwards. A fix that did not land is not counted as one.',
  },
  {
    k: 'Nothing runs without your say-so',
    v: 'Every change waits for approval. Autonomy is a dial you set, not a default you discover.',
  },
  {
    k: 'An environment in minutes, not a quarter',
    v: 'Point Orkastor Cloud at a container image and get a real HTTPS URL. No cluster to build, no ticket to raise, and an expiry date so nothing becomes a permanent bill.',
  },
];
