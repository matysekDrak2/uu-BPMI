import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
    include: ['src/__tests__/**/*.{js,jsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
