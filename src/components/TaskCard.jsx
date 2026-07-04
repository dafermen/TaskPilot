import { ChevronDown, ChevronRight, Clock3, GripVertical, UserRound } from 'lucide-react';
import { columns } from '../data/boardData.js';
import { getChecklistProgress, isObjectiveMet } from '../utils/taskStatus.js';

export function TaskCard({
  activity,
  density = 'comfortable',
  isExpanded = false,
  mode = 'expanded',
  project,
  task,
  onDragStart,
  onOpen,
  onMoveLeft,
  onMoveRight,
  onToggleExpanded,
}) {
  const columnIndex = columns.findIndex((column) => column.id === task.column);
  const checklistProgress = getChecklistProgress(task);
  const objectiveMet = isObjectiveMet(task);
  const collapsible = mode === 'collapsible';
  const collapsed = collapsible && !isExpanded;
  const compact = density === 'compact';
  const className = [
    'task-card',
    objectiveMet ? 'task-card-complete' : '',
    compact ? 'task-card-compact' : '',
    collapsible ? 'task-card-collapsible' : '',
    collapsed ? 'task-card-collapsed' : 'task-card-expanded',
  ].filter(Boolean).join(' ');

  function handlePrimaryAction() {
    if (collapsible) {
      onToggleExpanded();
      return;
    }
    onOpen();
  }

  return (
    <article
      className={className}
      draggable
      onDragStart={onDragStart}
      onClick={handlePrimaryAction}
      onDoubleClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && event.shiftKey) {
          event.preventDefault();
          onOpen();
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handlePrimaryAction();
        }
      }}
      role="button"
      tabIndex="0"
      aria-expanded={collapsible ? isExpanded : undefined}
    >
      <div className="task-topline">
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
        {objectiveMet && <span className="objective-badge">Objective met</span>}
        <div className="card-actions" aria-label={`Move ${task.title}`}>
          {collapsible && (
            <button
              className="mini-button expand-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpanded();
              }}
              title={isExpanded ? 'Collapse task' : 'Expand task'}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${task.title}`}
              aria-expanded={isExpanded}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {columnIndex > 0 && (
            <button
              className="mini-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMoveLeft();
              }}
              title="Move left"
              aria-label={`Move ${task.title} left`}
            >
              <ChevronDown size={14} />
            </button>
          )}
          <GripVertical size={17} aria-hidden="true" />
          {columnIndex < columns.length - 1 && (
            <button
              className="mini-button mini-button-right"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMoveRight();
              }}
              title="Move right"
              aria-label={`Move ${task.title} right`}
            >
              <ChevronDown size={14} />
            </button>
          )}
        </div>
      </div>
      <h3>{task.title}</h3>
      <div className="task-group">
        <span style={{ '--project-color': project?.color || '#0e7490' }}>{project?.name || 'No project'}</span>
        <span>{activity?.name || 'No activity'}</span>
      </div>
      {!compact && !collapsed && <p>{task.description}</p>}
      <div className="task-meta">
        {!compact && !collapsed && (
          <span>
            <UserRound size={15} />
            {task.owner}
          </span>
        )}
        <span>
          <Clock3 size={15} />
          {task.due}
        </span>
      </div>
      <div className="task-footer">
        {!compact && !collapsed && <span className="tag">{task.tag}</span>}
        <strong>{task.points} pts</strong>
      </div>
      {!collapsed && (
        <div className="check-progress">
          {checklistProgress.done}/{checklistProgress.total} checklist
        </div>
      )}
      {task.blocked && <div className="blocked">Blocked</div>}
    </article>
  );
}
