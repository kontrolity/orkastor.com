/**
 * ONE SOURCE FOR EVERY CLAIM ON THE SITE.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 *
 * The old site said different things in different places about the same
 * products: /about called Orkastor "a modular AI DevOps platform" whose agents
 * all run inside your cluster (which leaves no room for Domineta at all), /pricing
 * listed plan names and cluster counts that disagreed with kubegraf.io, and the
 * home page claimed both products solved the same problem. Copy living in nine
 * components is how that happens — nobody can see the contradiction because
 * nobody can see the claims together.
 *
 * Every product fact below is traceable to one of:
 *   · kubegraf-api/docs/how-it-works.md              (KubeGraf, what it is)
 *   · kubegraf-api/docs/orkastor-cloud-product.md    (Domineta, what it is and why)
 *   · the live kubegraf.io / domineta.com copy      (positioning, pricing)
 *   · ORKASTOR-PRODUCTS-AND-DOMAINS.md               (the map, and §8's warnings)
 *
 * ── WHAT MUST NOT BE ADDED HERE ─────────────────────────────────────────────
 *
 * No customers. No logos. No testimonials. No certifications. No funding. No
 * uptime or MTTR figures. The previous /about carried "500+ beta users · 18s
 * mean resolution · 80% faster MTTR · 0 bytes leave your network" — all four
 * unsourced, and the last one contradicted by the architecture, which routes AI
 * through KubeGraf's own gateway to Amazon Bedrock. If a number cannot be
 * pointed at a source, it does not go on the site.
 */

export const EXTERNAL = {
  kubegrafSite:  'https://kubegraf.io',
  kubegrafApp:   'https://app.kubegraf.io',
  kubegrafPricing: 'https://kubegraf.io/pricing',
  cloudSite:     'https://domineta.com',
  cloudConsole:  'https://console.domineta.com',
  discord:       'https://discord.gg/GKpbU3pQ',
  email:         'hello@orkastor.com',
};

export const PRODUCTS = [
  {
    key: 'kubegraf',
    name: 'KubeGraf',
    /* Points at the PRODUCT'S OWN SITE, not this site's /kubegraf page. The
       nav names a product, and the thing a visitor wants after clicking a
       product's name is that product — which has its own site, kept current
       by the team that ships it. /kubegraf still exists and still renders;
       the hero's "Explore KubeGraf" CTA is what reaches it. */
    href: EXTERNAL.kubegrafSite,
    external: true,
    status: 'Live',
    dot: 'var(--kg)',
    tagline: 'An AI SRE for the clusters you already run',
  },
];

/* ⚠ DOMINETA IS UNLISTED, NOT DELETED.
   Its entry used to sit above. /cloud and /cloud/how-it-works still exist and
   still render — they are simply not linked from anywhere on this site any
   more, so the pages keep working for anyone holding a direct URL while the
   product is not being marketed here.

   Everything that drove a LINK to it was removed: this list, the footer
   column, the hero copy, the product cards, the home page's two-product
   section and the split CTA. Its content blocks (CLOUD, and the comparison
   copy below) are left in place because /cloud still reads from them. */

/* Pricing was the first entry here. It is gone with the /pricing page —
   KubeGraf publishes its own pricing on kubegraf.io, and a second copy on the
   company site is a number that can drift out of date without anyone
   noticing. Three tabs became two. */
export const LINKS = [
  { label: 'Docs',  href: '/docs' },
  { label: 'About', href: '/about' },
];

/** The hero. "Same problem" was the old claim and it was false — the products
 *  solve different problems, so the thread is the AUDIENCE. */
