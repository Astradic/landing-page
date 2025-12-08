import { defineConfig } from "astro/config";

export default defineConfig({
  srcDir: "src",
  outDir: "docs",
  base: "./",
  build: {
    assetsPrefix: "./",
  },
});
