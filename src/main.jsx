import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Flag,
  Home,
  Info,
  KanbanSquare,
  ListChecks,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  SunMedium,
  Upload,
} from 'lucide-react';
import { AdminPanel } from './components/AdminPanel.jsx';
import { Metric } from './components/Metric.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskDrawer } from './components/TaskDrawer.jsx';
import { columns, initialActivities, initialProjects, initialTasks, priorityRank } from './data/boardData.js';
import {
  ACTIVE_ACTIVITY_STORAGE_KEY,
  ACTIVE_PROJECT_STORAGE_KEY,
  CARD_VIEW_STORAGE_KEY,
  createActivity,
  createBoardBackup,
  createProject,
  createTask,
  FOCUS_STORAGE_KEY,
  loadActivities,
  loadBooleanPreference,
  loadProjects,
  loadStringPreference,
  loadTasks,
  normalizeBoardData,
  parseBoardBackup,
  saveActivities,
  saveBooleanPreference,
  saveProjects,
  saveStringPreference,
  saveTasks,
  SHOW_ARCHIVED_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from './utils/storage.js';
import { isOperationalActivity, isOperationalProject } from './utils/recordStatus.js';
import { isObjectiveMet } from './utils/taskStatus.js';
import './styles.css';

const COLUMN_PREVIEW_LIMIT = 8;

function App() {
  const importInputRef = useRef(null);
  const [projects, setProjects] = useState(loadProjects);
  const [activities, setActivities] = useState(loadActivities);
  const [tasks, setTasks] = useState(loadTasks);
  const [activeTask, setActiveTask] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [storageStatus, setStorageStatus] = useState('ready');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [activeProjectId, setActiveProjectId] = useState(() => loadStringPreference(ACTIVE_PROJECT_STORAGE_KEY, initialProjects[0].id));
  const [activeActivityId, setActiveActivityId] = useState(() => loadStringPreference(ACTIVE_ACTIVITY_STORAGE_KEY, 'all'));
  const [activePage, setActivePage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(() => loadBooleanPreference(FOCUS_STORAGE_KEY));
  const [cardView, setCardView] = useState(() => loadStringPreference(CARD_VIEW_STORAGE_KEY, 'expanded'));
  const [showArchivedWork, setShowArchivedWork] = useState(() => loadBooleanPreference(SHOW_ARCHIVED_STORAGE_KEY));
  const [expandedTaskIds, setExpandedTaskIds] = useState(() => new Set());
  const [columnLimits, setColumnLimits] = useState({});
  const [darkMode, setDarkMode] = useState(() => loadBooleanPreference(THEME_STORAGE_KEY));

  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const activityById = useMemo(() => new Map(activities.map((activity) => [activity.id, activity])), [activities]);

  useEffect(() => {
    saveBooleanPreference(THEME_STORAGE_KEY, darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveBooleanPreference(FOCUS_STORAGE_KEY, focusMode);
  }, [focusMode]);

  useEffect(() => {
    saveStringPreference(CARD_VIEW_STORAGE_KEY, cardView);
  }, [cardView]);

  useEffect(() => {
    saveBooleanPreference(SHOW_ARCHIVED_STORAGE_KEY, showArchivedWork);
  }, [showArchivedWork]);

  useEffect(() => {
    saveStringPreference(ACTIVE_PROJECT_STORAGE_KEY, activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    saveStringPreference(ACTIVE_ACTIVITY_STORAGE_KEY, activeActivityId);
  }, [activeActivityId]);

  useEffect(() => {
    setColumnLimits({});
  }, [activeActivityId, activeProjectId, priorityFilter, search]);

  const operationalProjects = useMemo(() => {
    return projects.filter(isOperationalProject);
  }, [projects]);

  const operationalTasks = useMemo(() => {
    return tasks.filter((task) => {
      const project = projectById.get(task.projectId);
      const activity = activityById.get(task.activityId);
      return isOperationalProject(project) && isOperationalActivity(activity);
    });
  }, [activityById, projectById, tasks]);

  const workspaceProjects = useMemo(() => {
    return showArchivedWork ? projects : operationalProjects;
  }, [operationalProjects, projects, showArchivedWork]);

  const effectiveProjectId = useMemo(() => {
    if (activeProjectId === 'all') return 'all';
    return workspaceProjects.some((project) => project.id === activeProjectId) ? activeProjectId : 'all';
  }, [activeProjectId, workspaceProjects]);

  const workspaceProjectActivities = useMemo(() => {
    return activities.filter((activity) => {
      const project = projectById.get(activity.projectId);
      const matchesProject = effectiveProjectId === 'all' || activity.projectId === effectiveProjectId;
      const visibleStatus = showArchivedWork || (isOperationalProject(project) && isOperationalActivity(activity));
      return matchesProject && visibleStatus;
    });
  }, [activities, effectiveProjectId, projectById, showArchivedWork]);

  const effectiveActivityId = useMemo(() => {
    if (activeActivityId === 'all') return 'all';
    return workspaceProjectActivities.some((activity) => activity.id === activeActivityId) ? activeActivityId : 'all';
  }, [activeActivityId, workspaceProjectActivities]);

  const activeProjectActivities = useMemo(() => {
    return activities.filter((activity) => activeProjectId === 'all' || activity.projectId === activeProjectId);
  }, [activeProjectId, activities]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const project = projectById.get(task.projectId);
        const activity = activityById.get(task.activityId);
        const visibleStatus = showArchivedWork || (isOperationalProject(project) && isOperationalActivity(activity));
        const matchesProject = effectiveProjectId === 'all' || task.projectId === effectiveProjectId;
        const matchesActivity = effectiveActivityId === 'all' || task.activityId === effectiveActivityId;
        const matchesText = `${task.title} ${task.description} ${task.owner} ${task.tag} ${project?.name || ''} ${activity?.name || ''}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        return visibleStatus && matchesProject && matchesActivity && matchesText && matchesPriority;
      })
      .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  }, [activityById, effectiveActivityId, effectiveProjectId, priorityFilter, projectById, search, showArchivedWork, tasks]);

  const metrics = useMemo(() => {
    const blocked = filteredTasks.filter((task) => task.blocked).length;
    const objectiveMet = filteredTasks.filter(isObjectiveMet).length;
    const points = filteredTasks.reduce((total, task) => total + Number(task.points || 0), 0);
    return { blocked, objectiveMet, points };
  }, [filteredTasks]);

  const dashboardMetrics = useMemo(() => {
    const active = operationalTasks.filter((task) => task.column !== 'done').length;
    const blocked = operationalTasks.filter((task) => task.blocked).length;
    const objectiveMet = operationalTasks.filter(isObjectiveMet).length;
    const points = operationalTasks.reduce((total, task) => total + Number(task.points || 0), 0);
    return { active, blocked, objectiveMet, points };
  }, [operationalTasks]);

  const focusQueue = useMemo(() => {
    return filteredTasks
      .filter((task) => task.column !== 'done' && (task.blocked || task.priority === 'High'))
      .sort((a, b) => {
        if (Number(b.blocked) !== Number(a.blocked)) return Number(b.blocked) - Number(a.blocked);
        return priorityRank[b.priority] - priorityRank[a.priority];
      })
      .slice(0, 3);
  }, [filteredTasks]);

  const dueSoonTasks = useMemo(() => {
    return operationalTasks
      .filter((task) => task.column !== 'done')
      .sort((a, b) => a.due.localeCompare(b.due))
      .slice(0, 3);
  }, [operationalTasks]);

  const reviewQueue = useMemo(() => {
    return operationalTasks
      .filter((task) => task.column === 'review')
      .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority])
      .slice(0, 3);
  }, [operationalTasks]);

  function setSavedStatus(...results) {
    setStorageStatus(results.every(Boolean) ? 'saved' : 'failed');
  }

  function updateTasks(nextTasks) {
    const normalized = normalizeBoardData({ projects, activities, tasks: nextTasks }).tasks;
    setTasks(normalized);
    setSavedStatus(saveTasks(normalized));
  }

  function updateProjects(nextProjects) {
    const normalized = normalizeBoardData({ projects: nextProjects, activities, tasks });
    setProjects(normalized.projects);
    setActivities(normalized.activities);
    setTasks(normalized.tasks);
    setSavedStatus(saveProjects(normalized.projects), saveActivities(normalized.activities), saveTasks(normalized.tasks));
  }

  function updateActivities(nextActivities) {
    const normalized = normalizeBoardData({ projects, activities: nextActivities, tasks });
    setActivities(normalized.activities);
    setTasks(normalized.tasks);
    setSavedStatus(saveActivities(normalized.activities), saveTasks(normalized.tasks));
  }

  function addTask(columnId, targetPage = 'workspace') {
    const projectId = effectiveProjectId === 'all' ? (workspaceProjects[0]?.id || projects[0]?.id) : effectiveProjectId;
    const availableActivities = workspaceProjectActivities.length > 0 ? workspaceProjectActivities : activities;
    const activityId = effectiveActivityId === 'all'
      ? availableActivities.find((activity) => activity.projectId === projectId)?.id
      : effectiveActivityId;
    const nextTask = createTask(columnId, projectId, activityId);
    updateTasks([nextTask, ...tasks]);
    setActiveTask(nextTask);
    setActivePage(targetPage);
  }

  function addProject() {
    const nextProject = createProject();
    updateProjects([nextProject, ...projects]);
    setActiveProjectId(nextProject.id);
    setActiveActivityId('all');
  }

  function addActivity() {
    const projectId = activeProjectId === 'all' ? projects[0]?.id : activeProjectId;
    const nextActivity = createActivity(projectId);
    updateActivities([nextActivity, ...activities]);
    setActiveProjectId(projectId);
    setActiveActivityId(nextActivity.id);
  }

  function updateProject(projectId, patch) {
    updateProjects(projects.map((project) => (project.id === projectId ? { ...project, ...patch } : project)));
  }

  function updateActivity(activityId, patch) {
    updateActivities(activities.map((activity) => (activity.id === activityId ? { ...activity, ...patch } : activity)));
  }

  function updateTask(taskId, patch) {
    const nextTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task));
    updateTasks(nextTasks);
    setActiveTask((current) => (current?.id === taskId ? { ...current, ...patch } : current));
  }

  function deleteProject(projectId) {
    if (tasks.some((task) => task.projectId === projectId) || activities.some((activity) => activity.projectId === projectId)) return;
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    updateProjects(projects.filter((project) => project.id !== projectId));
    if (activeProjectId === projectId) setActiveProjectId('all');
  }

  function deleteActivity(activityId) {
    if (tasks.some((task) => task.activityId === activityId)) return;
    if (!window.confirm('Delete this activity? This cannot be undone.')) return;
    updateActivities(activities.filter((activity) => activity.id !== activityId));
    if (activeActivityId === activityId) setActiveActivityId('all');
  }

  function deleteTask(taskId) {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    updateTasks(tasks.filter((task) => task.id !== taskId));
    setActiveTask((current) => (current?.id === taskId ? null : current));
  }

  function moveTask(taskId, columnId) {
    updateTasks(tasks.map((task) => (task.id === taskId ? { ...task, column: columnId } : task)));
  }

  function moveTaskByStep(taskId, direction) {
    const task = tasks.find((item) => item.id === taskId);
    const currentIndex = columns.findIndex((column) => column.id === task?.column);
    const nextColumn = columns[currentIndex + direction];
    if (nextColumn) moveTask(taskId, nextColumn.id);
  }

  function resetBoard() {
    if (!window.confirm('Reset all demo data? This will replace current local projects, activities, and tasks.')) return;
    setProjects(initialProjects);
    setActivities(initialActivities);
    setTasks(initialTasks);
    setActiveProjectId(initialProjects[0].id);
    setActiveActivityId('all');
    setActiveTask(null);
    setSavedStatus(saveProjects(initialProjects), saveActivities(initialActivities), saveTasks(initialTasks));
  }

  function exportBoardData() {
    const backup = createBoardBackup({ projects, activities, tasks });
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskpilot-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importBoardData(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!window.confirm('Import this JSON backup? Current local projects, activities, and tasks will be replaced.')) return;

    try {
      const imported = parseBoardBackup(await file.text());
      setProjects(imported.projects);
      setActivities(imported.activities);
      setTasks(imported.tasks);
      setActiveProjectId(imported.projects[0]?.id || 'all');
      setActiveActivityId('all');
      setActiveTask(null);
      setSavedStatus(saveProjects(imported.projects), saveActivities(imported.activities), saveTasks(imported.tasks));
    } catch {
      window.alert('TaskPilot could not import this JSON file. Check that it is a valid TaskPilot backup.');
    }
  }

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  function openTaskFromHome(task) {
    setActivePage('workspace');
    setActiveTask(task);
  }

  function showMore(columnId) {
    setColumnLimits((current) => ({
      ...current,
      [columnId]: (current[columnId] || COLUMN_PREVIEW_LIMIT) + COLUMN_PREVIEW_LIMIT,
    }));
  }

  function toggleTaskExpanded(taskId) {
    setExpandedTaskIds((current) => {
      const next = new Set(current);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }

  function changeCardView(nextView) {
    setCardView(nextView);
    setExpandedTaskIds(new Set());
  }

  return (
    <main className={darkMode ? 'app theme-dark' : 'app'}>
      <div className={sidebarOpen ? 'shell sidebar-open' : 'shell'}>
        <aside className="sidebar" aria-label="Main navigation">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((value) => !value)} title="Toggle menu">
            <Menu size={20} />
          </button>
          <nav className="side-nav">
            <NavButton active={activePage === 'home'} icon={<Home size={19} />} label="Home" onClick={() => navigate('home')} />
            <NavButton active={activePage === 'workspace'} icon={<KanbanSquare size={19} />} label="Workspace" onClick={() => navigate('workspace')} />
            <NavButton active={activePage === 'administration'} icon={<ListChecks size={19} />} label="Administration" onClick={() => navigate('administration')} />
            <NavButton active={activePage === 'settings'} icon={<Settings size={19} />} label="Settings" onClick={() => navigate('settings')} />
            <NavButton active={activePage === 'docs'} icon={<BookOpen size={19} />} label="Documentation" onClick={() => navigate('docs')} />
            <NavButton active={activePage === 'about'} icon={<Info size={19} />} label="About" onClick={() => navigate('about')} />
          </nav>
        </aside>
        {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

        <div className="content-shell">
          <header className="topbar">
            <button className="mobile-menu-button" onClick={() => setSidebarOpen(true)} title="Open menu">
              <Menu size={20} />
            </button>
            <div className="brand">
              <span className="brand-mark">
                <img src="/taskpilot-mark.svg" alt="" />
              </span>
              <div>
                <p>TaskPilot</p>
                <span>Projects, activities, and workflow</span>
              </div>
            </div>
            <div className="top-actions">
              <button className="primary-button" onClick={() => addTask('backlog')}>
                <Plus size={18} />
                New task
              </button>
            </div>
          </header>

          {activePage === 'home' && (
            <>
              <section className="hero">
                <div>
                  <p className="eyebrow">MVP v0.4</p>
                  <h1>Project workflow dashboard.</h1>
                  <p className="hero-copy">
                    Review project health, urgent work, and completion progress before jumping into the operational workspace.
                  </p>
                </div>
              </section>

              <section className="metrics" aria-label="Board metrics">
                <Metric icon={<BriefcaseBusiness />} label="Active projects" value={operationalProjects.length} />
                <Metric icon={<KanbanSquare />} label="Active tasks" value={dashboardMetrics.active} />
                <Metric icon={<CheckCircle2 />} label="Objectives met" value={dashboardMetrics.objectiveMet} />
                <Metric icon={<Flag />} label="Total points" value={dashboardMetrics.points} />
              </section>

              <section className="dashboard-grid">
                <article className="dashboard-card">
                  <div className="panel-title">
                    <Sparkles size={18} />
                    Priority queue
                  </div>
                  <p>Blocked and high-priority tasks that may need attention next.</p>
                  <div className="focus-list focus-list-dashboard">
                    {focusQueue.length > 0 ? focusQueue.map((task) => (
                      <button key={task.id} className="focus-item" onClick={() => openTaskFromHome(task)}>
                        <span>{task.title}</span>
                        <strong>{task.blocked ? 'Blocked' : task.priority}</strong>
                      </button>
                    )) : <span className="quiet-empty">No urgent tasks.</span>}
                  </div>
                </article>
                <article className="dashboard-card">
                  <div className="panel-title">
                    <Flag size={18} />
                    Due next
                  </div>
                  <p>Upcoming active tasks by due date.</p>
                  <div className="focus-list focus-list-dashboard">
                    {dueSoonTasks.length > 0 ? dueSoonTasks.map((task) => (
                      <button key={task.id} className="focus-item" onClick={() => openTaskFromHome(task)}>
                        <span>{task.title}</span>
                        <strong>{task.due}</strong>
                      </button>
                    )) : <span className="quiet-empty">No upcoming tasks.</span>}
                  </div>
                </article>
                <article className="dashboard-card">
                  <div className="panel-title">
                    <CheckCircle2 size={18} />
                    Review lane
                  </div>
                  <p>Work waiting for feedback before completion.</p>
                  <div className="focus-list focus-list-dashboard">
                    {reviewQueue.length > 0 ? reviewQueue.map((task) => (
                      <button key={task.id} className="focus-item" onClick={() => openTaskFromHome(task)}>
                        <span>{task.title}</span>
                        <strong>{task.priority}</strong>
                      </button>
                    )) : <span className="quiet-empty">Nothing in review.</span>}
                  </div>
                </article>
                <article className="dashboard-card">
                  <div className="panel-title">
                    <CheckCircle2 size={18} />
                    Operational snapshot
                  </div>
                  <div className="snapshot-list">
                    <span><strong>{operationalTasks.length}</strong> visible tasks</span>
                    <span><strong>{dashboardMetrics.blocked}</strong> blocked tasks</span>
                    <span><strong>{tasks.length}</strong> total tasks</span>
                  </div>
                </article>
                <article className="dashboard-card">
                  <div className="panel-title">
                    <Flag size={18} />
                    Quick actions
                  </div>
                  <div className="action-stack">
                    <button className="ghost-button" onClick={() => navigate('workspace')}>
                      <KanbanSquare size={16} />
                      Open workspace
                    </button>
                    <button className="ghost-button" onClick={() => navigate('administration')}>
                      <ListChecks size={16} />
                      Open administration
                    </button>
                    <button className="ghost-button" onClick={() => addTask('backlog')}>
                      <Plus size={16} />
                      New task
                    </button>
                  </div>
                </article>
              </section>
            </>
          )}

          {activePage === 'workspace' && (
            <>
              <UtilityPage
                title="Workspace"
                eyebrow="Kanban"
                description="Move tasks through the workflow, filter active work, and open task details without mixing the board with administration."
              >
                <section className="metrics" aria-label="Filtered workspace metrics">
                  <Metric icon={<BriefcaseBusiness />} label="Visible projects" value={workspaceProjects.length} />
                  <Metric icon={<ListChecks />} label="Visible activities" value={workspaceProjectActivities.length} />
                  <Metric icon={<CheckCircle2 />} label="Objectives met" value={metrics.objectiveMet} />
                  <Metric icon={<Flag />} label="Total points" value={metrics.points} />
                </section>

                <section className="toolbar" aria-label="Board filters">
                  <div className="view-switch" aria-label="Card expansion controls">
                    <button className={cardView === 'expanded' ? 'view-tab view-tab-active' : 'view-tab'} onClick={() => changeCardView('expanded')}>
                      Expanded
                    </button>
                    <button className={cardView === 'collapsible' ? 'view-tab view-tab-active' : 'view-tab'} onClick={() => changeCardView('collapsible')}>
                      Collapsible
                    </button>
                  </div>
                  <label className="search">
                    <Search size={18} />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, projects, activities..." />
                  </label>
                  <label className="select-label">
                    <BriefcaseBusiness size={18} />
                    <select value={effectiveProjectId} onChange={(event) => {
                      setActiveProjectId(event.target.value);
                      setActiveActivityId('all');
                    }}>
                      <option value="all">All projects</option>
                      {workspaceProjects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} />
                  </label>
                  <label className="select-label">
                    <ListChecks size={18} />
                    <select value={effectiveActivityId} onChange={(event) => setActiveActivityId(event.target.value)}>
                      <option value="all">All activities</option>
                      {workspaceProjectActivities.map((activity) => (
                        <option key={activity.id} value={activity.id}>{activity.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} />
                  </label>
                  <label className="toggle-filter">
                    <input
                      type="checkbox"
                      checked={showArchivedWork}
                      onChange={(event) => setShowArchivedWork(event.target.checked)}
                    />
                    <span>Show paused/done</span>
                  </label>
                  <label className="select-label">
                    <Filter size={18} />
                    <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                      <option>All</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <ChevronDown size={18} />
                  </label>
                </section>

                {storageStatus === 'failed' && (
                  <div className="status-message" role="status">
                    Changes are active in this session, but your browser blocked local saving.
                  </div>
                )}

                <section className={[
                  'board',
                  focusMode ? 'board-focus' : '',
                  'board-compact',
                ].filter(Boolean).join(' ')} aria-label="Task board">
                  {columns.map((column) => {
                    const columnTasks = filteredTasks.filter((task) => task.column === column.id);
                    const visibleLimit = columnLimits[column.id] || COLUMN_PREVIEW_LIMIT;
                    const visibleTasks = columnTasks.slice(0, visibleLimit);
                    const hiddenCount = Math.max(0, columnTasks.length - visibleTasks.length);

                    return (
                      <section
                        key={column.id}
                        className="column"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                          if (draggedId) moveTask(draggedId, column.id);
                          setDraggedId(null);
                        }}
                      >
                        <div className="column-header">
                          <div>
                            <h2>{column.title}</h2>
                            <p>{column.hint}</p>
                          </div>
                          <span>{columnTasks.length}</span>
                        </div>
                        <div className="task-list">
                          {visibleTasks.length > 0 ? visibleTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              activity={activityById.get(task.activityId)}
                              density="compact"
                              isExpanded={expandedTaskIds.has(task.id)}
                              mode={cardView}
                              project={projectById.get(task.projectId)}
                              task={task}
                              onDragStart={() => setDraggedId(task.id)}
                              onToggleExpanded={() => toggleTaskExpanded(task.id)}
                              onOpen={() => setActiveTask(task)}
                              onMoveLeft={() => moveTaskByStep(task.id, -1)}
                              onMoveRight={() => moveTaskByStep(task.id, 1)}
                            />
                          )) : (
                            <div className="column-empty">
                              <strong>No tasks here</strong>
                              <span>{search || priorityFilter !== 'All' || effectiveProjectId !== 'all' || effectiveActivityId !== 'all' ? 'Try another filter or add a task.' : 'This phase is clear.'}</span>
                              <button type="button" className="ghost-button" onClick={() => addTask(column.id)}>
                                <Plus size={15} />
                                Add task
                              </button>
                            </div>
                          )}
                        </div>
                        {hiddenCount > 0 && (
                          <button className="show-more-button" onClick={() => showMore(column.id)}>
                            Show {Math.min(COLUMN_PREVIEW_LIMIT, hiddenCount)} more of {hiddenCount}
                          </button>
                        )}
                        <button className="add-column-task" onClick={() => addTask(column.id)}>
                          <Plus size={16} />
                          Add task
                        </button>
                      </section>
                    );
                  })}
                </section>
              </UtilityPage>
            </>
          )}

          {activePage === 'administration' && (
            <UtilityPage
              title="Administration"
              eyebrow="CRUD"
              description="Create, edit, filter, sort, and paginate projects, activities, and tasks from one operational admin surface."
            >
              <section className="toolbar" aria-label="Administration filters">
                <label className="select-label">
                  <BriefcaseBusiness size={18} />
                  <select value={activeProjectId} onChange={(event) => {
                    setActiveProjectId(event.target.value);
                    setActiveActivityId('all');
                  }}>
                    <option value="all">All projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} />
                </label>
                <label className="select-label">
                  <ListChecks size={18} />
                  <select value={activeActivityId} onChange={(event) => setActiveActivityId(event.target.value)}>
                    <option value="all">All activities</option>
                    {activeProjectActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>{activity.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} />
                </label>
                <button className="ghost-button" onClick={() => addProject()}>
                  <Plus size={16} />
                  New project
                </button>
                <button className="ghost-button" onClick={() => addActivity()}>
                  <Plus size={16} />
                  New activity
                </button>
              </section>

              {storageStatus === 'failed' && (
                <div className="status-message" role="status">
                  Changes are active in this session, but your browser blocked local saving.
                </div>
              )}

              <AdminPanel
                activities={activities}
                activeActivityId={activeActivityId}
                activeProjectId={activeProjectId}
                onAddActivity={addActivity}
                onAddProject={addProject}
                onAddTask={() => addTask('backlog', 'administration')}
                onDeleteActivity={deleteActivity}
                onDeleteProject={deleteProject}
                onDeleteTask={deleteTask}
                onUpdateActivity={updateActivity}
                onUpdateProject={updateProject}
                onUpdateTask={updateTask}
                projects={projects}
                tasks={tasks}
              />
            </UtilityPage>
          )}

          {activePage === 'settings' && (
            <UtilityPage
              title="Settings"
              eyebrow="Workspace"
              description="Keep global preferences and local JSON data controls away from the working board."
            >
              <div className="settings-grid">
                <section className="utility-card">
                  <h2>Preferences</h2>
                  <label className="setting-row">
                    <span>
                      <strong>Dark theme</strong>
                      <small>Save the current visual mode locally.</small>
                    </span>
                    <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} />
                  </label>
                  <label className="setting-row">
                    <span>
                      <strong>Focus mode</strong>
                      <small>Dim empty Kanban columns while working.</small>
                    </span>
                    <input type="checkbox" checked={focusMode} onChange={(event) => setFocusMode(event.target.checked)} />
                  </label>
                </section>
                <section className="utility-card">
                  <h2>Local data</h2>
                  <div className="action-stack">
                    <button className="ghost-button" onClick={exportBoardData}>
                      <Download size={16} />
                      Export JSON backup
                    </button>
                    <button className="ghost-button" onClick={() => importInputRef.current?.click()}>
                      <Upload size={16} />
                      Import JSON backup
                    </button>
                    <button className="ghost-button danger-action" onClick={resetBoard}>
                      Reset demo data
                    </button>
                  </div>
                  <input ref={importInputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importBoardData} />
                </section>
              </div>
            </UtilityPage>
          )}

          {activePage === 'docs' && (
            <UtilityPage
              title="Documentation"
              eyebrow="Reference"
              description="A compact in-app reference that also mirrors the repository documentation."
            >
              <div className="doc-links">
                <article>
                  <strong>Product</strong>
                  <span>Project to Activity to Task workflow with dashboard, workspace, and administration views.</span>
                </article>
                <article>
                  <strong>Storage</strong>
                  <span>Local JSON in browser storage with import/export backup controls.</span>
                </article>
                <article>
                  <strong>Mobile</strong>
                  <span>Capacitor shells use the Vite `dist` build for Android and iOS.</span>
                </article>
                <article>
                  <strong>Quality</strong>
                  <span>Run tests, build, mobile sync, and dependency audit before publishing.</span>
                </article>
              </div>
            </UtilityPage>
          )}

          {activePage === 'about' && (
            <UtilityPage
              title="About TaskPilot"
              eyebrow="MVP v0.4"
              description="TaskPilot is a frontend-first project workflow board for grouped local task planning."
            >
              <div className="about-grid">
                <Metric icon={<BriefcaseBusiness />} label="Projects" value={projects.length} />
                <Metric icon={<ListChecks />} label="Activities" value={activities.length} />
                <Metric icon={<KanbanSquare />} label="Tasks" value={tasks.length} />
                <Metric icon={<Flag />} label="Points" value={tasks.reduce((total, task) => total + Number(task.points || 0), 0)} />
              </div>
              <section className="utility-card">
                <h2>Current scope</h2>
                <p>
                  React, Vite, local JSON persistence, Capacitor shells, project/activity/task grouping,
                  dashboard, compact Kanban workspace, CRUD administration, and guarded import/export. No backend, accounts,
                  collaboration, or production AI features yet.
                </p>
              </section>
            </UtilityPage>
          )}
        </div>
      </div>

      {activeTask && (
        <TaskDrawer
          activities={activities}
          projects={projects}
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onChange={(patch) => updateTask(activeTask.id, patch)}
        />
      )}
    </main>
  );
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <button className={active ? 'nav-button nav-button-active' : 'nav-button'} onClick={onClick} title={label}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function UtilityPage({ children, description, eyebrow, title }) {
  return (
    <section className="utility-page">
      <div className="utility-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