export const HERO = {
  eyebrow: 'Infrastructure, without the operating tax',
  /* ⚠ THE HEADLINE NOW STATES THE CLAIM INSTEAD OF THE GRIEVANCE.
     It was "For teams who run Kubernetes." / "And would rather not be paged
     for it.", with four alternates that were all "would rather not <verb>".

     Two problems with that. It was four negatives in a row — the reader was
     told what they do not want three times before being told what this is.
     And the headline never said what the product DOES; the whole claim was
     deferred to the standfirst, which is the one line people skip.

     The replacement is a contrast in two beats: what you already get, then
     what is missing. "What broke" versus "why" is the actual gap KubeGraf
     fills, stated in eight words, and it is the same gap KUBEGRAF.problems
     describes at length ("the first fix was a guess, not a diagnosis").

     Line A is a statement about Kubernetes, not a claim about a competitor:
     it reports what the platform surfaces, which is uncontroversial and
     true. */
  /* ⚠ `*…*` MARKS AN UNDERLINED RUN. The reference underlines the two words
     its headline actually turns on ("research", "products"); the device is
     what stops a three-line bold headline reading as a wall.

     Here the sentence turns on what/why, so those are the marked words. The
     markers are stripped before the text reaches a screen reader or a
     reduced-motion render — see plainText() in Hero.jsx. Punctuation stays
     OUTSIDE the marker so the rule does not run under a full stop. */
  /* ⚠ ONE LINE NOW, AND THE ROTATOR IS RETIRED WITH IT. The headline was
     'Kubernetes tells you *what* broke.' over a rotating 'KubeGraf tells you
     *why*.' — a product claim on the COMPANY's page. This is a positioning
     line instead, and it maps onto the company rather than onto one product:
     AI DevOps is KubeGraf, Cloud is Domineta, and Orchestrator is the name.

     ⚠ NO MARKED WORD, DELIBERATELY. 'Orchestrator' carried the underline
     for one revision. The reference this hero follows has no typographic
     device in its headline at all — it is set plain and lets the whitespace
     and the bloom do the work — and a heavy rule under a 60px word is the
     single least minimal thing the hero could contain. The marker syntax
     still works if it is ever wanted back: wrap one word in asterisks.

     DevOps, not Devops. It is the standard styling of the term and the one a
     technical reader expects to see set in 60px type. */
  titleA: 'AI DevOps & Cloud Orchestrator',

  /* ⚠ RETIRED, NOT DELETED, 2026-10-29. titleB and titleBAlts drove the
     rotating second line; the headline is one line now, so Hero.jsx no
     longer renders <Rotator> and nothing reads these. They stay because the
     comment below is the record of WHY each alternate was allowed to make
     the claim it makes — particularly the note that none of them may say the
     fix ships unattended. Re-deriving that from scratch is how a false claim
     gets written. Restoring the rotator is re-adding one component call. */
  titleB: 'KubeGraf tells you *why*.',

  /* The second line rotates through these. titleB stays the canonical one: it
   * is what a screen reader gets, what renders under reduced motion, and what
   * ships if the rotator is ever removed. The rest are variations on the SAME
   * claim, not new ones — every alternate is a phrasing of copy already
   * approved elsewhere on the site:
   *
   *   'just need a URL'      — proof.js: "get a real HTTPS URL. No cluster to
   *                            build, no ticket to raise"
   *   'never asked for one'  — OrkAbout: "building one is a quarter of work
   *                            nobody asked for"
   *
   * ⚠ Keep them the same grammatical shape ("And teams who …") and roughly the
   * same length. They are stacked in one grid cell, so the widest one sets the
   * headline's width — a long outlier makes the whole hero jump wider for
   * everybody. */
  /* The alternates now walk the product's four stages rather than restating
     one complaint four ways. Each is a phrasing of copy already approved
     elsewhere in this file — the rule has not changed, only the copy:

       'tells you why'         — KUBEGRAF.stages Diagnose: "A root cause,
                                 stated — not a correlation and not a
                                 dashboard."
       'finds the root cause'  — KUBEGRAF.oneLine, verbatim
       'ships the fix'         — KUBEGRAF.oneLine, verbatim
       'proves it landed'      — KUBEGRAF.stages Verify: "A fix that did not
                                 land is not a fix."

     ⚠ NOTHING HERE CLAIMS IT FIXES THINGS UNATTENDED, and nothing may. The
     Fix stage is "a concrete change, dry-run validated, FOR YOU TO APPROVE".
     "Ships the fix" is only usable because oneLine already says exactly that
     in the same breath as the approval step; an alternate like "fixes it
     while you sleep" would be a new claim and a false one.

     ⚠ Same grammatical shape ("KubeGraf <verb> …") and length held inside a
     tight range — 23 to 30 characters. They are stacked in one grid cell, so
     the widest sets the headline's width and a long outlier makes the hero
     jump wider for everybody. These are all SHORTER than the lines they
     replace, which suits the heavier sans the h1 now uses. */
  /* One marked word per alternate, always the one that distinguishes it from
     the other three. Keep it to a SINGLE word: each word is its own
     inline-block mask for the reveal, so a run spanning a space would draw as
     two underlines with a gap. */
  titleBAlts: [
    'KubeGraf tells you *why*.',
    'KubeGraf finds the root *cause*.',
    'KubeGraf ships the *fix*.',
    'KubeGraf proves it *landed*.',
  ],
  /* ⚠ THIS USED TO REPEAT THE HEADLINE. It read "…It detects the incident,
     finds the root cause, and ships the fix — then verifies the fix actually
     landed", which is KUBEGRAF.oneLine, which is also where titleBAlts came
     from. Three of the four rotating alternates appeared verbatim in the
     sentence sitting directly beside them: the hero made one claim twice, in
     two faces, side by side.

     The standfirst's job is what the headline CANNOT say. The headline has
     the pipeline — why, root cause, fix, landed. So this has the
     precondition instead: whose clusters, and where the thing runs. That is
     the question "an AI SRE" actually raises, and nothing else on the page
     answers it above the fold.

     Both halves are approved copy:
       'agent already inside them'    — KUBEGRAF.stages Detect: "from the
                                        agent already in the cluster"
       'one evidence set'             — KUBEGRAF.stages Investigate, verbatim

     ⚠ Length is deliberate at ~158 characters, within a few of the 162 it
     replaces. The hero's right column is sized so this sets in THREE lines
     and ends level with the two-line headline — see .ork-hero-lead. A
     materially longer or shorter line breaks that balance. */
  /* ⚠ RETIRED FROM THE HERO, 2026-10-29, and kept for the same reason
     titleBAlts is. The reference has NO paragraph in its hero — headline,
     two buttons, three short lines, and air. This sentence was also the
     thing flagged as mismatched when the headline became a company line:
     it is a KubeGraf sentence sitting under an Orkastor headline.

     Nothing renders it now. It stays because the commentary below is the
     record of which approved copy each half came from, and because the
     product sections lower down are where a sentence like it belongs if it
     is wanted again. */
  sub:
    'KubeGraf is an AI SRE for the clusters you already have. It works from ' +
    'an agent already inside them, pulling metrics, logs and events into one ' +
    'evidence set.',
};

