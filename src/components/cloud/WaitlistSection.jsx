import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Loader2 } from 'lucide-react';
import { CONTACT_EMAIL, Reveal } from '@/components/home/shared';
import { joinWaitlist } from '@/lib/waitlist';

/**
 * The call to action is a waitlist, not a price table.
 *
 * The architecture document is explicit that the infrastructure cost floor for
 * this product is unmeasured, and that pricing depends on it. Publishing a
 * number now would mean walking it back later, so the honest ask is interest.
 */

const inputCls =
  'w-full px-4 py-3 rounded-xl text-[14.5px] bg-white text-[#16181D] placeholder:text-[#9AA0AE] ' +
  'border border-transparent focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-white transition-shadow';

export default function WaitlistSection() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', name: '', company: '', teamSize: '' } });

  const onSubmit = async (values) => {
    setStatus('loading');
    setMessage('');
    try {
      const result = await joinWaitlist(values);
      setStatus('success');
      setMessage(result.message);
      reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="waitlist" className="relative py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div
            className="lp-inverted relative overflow-hidden rounded-3xl px-6 py-14 sm:px-14 sm:py-16"
            style={{ border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 24px 64px rgba(232,93,4,0.30)' }}
          >
            {/* Same depth treatment as the KubeGraf CTA panel — one brand moment,
                two products, identical construction. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 60% at 50% -15%, rgba(255,255,255,0.22), transparent 60%),' +
                  'radial-gradient(ellipse 70% 65% at 50% 120%, rgba(140,48,0,0.45), transparent 65%)',
              }}
            />

            <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-10 lg:gap-14 items-start">
              <div>
                <div className="lp-eyebrow mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Waitlist
                </div>
                <h2 className="lp-display text-[clamp(28px,4.2vw,46px)]" style={{ color: '#fff' }}>
                  No price yet, and no{' '}
                  <span className="lp-serif" style={{ color: 'var(--lp-ink)' }}>
                    invented one.
                  </span>
                </h2>
                <p className="mt-5 text-[15.5px] leading-relaxed max-w-lg" style={{ color: 'rgba(255,248,240,0.90)' }}>
                  Orkastor Cloud runs on infrastructure with a real hardware cost floor, and we have not
                  finished measuring it. We would rather publish a price once than publish one twice.
                </p>
                <p className="mt-4 text-[15.5px] leading-relaxed max-w-lg" style={{ color: 'rgba(255,248,240,0.90)' }}>
                  The first cohort is small and starts internally. Join the list and you will hear the
                  isolation review, the TTL defaults and the price before you hear a pitch.
                </p>
                <p className="mt-6 text-[13px] leading-relaxed max-w-lg" style={{ color: 'rgba(255,248,240,0.72)' }}>
                  Prefer email? Write to{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-1 underline-offset-2" style={{ color: '#fff' }}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>

              {/* Form */}
              <div
                className="rounded-2xl p-5 sm:p-6"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)' }}
              >
                {status === 'success' ? (
                  <div role="status" className="flex flex-col items-start gap-3 py-4">
                    <span
                      className="w-10 h-10 rounded-full inline-flex items-center justify-center"
                      style={{ background: '#fff' }}
                    >
                      <Check className="w-5 h-5" style={{ color: 'var(--lp-orange-deep)' }} aria-hidden="true" />
                    </span>
                    <p className="text-[15px] font-semibold" style={{ color: '#fff' }}>
                      You're on the list.
                    </p>
                    <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,248,240,0.88)' }}>
                      {message}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
                    <div>
                      <label htmlFor="wl-email" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#fff' }}>
                        Work email
                      </label>
                      <input
                        id="wl-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={inputCls}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'wl-email-error' : undefined}
                        {...register('email', {
                          required: 'Enter an email address so we can reach you.',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'That does not look like an email address.' },
                        })}
                      />
                      {errors.email && (
                        <p id="wl-email-error" className="mt-1.5 text-[12.5px] font-medium" style={{ color: '#FFF1E6' }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="wl-name" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#fff' }}>
                        Name
                      </label>
                      <input
                        id="wl-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        className={inputCls}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'wl-name-error' : undefined}
                        {...register('name', { required: 'A name helps us write back like a person.' })}
                      />
                      {errors.name && (
                        <p id="wl-name-error" className="mt-1.5 text-[12.5px] font-medium" style={{ color: '#FFF1E6' }}>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="wl-company" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#fff' }}>
                          Company <span style={{ fontWeight: 400, opacity: 0.75 }}>(optional)</span>
                        </label>
                        <input
                          id="wl-company"
                          type="text"
                          autoComplete="organization"
                          placeholder="Acme"
                          className={inputCls}
                          {...register('company')}
                        />
                      </div>
                      <div>
                        <label htmlFor="wl-team" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: '#fff' }}>
                          Team size <span style={{ fontWeight: 400, opacity: 0.75 }}>(optional)</span>
                        </label>
                        <select id="wl-team" className={`${inputCls} appearance-none cursor-pointer`} {...register('teamSize')}>
                          <option value="">Select…</option>
                          <option value="1–10">1–10 engineers</option>
                          <option value="11–50">11–50 engineers</option>
                          <option value="51–200">51–200 engineers</option>
                          <option value="200+">200+ engineers</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={status === 'loading'} className="lp-btn-paper w-full mt-1">
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Joining…
                        </>
                      ) : (
                        'Join the waitlist'
                      )}
                    </button>

                    {/* Announced to assistive tech without stealing focus. */}
                    <p role="status" aria-live="polite" className="text-[12.5px] font-medium min-h-[1em]" style={{ color: '#FFF1E6' }}>
                      {status === 'error' ? message : ''}
                    </p>

                    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,248,240,0.78)' }}>
                      We use your details to contact you about Orkastor Cloud, nothing else. See our{' '}
                      <a href="/privacy" className="underline decoration-1 underline-offset-2" style={{ color: '#fff' }}>
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
