import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const APPLY_EMAIL = 'support@kubegraf.io';
const APPLY_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(APPLY_EMAIL)}`;

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible || !bannerRef.current) {
      return undefined;
    }

    const syncHeight = () => {
      const height = bannerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--banner-height', `${height}px`);
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(bannerRef.current);
    window.addEventListener('resize', syncHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    document.documentElement.style.setProperty('--banner-height', '0px');
    window.dispatchEvent(new CustomEvent('banner-dismissed'));
  };

  const openApplyEmail = () => {
    window.open(APPLY_COMPOSE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={bannerRef}
          key="banner"
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-0 right-0 z-[60] overflow-hidden"
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
          <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto relative z-10 py-2 sm:py-0 sm:min-h-12 flex items-center">
            <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 pr-10 sm:pr-12 text-center sm:text-left text-[12px] sm:text-sm md:text-base text-slate-200 font-medium">
              <span
                className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.18em] px-3 py-1 rounded-full shrink-0"
                style={{
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #6C47FF 0%, #38BDF8 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 20px rgba(56,189,248,0.18)',
                }}
              >
                Early-Stage
              </span>
              <span className="max-w-full">
                Startup Program for <strong className="text-white">$49/mo for your first 6 months</strong> - quick 24-hour verification.
              </span>
              <button
                type="button"
                onClick={openApplyEmail}
                className="inline-flex items-center gap-1 font-semibold text-[#7DD3FC] underline underline-offset-4 decoration-[1.5px] shrink-0 hover:text-white transition-colors"
              >
                Apply now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
