import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => ({
  // GitHub Pages uses the repository subpath.
  // Vercel and local development use the root path.
  base:
    process.env.GITHUB_PAGES === 'true'
      ? '/DSA-hub/'
      : '/',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
  host: '0.0.0.0',
  port: 3000,
  strictPort: true,

  // Preserve AI Studio HMR settings.
  hmr: process.env.DISABLE_HMR !== 'true',
  watch: process.env.DISABLE_HMR === 'true' ? null : {},
},
}));