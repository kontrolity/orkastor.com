import { useEffect } from 'react';

/**
 * Per-route metadata for a client-rendered SPA.
 *
 * index.html carries ONE static set of tags, and it described a company that
 * "makes KubeGraf" and claimed "Zero data exfiltration" — a single-product
 * framing plus a claim the architecture does not support. Every route was
 * serving it. Pages already set `document.title` by hand; this does the rest of
 * the set from one place so a new route cannot forget half of it.
 *
 * ── WHAT THIS DOES AND DOES NOT FIX ─────────────────────────────────────────
 *
 * Crawlers that execute JavaScript see these values. A crawler that does not
 * still sees index.html's tags, because this is a client-rendered SPA with no
 * prerender step. That is a real limitation and the honest fix is prerendering,
 * which is a build-pipeline change rather than a component. So index.html's
 * defaults are ALSO corrected — this hook improves per-route accuracy, it does
 * not paper over a wrong default.
 */
export function useSeo({ title, description, canonical, image }) {
  useEffect(() => {
    if (title) document.title = title;

    const set = (selector, attr, value) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
        // Rebuild the identifying attribute from the selector so a tag created
        // here is found by the same selector next time.
        const m = selector.match(/\[(\w+)="([^"]+)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        if (selector.startsWith('link')) el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    set('meta[name="description"]', 'content', description);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:url"]', 'content', canonical);
    set('meta[property="og:image"]', 'content', image);
    set('meta[name="twitter:title"]', 'content', title);
    set('meta[name="twitter:description"]', 'content', description);
    set('meta[name="twitter:image"]', 'content', image);
    set('link[rel="canonical"]', 'href', canonical);
  }, [title, description, canonical, image]);
}

export default useSeo;
