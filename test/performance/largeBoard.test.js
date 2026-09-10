import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import test from 'node:test';
import { normalizeBoardData } from '../../src/utils/storage.js';

const PROJECT_COUNT = 20;
const ACTIVITIES_PER_PROJECT = 10;
const TASK_COUNT = 10000;
const NORMALIZATION_BUDGET_MS = 2500;

test('a 10,000-task board normalizes within the resource budget', () => {
  const projects = Array.from({ length: PROJECT_COUNT }, (_, index) => ({
    id: `project-${index}`,
    name: `Project ${index}`,
  }));
  const activities = projects.flatMap((project) => (
    Array.from({ length: ACTIVITIES_PER_PROJECT }, (_, index) => ({
      id: `${project.id}-activity-${index}`,
      projectId: project.id,
      name: `Activity ${index}`,
    }))
  ));
  const tasks = Array.from({ length: TASK_COUNT }, (_, index) => {
    const project = projects[index % projects.length];
    const activityIndex = index % ACTIVITIES_PER_PROJECT;
    return {
      id: `task-${index}`,
      projectId: project.id,
      activityId: `${project.id}-activity-${activityIndex}`,
      title: `Task ${index}`,
      points: (index % 13) + 1,
      checklist: [],
    };
  });

  const startedAt = performance.now();
  const board = normalizeBoardData({ projects, activities, tasks });
  const elapsedMs = performance.now() - startedAt;

  assert.equal(board.tasks.length, TASK_COUNT);
  assert.ok(
    elapsedMs < NORMALIZATION_BUDGET_MS,
    `Normalization took ${elapsedMs.toFixed(1)}ms; budget is ${NORMALIZATION_BUDGET_MS}ms.`,
  );
});
