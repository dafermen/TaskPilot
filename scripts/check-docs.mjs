import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsPages } from '../docs/site/docs.config.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(projectRoot, 'dist');
const docsRoot = path.join(distRoot, 'docs');
const errors = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(target));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
  }
  return files;
}

function localTarget(value, htmlFile) {
  const withoutFragment = value.split('#')[0].split('?')[0];
  if (!withoutFragment || /^(?:https?:|mailto:|tel:|data:)/i.test(withoutFragment)) return null;
  if (withoutFragment === '/') return path.join(distRoot, 'index.html');
  if (withoutFragment.startsWith('/')) {
    const relative = withoutFragment.slice(1);
    return withoutFragment.endsWith('/')
      ? path.join(distRoot, relative, 'index.html')
      : path.join(distRoot, relative);
  }
  const relative = path.resolve(path.dirname(htmlFile), withoutFragment);
  return withoutFragment.endsWith('/') ? path.join(relative, 'index.html') : relative;
}

if (!await exists(docsRoot)) errors.push('dist/docs does not exist.');

for (const page of docsPages) {
  const file = page.slug
    ? path.join(docsRoot, page.slug, 'index.html')
    : path.join(docsRoot, 'index.html');
  if (!await exists(file)) errors.push(`Missing generated page: ${path.relative(projectRoot, file)}`);
}

if (await exists(docsRoot)) {
  const htmlFiles = await collectHtml(docsRoot);
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    if (!html.includes('id="docs-sidebar"')) errors.push(`Missing sidebar in ${path.relative(projectRoot, htmlFile)}`);
    if (!html.includes('id="docs-search"')) errors.push(`Missing search in ${path.relative(projectRoot, htmlFile)}`);
    if (!html.includes('href="/" target="_self"')) errors.push(`Missing app return link in ${path.relative(projectRoot, htmlFile)}`);

    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const reference of references) {
      if (reference.includes('/docs/docs/')) {
        errors.push(`Duplicated docs route ${reference} in ${path.relative(projectRoot, htmlFile)}`);
      }
      const target = localTarget(reference, htmlFile);
      if (target && !await exists(target)) {
        errors.push(`Broken link ${reference} in ${path.relative(projectRoot, htmlFile)}`);
      }
    }
  }
}

for (const asset of ['docs/assets/docs.css', 'docs/assets/docs.js', 'docs/assets/search-index.json']) {
  if (!await exists(path.join(distRoot, asset))) errors.push(`Missing asset: dist/${asset}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Documentation checks passed for ${docsPages.length} pages.`);
}