export const KUBEGRAF = {
  name: 'KubeGraf',
  side: 'Your infrastructure',
  status: 'Live',
  // Its own doc: "an AI-SRE platform for Kubernetes — it detects incidents, finds
  // root cause, and ships the fix." And explicitly "not a monitoring/
  // observability tool", so that word never leads.
  headline: 'Detect. Diagnose. Fix.',
  headlineB: 'Kubernetes heals itself.',
  oneLine: 'An AI SRE for Kubernetes. It detects the incident, finds the root cause, and ships the fix — then verifies the fix actually landed.',
  problems: [
    ['Debugging takes too long', 'Hours lost paging the right person, jumping between dashboards and grepping logs to reach one root cause.'],
    ['Logs are confusing', 'Stack traces, container output and Kubernetes events, in three formats and three places, none of which say why.'],
    ['Issues repeat', "Patches don't stick. The same CrashLoop ships twice a quarter because the first fix was a guess, not a diagnosis."],
  ],
  stages: [
    ['Detect',      'An incident is picked up the moment it happens, from the agent already in the cluster.'],
    ['Investigate', 'Metrics, logs and events are pulled together into one evidence set.'],
    ['Diagnose',    'A root cause, stated — not a correlation and not a dashboard.'],
    ['Fix',         'A SafeFix™: a concrete change, dry-run validated, for you to approve.'],
    ['Verify',      'The change is checked against the live cluster. A fix that did not land is not a fix.'],
  ],
  // From how-it-works.md's roster. Only the SRE agent may write or execute.
  agents: [
    { name: 'SRE',                rights: 'R · W · X · RBAC', mode: 'auto',        note: 'authors and applies the change' },
    { name: 'Platform Eng',       rights: 'R · W',            mode: 'observe',     note: 'rolls the canary out' },
    { name: 'Security',           rights: 'R · RBAC',         mode: 'review',      note: 'reviews RBAC — may veto' },
    { name: 'CTO',                rights: 'R',                mode: 'observe',     note: 'checks it against budget' },
    { name: 'Solution Architect', rights: 'R',                mode: 'observe',     note: 'checks blast radius' },
    { name: 'FinOps',             rights: 'R',                mode: 'independent', note: 'finds the waste' },
  ],
  security: [
    ['One thin agent', 'A single `kubegraf-agent` in your cluster. Outbound-only — it opens no inbound ports.'],
    ['No stored cluster credentials', 'Nothing that could reach your cluster is held centrally.'],
    ['Commands are signed', 'The control plane signs what it sends; the agent is the only executor.'],
    // Stated carefully. The AI path leaves the customer's environment by design:
    // agent → KubeGraf's AI gateway → Amazon Bedrock, with the payload redacted.
    // "Zero external AI calls" and "0 bytes leave your network" were on the old
    // site and neither is what the architecture does.
    ['Redacted before it reaches a model', 'AI runs through KubeGraf’s own gateway to Amazon Bedrock, on redacted telemetry — not on raw logs, and never with your keys.'],
  ],
  pricing: {
    plan: 'Pro',
    price: '$399',
    per: '/month',
    was: '$799',
    offer: '50% off your first 3 months',
    trial: '14-day free trial · no credit card',
    includes: ['3 clusters', 'Up to 1,500 pods', 'Up to 10 team members', '200 deep AI investigations / month'],
    note: 'An early-stage tier starts from $99 for the first 3 months via the Startup Program.',
  },
};

