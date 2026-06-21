/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const actocoreRoot = fileURLToPath(new URL("../../actocore", import.meta.url));
const gymproClientRoot = path.resolve(appRoot, "packages/client/src/index.ts");

const actocoreSharedSrc = path.resolve(
  actocoreRoot,
  "packages/shared/src/index.ts",
);
const hasLocalActocore = fs.existsSync(actocoreSharedSrc);

const resolveAlias: Record<string, string> = {
  "@ahmedrioueche/gympro-client": gymproClientRoot,
};

if (hasLocalActocore) {
  // npm-linked actocore packages ship CJS dist; compile TS sources so Rollup sees ESM named exports.
  resolveAlias["@ahmedrioueche/actocore-shared/types"] = path.resolve(
    actocoreRoot,
    "packages/shared/src/types/index.ts",
  );
  resolveAlias["@ahmedrioueche/actocore-shared"] = actocoreSharedSrc;
  resolveAlias["@ahmedrioueche/actocore-sdk/styles.css"] = path.resolve(
    actocoreRoot,
    "packages/sdk/dist/styles/styles.css",
  );
  resolveAlias["@ahmedrioueche/actocore-sdk"] = path.resolve(
    actocoreRoot,
    "packages/sdk/src/index.ts",
  );
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: resolveAlias,
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // actocore-shared is CJS; pre-bundle so named exports (sessionsApi, etc.) work when linked locally
    include: [
      "reflect-metadata",
      "@ahmedrioueche/actocore-shared",
      "@ahmedrioueche/actocore-sdk",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /actocore\/packages/],
      transformMixedEsModules: true,
    },
  },
  server: {
    host: true, // Listen on all addresses
    allowedHosts: [
      ".ngrok-free.app", // Allow all ngrok domains
      ".ngrok.io", // Old ngrok domains
    ],
    port: 5173,
    fs: {
      allow: hasLocalActocore ? [appRoot, actocoreRoot] : [appRoot],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
