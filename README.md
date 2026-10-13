# orkastor.com

The Orkastor company marketing site. It also serves on orkastor.si.

## Develop

    npm ci
    npm run dev

## Deploy

Cloudflare Pages builds every push to `main` (`npm run build`, output `dist`).
Pull requests get a preview URL.

The Pages project, its custom domains and the DNS records are Terraform in
`kubegraf/kubegraf-infra`, under `terraform/aws/shared/cloudflare-dns`
(`cloudflare_orkastor_sites_dns.tf`). Change them there, not in the dashboard.

`public/_redirects` is the SPA fallback and `public/_headers` sets the cache
headers.
