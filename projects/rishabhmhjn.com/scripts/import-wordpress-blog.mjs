import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'app/src/content/docs/blog');
const assetsDir = path.join(outputDir, 'assets');
const reportPath = path.join(projectRoot, 'blog-migration-report.json');
const wordpressApiBase = 'https://rishabhmhjn.com/wp-json/wp/v2';
const siteOrigin = 'https://rishabhmhjn.com';

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(assetsDir, { recursive: true });

  const posts = await fetchJson(`${wordpressApiBase}/posts?per_page=100&_embed`);
  const postSlugs = new Set(posts.map((post) => post.slug));
  const report = [];

  for (const post of posts) {
    const assetState = { index: 0, downloads: [] };
    const markdown = await renderPost(post, postSlugs, assetState);
    const filePath = path.join(outputDir, `${post.slug}.md`);

    await fs.writeFile(filePath, markdown);

    report.push({
      slug: post.slug,
      title: decodeHtml(post.title.rendered),
      date: post.date.slice(0, 10),
      output: path.relative(projectRoot, filePath),
      assets: assetState.downloads,
    });
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(`Imported ${posts.length} posts into ${path.relative(projectRoot, outputDir)}`);
}

async function renderPost(post, postSlugs, assetState) {
  const dom = new JSDOM(`<body>${post.content.rendered}</body>`);
  const { document } = dom.window;
  normalizeWordPressBlocks(document);

  const tags = extractTags(post);
  const description = buildDescription(post, document);
  const blocks = [];

  for (const node of [...document.body.childNodes]) {
    const block = await renderBlock(node, {
      document,
      post,
      postSlugs,
      assetState,
    });

    if (block) {
      blocks.push(block.trimEnd());
    }
  }

  const body = blocks.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();

  return [
    '---',
    `title: ${JSON.stringify(decodeHtml(post.title.rendered))}`,
    `date: ${post.date.slice(0, 10)}`,
    `description: ${JSON.stringify(description)}`,
    `tags: [${tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
    '---',
    '',
    body,
    '',
  ].join('\n');
}

function normalizeWordPressBlocks(document) {
  for (const block of document.querySelectorAll('.wp-block-kevinbatdorf-code-block-pro')) {
    const copyButton = block.querySelector('[data-code]');
    const code = copyButton?.getAttribute('data-code') ?? block.querySelector('code')?.textContent ?? '';
    const pre = document.createElement('pre');
    const codeElement = document.createElement('code');
    codeElement.textContent = code.replace(/^\$ /gm, '$ ');
    pre.append(codeElement);
    block.replaceWith(pre);
  }

  for (const node of document.querySelectorAll('script, style, noscript')) {
    node.remove();
  }
}

async function renderBlock(node, context) {
  if (node.nodeType === node.TEXT_NODE) {
    const text = normalizeText(node.textContent);
    return text ? text : '';
  }

  if (node.nodeType !== node.ELEMENT_NODE) {
    return '';
  }

  const tag = node.tagName.toLowerCase();

  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1]);
    const text = cleanupInlineMarkdown(renderInline(node, context));
    return text ? `${'#'.repeat(level)} ${text}` : '';
  }

  if (tag === 'p') {
    return cleanupInlineMarkdown(renderInline(node, context));
  }

  if (tag === 'pre') {
    const codeText = node.textContent?.replace(/\u00a0/g, ' ').trimEnd() ?? '';
    return ['```', codeText, '```'].join('\n');
  }

  if (tag === 'blockquote') {
    const content = await renderChildren(node, context);
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.map((line) => `> ${line}`).join('\n');
  }

  if (tag === 'ul' || tag === 'ol') {
    return await renderList(node, context, 0);
  }

  if (tag === 'figure') {
    return await renderFigure(node, context);
  }

  if (tag === 'hr') {
    return '---';
  }

  if (tag === 'div' || tag === 'section' || tag === 'article') {
    return await renderChildren(node, context);
  }

  if (tag === 'img') {
    return await renderImage(node, context);
  }

  if (tag === 'iframe') {
    const src = node.getAttribute('src');
    return src ? `[Embedded content](${src})` : '';
  }

  return await renderChildren(node, context);
}

async function renderChildren(node, context) {
  const parts = [];

  for (const child of [...node.childNodes]) {
    const rendered = await renderBlock(child, context);
    if (rendered) {
      parts.push(rendered);
    }
  }

  return parts.join('\n\n').trim();
}

async function renderList(listNode, context, depth) {
  const isOrdered = listNode.tagName.toLowerCase() === 'ol';
  const items = [];
  let index = 1;

  for (const item of [...listNode.children].filter((child) => child.tagName?.toLowerCase() === 'li')) {
    const marker = isOrdered ? `${index}. ` : '- ';
    const indent = '  '.repeat(depth);
    const childParts = [];

    for (const child of [...item.childNodes]) {
      if (child.nodeType === child.ELEMENT_NODE && ['ul', 'ol'].includes(child.tagName.toLowerCase())) {
        const nested = await renderList(child, context, depth + 1);
        if (nested) {
          childParts.push(`\n${nested}`);
        }
        continue;
      }

      if (child.nodeType === child.ELEMENT_NODE && child.tagName.toLowerCase() === 'p') {
        const text = cleanupInlineMarkdown(renderInline(child, context));
        if (text) {
          childParts.push(text);
        }
        continue;
      }

      if (child.nodeType === child.TEXT_NODE) {
        const text = normalizeText(child.textContent);
        if (text) {
          childParts.push(text);
        }
        continue;
      }

      if (child.nodeType === child.ELEMENT_NODE) {
        const block = await renderBlock(child, context);
        if (block) {
          childParts.push(block);
        }
      }
    }

    const content = childParts.join('\n').trim();
    if (content) {
      const [firstLine, ...rest] = content.split('\n');
      const entry = [`${indent}${marker}${firstLine}`];
      for (const line of rest) {
        entry.push(`${indent}  ${line}`);
      }
      items.push(entry.join('\n'));
      index += 1;
    }
  }

  return items.join('\n');
}

async function renderFigure(node, context) {
  const image = node.querySelector('img');
  if (image) {
    const imageMarkdown = await renderImage(image, context);
    const caption = normalizeText(node.querySelector('figcaption')?.textContent ?? '');
    return caption ? `${imageMarkdown}\n\n_${caption}_` : imageMarkdown;
  }

  return await renderChildren(node, context);
}

async function renderImage(node, context) {
  const sources = pickImageSources(node);
  if (sources.length === 0) {
    return '';
  }

  const alt = normalizeText(node.getAttribute('alt') || node.getAttribute('data-image-title') || '');
  try {
    const localPath = await downloadAsset(sources, context.post, context.assetState);
    return `![${escapeMarkdownText(alt)}](./assets/${path.basename(localPath)})`;
  } catch {
    return `![${escapeMarkdownText(alt)}](${sources[0]})`;
  }
}

function renderInline(node, context) {
  if (node.nodeType === node.TEXT_NODE) {
    return collapseWhitespace(node.textContent);
  }

  if (node.nodeType !== node.ELEMENT_NODE) {
    return '';
  }

  const tag = node.tagName.toLowerCase();
  const children = [...node.childNodes].map((child) => renderInline(child, context)).join('');

  if (tag === 'br') {
    return '\n';
  }

  if (tag === 'code') {
    const text = node.textContent?.replace(/\u00a0/g, ' ') ?? '';
    return text ? `\`${text}\`` : '';
  }

  if (tag === 'strong' || tag === 'b') {
    return children ? `**${children.trim()}**` : '';
  }

  if (tag === 'em' || tag === 'i') {
    return children ? `*${children.trim()}*` : '';
  }

  if (tag === 'a') {
    const href = normalizeHref(node.getAttribute('href') ?? '', context.postSlugs);
    const label = children.trim() || href;
    return href ? `[${label}](${href})` : label;
  }

  if (tag === 'span' || tag === 'mark' || tag === 'small' || tag === 'sup' || tag === 'sub') {
    return children;
  }

  return children;
}

