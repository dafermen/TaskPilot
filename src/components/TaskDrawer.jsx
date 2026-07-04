import { CheckCircle2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { columns } from '../data/boardData.js';
import { getChecklistProgress, isObjectiveMet } from '../utils/taskStatus.js';

export function TaskDrawer({ activities, projects, task, onClose, onChange }) {
  const titleInputRef = useRef(null);
  const drawerRef = useRef(null);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [task.id]);

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = drawerRef.current?.querySelectorAll(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)',
    );
    const focusable = Array.from(focusableElements || []);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function updateChecklistItem(itemId, patch) {
    onChange({
      checklist: task.checklist.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    });
  }

  function addChecklistItem() {
    const text = newChecklistItem.trim();
    if (!text) return;

    onChange({
      checklist: [
        ...task.checklist,
        {
          id: `${task.id}-check-${Date.now()}`,
          text,
          done: false,
        },
      ],
    });
    setNewChecklistItem('');
  }

  function removeChecklistItem(itemId) {
    onChange({
      checklist: task.checklist.filter((item) => item.id !== itemId),
    });
  }

  const projectActivities = activities.filter((activity) => activity.projectId === task.projectId);
  const checklistProgress = getChecklistProgress(task);
  const objectiveMet = isObjectiveMet(task);

  return (
    <aside className="drawer" aria-label="Task details" onKeyDown={handleKeyDown}>
      <div ref={drawerRef} className="drawer-card" role="dialog" aria-modal="true" aria-labelledby="task-drawer-title">
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
            Project
            <select
              value={task.projectId}
              onChange={(event) => {
                const nextProjectId = event.target.value;
                const nextActivity = activities.find((activity) => activity.projectId === nextProjectId);
                onChange({ projectId: nextProjectId, activityId: nextActivity?.id || '' });
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <label>
            Activity
            <select value={task.activityId} onChange={(event) => onChange({ activityId: event.target.value })}>
              {projectActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>{activity.name}</option>
              ))}
            </select>
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
        <div className={objectiveMet ? 'objective-summary objective-summary-met' : 'objective-summary'}>
          <CheckCircle2 size={17} />
          <div>
            <strong>{objectiveMet ? 'Objective met' : 'Objective pending'}</strong>
            <span>
              {checklistProgress.done}/{checklistProgress.total} checklist items complete
              {task.column === 'done' ? ' in Done' : ' before Done'}
            </span>
          </div>
        </div>
        <section className="checklist" aria-labelledby="checklist-title">
          <p id="checklist-title">Checklist</p>
          {task.checklist.map((item) => (
            <div key={item.id} className={item.done ? 'checklist-item checklist-item-done' : 'checklist-item'}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(event) => updateChecklistItem(item.id, { done: event.target.checked })}
                />
                <CheckCircle2 size={15} />
                <input
                  value={item.text}
                  aria-label="Checklist item"
                  onChange={(event) => updateChecklistItem(item.id, { text: event.target.value })}
                />
              </label>
              <button type="button" className="mini-button" onClick={() => removeChecklistItem(item.id)} title="Remove checklist item">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="checklist-add">
            <input
              value={newChecklistItem}
              onChange={(event) => setNewChecklistItem(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addChecklistItem();
                }
              }}
              placeholder="Add checklist item"
            />
            <button type="button" className="ghost-button" onClick={addChecklistItem}>
              <Plus size={16} />
              Add
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
