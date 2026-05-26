import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@boomerang/content': path.resolve(__dirname, '../../packages/content/src/index.ts'),
      '@boomerang/netcode': path.resolve(__dirname, '../../packages/netcode/src/index.ts'),
      '@boomerang/game-core': path.resolve(__dirname, '../../packages/game-core/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ['phaser', 'matter-js', 'howler'],
  },
});
