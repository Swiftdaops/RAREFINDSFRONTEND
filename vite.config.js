import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Development proxy to avoid cross-origin cookie issues between Vite (5173)
  // and the owner backend (5001). This makes requests to `/api/owner` go
  // to the backend while keeping the browser origin as the Vite server.
  server: {
    // serve on 5174 to match the browser origin used in development
    port: 5174,
    host: true,
    hmr: {
      port: 5174,
    },
    proxy: {
      '/api/owner': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

})
