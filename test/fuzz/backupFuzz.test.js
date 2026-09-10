import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadActivities,
  loadProjects,
  loadTasks,
  parseBoardBackup,
  saveActivities,
  saveProjects,
  saveTasks,
} from '../../src/utils/storage.js';

const FUZZ_SEED = 0x1badb002;

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function mutate(random, source) {
  const characters = [...source];
  const edits = 1 + Math.floor(random() * 8);
  const replacements = ['{', '}', '[', ']', '"', ':', ',', '\\', '\u0000', '9', 'x'];

  for (let edit = 0; edit < edits; edit += 1) {
    const position = Math.floor(random() * Math.max(1, characters.length));
    const operation = Math.floor(random() * 3);
    if (operation === 0 && characters.length > 0) characters.splice(position, 1);
    if (operation === 1) characters.splice(position, 0, replacements[Math.floor(random() * replacements.length)]);
    if (operation === 2 && characters.length > 0) characters[position] = replacements[Math.floor(random() * replacements.length)];
  }

  return characters.join('');
}

test('backup parser handles deterministic malformed-input fuzzing without hanging', () => {
  const random = randomGenerator(FUZZ_SEED);
  const validBackup = JSON.stringify({
    version: 1,
    projects: [{ id: 'p', name: 'Project' }],
    activities: [{ id: 'a', projectId: 'p', name: 'Activity' }],
    tasks: [{ id: 't', projectId: 'p', activityId: 'a', title: 'Task' }],
  });

  for (let iteration = 0; iteration < 750; iteration += 1) {
    const candidate = mutate(random, validBackup);
    try {
      const board = parseBoardBackup(candidate);
      assert.ok(Array.isArray(board.projects));
      assert.ok(Array.isArray(board.activities));
      assert.ok(Array.isArray(board.tasks));
    } catch (error) {
      assert.ok(error instanceof Error);
    }
  }
});

test('backup parser rejects non-object roots and unsupported versions', () => {
  for (const candidate of ['null', '[]', 'true', '"text"', '42']) {
    assert.throws(() => parseBoardBackup(candidate), /Backup must be a JSON object/);
  }

  assert.throws(
    () => parseBoardBackup('{"version":999,"projects":[],"activities":[],"tasks":[]}'),
    /Unsupported backup version: 999/,
  );
});

test('storage failures return safe fallbacks and explicit failed writes', () => {
  global.window = {
    localStorage: {
      getItem() {
        throw new Error('storage unavailable');
      },
      setItem() {
        throw new Error('quota exceeded');
      },
    },
  };

  assert.ok(loadProjects().length > 0);
  assert.ok(loadActivities().length > 0);
  assert.ok(loadTasks().length > 0);
  assert.equal(saveProjects([]), false);
  assert.equal(saveActivities([]), false);
  assert.equal(saveTasks([]), false);
});
