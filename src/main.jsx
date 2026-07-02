import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock3,
  Filter,
  Flag,
  GripVertical,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Sparkles,
  SunMedium,
  UserRound,
  X,
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'taskpilot-board-v1';

const columns = [
  { id: 'backlog', title: 'Backlog', hint: 'Ideas and unshaped work' },
  { id: 'ready', title: 'Ready', hint: 'Clear and ready to start' },
  { id: 'progress', title: 'In Progress', hint: 'Active execution' },
  { id: 'review', title: 'Review', hint: 'Waiting for feedback' },
  { id: 'done', title: 'Done', hint: 'Completed and shipped' },
];

const initialTasks = [
  {
    id: 'tp-101',
    title: 'Draft public README',
    description: 'Explain what TaskPilot is, who it is for, and what the MVP can do today.',
    column: 'backlog',
    owner: 'Dario',
    priority: 'High',
    tag: 'Docs',
    due: '2026-07-03',
    points: 2,
    blocked: false,
    checklist: ['Positioning', 'MVP features', 'Next steps'],
  },
  {
    id: 'tp-102',
    title: 'Design task detail panel',
    description: 'Make editing feel fast without leaving the board.',
    column: 'ready',
    owner: 'Dario',
    priority: 'Medium',
    tag: 'UX',
    due: '2026-07-05',
    points: 3,
    blocked: false,
    checklist: ['Fields', 'Checklist', 'Save flow'],
  },
  {
    id: 'tp-103',
    title: 'Create drag and drop board',
    description: 'Move cards left to right and persist the updated status locally.',
    column: 'progress',
    owner: 'Dario',
    priority: 'High',
    tag: 'React',
    due: '2026-07-02',
    points: 5,
    blocked: false,
    checklist: ['Columns', 'Cards', 'Drop targets'],
  },
  {
    id: 'tp-104',
    title: 'Add blocked task signal',
    description: 'Surface blocked work in the overview before it becomes invisible.',
    column: 'review',
    owner: 'Ops',
    priority: 'High',
    tag: 'Ops',
    due: '2026-07-01',
    points: 2,
    blocked: true,
    checklist: ['Badge', 'Metric', 'Filter'],
  },
  {
    id: 'tp-105',
    title: 'Publish first MVP screenshot',
    description: 'Capture the first version after the layout is stable.',
    column: 'done',
    owner: 'Dario',
    priority: 'Low',
    tag: 'Portfolio',
    due: '2026-07-07',
    points: 1,
    blocked: false,
    checklist: ['Desktop shot', 'Mobile shot'],
  },
];

const priorityRank = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function loadTasks() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : initialTasks;
    return Array.isArray(parsed) ? parsed : initialTasks;
  } catch {
    return initialTasks;
  }
}

function saveTasks(tasks) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

