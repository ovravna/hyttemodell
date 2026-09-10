import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project page lives at https://ovravna.github.io/hyttemodell/
export default defineConfig({
  base: "/hyttemodell/",
  plugins: [react()],
  build: {
    // the component inlines large base64 images; keep them out of the JS chunk warning
    chunkSizeWarningLimit: 2000,
  },
});
