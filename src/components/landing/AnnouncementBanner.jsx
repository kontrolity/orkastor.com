import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const KEY = 'orkastor-banner-dismissed';
const OFFER_URL = 'https://kubegraf.io/pricing';

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(KEY);
    if (!dismissed) {
      setVisible(true);
      document.documentElement.style.setProperty('--banner-height', '48px');
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(KEY, '1');
    document.documentElement.style.setProperty('--banner-height', '0px');
    window.dispatchEvent(new CustomEvent('banner-dismissed'));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="banner"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-0 right-0 z-[60] h-12 flex items-center overflow-hidden"
          style={{
            top: 0,
            background:
              'linear-gradient(90deg, rgba(8,8,12,0.96) 0%, rgba(11,11,18,0.98) 45%, rgba(8,8,12,0.96) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.22)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 35% 120% at 18% 50%, rgba(255,138,61,0.16) 0%, transparent 65%),' +
                'radial-gradient(ellipse 30% 120% at 50% 50%, rgba(123,77,255,0.18) 0%, transparent 68%),' +
                'radial-gradient(ellipse 35% 120% at 82% 50%, rgba(56,189,248,0.14) 0%, transparent 65%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 22%, rgba(255,255,255,0.4) 48%, rgba(125,211,252,0.28) 80%, transparent 100%)',
            }}
          />
          <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
            <a
              href={OFFER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full justify-center min-w-0 items-center gap-3 pr-10 sm:pr-12 text-[13px] sm:text-base text-slate-200 hover:text-white transition-colors font-medium"
            >
              <span
                className="hidden sm:inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.18em] px-3 py-1 rounded-full shrink-0"
                style={{
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #6C47FF 0%, #38BDF8 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 20px rgba(56,189,248,0.18)',
                }}
              >
                Early-Stage
              </span>
              <span className="truncate">
                Startup Program for <strong className="text-white">$49/mo for your first 6 months</strong> - quick 24-hour verification.
              </span>
              <span className="hidden md:inline-flex items-center gap-1 font-semibold text-[#7DD3FC] underline underline-offset-4 decoration-[1.5px] shrink-0">
                Apply now
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
            <button
              onClick={dismiss}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-200 transition-colors rounded-md hover:bg-white/[0.05]"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
