import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Keep this in sync with PORT in backend/.env
      '/api': {
        target: 'http://localhost:6000',
        changeOrigin: true,
      },
    },
  },
});
