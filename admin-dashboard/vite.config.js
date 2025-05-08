// filepath: c:\Users\Public\LUCID_TECHWRLD\shopibag\server\admin-dashboard\vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
      port: 4000
    }
});