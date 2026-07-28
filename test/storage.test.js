import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ACTIVITY_STORAGE_KEY,
  createBoardBackup,
  createActivity,
  createProject,
  createTask,
  DEFAULT_ACTIVITY_ID,
  DEFAULT_PROJECT_ID,
  FOCUS_STORAGE_KEY,
  loadActivities,
  loadBooleanPreference,
  loadProjects,
  loadTasks,
  normalizeBoardData,
  parseBoardBackup,
  PROJECT_STORAGE_KEY,
  saveActivities,
  saveBooleanPreference,
  saveProjects,
  saveTasks,
  TASK_STORAGE_KEY,
} from '../src/utils/storage.js';
import {
  isOperationalActivity,
  isOperationalProject,
  isOperationalStatus,
  recordStatuses,
} from '../src/utils/recordStatus.js';

function mockStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));

  global.window = {
    localStorage: {
      getItem(key) {
        return values.has(key) ? values.get(key) : null;
      },
      setItem(key, value) {
        values.set(key, value);
      },
    },
  };

  return values;
}

test('loadTasks returns demo tasks when storage is empty', () => {
  mockStorage();

  const tasks = loadTasks();

  assert.equal(tasks.length, 5);
  assert.equal(tasks[0].id, 'tp-101');
  assert.equal(tasks[0].projectId, DEFAULT_PROJECT_ID);
  assert.equal(typeof tasks[0].checklist[0], 'object');
});

test('loadTasks migrates legacy string checklist items', () => {
  mockStorage({
    [TASK_STORAGE_KEY]: JSON.stringify([
      {
        id: 'legacy-task',
        title: 'Legacy task',
        checklist: ['Old item'],
      },
    ]),
  });

  const [task] = loadTasks();

  assert.deepEqual(task.checklist[0], {
    id: 'legacy-0-Old item',
    text: 'Old item',
    done: false,
  });
  assert.equal(task.projectId, DEFAULT_PROJECT_ID);
  assert.equal(task.activityId, DEFAULT_ACTIVITY_ID);
});

test('saveTasks reports success when storage accepts writes', () => {
  const values = mockStorage();
  const task = createTask('ready');

  assert.equal(saveTasks([task]), true);
  assert.equal(JSON.parse(values.get(TASK_STORAGE_KEY))[0].column, 'ready');
});

test('boolean preferences round-trip through storage', () => {
  mockStorage();

  assert.equal(loadBooleanPreference(FOCUS_STORAGE_KEY), false);
  assert.equal(saveBooleanPreference(FOCUS_STORAGE_KEY, true), true);
  assert.equal(loadBooleanPreference(FOCUS_STORAGE_KEY), true);
});

test('createTask seeds an editable checklist', () => {
  const task = createTask('progress', 'project-custom', 'activity-custom');

  assert.equal(task.column, 'progress');
  assert.equal(task.projectId, 'project-custom');
  assert.equal(task.activityId, 'activity-custom');
  assert.equal(task.checklist.length, 1);
  assert.equal(task.checklist[0].text, 'Define scope');
  assert.equal(task.checklist[0].done, false);
});

test('projects and activities load default JSON records', () => {
  mockStorage();

  const projects = loadProjects();
  const activities = loadActivities();

  assert.equal(projects.length, 2);
  assert.equal(activities.length, 3);
  assert.equal(activities[0].projectId, projects[0].id);
});

test('project and activity records can be created and saved', () => {
  const values = mockStorage();
  const project = createProject();
  const activity = createActivity(project.id);

  assert.equal(saveProjects([project]), true);
  assert.equal(saveActivities([activity]), true);
  assert.equal(JSON.parse(values.get(PROJECT_STORAGE_KEY))[0].name, 'New project');
  assert.equal(JSON.parse(values.get(ACTIVITY_STORAGE_KEY))[0].projectId, project.id);
});

test('paused and done records are non-operational workspace records', () => {
  assert.deepEqual(recordStatuses, ['Planning', 'Active', 'Paused', 'Done']);
  assert.equal(isOperationalStatus('Planning'), true);
  assert.equal(isOperationalStatus('Active'), true);
  assert.equal(isOperationalStatus('Paused'), false);
  assert.equal(isOperationalStatus('Done'), false);
  assert.equal(isOperationalProject({ status: 'Paused' }), false);
  assert.equal(isOperationalActivity({ status: 'Done' }), false);
});

test('board backups round-trip through JSON import', () => {
  const project = createProject();
  const activity = createActivity(project.id);
  const task = createTask('review', project.id, activity.id);

  const backup = createBoardBackup({
    projects: [project],
    activities: [activity],
    tasks: [task],
  });
  const imported = parseBoardBackup(backup);

  assert.equal(imported.projects[0].id, project.id);
  assert.equal(imported.activities[0].projectId, project.id);
  assert.equal(imported.tasks[0].activityId, activity.id);
});

test('normalization repairs invalid task relationships and keeps empty task arrays', () => {
  const normalized = normalizeBoardData({
    projects: [{ id: 'project-a', name: '', color: 'bad-color' }],
    activities: [{ id: 'activity-a', projectId: 'missing-project', name: '' }],
    tasks: [
      {
        id: 'task-a',
        projectId: 'missing-project',
        activityId: 'missing-activity',
        title: '',
        column: 'missing-column',
        priority: 'Urgent',
        points: 99,
        checklist: [''],
      },
    ],
  });

  assert.equal(normalized.projects[0].name, 'Untitled project');
  assert.equal(normalized.projects[0].color, '#0e7490');
  assert.equal(normalized.activities[0].projectId, 'project-a');
  assert.equal(normalized.tasks[0].projectId, 'project-a');
  assert.equal(normalized.tasks[0].activityId, 'activity-a');
  assert.equal(normalized.tasks[0].title, 'Untitled task');
  assert.equal(normalized.tasks[0].column, 'backlog');
  assert.equal(normalized.tasks[0].priority, 'Medium');
  assert.equal(normalized.tasks[0].points, 13);

  assert.deepEqual(normalizeBoardData({ tasks: [] }).tasks, []);
});
