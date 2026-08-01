import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseBoardBackup } from '../../src/utils/storage.js';

const fixtureUrl = new URL('../fixtures/board-backup-v1.json', import.meta.url);

test('a versioned JSON fixture imports with valid relationships', async () => {
  const backup = await readFile(fileURLToPath(fixtureUrl), 'utf8');
  const board = parseBoardBackup(backup);

  assert.equal(board.projects.length, 1);
  assert.equal(board.activities[0].projectId, board.projects[0].id);
  assert.equal(board.tasks[0].projectId, board.projects[0].id);
  assert.equal(board.tasks[0].activityId, board.activities[0].id);
  assert.equal(board.tasks[0].checklist[0].done, true);
});
