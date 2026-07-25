import { withBase } from '../lib/posts';

export function GET({ site }: { site: URL }) {
  const sitemap = new URL(withBase('sitemap.xml'), site);
  const body = `User-agent: *
Allow: ${withBase()}

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
