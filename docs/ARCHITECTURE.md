# Architecture

## System Context

TaskPilot is a frontend-only project workflow application. It runs as a Vite web application and inside Capacitor WebViews for Android and iOS. There is no backend, authentication service, remote API, or database in the current MVP.

```text
User
  |
  +-- Web browser ------------------+
  |                                 |
  +-- Android/iOS Capacitor shell --+--> React application
                                         |
                                         +--> localStorage
                                         +--> JSON import/export
```

## Application Layers

- `src/main.jsx`: application state, navigation, page composition, filters, and persistence orchestration.
- `src/components/`: reusable dashboard, Kanban, drawer, metric, and Administration UI.
- `src/data/boardData.js`: default projects, activities, tasks, workflow columns, and priority metadata.
- `src/utils/storage.js`: storage keys, normalization, JSON backup contract, import/export, and record factories.
- `src/utils/taskStatus.js`: checklist progress and objective-completion rules.
- `src/utils/recordStatus.js`: operational versus paused/completed record rules.
- `src/styles.css`: responsive application styling and theme behavior.
- `docs/site/`: documentation navigation, theme, responsive styles, and browser behavior.
- `scripts/build-docs.mjs`: converts the existing Markdown sources into static pages under `/docs/`.
- `scripts/check-docs.mjs` and `scripts/check-docs-browser.mjs`: static and Chrome-based documentation validation.
- `vite.config.js`: React support plus a development-only directory-index rewrite for `/docs/` routes.

## Domain Model

The hierarchy is:

```text
Project
  +-- Activity
        +-- Task
              +-- Checklist item
```

Projects and activities use `Planning`, `Active`, `Paused`, or `Done`. Tasks move through `backlog`, `ready`, `progress`, `review`, and `done`.

A task meets its objective only when it is in `done`, is not blocked, has at least one checklist item, and every checklist item is complete.

## Persistence

The app stores separate JSON arrays for projects, activities, and tasks in browser `localStorage`. Preferences use independent keys. JSON backup files provide manual portability.

All imported and legacy data passes through normalization. The normalizer repairs invalid relationships and supported field values before data reaches the application.

See [API.md](API.md) for the current schemas and storage keys.

## Navigation and Views

- Home: high-level dashboard and operational summary.
- Workspace: Kanban execution, search, filters, and task movement.
- Administration: paginated, sortable, filterable CRUD for projects, activities, and tasks.
- Settings: theme, focus mode, JSON backup, restore, and reset.
- Documentation and About: product guidance and scope.

Navigation is local React state rather than URL routing. This keeps the MVP small but means deep links are not currently supported.

## Deployment Targets

- Web: static Vite output in `dist`, published through GitHub Pages.
- Documentation: generated static pages in `dist/docs`, served from `/docs/` without a second application router.
- Android: Capacitor project in `android/`.
- iOS: Capacitor project in `ios/`; Xcode and macOS are required to build and sign.

## Current Boundaries

TaskPilot does not currently provide multi-user synchronization, remote backups, server-side authorization, real-time collaboration, or conflict resolution across devices. These boundaries are intentional while the workflow is refined.

## Decisions

Significant decisions are recorded in [docs/adr](adr/README.md).
