import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ExpressGo Bus Booking',
        short_name: 'ExpressGo',
        description: 'Ethiopia\'s Premium Bus Service',
        theme_color: '#f59e0b',
        background_color: '#0a0a0c',
        display: "standalone"
      }
    }),
  ],
  server: {
    fs: {
      strict: false,
    },
  },
});
