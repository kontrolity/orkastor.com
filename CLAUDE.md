# CLAUDE.md — orkastor.com

This repo has no guidance of its own yet. The shared context below applies.

<!-- BEGIN kubegraf/orkastor shared context -->
<!--
  SYNCED FILE. The source of truth is CLAUDE.md at the repos root, beside the
  repo checkouts. Edit it there and re-sync, do not edit this block in place.
  Everything between these two markers is identical in every kubegraf-* and
  orkastor-* repo.
-->

# KubeGraf and Orkastor: cross-repo context

This section is the same in every repo. It covers the things that span repos,
because those are the things that get got wrong.

**Where this section and anything above it disagree, this section is newer.**
Some repo CLAUDE.md files still say Postgres is shared between the two products.
It is not, any more. See below.

## Two products, not one

| | KubeGraf | Orkastor Cloud |
|---|---|---|
| What it is | Kubernetes observability and an autonomous SRE for the customer's own clusters | A hosting product. We run the customer's dev/test environments |
| Cluster | `kubegraf-prod`, plus an agent inside each customer cluster | `orkastor-prod`, ours, running untrusted customer images in Kata microVMs |
| Domains | kubegraf.io, app.kubegraf.io, api.kubegraf.io | orkastor.cloud, console.orkastor.cloud, registry.orkastor.cloud, api.orkastor.cloud |
| Repos | `kubegraf-*` | `orkastor-*` |

They were one codebase until ADR-003 separated them
(`kubegraf-api/docs/orkastor-cloud-adr-003-repo-separation.md`). Do not undo that.

`orkastor.com` is a third thing. It is the marketing site, it lives in a
different GitHub org (`kontrolity/orkastor.com`) and it is not `orkastor.cloud`.

## ⚠ Duplicated trees. Read this before you deploy anything

ADR-003 copied several trees into `orkastor-*` repos. Some copies were never
wired up to deploy, and they have since drifted. Both copies declare objects with
the same names, so applying the wrong one silently reverts live state.

This has already caused one production revert and one outage.

| Live source of truth | Stale copy. Do not apply | Status |
|---|---|---|
| `orkastor-helm/charts/orkastor-registry` | ~~`kubegraf-helm/charts/orkastor-registry`~~ | Resolved 2026-08-23. `orkastor-helm` is canonical, kubegraf-helm's copy deleted |
| `orkastor-helm/charts/orkastor-runtime` | ~~`kubegraf-helm/charts/orkastor-runtime`~~ | Resolved 2026-08-23, same way |
| `kubegraf.io/apps/orkastor` | `orkastor-console` | The copy ships nowhere. Its CI has typecheck, test and build, and no deploy step at all |
| `kubegraf-deploy/orkastor-site` | ~~`orkastor-deploy/orkastor-site`~~ | Deleted 2026-08-23 |

Before touching any of these, check which one is live. Do not assume the
`orkastor-*` copy is canonical just because the thing is called Orkastor.

**The root cause is worth knowing.** ADR-003 split the repos by repo NAME, not by
CLUSTER. Some Orkastor surfaces run on `kubegraf-prod`, so they stayed in
`kubegraf-*` repos and their copies went to a repo that deploys to the wrong
cluster.

The two resolved rows went opposite ways, and the rule is the cluster. The apex
site runs on kubegraf-prod, so the `orkastor-deploy` copy was deleted. The
registry runs on orkastor-prod, so `orkastor-helm` became canonical and the
`kubegraf-helm` copy was deleted. Ask which cluster the thing runs on, not what
the repo is called.

## Orkastor-shaped things that live in `kubegraf-*` repos on purpose

Do not "finish the split" by moving these. Moving a resource between Terraform
states or Helm releases is a live migration, not a file move.

- `kubegraf.io/apps/orkastor` is the Console. It deploys to
  console.orkastor.cloud from here, via Vercel.
- `kubegraf-deploy/orkastor-site` is the orkastor.cloud apex site. It runs on
  kubegraf-prod.
- `kubegraf-infra/terraform/aws/shared/cloudflare-dns` holds DNS for both zones,
  in one state.
- `kubegraf-infra/terraform/aws/envs/prod/workload-iam/kubegraf-api-orkastor-object-storage.tf`

## How each surface actually ships

There is no single deploy mechanism. Check before you assume.

| Surface | Ships by | Merging is enough? |
|---|---|---|
| console.orkastor.cloud | Vercel, from `kubegraf.io/.github/workflows/frontend.yml`, triggered by a change under `apps/orkastor/` | Yes |
| orkastor.cloud | `kubectl --context kgprod apply -f kubegraf-deploy/orkastor-site/prod/site.yaml` | **No.** By hand |
| registry.orkastor.cloud | `helm upgrade --install orkastor-registry charts/orkastor-registry -n orkastor-registry -f charts/orkastor-registry/values-orkastor-prod.yaml`, run from **orkastor-helm** | **No.** By hand |
| orkastor.com | Vercel git integration on push. No CI in the repo at all | Yes |

The apex site is a documented exception to kubegraf-deploy's "merge here and it
ships" rule. `helm-deploy.yml` does not match its path, so a merge does nothing.
The pods still pick up a hand-applied change because the Deployment carries
`reloader.stakater.com/auto: "true"`.

