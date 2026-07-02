# TaskPilot

TaskPilot is a React task board MVP for managing work across a simple left-to-right workflow. It is designed as a portfolio project that demonstrates product thinking, task state, accessible workflow movement, filters, metrics, and local persistence.

The current version is intentionally frontend-only. It stores board data in `localStorage` and uses realistic demo tasks so the product can be evaluated without a backend.

Public visual documentation is available at [docs/index.html](docs/index.html).

Developer documentation is available at [docs/developer-guide.md](docs/developer-guide.md).

Accessibility and storage notes are available at [docs/accessibility-and-storage.md](docs/accessibility-and-storage.md).

Quality review checklist is available at [docs/quality-review.md](docs/quality-review.md).

## MVP Features

- React + Vite application.
- Kanban-style workflow: Backlog, Ready, In Progress, Review, Done.
- Drag-and-drop task movement between columns.
- Keyboard-accessible left/right task movement controls.
- Create and edit tasks through a detail drawer.
- Detail drawer with dialog semantics, initial focus, and Escape-to-close behavior.
- Search and priority filtering.
- Board metrics for open, blocked, completed, and total points.
- Focus queue for important or blocked work.
- Light and dark theme toggle.
- Local persistence with guarded `localStorage` reads and writes.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Quality Checks

```bash
npm run build
npm audit --audit-level=moderate
```

The current version has been checked with both commands.

## Project Goals

TaskPilot is not meant to be a Trello clone. It is a focused workflow board that can grow toward AI-assisted planning, weekly status summaries, blocked-work detection, and lightweight project reporting.

## Current Scope

TaskPilot is frontend-only. It does not include authentication, multi-user collaboration, real-time sync, backend storage, or production AI features yet. Those are roadmap items.

## Suggested GitHub Topics

`react`, `vite`, `kanban`, `task-manager`, `drag-and-drop`, `productivity`, `portfolio-project`
