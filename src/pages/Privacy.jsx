import React, { useEffect } from 'react';
import Nav from '@/components/home/Nav';
import Footer from '@/components/home/Footer';
import { CONTACT_EMAIL } from '@/components/home/shared';

const linkStyle = {
  color: 'var(--lp-orange-deep)',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(255,122,31,0.35)',
  textUnderlineOffset: '3px',
};

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy – Orkastor';
  }, []);

  return (
    <div className="lp min-h-screen">
      <Nav />

      <main className="relative lp-hero-wash">
        <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-[140px] sm:pt-[160px] pb-20 sm:pb-28">
          <div className="lp-eyebrow mb-5">Legal</div>
          <h1 className="lp-display text-[clamp(32px,4.4vw,52px)] mb-3">Privacy Policy</h1>
          <p className="text-sm mb-12" style={{ color: 'var(--lp-ink-3)' }}>Last updated: 6 March 2026</p>

          <div className="space-y-10 text-[15.5px] leading-[1.75]" style={{ color: 'var(--lp-ink-2)' }}>
            <p>
              The privacy of your data matters to us. Orkastor is built to run inside your
              environment — we have no visibility into your infrastructure, incidents, or code.
              This page explains what little we do collect and why.
            </p>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.015em' }}>
                Your infrastructure data stays in your environment
              </h2>
              <p>
                Orkastor runs inside your own environment. We have no access to your Kubernetes
                clusters, cloud resources, incidents, logs, or configurations. None of that data
                is sent to us.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.015em' }}>
                This website — no tracking, no cookies
              </h2>
              <p>
                orkastor.com uses no analytics, no tracking, and no advertising. We do not use
                Google Analytics, Meta Pixel, or any similar service. We do not set any cookies.
                Fonts are served from our own domain — no requests go to Google Fonts or any
                external CDN.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.015em' }}>
                Waitlist and contact forms
              </h2>
              <p>
                If you sign up for early access or request a demo, you provide your email address
                and optionally your name, company, role, team size, and environment details. We
                use this only to contact you about Orkastor.
              </p>
              <p className="mt-3">
                Submissions are stored in <strong style={{ color: 'var(--lp-ink)' }}>Google Sheets</strong>{' '}
                via Google Apps Script — Google acts as a data processor under their standard{' '}
                <a
                  href="https://workspace.google.com/terms/dpa_terms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Data Processing Amendment
                </a>
                . We do not share this information with anyone else or use it for advertising.
                Legal basis: legitimate interests (Art. 6(1)(f) UK/EU GDPR) — responding to your
                expressed interest in Orkastor.
              </p>
              <p className="mt-3">
                To have your data removed, email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={linkStyle}>{CONTACT_EMAIL}</a>{' '}
                and we&apos;ll delete it promptly.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.015em' }}>
                Your rights
              </h2>
              <p>
                Under UK and EU GDPR you have the right to access, correct, delete, or port any
                personal data we hold about you, and to object to how we use it. Email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={linkStyle}>{CONTACT_EMAIL}</a>{' '}
                and we&apos;ll respond within 30 days.
              </p>
              <p className="mt-3">
                If you have a concern, please contact us first. If you remain unsatisfied, you
                have the right to escalate to the{' '}
                <a
                  href="https://ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Information Commissioner&apos;s Office (ICO)
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--lp-ink)', letterSpacing: '-0.015em' }}>
                Changes
              </h2>
              <p>If we make material changes we&apos;ll update this page and revise the date above.</p>
            </div>

            <p className="pt-4 text-[14px]" style={{ color: 'var(--lp-ink-3)' }}>
              Orkastor is a UK company.{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--lp-ink-2)' }}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
