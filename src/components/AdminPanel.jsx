import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { columns } from '../data/boardData.js';
import { recordStatuses } from '../utils/recordStatus.js';
import { isObjectiveMet } from '../utils/taskStatus.js';

const priorities = ['High', 'Medium', 'Low'];
const pageSize = 8;

export function AdminPanel({
  activities,
  activeActivityId,
  activeProjectId,
  onAddActivity,
  onAddProject,
  onAddTask,
  onDeleteActivity,
  onDeleteProject,
  onDeleteTask,
  onUpdateActivity,
  onUpdateProject,
  onUpdateTask,
  projects,
  tasks,
}) {
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const activityById = useMemo(() => new Map(activities.map((activity) => [activity.id, activity])), [activities]);

  const projectRows = useAdminTable({
    rows: projects,
    columns: projectColumns,
    defaultSort: { key: 'name', direction: 'asc' },
    getSearchRecord: (project) => ({
      ...project,
      activities: activities.filter((activity) => activity.projectId === project.id).length,
      tasks: tasks.filter((task) => task.projectId === project.id).length,
    }),
  });

  const visibleActivities = activities.filter((activity) => activeProjectId === 'all' || activity.projectId === activeProjectId);
  const activityRows = useAdminTable({
    rows: visibleActivities,
    columns: activityColumns,
    defaultSort: { key: 'name', direction: 'asc' },
    getSearchRecord: (activity) => ({
      ...activity,
      project: projectById.get(activity.projectId)?.name || '',
      tasks: tasks.filter((task) => task.activityId === activity.id).length,
    }),
  });

  const scopedTasks = tasks.filter((task) => {
    const matchesProject = activeProjectId === 'all' || task.projectId === activeProjectId;
    const matchesActivity = activeActivityId === 'all' || task.activityId === activeActivityId;
    return matchesProject && matchesActivity;
  });
  const taskRows = useAdminTable({
    rows: scopedTasks,
    columns: taskColumns,
    defaultSort: { key: 'due', direction: 'asc' },
    getSearchRecord: (task) => ({
      ...task,
      project: projectById.get(task.projectId)?.name || '',
      activity: activityById.get(task.activityId)?.name || '',
      objective: isObjectiveMet(task) ? 'Met' : 'Pending',
    }),
  });

  return (
    <section className="admin" aria-label="Administration">
      <AdminSection
        title="Projects"
        count={projectRows.filteredCount}
        total={projects.length}
        actionLabel="New project"
        onAdd={onAddProject}
      >
        <AdminTable
          columns={projectColumns}
          table={projectRows}
          emptyMessage="No projects match the current filters."
          renderRow={(project) => {
            const taskCount = tasks.filter((task) => task.projectId === project.id).length;
            const activityCount = activities.filter((activity) => activity.projectId === project.id).length;

            return (
              <tr key={project.id}>
                <td>
                  <input value={project.name} onChange={(event) => onUpdateProject(project.id, { name: event.target.value })} />
                </td>
                <td>
                  <input value={project.owner} onChange={(event) => onUpdateProject(project.id, { owner: event.target.value })} />
                </td>
                <td>
                  <select value={project.status} onChange={(event) => onUpdateProject(project.id, { status: event.target.value })}>
                    {recordStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
                <td>
                  <input type="color" value={project.color} onChange={(event) => onUpdateProject(project.id, { color: event.target.value })} />
                </td>
                <td><span className="admin-count">{activityCount}</span></td>
                <td><span className="admin-count">{taskCount}</span></td>
                <td>
                  <button
                    type="button"
                    className="mini-button"
                    onClick={() => onDeleteProject(project.id)}
                    disabled={taskCount > 0 || activityCount > 0}
                    title="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          }}
        />
      </AdminSection>

      <AdminSection
        title="Activities"
        count={activityRows.filteredCount}
        total={visibleActivities.length}
        actionLabel="New activity"
        onAdd={onAddActivity}
      >
        <AdminTable
          columns={activityColumns}
          table={activityRows}
          emptyMessage="No activities match the current filters."
          renderRow={(activity) => {
            const taskCount = tasks.filter((task) => task.activityId === activity.id).length;

            return (
              <tr key={activity.id}>
                <td>
                  <input value={activity.name} onChange={(event) => onUpdateActivity(activity.id, { name: event.target.value })} />
                </td>
                <td>
                  <select value={activity.projectId} onChange={(event) => onUpdateActivity(activity.id, { projectId: event.target.value })}>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input value={activity.owner} onChange={(event) => onUpdateActivity(activity.id, { owner: event.target.value })} />
                </td>
                <td>
                  <select value={activity.status} onChange={(event) => onUpdateActivity(activity.id, { status: event.target.value })}>
                    {recordStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
                <td><span className="admin-count">{taskCount}</span></td>
                <td>
                  <button type="button" className="mini-button" onClick={() => onDeleteActivity(activity.id)} disabled={taskCount > 0} title="Delete activity">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          }}
        />
      </AdminSection>

      <AdminSection
        title="Tasks"
        count={taskRows.filteredCount}
        total={scopedTasks.length}
        actionLabel="New task"
        onAdd={onAddTask}
      >
        <AdminTable
          columns={taskColumns}
          table={taskRows}
          emptyMessage="No tasks match the current filters."
          renderRow={(task) => {
            const projectActivities = activities.filter((activity) => activity.projectId === task.projectId);
            const objectiveMet = isObjectiveMet(task);

            return (
              <tr key={task.id}>
                <td>
                  <input value={task.title} onChange={(event) => onUpdateTask(task.id, { title: event.target.value })} />
                </td>
                <td>
                  <select value={task.projectId} onChange={(event) => {
                    const nextProjectId = event.target.value;
                    const nextActivity = activities.find((activity) => activity.projectId === nextProjectId);
                    onUpdateTask(task.id, {
                      projectId: nextProjectId,
                      activityId: nextActivity?.id || '',
                    });
                  }}>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select value={task.activityId} onChange={(event) => onUpdateTask(task.id, { activityId: event.target.value })}>
                    {projectActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>{activity.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select value={task.column} onChange={(event) => onUpdateTask(task.id, { column: event.target.value })}>
                    {columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
                  </select>
                </td>
                <td>
                  <select value={task.priority} onChange={(event) => onUpdateTask(task.id, { priority: event.target.value })}>
                    {priorities.map((priority) => <option key={priority}>{priority}</option>)}
                  </select>
                </td>
                <td>
                  <input type="date" value={task.due} onChange={(event) => onUpdateTask(task.id, { due: event.target.value })} />
                </td>
                <td>
                  <span className={objectiveMet ? 'admin-count objective-count-met' : 'admin-count'}>{objectiveMet ? 'Met' : 'Pending'}</span>
                </td>
                <td>
                  <button type="button" className="mini-button" onClick={() => onDeleteTask(task.id)} title="Delete task">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          }}
        />
      </AdminSection>
    </section>
  );
}

const projectColumns = [
  { key: 'name', label: 'Name', filter: 'text', className: 'admin-col-wide' },
  { key: 'owner', label: 'Owner', filter: 'text' },
  { key: 'status', label: 'Status', filter: 'select', options: recordStatuses },
  { key: 'color', label: 'Color', sortable: false },
  { key: 'activities', label: 'Activities', filter: 'number' },
  { key: 'tasks', label: 'Tasks', filter: 'number' },
  { key: 'actions', label: '', sortable: false },
];

const activityColumns = [
  { key: 'name', label: 'Name', filter: 'text', className: 'admin-col-wide' },
  { key: 'project', label: 'Project', filter: 'text', className: 'admin-col-wide' },
  { key: 'owner', label: 'Owner', filter: 'text' },
  { key: 'status', label: 'Status', filter: 'select', options: recordStatuses },
  { key: 'tasks', label: 'Tasks', filter: 'number' },
  { key: 'actions', label: '', sortable: false },
];

const taskColumns = [
  { key: 'title', label: 'Title', filter: 'text', className: 'admin-col-title' },
  { key: 'project', label: 'Project', filter: 'text', className: 'admin-col-wide' },
  { key: 'activity', label: 'Activity', filter: 'text', className: 'admin-col-wide' },
  { key: 'column', label: 'Status', filter: 'select', options: columns.map((column) => ({ label: column.title, value: column.id })) },
  { key: 'priority', label: 'Priority', filter: 'select', options: priorities },
  { key: 'due', label: 'Due', filter: 'text' },
  { key: 'objective', label: 'Objective', filter: 'select', options: ['Met', 'Pending'] },
  { key: 'actions', label: '', sortable: false },
];

function useAdminTable({ columns: tableColumns, defaultSort, getSearchRecord, rows }) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const filterSignature = JSON.stringify(filters);

  useEffect(() => {
    setPage(1);
  }, [filterSignature, sort.key, sort.direction, rows.length]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const record = getSearchRecord(row);

      return tableColumns.every((column) => {
        if (!column.filter) return true;
        const filterValue = String(filters[column.key] || '').trim().toLowerCase();
        if (!filterValue) return true;
        const value = String(record[column.key] ?? '').toLowerCase();

        if (column.filter === 'number') return value === filterValue;
        return value.includes(filterValue);
      });
    });
  }, [filterSignature, getSearchRecord, rows, tableColumns]);

  const sortedRows = useMemo(() => {
    const direction = sort.direction === 'asc' ? 1 : -1;

    return [...filteredRows].sort((a, b) => {
      const first = getSearchRecord(a)[sort.key] ?? '';
      const second = getSearchRecord(b)[sort.key] ?? '';

      if (typeof first === 'number' && typeof second === 'number') return (first - second) * direction;
      return String(first).localeCompare(String(second), undefined, { numeric: true, sensitivity: 'base' }) * direction;
    });
  }, [filteredRows, getSearchRecord, sort.direction, sort.key]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleSort(key) {
    const column = tableColumns.find((item) => item.key === key);
    if (column?.sortable === false) return;

    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  return {
    filteredCount: filteredRows.length,
    filters,
    page: safePage,
    pageRows,
    setPage,
    sort,
    totalPages,
    toggleSort,
    updateFilter,
  };
}

function AdminSection({ actionLabel, children, count, onAdd, title, total }) {
  const countText = count === total ? `${total} total` : `${count} of ${total}`;

  return (
    <section className="admin-section">
      <div className="admin-heading">
        <div>
          <h2>{title}</h2>
          <p>{countText}</p>
        </div>
        <button type="button" className="ghost-button" onClick={onAdd}>
          <Plus size={16} />
          {actionLabel}
        </button>
      </div>
      {children}
    </section>
  );
}

function AdminTable({ columns: tableColumns, emptyMessage, renderRow, table }) {
  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th key={column.key} className={column.className}>
                  {column.sortable === false ? (
                    <span className="admin-th-label">{column.label}</span>
                  ) : (
                    <button type="button" className="admin-sort" onClick={() => table.toggleSort(column.key)}>
                      {column.label}
                      {table.sort.key === column.key && <span>{table.sort.direction === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  )}
                </th>
              ))}
            </tr>
            <tr className="admin-filter-row">
              {tableColumns.map((column) => (
                <th key={column.key}>
                  {column.filter === 'select' && (
                    <select value={table.filters[column.key] || ''} onChange={(event) => table.updateFilter(column.key, event.target.value)}>
                      <option value="">All</option>
                      {column.options.map((option) => {
                        const value = typeof option === 'string' ? option : option.value;
                        const label = typeof option === 'string' ? option : option.label;
                        return <option key={value} value={value}>{label}</option>;
                      })}
                    </select>
                  )}
                  {(column.filter === 'text' || column.filter === 'number') && (
                    <input
                      type={column.filter === 'number' ? 'number' : 'search'}
                      value={table.filters[column.key] || ''}
                      onChange={(event) => table.updateFilter(column.key, event.target.value)}
                      placeholder="Filter"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.pageRows.map(renderRow)}
            {table.pageRows.length === 0 && (
              <tr>
                <td className="admin-empty" colSpan={tableColumns.length}>{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="admin-pagination">
        <span>Page {table.page} of {table.totalPages}</span>
        <div>
          <button type="button" className="ghost-button" onClick={() => table.setPage((page) => Math.max(1, page - 1))} disabled={table.page <= 1}>
            Prev
          </button>
          <button type="button" className="ghost-button" onClick={() => table.setPage((page) => Math.min(table.totalPages, page + 1))} disabled={table.page >= table.totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
