import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-64x64.png', 'apple-touch-icon.png', 'logo.svg'],
      manifest: {
        name: 'StageComplete - Plateforme de Booking',
        short_name: 'StageComplete',
        description: 'Plateforme de booking pour artistes et venues - Réservez des concerts, spectacles et événements culturels',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon'
          }
        ],
        categories: ['entertainment', 'music', 'business'],
        screenshots: []
      },
      workbox: {
        // Cache des assets statiques
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Stratégies de cache
        runtimeCaching: [
          // Fonts Google
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },

          // Images (Cloudinary, etc.)
          {
            urlPattern: /^https:\/\/.*\.(cloudinary\.com|unsplash\.com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },

          // API endpoints - Profils artistes
          {
            urlPattern: /\/api\/artists\/[^\/]+$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-artists-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 10 // 10 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 5
            }
          },

          // API endpoints - Events/Bookings
          {
            urlPattern: /\/api\/(events|bookings)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-events-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 5
            }
          },

          // API endpoints - Messages
          {
            urlPattern: /\/api\/messages/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-messages-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 2 // 2 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 3
            }
          },

          // API auth
          {
            urlPattern: /\/api\/auth/,
            handler: 'NetworkOnly' // Jamais de cache pour l'auth
          },

          // Pages HTML - Dashboard, Profil, Calendrier
          {
            urlPattern: /\/(dashboard|profile|calendar|messages|bookings)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 30 // 30 minutes
              }
            }
          }
        ],

        // Page offline de fallback - seulement pour vraies 404
        // Ne PAS intercepter les routes React Router (/, /home, /login, etc.)
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/$/, /^\/home/, /^\/login/, /^\/register/, /^\/artist\//, /^\/venue\//, /^\/directory/, /^\/artistes/]
      },

      devOptions: {
        enabled: false, // Désactivé en dev pour éviter problèmes de cache/routing
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Désactive le découpage en chunks pour éviter les problèmes de production
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
