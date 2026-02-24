import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://astradic.org",
  srcDir: "src",
  outDir: "docs",
  base: "/",
  build: {
    assets: "assets",
  },
  integrations: [sitemap()],
});
