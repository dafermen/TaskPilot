import assert from 'node:assert/strict';
import test from 'node:test';
import { getChecklistProgress, isObjectiveMet } from '../../src/utils/taskStatus.js';

const completedChecklist = [
  { id: 'check-1', text: 'Plan', done: true },
  { id: 'check-2', text: 'Review', done: true },
];

test('isObjectiveMet requires a done task with every checklist item completed', () => {
  assert.equal(isObjectiveMet({
    column: 'done',
    blocked: false,
    checklist: completedChecklist,
  }), true);
});

test('isObjectiveMet rejects pending, blocked, empty, or incomplete tasks', () => {
  assert.equal(isObjectiveMet({
    column: 'in-progress',
    blocked: false,
    checklist: completedChecklist,
  }), false);

  assert.equal(isObjectiveMet({
    column: 'done',
    blocked: true,
    checklist: completedChecklist,
  }), false);

  assert.equal(isObjectiveMet({
    column: 'done',
    blocked: false,
    checklist: [],
  }), false);

  assert.equal(isObjectiveMet({
    column: 'done',
    blocked: false,
    checklist: [{ id: 'check-1', text: 'Review', done: false }],
  }), false);
});

test('getChecklistProgress reports completed and total checklist items', () => {
  assert.deepEqual(getChecklistProgress({
    checklist: [
      { id: 'check-1', text: 'Plan', done: true },
      { id: 'check-2', text: 'Build', done: false },
      { id: 'check-3', text: 'Review', done: true },
    ],
  }), { done: 2, total: 3 });

  assert.deepEqual(getChecklistProgress({}), { done: 0, total: 0 });
});
