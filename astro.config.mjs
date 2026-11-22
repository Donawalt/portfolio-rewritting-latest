import { defineConfig } from 'astro/config';

// Add React support
import react from '@astrojs/react';

//
import path from "path";
import { fileURLToPath } from 'url';
import sitemap from "@astrojs/sitemap";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathSrc = path.resolve(__dirname, "./src").replace(/\\/g, "/");


// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap({
    lastmod: new Date(),
    changefreq: "weekly",
    priority: 0.7,
  })],
  vite: {
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirname, "src")}/`
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Only inject declarations that emit no CSS. Injecting a global
          // stylesheet here duplicated every @font-face rule into every CSS
          // module and made Sass re-parse the whole style system for each file.
          additionalData: `@import "${pathSrc}/assets/styles/variables.scss";\n@import "${pathSrc}/assets/styles/mixins.scss";`
        }
      }
    }
  },
  site: 'https://www.donaelwalter.com'
});