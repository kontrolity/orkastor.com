import React, { useEffect } from 'react';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy – Orkastor';
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
      <NavBar />

      <main className="relative">
        <section className="max-w-3xl mx-auto px-5 sm:px-6 pt-36 pb-24">

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm mb-12" style={{ color: '#524770' }}>Last updated: 6 March 2026</p>

          <div className="space-y-10 text-base leading-relaxed" style={{ color: '#9B93C4' }}>

            <p>
              The privacy of your data matters to us. Orkastor is built to run inside your environment — we have no visibility into your infrastructure, incidents, or code. This page explains what little we do collect and why.
            </p>

            {/* ── Your infrastructure data ── */}
            <div>
              <h2 className="text-white text-lg font-semibold mb-3">Your infrastructure data stays in your environment</h2>
              <p>
                Orkastor runs inside your own environment. We have no access to your Kubernetes clusters, cloud resources, incidents, logs, or configurations. None of that data is sent to us.
              </p>
            </div>

            {/* ── This website ── */}
            <div>
              <h2 className="text-white text-lg font-semibold mb-3">This website — no tracking, no cookies</h2>
              <p>
                orkastor.com uses no analytics, no tracking, and no advertising. We do not use Google Analytics, Meta Pixel, or any similar service. We do not set any cookies. Fonts are served from our own domain — no requests go to Google Fonts or any external CDN.
              </p>
            </div>

            {/* ── Waitlist / forms ── */}
            <div>
              <h2 className="text-white text-lg font-semibold mb-3">Waitlist and contact forms</h2>
              <p>
                If you sign up for early access or request a demo, you provide your email address and optionally your name, company, role, team size, and environment details. We use this only to contact you about Orkastor.
              </p>
              <p className="mt-3">
                Submissions are stored in <strong className="text-white/80">Google Sheets</strong> via Google Apps Script — Google acts as a data processor under their standard{' '}
                <a
                  href="https://workspace.google.com/terms/dpa_terms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6C47FF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6C47FF')}
                >
                  Data Processing Amendment
                </a>. We do not share this information with anyone else or use it for advertising. Legal basis: legitimate interests (Art. 6(1)(f) UK/EU GDPR) — responding to your expressed interest in Orkastor.
              </p>
              <p className="mt-3">
                To have your data removed, email{' '}
                <a
                  href="mailto:hello@orkastor.com"
                  style={{ color: '#6C47FF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6C47FF')}
                >
                  hello@orkastor.com
                </a>{' '}
                and we'll delete it promptly.
              </p>
            </div>

            {/* ── Your rights ── */}
            <div>
              <h2 className="text-white text-lg font-semibold mb-3">Your rights</h2>
              <p>
                Under UK and EU GDPR you have the right to access, correct, delete, or port any personal data we hold about you, and to object to how we use it. Email{' '}
                <a
                  href="mailto:hello@orkastor.com"
                  style={{ color: '#6C47FF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6C47FF')}
                >
                  hello@orkastor.com
                </a>{' '}
                and we'll respond within 30 days.
              </p>
              <p className="mt-3">
                If you have a concern, please contact us first. If you remain unsatisfied, you have the right to escalate to the{' '}
                <a
                  href="https://ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6C47FF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6C47FF')}
                >
                  Information Commissioner's Office (ICO)
                </a>.
              </p>
            </div>

            {/* ── Changes ── */}
            <div>
              <h2 className="text-white text-lg font-semibold mb-3">Changes</h2>
              <p>If we make material changes we'll update this page and revise the date above.</p>
            </div>

            <p className="pt-4" style={{ color: '#3D3460' }}>
              Orkastor is a UK company.{' '}
              <a
                href="mailto:hello@orkastor.com"
                style={{ color: '#524770' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#524770')}
              >
                hello@orkastor.com
              </a>
            </p>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
