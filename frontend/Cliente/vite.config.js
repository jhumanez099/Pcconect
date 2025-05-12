// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // ✅ Para evitar que la superposición bloquee la vista
    },
  },
  resolve: {
    alias: {
      "@bootstrap-icons": "node_modules/bootstrap-icons/font/bootstrap-icons.css",
    },
  },
});
