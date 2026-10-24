import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Browsers refuse to load `<script type="module">` over the file:// protocol
 * (module scripts are subject to CORS, and file:// has an opaque origin).
 * To make `dist/index.html` work when double-clicked, we:
 *   1. bundle everything into a single classic IIFE script (see build options), and
 *   2. rewrite the injected tags to plain deferred scripts without `crossorigin`.
 */
function fileProtocolCompat() {
  return {
    name: 'file-protocol-compat',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          .replace(/<script type="module" crossorigin/g, '<script defer')
          .replace(/<script type="module"/g, '<script defer')
          .replace(/(<link rel="stylesheet")\s+crossorigin/g, '$1');
      },
    },
  };
}

export default defineConfig({
  // Relative base so assets resolve from wherever index.html lives (incl. file://).
  base: './',
  plugins: [react(), fileProtocolCompat()],
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
  },
});
