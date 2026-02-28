import { defineConfig } from "astro/config";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const simpleSitemap = ({ filename = "sitemap.xml" } = {}) => {
  let siteConfig;

  return {
    name: "astradic-simple-sitemap",
    hooks: {
      "astro:config:done": async ({ config }) => {
        siteConfig = config;
      },
      "astro:build:done": async ({ dir, pages, logger }) => {
        if (!siteConfig?.site) {
          logger.warn(
            "The custom sitemap integration requires the `site` astro.config option. Skipping."
          );
          return;
        }

        try {
          const outputDir = fileURLToPath(dir);
          const finalSiteUrl = new URL(siteConfig.base ?? "/", siteConfig.site);

          const pageUrls = Array.from(
            new Set(
              pages
                .map((page) => {
                  if (!page.pathname) return null;
                  const normalized = page.pathname.startsWith("/") ? page.pathname : `/${page.pathname}`;
                  return new URL(normalized, finalSiteUrl).href;
                })
                .filter(Boolean)
            )
          );

          if (pageUrls.length === 0) {
            logger.warn("No pages found! Sitemap not created.");
            return;
          }

          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${pageUrls
            .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
            .join("\n")}\n</urlset>\n`;

          const destPath = path.join(outputDir, filename);
          await writeFile(destPath, xml);

          logger.info(
            `\`${filename}\` created at \`${path.relative(process.cwd(), outputDir)}\``
          );
        } catch (error) {
          logger.error(`Error creating sitemap\n${error}`);
        }
      },
    },
  };
};

export default defineConfig({
  site: "https://astradic.org",
  srcDir: "src",
  outDir: "docs",
  base: "/",
  build: {
    assets: "assets",
  },
  integrations: [simpleSitemap()],
});
