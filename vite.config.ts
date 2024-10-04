import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

const icons = [
  {
    "src": "pwa-64x64.png",
    "sizes": "64x64",
    "type": "image/png"
  },
  {
    "src": "pwa-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "pwa-512x512.png",
    "sizes": "512x512",
    "type": "image/png"
  },
  {
    "src": "maskable-icon-512x512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  }
]

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: false
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