## The clusters are not the same shape

One AWS account, `341796273224`, region `eu-north-1`, profile `kg`.

**kubegraf-prod** runs Istio. Its gateway is `istio-system/kubegraf-gateway`.

**orkastor-prod** runs **Cilium and Envoy Gateway**. There is no `istio-system`
namespace. ADR-002 phase 7 removed Istio and deleting the Istio Gateways
destroyed their NLBs with them.

Never create `istio-system` on orkastor-prod. If a chart or manifest asks for it,
the chart is stale.

Two facts about orkastor-prod that have each caused an outage:

1. **The Gateway object and the Envoy proxy pods are in different namespaces.**
   The Gateway is `orkastor-gateway/orkastor-eg`. The proxies run in
   `envoy-gateway-system`. A NetworkPolicy has to admit the namespace traffic
   comes FROM, which is the second one. Istio had both in one namespace, so old
   code uses one value for both. The symptom of getting this wrong is a 503 that
   reads like a broken backend, not like a policy denial.
2. **NLB hostnames are minted by AWS and are hardcoded in Terraform.** Recreating
   a gateway mints a new hostname and silently orphans the old one. DNS then
   points at a load balancer that does not exist. Nothing in Kubernetes notices,
   because every in-cluster signal stays green. This has happened twice. There is
   now a daily `orkastor-dns-liveness` workflow in kubegraf-infra.
3. **The `vpc-cni` and `kube-proxy` EKS addons were removed out-of-band during
   the Cilium cutover, not through Terraform.** `kubegraf-infra`'s EKS stack kept
   declaring both as managed addons, so an unrelated `terraform apply` against
   that stack silently recreated them (caught and removed again 2026-08-23; the
   Terraform config was then fixed to stop declaring them). Cilium's own
   protections meant this never actually took traffic, but the failure mode it
   risked is exactly #1's `kubeProxyReplacement` conflict. Before touching that
   Terraform stack, confirm the addons map still excludes `vpc-cni`/`kube-proxy`.

## What the two products still share

This list keeps shrinking. Check it rather than trusting it.

1. **One identity model.** A signed-in user is signed in to both. Shared as
   `@kubegraf/platform-core` (server, from kubegraf-api) and `@kubegraf/web-core`
   (browser, from kubegraf.io). **Never fork auth or tenancy.**
2. **One AWS account and one GitHub org.**
3. **The constant registry.** See below.

Postgres is **no longer shared**. Orkastor got its own instance in the Orkastor
VPC (kubegraf-infra #145). Older CLAUDE.md files still say "one Postgres
instance, disjoint tables". That is now out of date.

`api.orkastor.cloud` moved to orkastor-prod once Orkastor had its own database.
It used to point at kubegraf-prod, because that is where its data was.

## The constant registry is vendored into six repos

Canonical: `kubegraf-api/api/_lib/orkastor/constants.json`.

Copies that must move with it. Every one of these is asserted byte-identical by
some CI job, and each job reads its OWN copy rather than the canonical one:

- `orkastor-api/api/_lib/orkastor/constants.json`
- `kubegraf-controller/internal/orkastor/constants.json`
- `orkastor-controller/internal/orkastor/constants.json`
- `kubegraf-helm/tests/orkastor/constants.json`
- `orkastor-helm/tests/orkastor/constants.json`
- `kubegraf-infra/tests/orkastor/constants.json`

Adding one `orkastor.cloud/*` label key therefore means editing seven files, plus
`kubegraf-api/docs/orkastor-cloud-implementation.md` §3. Miss one and that repo's
CI goes red on its next unrelated pull request, which is how this list was found:
a docs-only change reddened two repos that had nothing to do with it.

The freshness jobs also fail if you skip the `--canonical` flag, on purpose,
because a drift check that passes when it cannot see the other repo is the bug it
exists to prevent.

## DNS

Cloudflare, for both products. Not Route53, whatever the design docs say.

Records are Terraform, in
`kubegraf-infra/terraform/aws/shared/cloudflare-dns`. Every record is grey cloud
(unproxied) and there are real reasons per record in the file. The registry one
in particular breaks if proxied, because Cloudflare caps request bodies at 100 MB
and container layers are bigger than that.

## Brand

The Orkastor mark is an orca in an interrupted ring, navy to teal. It replaced an
interrupted "O", which replaced a four-shape glyph.

Canonical artwork and a consistency checker are in `.orkastor-brand/` at this
root. That directory is not in any git repo, so treat it as a working copy.
`check_brand.py` scans every repo and fails if a retired mark survives anywhere,
or if a file that should carry the mark does not.

The mark is duplicated by hand across repos. It went stale once already, in a way
no test caught, which is why the checker exists. Two drawings, not one: the full
drawing above 48px, a simplified one at or below 32px. The full drawing is
unreadable at favicon size.

## CI

Every workflow in every repo uses `runs-on: kubegraf-org-runners`. Never
`ubuntu-latest`. The pool is amd64 and capped at 8. A "Set up job" failure is
usually a stale runner holding a slot, not your change.

<!-- END kubegraf/orkastor shared context -->
