import { columns, initialActivities, initialProjects, initialTasks, priorityRank } from '../data/boardData.js';

export const TASK_STORAGE_KEY = 'taskpilot-board-v3';
export const PROJECT_STORAGE_KEY = 'taskpilot-projects-v1';
export const ACTIVITY_STORAGE_KEY = 'taskpilot-activities-v1';
export const THEME_STORAGE_KEY = 'taskpilot-theme';
export const FOCUS_STORAGE_KEY = 'taskpilot-focus-mode';
export const CARD_VIEW_STORAGE_KEY = 'taskpilot-card-view';
export const ACTIVE_PROJECT_STORAGE_KEY = 'taskpilot-active-project';
export const ACTIVE_ACTIVITY_STORAGE_KEY = 'taskpilot-active-activity';

export const DEFAULT_PROJECT_ID = initialProjects[0].id;
export const DEFAULT_ACTIVITY_ID = initialActivities[0].id;
export const BOARD_BACKUP_VERSION = 1;

const validColumns = new Set(columns.map((column) => column.id));
const validPriorities = new Set(Object.keys(priorityRank));
const validStatuses = new Set(['Planning', 'Active', 'Paused', 'Done']);

function cleanText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function cleanColor(value, fallback = '#0e7490') {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function cleanDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : new Date().toISOString().slice(0, 10);
}

function cleanPoints(value) {
  const points = Number(value);
  if (!Number.isFinite(points)) return 1;
  return Math.min(13, Math.max(1, Math.round(points)));
}

function normalizeChecklist(checklist = []) {
  return checklist.map((item, index) => {
    if (typeof item === 'string') {
      return { id: `legacy-${index}-${item}`, text: cleanText(item, 'Checklist item'), done: false };
    }

    return {
      id: item.id || `item-${index}`,
      text: cleanText(item.text, 'Checklist item'),
      done: Boolean(item.done),
    };
  });
}

function normalizeTask(task) {
  return {
    ...task,
    id: task.id || `task-${Date.now()}`,
    projectId: task.projectId || DEFAULT_PROJECT_ID,
    activityId: task.activityId || DEFAULT_ACTIVITY_ID,
    title: cleanText(task.title, 'Untitled task'),
    description: typeof task.description === 'string' ? task.description : '',
    column: validColumns.has(task.column) ? task.column : 'backlog',
    owner: cleanText(task.owner, 'Dario'),
    priority: validPriorities.has(task.priority) ? task.priority : 'Medium',
    tag: cleanText(task.tag, 'Planning'),
    due: cleanDate(task.due),
    points: cleanPoints(task.points),
    blocked: Boolean(task.blocked),
    checklist: normalizeChecklist(task.checklist),
  };
}

function normalizeProject(project, index) {
  return {
    id: project.id || `project-${index}`,
    name: cleanText(project.name, 'Untitled project'),
    owner: cleanText(project.owner, 'Dario'),
    color: cleanColor(project.color),
    status: validStatuses.has(project.status) ? project.status : 'Active',
  };
}

function normalizeActivity(activity, index) {
  return {
    id: activity.id || `activity-${index}`,
    projectId: activity.projectId || DEFAULT_PROJECT_ID,
    name: cleanText(activity.name, 'Untitled activity'),
    owner: cleanText(activity.owner, 'Dario'),
    status: validStatuses.has(activity.status) ? activity.status : 'Active',
  };
}

export function normalizeBoardData(data = {}) {
  const projects = Array.isArray(data.projects) && data.projects.length
    ? data.projects.map(normalizeProject)
    : initialProjects;
  const projectIds = new Set(projects.map((project) => project.id));

  const activities = (Array.isArray(data.activities)
    ? data.activities.map(normalizeActivity)
    : initialActivities
  ).map((activity) => ({
    ...activity,
    projectId: projectIds.has(activity.projectId) ? activity.projectId : projects[0].id,
  }));
  const activityIds = new Set(activities.map((activity) => activity.id));

  const tasks = (Array.isArray(data.tasks)
    ? data.tasks.map(normalizeTask)
    : initialTasks
  ).map((task) => {
    const projectId = projectIds.has(task.projectId) ? task.projectId : projects[0].id;
    const fallbackActivity = activities.find((activity) => activity.projectId === projectId) || activities[0];
    const currentActivity = activities.find((activity) => activity.id === task.activityId);
    const activityId = activityIds.has(task.activityId) && currentActivity?.projectId === projectId
      ? task.activityId
      : fallbackActivity.id;

    return { ...task, projectId, activityId };
  });

  return { projects, activities, tasks };
}

function loadJsonArray(key, fallback, normalize) {
  try {
    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : fallback;
    return Array.isArray(parsed) ? parsed.map(normalize) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadTasks() {
  return loadJsonArray(TASK_STORAGE_KEY, initialTasks, normalizeTask);
}

export function saveTasks(tasks) {
  return saveJson(TASK_STORAGE_KEY, tasks);
}

export function loadProjects() {
  return loadJsonArray(PROJECT_STORAGE_KEY, initialProjects, normalizeProject);
}

export function saveProjects(projects) {
  return saveJson(PROJECT_STORAGE_KEY, projects);
}

export function loadActivities() {
  return loadJsonArray(ACTIVITY_STORAGE_KEY, initialActivities, normalizeActivity);
}

export function saveActivities(activities) {
  return saveJson(ACTIVITY_STORAGE_KEY, activities);
}

export function loadStringPreference(key, fallback = '') {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function saveStringPreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function loadBooleanPreference(key, fallback = false) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : stored === 'true';
  } catch {
    return fallback;
  }
}

export function saveBooleanPreference(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function createProject() {
  return {
    id: `project-${Date.now()}`,
    name: 'New project',
    owner: 'Dario',
    color: '#0e7490',
    status: 'Planning',
  };
}

export function createActivity(projectId = DEFAULT_PROJECT_ID) {
  return {
    id: `activity-${Date.now()}`,
    projectId,
    name: 'New activity',
    owner: 'Dario',
    status: 'Planning',
  };
}

export function createTask(column = 'backlog', projectId = DEFAULT_PROJECT_ID, activityId = DEFAULT_ACTIVITY_ID) {
  const taskId = `tp-${Date.now()}`;

  return {
    id: taskId,
    projectId,
    activityId,
    title: 'New task',
    description: 'Describe the outcome and the next concrete action.',
    column,
    owner: 'Dario',
    priority: 'Medium',
    tag: 'Planning',
    due: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    points: 2,
    blocked: false,
    checklist: [{ id: `${taskId}-check-1`, text: 'Define scope', done: false }],
  };
}

export function createBoardBackup({ activities, projects, tasks }) {
  return JSON.stringify({
    version: BOARD_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    projects,
    activities,
    tasks,
  }, null, 2);
}

export function parseBoardBackup(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Backup must be a JSON object.');
  }

  return normalizeBoardData(parsed);
}
