import assert from 'node:assert/strict';
import { accessSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifactsDirectory = path.join(tmpdir(), 'taskpilot-app-check');

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

async function findInputByValue(page, expectedValue) {
  const inputs = page.locator('input');
  const count = await inputs.count();

  for (let index = 0; index < count; index += 1) {
    const input = inputs.nth(index);
    if (await input.inputValue() === expectedValue) return input;
  }

  throw new Error(`Could not find an input with value "${expectedValue}".`);
}

async function findRowByFirstInput(section, expectedValue) {
  const rows = section.locator('tbody tr');
  const count = await rows.count();

  for (let index = 0; index < count; index += 1) {
    const row = rows.nth(index);
    const firstInput = row.locator('input').first();
    if (await firstInput.count() && await firstInput.inputValue() === expectedValue) return row;
  }

  throw new Error(`Could not find a table row for "${expectedValue}".`);
}

const chromePath = findChrome();
assert.ok(chromePath, 'A local Chrome or Chromium installation is required.');

const port = await availablePort();
const origin = `http://127.0.0.1:${port}`;
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
  await waitForUrl(origin);
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  mkdirSync(artifactsDirectory, { recursive: true });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.getByRole('heading', { level: 1, name: 'Project workflow dashboard.' }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);

  await page.getByTitle('Administration').click();
  await page.getByRole('heading', { level: 1, name: 'Administration' }).waitFor();

  const projectsSection = page.locator('.admin-section').filter({
    has: page.getByRole('heading', { level: 2, name: 'Projects' }),
  });
  await projectsSection.getByRole('button', { name: 'New project' }).click();
  const projectName = await findInputByValue(page, 'New project');
  await projectName.fill('E2E Project');

  await page.locator('.toolbar').getByRole('button', { name: 'New activity' }).click();
  const activitiesSection = page.locator('.admin-section').filter({
    has: page.getByRole('heading', { level: 2, name: 'Activities' }),
  });
  const activityName = await findInputByValue(page, 'New activity');
  await activityName.fill('E2E Activity');

  await page.locator('.topbar').getByRole('button', { name: 'New task' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title').fill('E2E Completed Task');
  await dialog.getByLabel('Status').selectOption('done');
  await dialog.locator('.checklist input[type="checkbox"]').first().check();
  await dialog.getByText('Objective met', { exact: true }).waitFor();

  await page.waitForFunction(() => {
    const projects = JSON.parse(localStorage.getItem('taskpilot-projects-v1') || '[]');
    const activities = JSON.parse(localStorage.getItem('taskpilot-activities-v1') || '[]');
    const tasks = JSON.parse(localStorage.getItem('taskpilot-board-v3') || '[]');
    return projects.some((item) => item.name === 'E2E Project')
      && activities.some((item) => item.name === 'E2E Activity')
      && tasks.some((item) => item.title === 'E2E Completed Task' && item.column === 'done');
  });

  await dialog.getByTitle('Close').click();
  await page.getByTitle('Administration').click();
  await page.getByRole('heading', { level: 1, name: 'Administration' }).waitFor();
  const projectRow = await findRowByFirstInput(projectsSection, 'E2E Project');
  await projectRow.locator('select').first().selectOption('Paused');

  await page.getByTitle('Workspace').click();
  await page.getByRole('heading', { level: 1, name: 'Workspace' }).waitFor();
  const completedTask = page.locator('.task-card', { hasText: 'E2E Completed Task' });
  assert.equal(await completedTask.count(), 0);

  await page.getByLabel('Show paused/done').check();
  await completedTask.waitFor({ state: 'visible' });
  await page.screenshot({ path: path.join(artifactsDirectory, 'workspace-paused-visible.png'), fullPage: false });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.goto(origin, { waitUntil: 'networkidle' });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  await mobile.getByTitle('Open menu').click();
  await mobile.getByTitle('Administration').waitFor({ state: 'visible' });

  console.log('Application E2E checks passed for CRUD persistence, objective completion, archived visibility, and responsive navigation.');
  console.log(`Screenshots: ${artifactsDirectory}`);
} finally {
  await browser?.close();
  stopProcess(preview);
}
