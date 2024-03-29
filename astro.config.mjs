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
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirname, "src")}/`
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${pathSrc}/assets/styles/root.scss";`
        }
      }
    }
  },
  plugins: [
  // Import your global SCSS file here
  {
    name: 'import-global-scss',
    config() {
      return {
        resolve: {
          alias: {
            // Use an alias to import your global SCSS file
            'global-scss': path.resolve(__dirname, 'src/assets/styles/root.scss').replace(/\\/g, "/")
          }
        }
      };
    }
  }]
});