/* Scroll reveal for orkastor.cloud.
 *
 * External rather than inline purely so the Content-Security-Policy can say
 * `script-src 'self'` instead of `'unsafe-inline'`. This page is served from the
 * tenant domain, so a policy that permits arbitrary inline script here is a worse
 * default than the convenience is worth.
 *
 * No dependencies, no network, no storage — nothing on this host may set a cookie
 * or read one, because a cookie scoped to orkastor.cloud reaches every tenant
 * environment underneath it.
 */
(function () {
  var els = document.querySelectorAll('.reveal');

  // If IntersectionObserver is missing, show everything immediately. A page that
  // hides its own content on an older browser is worse than one that never
  // animated. prefers-reduced-motion is handled in CSS, not here, so that the
  // content is visible even if this file fails to load at all.
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target); // reveal once — re-animating on scroll-back is noise
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

  els.forEach(function (el) { io.observe(el); });
})();
