import { getCollection } from 'astro:content';
import { excerpt, postPath, sortPosts, withBase } from '../lib/posts';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });

export async function GET({ site }: { site: URL }) {
  const posts = sortPosts(await getCollection('posts'));
  const homeUrl = new URL(withBase(), site);
  const items = posts
    .map((post) => {
      const url = new URL(postPath(post), site);
      return `<item>
        <title>${escapeXml(post.data.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${post.data.date.toUTCString()}</pubDate>
        <description>${escapeXml(excerpt(post.data.description, 500))}</description>
      </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Rishabh Mahajan</title>
    <link>${homeUrl}</link>
    <description>Writing about Statusbrew, software businesses, technology, and Amritsar.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
