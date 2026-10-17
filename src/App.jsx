import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { queryClient } from '@/lib/query-client';
import Layout from '@/Layout';
import OrkHome from '@/pages/OrkHome';
import CookieConsent from '@/components/CookieConsent';

/**
 * Routing.
 *
 * Every route is now the redesigned page. The previous `.lp` pages are still on
 * disk but no longer reachable — deleting a whole design system is a separate
 * change from replacing it, and keeping them for one release means a revert is a
 * one-line change here rather than a restore.
 *
 * Home stays eager. Everything else is code-split, so a visitor who only reads
 * the home page never downloads the Cloud diagrams.
 */
/* OrkKubeGraf is no longer routed. KubeGraf has its own site and the nav,
   hero, footer and About page all point at it now; a second product page on
   the company site was copy that could drift. The component stays on disk
   under the same rule as the pages above — unreachable, not deleted. */
const OrkCloud     = lazy(() => import('@/pages/OrkCloud'));
const OrkCloudHow  = lazy(() => import('@/pages/OrkCloudHow'));
const OrkDocs      = lazy(() => import('@/pages/OrkDocs'));
const OrkChangelog = lazy(() => import('@/pages/OrkChangelog'));
const OrkAbout     = lazy(() => import('@/pages/OrkAbout'));
const OrkPrivacy   = lazy(() => import('@/pages/OrkPrivacy'));
const PageNotFound = lazy(() => import('@/lib/PageNotFound'));

export default function App() {
  return (
    /* attribute="class" so Tailwind's darkMode:["class"] and the `.dark .ork`
     * token block key off the same thing.
     *
     * ⚠ forcedTheme="light" — THE SITE IS WHITE, AND ONLY WHITE.
     *
     * This flag has now been here, removed, and put back, so the history is
     * worth stating. It originally pinned the site to DARK, which made
     * ThemeToggle dead code because next-themes ignores setTheme while a
     * theme is forced. It was removed so the toggle would work and the site
     * could ship in both. The decision now is that there is no second theme
     * to toggle to: white is the site.
     *
     * So the toggle is gone from the Navbar rather than left on screen doing
     * nothing — a control that cannot change anything is worse than no
     * control. enableSystem stays unset for the same reason it always was,
     * and now additionally because there is nothing for the OS to pick.
     *
     * ⚠ The `.dark .ork` token blocks in styles/mono.css are INTENTIONALLY
     * LEFT IN PLACE. They are unreachable while this flag is set, and
     * deleting a whole token system is a separate change from ceasing to use
     * it — the same rule the retired `.lp` pages below are kept under.
     * Reinstating dark is: drop this prop, restore the toggle.
     *
     * disableTransitionOnChange stops every border on the page animating at
     * once on a theme swap — the few properties that should tween are named in
     * orkastor.css instead. Harmless now that nothing swaps, kept for the
     * revert. */
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<OrkHome />} />
                <Route path="/cloud" element={<OrkCloud />} />
                <Route path="/cloud/how-it-works" element={<OrkCloudHow />} />
                <Route path="/docs" element={<OrkDocs />} />
                <Route path="/changelog" element={<OrkChangelog />} />
                <Route path="/about" element={<OrkAbout />} />
                <Route path="/privacy" element={<OrkPrivacy />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Routes>
          </Suspense>
          <CookieConsent />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
