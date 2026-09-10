import assert from 'node:assert/strict';
import test from 'node:test';
import { columns, priorityRank } from '../../src/data/boardData.js';
import { recordStatuses } from '../../src/utils/recordStatus.js';
import { createBoardBackup, normalizeBoardData, parseBoardBackup } from '../../src/utils/storage.js';

const SEED = 0x5eed1234;
const validColumns = new Set(columns.map((column) => column.id));
const validPriorities = new Set(Object.keys(priorityRank));

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(random, values) {
  return values[Math.floor(random() * values.length)];
}

function createGeneratedBoard(random, iteration) {
  const projectCount = Math.floor(random() * 5);
  const projects = Array.from({ length: projectCount }, (_, index) => ({
    id: pick(random, [`project-${iteration}-${index}`, '', null, index]),
    name: pick(random, [`Project ${index}`, ' ', null]),
    owner: pick(random, ['Owner', '', 42]),
    color: pick(random, ['#0e7490', '#ABCDEF', 'blue', null]),
    status: pick(random, [...recordStatuses, 'Archived', null]),
  }));
  const projectIds = projects.map((project) => project.id);

  const activityCount = Math.floor(random() * 9);
  const activities = Array.from({ length: activityCount }, (_, index) => ({
    id: pick(random, [`activity-${iteration}-${index}`, '', null]),
    projectId: pick(random, [...projectIds, 'missing-project', null]),
    name: pick(random, [`Activity ${index}`, '', null]),
    owner: pick(random, ['Owner', '', null]),
    status: pick(random, [...recordStatuses, 'Unknown', null]),
  }));
  const activityIds = activities.map((activity) => activity.id);

  const taskCount = Math.floor(random() * 31);
  const tasks = Array.from({ length: taskCount }, (_, index) => ({
    id: pick(random, [`task-${iteration}-${index}`, '', null]),
    projectId: pick(random, [...projectIds, 'missing-project', null]),
    activityId: pick(random, [...activityIds, 'missing-activity', null]),
    title: pick(random, [`Task ${index}`, '', null]),
    description: pick(random, ['Description', '', null, 123]),
    column: pick(random, [...validColumns, 'unknown', null]),
    owner: pick(random, ['Owner', '', null]),
    priority: pick(random, [...validPriorities, 'Urgent', null]),
    tag: pick(random, ['Quality', '', null]),
    due: pick(random, ['2026-09-09', 'not-a-date', null]),
    points: pick(random, [-100, 0, 1, 5.6, 13, 100, '3', 'invalid', null]),
    blocked: pick(random, [true, false, 0, 1, null]),
    checklist: pick(random, [
      null,
      'not-an-array',
      [],
      ['Legacy item', '', null, { text: 'Object item', done: 1 }],
    ]),
  }));

  return { projects, activities, tasks };
}

function assertBoardInvariants(board) {
  assert.ok(board.projects.length > 0);

  const projects = new Map(board.projects.map((project) => [project.id, project]));
  const activities = new Map(board.activities.map((activity) => [activity.id, activity]));

  for (const project of board.projects) {
    assert.equal(typeof project.id, 'string');
    assert.ok(project.id.length > 0);
    assert.ok(recordStatuses.includes(project.status));
    assert.match(project.color, /^#[0-9a-f]{6}$/i);
  }

  for (const activity of board.activities) {
    assert.equal(projects.has(activity.projectId), true);
    assert.ok(recordStatuses.includes(activity.status));
  }

  for (const task of board.tasks) {
    const activity = activities.get(task.activityId);
    assert.equal(projects.has(task.projectId), true);
    assert.ok(activity);
    assert.equal(
      activity.projectId,
      task.projectId,
      `Task ${task.id} must reference an activity in project ${task.projectId}.`,
    );
    assert.equal(validColumns.has(task.column), true);
    assert.equal(validPriorities.has(task.priority), true);
    assert.equal(Number.isInteger(task.points), true);
    assert.ok(task.points >= 1 && task.points <= 13);
    assert.match(task.due, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(Array.isArray(task.checklist), true);
    assert.equal(new Set(task.checklist.map((item) => item.id)).size, task.checklist.length);
    for (const item of task.checklist) {
      assert.equal(typeof item.id, 'string');
      assert.equal(typeof item.text, 'string');
      assert.equal(typeof item.done, 'boolean');
    }
  }
}

test('generated board data always normalizes to valid relationships and ranges', () => {
  const random = randomGenerator(SEED);

  for (let iteration = 0; iteration < 300; iteration += 1) {
    const board = normalizeBoardData(createGeneratedBoard(random, iteration));
    assertBoardInvariants(board);

    const roundTrip = parseBoardBackup(createBoardBackup(board));
    assert.deepEqual(roundTrip, board);
  }
});

test('malformed records and missing activities recover without losing tasks', () => {
  const board = normalizeBoardData({
    projects: [null],
    activities: [],
    tasks: [null, { checklist: null }],
  });

  assert.equal(board.tasks.length, 2);
  assert.equal(board.activities.length, 1);
  assertBoardInvariants(board);
});
