import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, ChevronLeft } from 'lucide-react';
import { joinWaitlist } from '@/lib/waitlist';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  color: '#fff',
};

const inputFocusHandlers = {
  onFocus: (e) => {
    e.target.style.borderColor = 'rgba(108,71,255,0.5)';
    e.target.style.background = 'rgba(255,255,255,0.06)';
  },
  onBlur: (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.09)';
    e.target.style.background = 'rgba(255,255,255,0.04)';
  },
};

const inputCls =
  'w-full px-4 py-3 rounded-xl text-sm placeholder:text-slate-600 focus:outline-none transition-all';

const selectCls =
  'w-full px-3 py-3 rounded-xl text-sm focus:outline-none transition-all cursor-pointer appearance-none';

export default function WaitlistForm({ size = 'lg', placeholder = 'your@company.com' }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [clusters, setClusters] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleEmailStep = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
      return;
    }
    setStatus('idle');
    setMessage('');
    setStep('details');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setStatus('error');
      setMessage('Please enter your name');
      return;
    }
    setStatus('loading');
    setMessage('');

    try {
      const { message: successMessage } = await joinWaitlist({ email, name, company, role, teamSize, clusters });
      setStatus('success');
      setMessage(successMessage || "You're on the list!");
      setEmail('');
      setName('');
      setCompany('');
      setRole('');
      setTeamSize('');
      setClusters('');
      setStep('email');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
    }
  };

  const py = size === 'lg' ? 'py-3.5' : 'py-3';

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* Step 1: Email */}
        {step === 'email' && status !== 'success' && (
          <motion.form
            key="email-step"
            onSubmit={handleEmailStep}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={status === 'success'}
                className={`${inputCls} flex-1 ${py}`}
                style={inputStyle}
                autoComplete="email"
                aria-label="Email address"
                {...inputFocusHandlers}
              />
              <button
                type="submit"
                className={`btn-clerk-primary inline-flex items-center justify-center gap-2 px-6 ${py} rounded-xl text-sm font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform whitespace-nowrap`}
              >
                Get Early Access
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-2 text-xs ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="mt-2 text-xs" style={{ color: '#3D3460' }}>
              By continuing you agree to our{' '}
              <a href="/privacy" style={{ color: '#524770' }} onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')} onMouseLeave={e => (e.currentTarget.style.color = '#524770')}>Privacy Policy</a>.
            </p>
          </motion.form>
        )}

        {/* Step 2: Details */}
        {step === 'details' && status !== 'success' && (
          <motion.form
            key="details-step"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2.5"
          >
            {/* Confirmed email row */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={{
                border: '1px solid rgba(108,71,255,0.25)',
                background: 'rgba(108,71,255,0.06)',
              }}
            >
              <Check className="w-4 h-4 shrink-0" style={{ color: '#A78BFA' }} />
              <span className="flex-1 truncate text-slate-400">{email}</span>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-xs flex items-center gap-0.5 shrink-0 hover:underline"
                style={{ color: '#A78BFA' }}
              >
                <ChevronLeft className="w-3 h-3" />
                Edit
              </button>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (required)"
              disabled={status === 'loading'}
              className={`${inputCls} py-3`}
              style={inputStyle}
              autoComplete="name"
              aria-label="Your name"
              autoFocus
              {...inputFocusHandlers}
            />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company / organization (optional)"
              disabled={status === 'loading'}
              className={`${inputCls} py-3`}
              style={inputStyle}
              autoComplete="organization"
              aria-label="Company or organization"
              {...inputFocusHandlers}
            />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role — SRE, Platform Eng, DevOps (optional)"
              disabled={status === 'loading'}
              className={`${inputCls} py-3`}
              style={inputStyle}
              aria-label="Your role"
              {...inputFocusHandlers}
            />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                disabled={status === 'loading'}
                className={selectCls}
                style={{ ...inputStyle, color: teamSize ? '#fff' : '#475569' }}
                aria-label="Team size"
              >
                <option value="">Team size</option>
                <option value="1–10">1–10 engineers</option>
                <option value="11–50">11–50 engineers</option>
                <option value="51–200">51–200 engineers</option>
                <option value="200+">200+ engineers</option>
              </select>

              <select
                value={clusters}
                onChange={(e) => setClusters(e.target.value)}
                disabled={status === 'loading'}
                className={selectCls}
                style={{ ...inputStyle, color: clusters ? '#fff' : '#475569' }}
                aria-label="Number of clusters"
              >
                <option value="">No. of clusters</option>
                <option value="1–2">1–2 clusters</option>
                <option value="3–10">3–10 clusters</option>
                <option value="10+">10+ clusters</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-clerk-primary w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform mt-1"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Join Waitlist
                </>
              )}
            </button>

            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs text-center ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs text-center" style={{ color: '#3D3460' }}>
              We'll only use your details to contact you about Orkastor.{' '}
              <a href="/privacy" style={{ color: '#524770' }} onMouseEnter={e => (e.currentTarget.style.color = '#9B93C4')} onMouseLeave={e => (e.currentTarget.style.color = '#524770')}>Privacy Policy</a>.
            </p>
          </motion.form>
        )}

        {/* Success state */}
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2 py-4 text-center"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.3)',
              }}
            >
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-white">You're on the list!</p>
            <p className="text-xs text-slate-500">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
