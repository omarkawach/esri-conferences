// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            tag.startsWith("arcgis-") || tag.startsWith("calcite-"),
        },
      },
    }),
    react(),
  ],
});
