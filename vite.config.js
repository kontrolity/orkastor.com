import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split big, stable libraries into their own long-cached chunks so the
    // app shell downloads fast and repeat visits are near-instant.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          /* ⚠ The 'motion': ['framer-motion'] chunk was removed. Nothing in
             the routed tree imports framer-motion any more — the nav's two
             AnimatePresence blocks are CSS now — so naming it here produced a
             1 kB stub chunk that every page still had to request. A manual
             chunk for an unused dependency is a round trip for nothing.

             framer-motion is still a package.json dependency because the
             unrouted components/landing/* tree imports it; it is tree-shaken
             out of the build. */
        },
      },
    },
  },
})
