export function isObjectiveMet(task) {
  const checklist = Array.isArray(task.checklist) ? task.checklist : [];

  return task.column === 'done'
    && !task.blocked
    && checklist.length > 0
    && checklist.every((item) => item.done);
}

export function getChecklistProgress(task) {
  const checklist = Array.isArray(task.checklist) ? task.checklist : [];
  const total = checklist.length;
  const done = checklist.filter((item) => item.done).length;

  return { done, total };
}
