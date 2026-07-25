import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const featuredPostIds = [
  'ai-has-democratized-the-how',
  'amritsar-startup-manifesto',
  'million-dollar-startups-from-tier-2-indian-cities',
];

export function sortPosts(posts: Post[]) {
  return [...posts]
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postPath(post: Post) {
  return `/blog/${post.id}/`;
}

export function excerpt(description: string, length = 220) {
  const normalized = description
    .replace(/\s*\[…\]\s*$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length <= length) {
    return normalized;
  }

  const shortened = normalized.slice(0, length + 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace)}…`;
}

export function readingTime(body: string) {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_[\]()`-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
