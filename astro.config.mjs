// @ts-check
import { defineConfig } from 'astro/config';

// Static output only. All server logic lives in Cloudflare Pages Functions under /functions.
export default defineConfig({
  site: 'https://sitmollysit.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
});
