import assert from 'node:assert/strict';
import { accessSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifactsDirectory = path.join(tmpdir(), 'taskpilot-docs-check');

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  return candidates.find((candidate) => {
    try {
      accessSync(candidate);
      return true;
    } catch {
      return false;
    }
  });
}

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForUrl(url) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Preview can take a moment to bind its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview did not become ready at ${url}`);
}

function stopProcess(processHandle) {
  if (!processHandle || processHandle.exitCode !== null) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(processHandle.pid), '/t', '/f'], { stdio: 'ignore' });
  } else {
    try {
      process.kill(-processHandle.pid, 'SIGTERM');
    } catch {
      processHandle.kill('SIGTERM');
    }
  }
}

const chromePath = findChrome();
assert.ok(chromePath, 'A local Chrome or Chromium installation is required.');

const port = await availablePort();
const origin = `http://127.0.0.1:${port}`;
const docsUrl = `${origin}/docs/`;
const previewCommand = process.platform === 'win32' ? 'cmd.exe' : 'npm';
const previewArguments = process.platform === 'win32'
  ? ['/d', '/s', '/c', `npm.cmd run preview -- --port ${port}`]
  : ['run', 'preview', '--', '--port', String(port)];
const preview = spawn(previewCommand, previewArguments, {
  cwd: projectRoot,
  detached: process.platform !== 'win32',
  stdio: ['ignore', 'pipe', 'pipe'],
});

let browser;

try {
  await waitForUrl(docsUrl);
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  mkdirSync(artifactsDirectory, { recursive: true });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(docsUrl, { waitUntil: 'networkidle' });
  await desktop.evaluate(() => localStorage.setItem('taskpilot-theme', 'false'));
  await desktop.reload({ waitUntil: 'networkidle' });

  await assert.doesNotReject(() => desktop.locator('h1').waitFor({ state: 'visible' }));
  await assert.doesNotReject(() => desktop.locator('#docs-sidebar').waitFor({ state: 'visible' }));
  assert.equal(await desktop.locator('#theme-toggle').textContent(), 'Dark mode');
  assert.equal(await desktop.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  assert.equal(await desktop.locator('a').evaluateAll((links) => links.some((link) => link.href.includes('/docs/docs/'))), false);

  const cssResponse = await desktop.request.get(`${origin}/docs/assets/docs.css`);
  const scriptResponse = await desktop.request.get(`${origin}/docs/assets/docs.js`);
  assert.equal(cssResponse.ok(), true);
  assert.equal(scriptResponse.ok(), true);

  await desktop.screenshot({ path: path.join(artifactsDirectory, 'desktop-light.png'), fullPage: true });
  await desktop.locator('#theme-toggle').click();
  assert.equal(await desktop.locator('html').getAttribute('data-theme'), 'dark');
  await desktop.screenshot({ path: path.join(artifactsDirectory, 'desktop-dark.png'), fullPage: true });

  await desktop.locator('#docs-search').fill('deployment');
  const deploymentResult = desktop.locator('#search-results a', { hasText: 'Deployment' }).first();
  await deploymentResult.waitFor({ state: 'visible' });
  await deploymentResult.click();
  await desktop.waitForURL('**/docs/deployment/');
  await assert.doesNotReject(() => desktop.getByRole('heading', { level: 1, name: 'Deployment' }).waitFor());

  await desktop.goto(`${origin}/docs/architecture/`, { waitUntil: 'networkidle' });
  await assert.doesNotReject(() => desktop.getByRole('heading', { level: 1, name: 'Architecture' }).waitFor());
  await desktop.locator('.app-link-desktop').click();
  await desktop.waitForURL(`${origin}/`);
  await assert.doesNotReject(() => desktop.locator('#root').waitFor({ state: 'attached' }));
  await assert.doesNotReject(() => desktop.locator('.theme-dark').waitFor({ state: 'attached' }));
  const appDocumentationLink = desktop.locator('a[title="Documentation"]');
  assert.equal(await appDocumentationLink.getAttribute('href'), '/docs/');
  await appDocumentationLink.click();
  await desktop.waitForURL(`${origin}/docs/`);
  await assert.doesNotReject(() => desktop.locator('.nav-section a.current').waitFor({ state: 'visible' }));

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.goto(docsUrl, { waitUntil: 'networkidle' });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  await mobile.locator('.menu-button').click();
  assert.equal(await mobile.locator('.menu-button').getAttribute('aria-expanded'), 'true');
  await assert.doesNotReject(() => mobile.locator('.app-link-mobile').waitFor({ state: 'visible' }));
  const mobileBackBox = await mobile.locator('.app-link-mobile').boundingBox();
  assert.ok(mobileBackBox && mobileBackBox.y >= 0 && mobileBackBox.y + mobileBackBox.height <= 844);
  await mobile.screenshot({ path: path.join(artifactsDirectory, 'mobile-menu.png'), fullPage: false });
  await mobile.locator('.app-link-mobile').click();
  await mobile.waitForURL(`${origin}/`);

  console.log(`Browser checks passed in Chrome at desktop and mobile sizes.`);
  console.log(`Screenshots: ${artifactsDirectory}`);
} finally {
  await browser?.close();
  stopProcess(preview);
}
