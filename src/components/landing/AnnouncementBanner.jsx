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
          className="fixed left-0 right-0 z-[60] h-12 flex items-center overflow-hidden"
          style={{
            top: 0,
            background: 'rgba(8,8,12,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Bottom seam */}
          <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.30) 20%, rgba(255,255,255,0.45) 50%, rgba(125,211,252,0.30) 80%, transparent 100%)' }}
          />
          <div className="flex items-center justify-between w-full px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
            <a
              href="https://kubegraf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <span
                className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: '#FFFFFF',
                  color: '#000',
                }}
              >
                New
              </span>
              <span>OrkaAI + KubēGraf — AI-powered infrastructure intelligence is here</span>
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
