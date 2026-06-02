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
    target: 'es2020',
    // Split big, rarely-changing vendor libs into their own long-cached
    // chunks so app updates don't bust the whole bundle for repeat visitors.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          return 'vendor';
        },
      },
    },
  },
})
