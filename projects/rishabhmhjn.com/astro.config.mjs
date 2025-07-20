import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

// https://astro.build/config
export default defineConfig({
  srcDir: 'app/src',
  publicDir: 'app/public',
  outDir: '../../dist/projects/rishabhmhjn.com',
  site: 'https://rishabhmhjn.com',
  integrations: [
    starlight({
      plugins: [starlightBlog()],
      title: 'rishabhmhjn',
      logo: { src: './app/src/assets/logo.png' },
      tagline:
        'Startups, Tech, SAAS, Amritsar – Tokyo – Prague – Singapore, Social Media, Tourism',
      description:
        'Startups, Tech, SAAS, Amritsar – Tokyo – Prague – Singapore, Social Media, Tourism',
      social: [
        {
          icon: 'x.com',
          label: 'X',
          href: 'https://twitter.com/rishabhmhjn',
        },
        {
          icon: 'instagram',
          label: 'Instagram',
          href: 'https://www.instagram.com/rishabhmhjn/',
        },
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/rishabhmhjn',
        },
      ],
    }),
  ],
});
