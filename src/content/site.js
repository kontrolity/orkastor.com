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
    href: '/kubegraf',
    status: 'Live',
    dot: 'var(--kg)',
    tagline: 'An AI SRE for the clusters you already run',
  },
  {
    key: 'cloud',
    name: 'Domineta',
    href: '/cloud',
    status: 'By invitation',
    dot: 'var(--cloud-bright)',
    tagline: 'Ephemeral environments with a real kernel boundary',
  },
];

export const LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs',    href: '/docs' },
  { label: 'About',   href: '/about' },
];

/** The hero. "Same problem" was the old claim and it was false — the products
 *  solve different problems, so the thread is the AUDIENCE. */
export const HERO = {
  eyebrow: 'Infrastructure, without the operating tax',
  titleA: 'For teams who run Kubernetes.',
  titleB: 'And teams who would rather not.',
  sub:
    'KubeGraf is an AI SRE for the clusters you already have. Domineta gives you ' +
    'ephemeral environments when you would rather not build the infrastructure yourself.',
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
