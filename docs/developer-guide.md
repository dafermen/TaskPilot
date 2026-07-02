# TaskPilot Developer Guide

## Stack

- React
- Vite
- lucide-react
- Browser `localStorage`
- Native HTML drag-and-drop events
- Keyboard-accessible movement controls

## Structure

```text
TaskPilot/
  index.html
  package.json
  src/
    main.jsx
    styles.css
  docs/
    index.html
    developer-guide.md
    quality-review.md
```

## Current Architecture

The MVP keeps all app logic in `src/main.jsx` to make the first iteration easy to inspect. Tasks are stored as objects with `id`, `title`, `description`, `column`, `owner`, `priority`, `tag`, `due`, `points`, `blocked`, and `checklist`.

State changes are persisted with `localStorage` through `saveTasks`. Reads and writes are guarded so the app can keep working if stored JSON is invalid, storage quota is exceeded, or the browser blocks local persistence.

Task movement works through native drag-and-drop and through explicit card controls for keyboard and assistive-technology users. The task drawer uses dialog semantics, moves focus into the title field when opened, and closes with Escape.

## Verification

Run these checks before publishing:

```bash
npm run build
npm audit --audit-level=moderate
```

Last verified: July 2, 2026.

## Next Technical Steps

1. Split components into `src/components/`.
2. Move demo tasks into `src/data/initialTasks.js`.
3. Replace native drag events with `@dnd-kit` if touch/mobile drag behavior becomes a priority.
4. Add tests for task creation, filtering, and moving.
5. Add backend storage only after the product flow feels right.
6. Persist theme preference after adding a settings layer.

## Do Not Claim Yet

- Multi-user collaboration.
- Real-time sync.
- AI planning.
- Authentication.
- Integrations.

These are roadmap items, not current MVP capabilities.
