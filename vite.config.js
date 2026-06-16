import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
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