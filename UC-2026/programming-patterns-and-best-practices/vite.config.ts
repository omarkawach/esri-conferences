import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server: {
    open: false,
  },
  build: {
    outDir: "dist",
  },
});
