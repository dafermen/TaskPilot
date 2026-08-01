import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BOARD_BACKUP_VERSION,
  createActivity,
  createBoardBackup,
  createProject,
  createTask,
} from '../../src/utils/storage.js';

test('exported backups keep the documented versioned contract', () => {
  const project = createProject();
  const activity = createActivity(project.id);
  const task = createTask('backlog', project.id, activity.id);
  const backup = JSON.parse(createBoardBackup({
    projects: [project],
    activities: [activity],
    tasks: [task],
  }));

  assert.equal(backup.version, BOARD_BACKUP_VERSION);
  assert.equal(typeof backup.exportedAt, 'string');
  assert.deepEqual(Object.keys(backup).sort(), [
    'activities',
    'exportedAt',
    'projects',
    'tasks',
    'version',
  ]);
  assert.equal(backup.activities[0].projectId, backup.projects[0].id);
  assert.equal(backup.tasks[0].activityId, backup.activities[0].id);
});
