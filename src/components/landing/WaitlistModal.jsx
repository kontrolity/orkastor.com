import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

/* ── Context ── */
const WaitlistContext = createContext({ open: false, setOpen: () => {} });

export function useWaitlistModal() {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <WaitlistContext.Provider value={{ open, setOpen }}>
      {children}
      <WaitlistModal open={open} onOpenChange={setOpen} />
    </WaitlistContext.Provider>
  );
}

/* ── Modal ── */
function WaitlistModal({ open, onOpenChange }) {
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${sw}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="waitlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Centering shell */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            {/* Animated card */}
            <motion.div
              key="waitlist-modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Get Early Access"
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl p-6"
              style={{
                width: '100%',
                maxWidth: '480px',
                maxHeight: '90vh',
                overflowY: 'auto',
                pointerEvents: 'auto',
                background: 'rgba(19, 19, 22, 0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 0 1px rgba(108,71,255,0.15), 0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(108,71,255,0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Get Early Access</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Free forever — no credit card required.
                  </p>
                </div>
                <button
                  onClick={close}
                  className="ml-4 shrink-0 rounded-lg p-1.5 transition-colors"
                  style={{
                    color: '#524770',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#524770';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <WaitlistForm size="lg" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
