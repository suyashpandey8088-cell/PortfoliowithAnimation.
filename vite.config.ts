import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// `base: './'` keeps asset URLs relative so the build works on Vercel,
// on a bare static host, and in a local preview without extra config.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Keep the animation engine in its own chunk so the shell paints first.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