function normalizeHref(href, postSlugs) {
  if (!href) {
    return '';
  }

  try {
    const url = new URL(href, siteOrigin);
    if (url.origin === siteOrigin) {
      const slug = url.pathname.replace(/^\/|\/$/g, '');
      if (url.pathname.startsWith('/tag/')) {
        const tagSlug = slug.replace(/^tag\//, '');
        return `/blog/tags/${tagSlug}/`;
      }
      if (postSlugs.has(slug)) {
        return `/blog/${slug}/`;
      }
    }
    return url.toString();
  } catch {
    return href;
  }
}

function extractTags(post) {
  const embeddedTerms = post._embedded?.['wp:term'] ?? [];
  const tags = embeddedTerms
    .flat()
    .filter((term) => term.taxonomy === 'post_tag')
    .map((term) => decodeHtml(term.name).trim())
    .filter(Boolean);

  return [...new Set(tags)];
}

function buildDescription(post, document) {
  const excerpt = stripHtml(post.excerpt.rendered);
  if (excerpt) {
    return excerpt;
  }

  const firstParagraph = stripHtml(document.querySelector('p')?.innerHTML ?? '');
  return firstParagraph.slice(0, 180);
}

function stripHtml(value) {
  return normalizeText(decodeHtml(value.replace(/<[^>]+>/g, ' ')));
}

function decodeHtml(value) {
  const dom = new JSDOM(`<!doctype html><body>${value}</body>`);
  return dom.window.document.body.textContent ?? '';
}

function normalizeText(value, options = {}) {
  const text = collapseWhitespace(value).trim();

  if (!text) {
    return '';
  }

  return options.preserveLeadingSpace ? text : text;
}

function collapseWhitespace(value) {
  return decodeHtml(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ');
}

function cleanupInlineMarkdown(value) {
  return value
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function escapeMarkdownText(value) {
  return value.replace(/[[\]\\]/g, '\\$&');
}

function pickImageSources(node) {
  const candidates = [
    node.getAttribute('data-orig-file'),
    node.getAttribute('data-large-file'),
    node.getAttribute('src'),
  ].filter(Boolean);

  const sources = [];

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate, siteOrigin);
      sources.push(url.toString());

      const stripped = new URL(url.toString());
      stripped.search = '';
      stripped.hash = '';
      sources.push(stripped.toString());
    } catch {
      continue;
    }
  }

  return [...new Set(sources)];
}

async function downloadAsset(urls, post, assetState) {
  assetState.index += 1;
  const parsedUrl = new URL(urls[0]);
  const extension = path.extname(parsedUrl.pathname) || '.jpg';
  const fileName = `${post.date.slice(0, 10)}-${post.slug}-${String(assetState.index).padStart(2, '0')}${extension}`;
  const filePath = path.join(assetsDir, fileName);

  try {
    await fs.access(filePath);
    assetState.downloads.push(path.relative(projectRoot, filePath));
    return filePath;
  } catch {
    for (const url of urls) {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      assetState.downloads.push(path.relative(projectRoot, filePath));
      return filePath;
    }

    throw new Error(`Failed to download asset for ${post.slug}: ${urls.join(', ')}`);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return response.json();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