export const CLOUD = {
  name: 'Domineta',
  side: 'Our infrastructure',
  status: 'By invitation',
  headline: 'Ephemeral environments',
  headlineB: 'with a real kernel boundary.',
  oneLine: 'A complete dev or test environment inside its own microVM, with its own guest kernel. Your image, unchanged. An HTTPS URL the moment you ask for one — and a TTL that throws the whole thing away.',
  strap: 'One environment · one microVM · one guest kernel',
  lifecycle: ['Image', 'Create', 'Boot', 'Run', 'URL', 'TTL', 'Destroy'],
  // The site's own comparison. Framed as two architectures, not a scorecard.
  compare: [
    ['Isolation',  'Namespace on a shared kernel', 'microVM'],
    ['Kernel',     'Shared with the host',         'Its own guest kernel'],
    ['Unit',       'A container',                  'The whole environment'],
    ['Datastore',  'External, or an add-on',       'A service inside the boundary'],
    ['HTTPS URL',  'Usually configured',           'Minted on request'],
    ['Lifetime',   'Persistent, or varies',        'Ephemeral, on a TTL'],
  ],
  useCases: [
    ['PR environments',      'Give every pull request its own complete environment, with a URL you can paste into the description before CI finishes.'],
    ['Integration testing',  'Frontend, API and a real database together, seeded and torn down per run, instead of one shared staging everybody queues for.'],
    ['Agent-generated code', 'Somewhere a coding agent can actually run what it wrote. The boundary matters more when nobody read the code first.'],
    ['Development sandboxes','A temporary environment for a spike or a demo that leaves nothing behind in shared infrastructure.'],
  ],
  // Presented as decisions. They are the product's shape, not a backlog.
  limits: [
    ['TTL',                 'Environments expire', 'Every one has a time to live, a grace period, and then it is gone. That is the product, not a limitation of it.'],
    ['No backups',          'Nothing is kept',     'Storage goes when the environment goes, database included. Seed with test data.'],
    ['One region',          'eu-north-1',          'No region picker, and your own domains are not supported yet.'],
    ['No GPUs',             'Not in v1',           'Neither is networking between separate environments.'],
    ['Cold start',          'The first one is slow','Hardware scales to zero when nobody is using it, so the first environment after a quiet spell can take five to twenty minutes. The rest are quick.'],
  ],
  isolation: {
    primary: 'Kata Containers, on bare metal we operate — machines kept for customer work alone. Our own services never run on them.',
    // Named on the live site rather than averaged away, and repeated here for
    // the same reason.
    caveat: 'Trial and Dev plans run under gVisor: a userspace kernel on ordinary compute. A real boundary, and a weaker one than a separate guest kernel.',
  },
  access: 'There is no self-serve sign-up. Access is by invitation while it is being built in the open.',
  pricing: 'Not published yet — the measurements a rate depends on are not finished. The Console shows the exact cost of an environment before you create it.',
};

export const COMPANY = {
  // Replaces the "modular AI DevOps platform / KubeGraf is the first module"
  // framing, which had no room for a hosting product.
  oneLine: 'Orkastor builds infrastructure software for Kubernetes teams.',
  boundary:
    'Everything we build sits on one line: the boundary around your infrastructure. ' +
    'KubeGraf works inside the clusters you own. Domineta is infrastructure we ' +
    'operate for you. The line is the same one; we build on both sides of it.',
  shared: [
    ['One account',        'Sign in once. The same login works across both products.'],
    ['One company',        'Same team, same security posture, same people answering support.'],
    ['One reason they sit together', 'We operate the infrastructure Domineta runs on, so we already hold its telemetry — which is where KubeGraf’s kind of analysis can eventually work with nothing for you to install.'],
  ],
  separate: [
    ['Separate clusters',  'KubeGraf’s agent runs in yours. Domineta runs in ours, and never the reverse.'],
    ['Separate data',      'Each product has its own database. Your cluster telemetry is not mixed with anything you host.'],
    ['Bought separately',  'Neither requires the other. Nothing is bundled to force a pair.'],
  ],
  // The obvious inference, and it is not true yet. Verified against both
  // codebases: Domineta has AI diagnosis for failed builds only.
  notYet:
    'KubeGraf does not watch your Domineta environments today. Domineta has AI diagnosis of its own for failed builds; KubeGraf’s incident detection runs on clusters you connect, and Domineta is not one of them yet.',
};
