import { defineConfig } from 'astro/config';

import { legacyBlogRedirects } from './legacy-blog-redirects.mjs';

// https://astro.build/config
export default defineConfig({
  srcDir: 'app/src',
  publicDir: 'app/public',
  outDir: '../../dist/projects/rishabhmhjn.com',
  site: 'https://rishabhmhjn.com',
  redirects: legacyBlogRedirects,
});
