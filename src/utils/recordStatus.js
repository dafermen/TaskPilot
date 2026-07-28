export const recordStatuses = ['Planning', 'Active', 'Paused', 'Done'];

export function isOperationalStatus(status) {
  return status === 'Planning' || status === 'Active';
}

export function isOperationalProject(project) {
  return Boolean(project) && isOperationalStatus(project.status);
}

export function isOperationalActivity(activity) {
  return Boolean(activity) && isOperationalStatus(activity.status);
}
