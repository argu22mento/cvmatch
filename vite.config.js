import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Archivos estáticos que van tal cual a la web publicada (estructura plana, sin carpeta public/)
const STATIC_FILES = [
  'manifest.webmanifest',
  'sw.js',
  'favicon.svg',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
];

function copyStaticFiles() {
  let root = '';
  let outDir = '';
  return {
    name: 'copy-static-files',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      for (const file of STATIC_FILES) {
        const from = resolve(root, file);
        if (existsSync(from)) copyFileSync(from, resolve(outDir, file));
        else console.warn(`[copy-static-files] Falta ${file}`);
      }
    },
  };
}

export default defineConfig({
  publicDir: false,
  plugins: [react(), copyStaticFiles()],
});
