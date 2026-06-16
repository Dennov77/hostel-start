import { defineConfig } from 'vite';
import { resolve } from 'path';

function resolveBasePath() {
  const base = (process.env.VITE_BASE_PATH || './').trim();

  if (!base || base === './') {
    return './';
  }

  return base.endsWith('/') ? base : `${base}/`;
}

export default defineConfig({
  base: resolveBasePath(),
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tushinskaya: resolve(__dirname, 'tushinskaya.html'),
        saratovskaya: resolve(__dirname, 'saratovskaya.html'),
        goncharnaya: resolve(__dirname, 'goncharnaya.html'),
        derbenevskaya: resolve(__dirname, 'derbenevskaya.html')
      }
    }
  },
  server: {
    open: true
  }
});
