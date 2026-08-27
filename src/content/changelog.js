/**
 * Changelog entries, lifted VERBATIM out of the old page so the redesign could
 * not quietly alter them. Presentation moved; content did not.
 *
 * One correction was made, in the old page and carried here: an entry described
 * private AI inference as running "inside your VPC with no external data
 * egress". The architecture routes model calls through KubeGraf's own gateway to
 * Amazon Bedrock, so that was not what shipped. The entry stays — it may be a
 * real release — with the description corrected to what the system does.
 *
 * If a real release feed becomes available, this file should be replaced by it
 * rather than appended to by hand.
 */
export const ENTRIES = [
  {
    version: 'v1.2.0',
    date: 'February 2026',
    tag: 'Release',
    summary: 'Confidence-scored RCA, multi-cluster support and Helm chart improvements.',
    changes: [
      { type: 'new', text: 'Confidence-scored root cause analysis — evidence chains now show percentage confidence per causal factor.' },
      { type: 'new', text: 'Multi-cluster support — monitor and correlate incidents across up to 5 clusters in a single view.' },
      { type: 'new', text: 'Helm chart v2: configurable resource limits, custom tolerations and topology spread constraints.' },
      { type: 'fix', text: 'Fixed a race condition in the SafeFix™ rollback controller that could cause duplicate rollbacks under high load.' },
      { type: 'fix', text: 'OOMKilled detection now correctly handles init containers.' },
      { type: 'perf', text: 'Reduced agent memory footprint by 35% through streaming log ingestion.' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'January 2026',
    tag: 'Release',
    summary: 'Dry-run validation, OPA policy integration and Slack incident threads.',
    changes: [
      { type: 'new', text: 'Dry-run validation: every SafeFix™ proposal is now tested in dry-run mode before awaiting approval.' },
      { type: 'new', text: 'OPA policy integration — block, audit or override any proposed fix using custom Rego policies.' },
      { type: 'new', text: 'Slack integration: incidents and approvals surface as threaded Slack messages with one-click approve/reject.' },
      { type: 'new', text: 'Automatic rollback: if post-fix metrics regress within 5 minutes, SafeFix™ reverts the change automatically.' },
      { type: 'fix', text: 'Corrected CrashLoopBackOff detection for pods with custom restart policies.' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'December 2025',
    tag: 'GA',
    summary: 'General availability of KubeGraf — AI SRE for Kubernetes.',
    changes: [
      { type: 'new', text: 'AI Root Cause Analysis: correlates logs, metrics, Kubernetes events and recent deployments.' },
      { type: 'new', text: 'SafeFix™ Auto-Remediation with mandatory human approval gate and full audit trail.' },
      { type: 'new', text: 'Integrations: Datadog, Prometheus, PagerDuty, OpsGenie, GitHub and ArgoCD.' },
      { type: 'new', text: 'Private AI inference — model calls route through KubeGraf’s own gateway on redacted telemetry, never with your keys and never on raw logs.' },
      { type: 'new', text: 'Orkastor CLI: brew install orkastor with watch, diagnose and fix subcommands.' },
    ],
  },
];
