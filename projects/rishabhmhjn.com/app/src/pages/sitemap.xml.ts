import { getCollection } from 'astro:content';
import { postPath, slugifyTag, sortPosts } from '../lib/posts';

export async function GET({ site }: { site: URL }) {
  const posts = sortPosts(await getCollection('posts'));
  const tagPaths = [
    ...new Set(
      posts.flatMap((post) =>
        post.data.tags.map((tag) => `/blog/tags/${slugifyTag(tag)}/`),
      ),
    ),
  ];
  const paths = ['/', '/blog/', ...posts.map(postPath), ...tagPaths];
  const urls = paths
    .map((path) => `<url><loc>${new URL(path, site)}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
}
