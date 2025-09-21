import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Augmente la limite avant warning (temporaire)
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Division intelligente des chunks
        manualChunks: (id) => {
          // Vendor chunks pour les librairies tierces
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI libraries
            if (id.includes('framer-motion') || id.includes('@heroicons') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Autres librairies
            if (id.includes('zustand') || id.includes('axios')) {
              return 'utils-vendor';
            }
            // Toutes les autres dépendances
            return 'vendor';
          }

          // Feature chunks basés sur les chemins
          if (id.includes('/pages/artist/') || id.includes('/components/artist/')) {
            return 'artist-features';
          }
          if (id.includes('/pages/public/') || id.includes('/components/public/')) {
            return 'public-features';
          }
          if (id.includes('/pages/auth/') || id.includes('/components/auth/')) {
            return 'auth-features';
          }
          if (id.includes('/pages/dashboard/')) {
            return 'dashboard-features';
          }
        }
      }
    }
  }
});
