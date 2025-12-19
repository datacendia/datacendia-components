import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    // Security headers for development
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  build: {
    // Use esbuild for minification (faster, built-in)
    minify: 'esbuild',
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React ecosystem
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // Large visualization libraries
          if (id.includes('node_modules/cytoscape')) {
            return 'cytoscape';
          }
          // Icons library
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
        },
      },
    },
    // Increase chunk size warning limit (we're code-splitting now)
    chunkSizeWarningLimit: 500,
    // Source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize deps for faster cold starts
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'clsx'],
  },
})
