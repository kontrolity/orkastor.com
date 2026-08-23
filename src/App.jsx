import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import Layout from '@/Layout';
import Home from '@/pages/Home';
import CookieConsent from '@/components/CookieConsent';

// Home stays eager (the landing page — no extra round-trip on first paint).
// Every other route is code-split so its JS only loads when visited.
const Cloud = lazy(() => import('@/pages/Cloud'));
const CloudHowItWorks = lazy(() => import('@/pages/CloudHowItWorks'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Docs = lazy(() => import('@/pages/Docs'));
const Changelog = lazy(() => import('@/pages/Changelog'));
const About = lazy(() => import('@/pages/About'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const PageNotFound = lazy(() => import('@/lib/PageNotFound'));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cloud" element={<Cloud />} />
              <Route path="/cloud/how-it-works" element={<CloudHowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <CookieConsent />
      </Router>
    </QueryClientProvider>
  );
}
