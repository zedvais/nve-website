// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * The canonical site URL is used for sitemap, canonical links and Open Graph tags.
 * Priority: PUBLIC_SITE_URL (set this once you have a custom domain)
 *        → the production URL Vercel exposes at build time
 *        → localhost for local development.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site =
  process.env.PUBLIC_SITE_URL ??
  (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:4321');

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
