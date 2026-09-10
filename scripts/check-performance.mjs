import assert from 'node:assert/strict';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDirectory = path.join(projectRoot, 'dist', 'assets');
const budgets = {
  '.css': 200 * 1024,
  '.js': 750 * 1024,
};

const assetNames = await readdir(assetsDirectory);
const totals = { '.css': 0, '.js': 0 };

for (const assetName of assetNames) {
  const extension = path.extname(assetName);
  if (!(extension in totals)) continue;
  const asset = await stat(path.join(assetsDirectory, assetName));
  totals[extension] += asset.size;
}

for (const [extension, budget] of Object.entries(budgets)) {
  assert.ok(totals[extension] > 0, `No ${extension} production assets were found.`);
  assert.ok(
    totals[extension] <= budget,
    `${extension} assets use ${totals[extension]} bytes; budget is ${budget} bytes.`,
  );
}

console.log(`Production asset budgets passed: JS ${(totals['.js'] / 1024).toFixed(1)} KiB, CSS ${(totals['.css'] / 1024).toFixed(1)} KiB.`);
