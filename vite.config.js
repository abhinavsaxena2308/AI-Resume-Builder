import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000, // Using port 3000 to avoid permission issues
    host: 'localhost', // Explicitly use localhost (resolves to IPv4 on Windows)
    strictPort: false, // Allow Vite to try next available port if 3000 is taken
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/index.css";`,
      },
    },
  },
});
