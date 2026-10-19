import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

/* Unknown routes must answer HTTP 404, not 200. vercel.json only rewrites the
   real routes to index.html, so anything else misses the filesystem and Vercel
   serves dist/404.html with a 404 status. That file is the same SPA shell, so
   the router renders PageNotFound for it. Security scanners and search engines
   both read the status code, not the page text. */
function spa404() {
  return {
    name: 'spa-404',
    apply: 'build',
    closeBundle() {
      const out = path.resolve(__dirname, 'dist')
      fs.copyFileSync(path.join(out, 'index.html'), path.join(out, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    spa404(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // No source maps in the public build.
    sourcemap: false,
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