function createTask(column = 'backlog') {
  return {
    id: `tp-${Date.now()}`,
    title: 'New task',
    description: 'Describe the outcome and the next concrete action.',
    column,
    owner: 'Dario',
    priority: 'Medium',
    tag: 'Planning',
    due: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    points: 2,
    blocked: false,
    checklist: ['Define scope'],
  };
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [activeTask, setActiveTask] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [storageStatus, setStorageStatus] = useState('ready');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesText = `${task.title} ${task.description} ${task.owner} ${task.tag}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        return matchesText && matchesPriority;
      })
      .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  }, [priorityFilter, search, tasks]);

  const metrics = useMemo(() => {
    const open = tasks.filter((task) => task.column !== 'done').length;
    const blocked = tasks.filter((task) => task.blocked).length;
    const done = tasks.filter((task) => task.column === 'done').length;
    const points = tasks.reduce((total, task) => total + Number(task.points || 0), 0);
    return { open, blocked, done, points };
  }, [tasks]);

  const focusQueue = useMemo(() => {
    return tasks
      .filter((task) => task.column !== 'done')
      .sort((a, b) => {
        if (Number(b.blocked) !== Number(a.blocked)) return Number(b.blocked) - Number(a.blocked);
        return priorityRank[b.priority] - priorityRank[a.priority];
      })
      .slice(0, 3);
  }, [tasks]);

  function updateTasks(nextTasks) {
    setTasks(nextTasks);
    setStorageStatus(saveTasks(nextTasks) ? 'saved' : 'failed');
  }

  function addTask(columnId) {
    const nextTask = createTask(columnId);
    updateTasks([nextTask, ...tasks]);
    setActiveTask(nextTask);
  }

  function updateTask(taskId, patch) {
    const nextTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task));
    updateTasks(nextTasks);
    setActiveTask((current) => (current?.id === taskId ? { ...current, ...patch } : current));
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
    updateTasks(initialTasks);
    setActiveTask(null);
  }

  return (
    <main className={darkMode ? 'app theme-dark' : 'app'}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <LayoutDashboard size={24} />
          </span>
          <div>
            <p>TaskPilot</p>
            <span>React workflow board</span>
          </div>
        </div>
        <div className="top-actions">
          <button className="icon-button" onClick={() => setFocusMode((value) => !value)} title="Toggle focus mode">
            <Sparkles size={18} />
          </button>
          <button className="icon-button" onClick={() => setDarkMode((value) => !value)} title="Toggle theme">
            {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>
          <button className="primary-button" onClick={() => addTask('backlog')}>
            <Plus size={18} />
            New task
          </button>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">MVP v0.1</p>
          <h1>Plan work, spot blockers, and move tasks with clarity.</h1>
          <p className="hero-copy">
            A portfolio-ready React task board with drag-and-drop workflow, local persistence,
            filters, metrics, and a focused operational view.
          </p>
        </div>
        <aside className="focus-panel">
          <div className="panel-title">
            <Sparkles size={18} />
            Focus queue
          </div>
          {focusQueue.map((task) => (
            <button key={task.id} className="focus-item" onClick={() => setActiveTask(task)}>
              <span>{task.title}</span>
              <strong>{task.priority}</strong>
            </button>
          ))}
        </aside>
      </section>

      <section className="metrics" aria-label="Board metrics">
        <Metric icon={<CircleDashed />} label="Open tasks" value={metrics.open} />
        <Metric icon={<AlertTriangle />} label="Blocked" value={metrics.blocked} tone="danger" />
        <Metric icon={<CheckCircle2 />} label="Completed" value={metrics.done} />
        <Metric icon={<Flag />} label="Total points" value={metrics.points} />
      </section>

      <section className="toolbar" aria-label="Board filters">
        <label className="search">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, owners, tags..." />
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
        <button className="ghost-button" onClick={resetBoard}>Reset demo data</button>
      </section>

      {storageStatus === 'failed' && (
        <div className="status-message" role="status">
          Changes are active in this session, but your browser blocked local saving.
        </div>
      )}

      <section className={focusMode ? 'board board-focus' : 'board'} aria-label="Task board">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.column === column.id);
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
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={() => setDraggedId(task.id)}
                    onOpen={() => setActiveTask(task)}
                    onMoveLeft={() => moveTaskByStep(task.id, -1)}
                    onMoveRight={() => moveTaskByStep(task.id, 1)}
                  />
                ))}
              </div>
              <button className="add-column-task" onClick={() => addTask(column.id)}>
                <Plus size={16} />
                Add task
              </button>
            </section>
          );
        })}
      </section>

      {activeTask && (
        <TaskDrawer
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onChange={(patch) => updateTask(activeTask.id, patch)}
        />
      )}
    </main>
  );
}

function Metric({ icon, label, value, tone }) {
  return (
    <article className={tone === 'danger' ? 'metric metric-danger' : 'metric'}>
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </article>
  );
}

function TaskCard({ task, onDragStart, onOpen, onMoveLeft, onMoveRight }) {
  const columnIndex = columns.findIndex((column) => column.id === task.column);

  return (
    <article
      className="task-card"
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex="0"
    >
      <div className="task-topline">
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
        <div className="card-actions" aria-label={`Move ${task.title}`}>
          <button
            className="mini-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMoveLeft();
            }}
            disabled={columnIndex <= 0}
            title="Move left"
            aria-label={`Move ${task.title} left`}
          >
            <ChevronDown size={14} />
          </button>
          <GripVertical size={17} aria-hidden="true" />
          <button
            className="mini-button mini-button-right"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMoveRight();
            }}
            disabled={columnIndex >= columns.length - 1}
            title="Move right"
            aria-label={`Move ${task.title} right`}
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>
          <UserRound size={15} />
          {task.owner}
        </span>
        <span>
          <Clock3 size={15} />
          {task.due}
        </span>
      </div>
      <div className="task-footer">
        <span className="tag">{task.tag}</span>
        <strong>{task.points} pts</strong>
      </div>
      {task.blocked && <div className="blocked">Blocked</div>}
    </article>
  );
}

function TaskDrawer({ task, onClose, onChange }) {
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [task.id]);

  function handleKeyDown(event) {
    if (event.key === 'Escape') onClose();
  }

  return (
    <aside className="drawer" aria-label="Task details" onKeyDown={handleKeyDown}>
      <div className="drawer-card" role="dialog" aria-modal="true" aria-labelledby="task-drawer-title">
        <div className="drawer-header">
          <div>
            <p>Edit task</p>
            <h2 id="task-drawer-title">{task.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
        <label>
          Title
          <input ref={titleInputRef} value={task.title} onChange={(event) => onChange({ title: event.target.value })} />
        </label>
        <label>
          Description
          <textarea value={task.description} onChange={(event) => onChange({ description: event.target.value })} />
        </label>
        <div className="drawer-grid">
          <label>
            Owner
            <input value={task.owner} onChange={(event) => onChange({ owner: event.target.value })} />
          </label>
          <label>
            Priority
            <select value={task.priority} onChange={(event) => onChange({ priority: event.target.value })}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <label>
            Tag
            <input value={task.tag} onChange={(event) => onChange({ tag: event.target.value })} />
          </label>
          <label>
            Due date
            <input type="date" value={task.due} onChange={(event) => onChange({ due: event.target.value })} />
          </label>
          <label>
            Points
            <input
              type="number"
              min="1"
              max="13"
              value={task.points}
              onChange={(event) => onChange({ points: Number(event.target.value) })}
            />
          </label>
          <label>
            Status
            <select value={task.column} onChange={(event) => onChange({ column: event.target.value })}>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>{column.title}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={task.blocked} onChange={(event) => onChange({ blocked: event.target.checked })} />
          Mark as blocked
        </label>
        <div className="checklist">
          <p>Checklist</p>
          {task.checklist.map((item) => (
            <span key={item}>
              <CheckCircle2 size={15} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
