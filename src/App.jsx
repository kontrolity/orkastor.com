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
const OrkKubeGraf  = lazy(() => import('@/pages/OrkKubeGraf'));
const OrkCloud     = lazy(() => import('@/pages/OrkCloud'));
const OrkCloudHow  = lazy(() => import('@/pages/OrkCloudHow'));
const OrkPricing   = lazy(() => import('@/pages/OrkPricing'));
const OrkDocs      = lazy(() => import('@/pages/OrkDocs'));
const OrkChangelog = lazy(() => import('@/pages/OrkChangelog'));
const OrkAbout     = lazy(() => import('@/pages/OrkAbout'));
const OrkPrivacy   = lazy(() => import('@/pages/OrkPrivacy'));
const PageNotFound = lazy(() => import('@/lib/PageNotFound'));

export default function App() {
  return (
    /* attribute="class" so Tailwind's darkMode:["class"] and the `.dark .ork`
     * token block key off the same thing. defaultTheme="dark" because the brief
     * makes dark the primary experience; enableSystem keeps "system" real.
     * disableTransitionOnChange stops every border on the page animating at once
     * on a theme swap — the few properties that should tween are named in
     * orkastor.css instead. */
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<OrkHome />} />
                <Route path="/kubegraf" element={<OrkKubeGraf />} />
                <Route path="/cloud" element={<OrkCloud />} />
                <Route path="/cloud/how-it-works" element={<OrkCloudHow />} />
                <Route path="/pricing" element={<OrkPricing />} />
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
