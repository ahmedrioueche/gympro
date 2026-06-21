/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const actocoreRoot = fileURLToPath(new URL("../../actocore", import.meta.url));
const gymproClientRoot = path.resolve(appRoot, "packages/client/src/index.ts");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ahmedrioueche/gympro-client": gymproClientRoot,
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // actocore-shared is CJS; pre-bundle so named exports (sessionsApi, etc.) work when linked locally
    include: ["@ahmedrioueche/actocore-shared", "@ahmedrioueche/actocore-sdk"],
  },
  server: {
    host: true, // Listen on all addresses
    allowedHosts: [
      ".ngrok-free.app", // Allow all ngrok domains
      ".ngrok.io", // Old ngrok domains
    ],
    port: 5173,
    fs: {
      allow: [appRoot, actocoreRoot],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
