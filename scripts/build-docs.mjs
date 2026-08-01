import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { docsPages, docsSections, docsSite, pageUrl } from '../docs/site/docs.config.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'public', 'docs');
const pageBySource = new Map(docsPages.map((page) => [normalizePath(page.source), page]));

function normalizePath(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'section';
}

function textFromInline(token) {
  if (!token?.children) return token?.content || '';
  return token.children.map((child) => child.content || '').join('');
}

function resolveLink(href, source) {
  if (!href || /^(?:[a-z]+:|#|\/)/i.test(href)) return href;

  const [targetPath, fragment = ''] = href.split('#');
  const sourceDirectory = path.posix.dirname(normalizePath(source));
  const resolved = normalizePath(path.posix.normalize(path.posix.join(sourceDirectory, targetPath)));
  const targetPage = pageBySource.get(resolved);

  if (!targetPage) return href;
  return `${pageUrl(targetPage)}${fragment ? `#${fragment}` : ''}`;
}

function createMarkdownRenderer(source) {
  const headings = [];
  const headingIds = new Map();
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

  md.renderer.rules.heading_open = (tokens, index) => {
    const level = Number(tokens[index].tag.slice(1));
    const title = textFromInline(tokens[index + 1]);
    const baseId = slugify(title);
    const count = headingIds.get(baseId) || 0;
    headingIds.set(baseId, count + 1);
    const id = count ? `${baseId}-${count + 1}` : baseId;
    tokens[index].attrSet('id', id);
    if (level === 2 || level === 3) headings.push({ level, title, id });
    return `<${tokens[index].tag} id="${id}">`;
  };

  const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, index, options, environment, self) => self.renderToken(tokens, index, options));
  md.renderer.rules.link_open = (tokens, index, options, environment, self) => {
    const href = tokens[index].attrGet('href');
    const resolved = resolveLink(href, source);
    tokens[index].attrSet('href', resolved);
    if (/^https?:\/\//i.test(resolved)) {
      tokens[index].attrSet('rel', 'noreferrer');
    }
    return defaultLinkOpen(tokens, index, options, environment, self);
  };

  return { md, headings };
}

function renderSidebar(currentPage) {
  return docsSections.map((section) => `
    <section class="nav-section">
      <h2>${escapeHtml(section.title)}</h2>
      <ul>
        ${section.pages.map((page) => {
          const current = page.source === currentPage.source;
          return `<li><a href="${pageUrl(page)}"${current ? ' class="current" aria-current="page"' : ''}>${escapeHtml(page.label)}</a></li>`;
        }).join('')}
      </ul>
    </section>`).join('');
}

function renderTableOfContents(headings) {
  if (!headings.length) return '<p class="toc-empty">No subsections</p>';
  return `<ol>${headings.map((heading) => (
    `<li class="toc-level-${heading.level}"><a href="#${heading.id}">${escapeHtml(heading.title)}</a></li>`
  )).join('')}</ol>`;
}

function renderPager(pageIndex) {
  const previous = docsPages[pageIndex - 1];
  const next = docsPages[pageIndex + 1];
  return `
    <nav class="page-pager" aria-label="Documentation pagination">
      ${previous ? `<a href="${pageUrl(previous)}"><span>Previous</span><strong>${escapeHtml(previous.label)}</strong></a>` : '<span></span>'}
      ${next ? `<a class="next" href="${pageUrl(next)}"><span>Next</span><strong>${escapeHtml(next.label)}</strong></a>` : '<span></span>'}
    </nav>`;
}

function pageTemplate({ content, headings, page, pageIndex, title }) {
  const description = `${page.section}: ${page.label} in the TaskPilot documentation.`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${docsSite.base}assets/docs.css" />
    <script>try{const t=localStorage.getItem('taskpilot-theme');document.documentElement.dataset.theme=t==='true'?'dark':t==='false'?'light':matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch{}</script>
    <title>${escapeHtml(title)} | TaskPilot Documentation</title>
  </head>
  <body data-docs-page="${escapeHtml(page.slug || 'home')}">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="docs-topbar">
      <div class="topbar-inner">
        <button class="menu-button" type="button" aria-controls="docs-sidebar" aria-expanded="false">Menu</button>
        <a class="docs-brand" href="${docsSite.base}" aria-label="TaskPilot documentation home">
          <img src="/taskpilot-mark.svg" alt="" width="36" height="36" />
          <span><strong>TaskPilot</strong><small>Documentation</small></span>
        </a>
        <nav class="top-links" aria-label="Documentation shortcuts">
          <a href="${docsSite.base}">Documentation</a>
          <a href="${docsSite.base}introduction/">Product</a>
          <a href="${docsSite.base}architecture/">Architecture</a>
          <a href="${docsSite.base}current-status/">Status</a>
        </nav>
        <div class="search-shell">
          <label class="visually-hidden" for="docs-search">Search documentation</label>
          <input id="docs-search" type="search" placeholder="Search docs" autocomplete="off" />
          <div id="search-results" class="search-results" hidden></div>
        </div>
        <button id="theme-toggle" class="theme-button" type="button">Theme</button>
        <a class="app-link app-link-desktop" href="/" target="_self">&larr; Back to app</a>
      </div>
    </header>
    <div class="docs-layout">
      <aside id="docs-sidebar" class="docs-sidebar" aria-label="Documentation navigation">
        <div class="sidebar-scroll">
          ${renderSidebar(page)}
        </div>
        <a class="app-link app-link-mobile" href="/" target="_self">&larr; Back to app</a>
      </aside>
      <button class="sidebar-backdrop" type="button" aria-label="Close documentation menu"></button>
      <main id="main-content" class="docs-content" tabindex="-1">
        <div class="page-context"><span>${escapeHtml(page.section)}</span><span aria-hidden="true">/</span><span>${escapeHtml(page.label)}</span></div>
        <article class="markdown-body">${content}</article>
        ${renderPager(pageIndex)}
      </main>
      <aside class="page-toc" aria-label="On this page">
        <h2>On this page</h2>
        ${renderTableOfContents(headings)}
      </aside>
    </div>
    <script src="${docsSite.base}assets/docs.js" defer></script>
  </body>
</html>`;
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(path.join(outputRoot, 'assets'), { recursive: true });
await cp(path.join(projectRoot, 'docs', 'site', 'docs.css'), path.join(outputRoot, 'assets', 'docs.css'));
await cp(path.join(projectRoot, 'docs', 'site', 'docs.js'), path.join(outputRoot, 'assets', 'docs.js'));

const searchIndex = [];

for (const [pageIndex, page] of docsPages.entries()) {
  const sourcePath = path.join(projectRoot, page.source);
  const markdown = await readFile(sourcePath, 'utf8');
  const { md, headings } = createMarkdownRenderer(page.source);
  const content = md.render(markdown);
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || page.label;
  const destination = page.slug ? path.join(outputRoot, page.slug) : outputRoot;
  await mkdir(destination, { recursive: true });
  await writeFile(path.join(destination, 'index.html'), pageTemplate({ content, headings, page, pageIndex, title }), 'utf8');

  searchIndex.push({
    title,
    label: page.label,
    section: page.section,
    url: pageUrl(page),
    text: content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  });
}

await writeFile(
  path.join(outputRoot, 'assets', 'search-index.json'),
  JSON.stringify(searchIndex),
  'utf8',
);

console.log(`Built ${docsPages.length} documentation pages in ${path.relative(projectRoot, outputRoot)}.`);
