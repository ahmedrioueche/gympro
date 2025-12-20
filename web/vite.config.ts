import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    allowedHosts: [
      ".ngrok-free.app", // Allow all ngrok domains
      ".ngrok.io", // Old ngrok domains
    ],
    // Optional: specify port
    port: 5173,
  },
});
