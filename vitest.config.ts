import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', '.next', 'dist'],
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
