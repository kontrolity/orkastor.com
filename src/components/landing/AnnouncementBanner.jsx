import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const KEY = 'orkastor-banner-dismissed';

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
          className="fixed left-0 right-0 z-[60] h-12 flex items-center"
          style={{
            top: 0,
            background: '#130F27',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center justify-between w-full px-4 sm:px-6 max-w-7xl mx-auto">
            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <span
                className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: '#E9E2FF', color: '#1E1A33' }}
              >
                New
              </span>
              <span>KubēGraf v1.0 is live — the first AI SRE for Kubernetes</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </a>
            <button
              onClick={dismiss}
              className="p-1.5 ml-4 text-slate-600 hover:text-slate-300 transition-colors rounded-md hover:bg-white/[0.05]"
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
