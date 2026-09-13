import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Project page lives at https://ovravna.github.io/hyttemodell/
export default defineConfig({
  base: "/hyttemodell/",
  plugins: [react()],
  build: {
    // the component inlines large base64 images; keep them out of the JS chunk warning
    chunkSizeWarningLimit: 2000,
    // two standalone pages rather than a router: each is a separate read,
    // and neither needs to know the other's state
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        hyttevalg: resolve(__dirname, "hyttevalg.html"),
      },
    },
  },
});
