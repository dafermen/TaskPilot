# TaskPilot

TaskPilot is a React project and task board MVP for managing work across projects, activities, and a simple left-to-right workflow. It is designed as a portfolio project that demonstrates product thinking, grouped task state, accessible workflow movement, editable checklists, filters, metrics, CRUD administration, and local persistence.

The current version is intentionally frontend-only. It stores board data in `localStorage` and uses realistic demo tasks so the product can be evaluated without a backend.

Public visual documentation is available at [docs/index.html](docs/index.html).

Developer documentation is available at [docs/developer-guide.md](docs/developer-guide.md).

Mobile Capacitor documentation is available at [docs/mobile-capacitor.md](docs/mobile-capacitor.md).

Accessibility and storage notes are available at [docs/accessibility-and-storage.md](docs/accessibility-and-storage.md).

Quality review checklist is available at [docs/quality-review.md](docs/quality-review.md).

Continuity notes for future Codex sessions are available at [AGENTS.md](AGENTS.md) and [CURRENT_STATUS.md](CURRENT_STATUS.md).

## MVP Features

- React + Vite application.
- Project -> Activity -> Task grouping.
- Home dashboard with executive metrics, priority queue, upcoming due dates, review lane, operational snapshot, and quick actions.
- Dedicated Workspace page for Kanban movement, search, and board filters.
- Workspace readability controls: compact task cards, expandable/collapsible details, expanded-card detail access for mobile users, empty-column states, and show-more limits for busy phases.
- Workspace hides `Paused` and `Done` projects or activities by default, with an optional control to show them when reviewing historical work.
- Kanban-style workflow: Backlog, Ready, In Progress, Review, Done.
- Separate administration view for listing, filtering, creating, editing, and deleting projects, activities, and tasks.
- Administration tables support per-column filtering, sortable headers, and pagination for larger task lists.
- Compact workspace layout optimized for scanning and saving screen space.
- Collapsible left sidebar with Home, Workspace, Administration, Settings, Documentation, and About.
- Settings page for theme, focus mode, JSON import/export, and demo reset controls.
- Drag-and-drop task movement between columns.
- Keyboard-accessible left/right task movement controls.
- Create and edit tasks through a detail drawer.
- Edit task checklists by adding, completing, renaming, and removing items.
- Show an objective-met signal when a task is in Done, is not blocked, and has every checklist item completed.
- Detail drawer with dialog semantics, initial focus, focus trapping, and Escape-to-close behavior.
- Search, project, activity, and priority filtering.
- Board metrics for projects, activities, completed objectives, and total points.
- Secondary priority queue for important or blocked work.
- Export and import JSON backups for local data portability.
- Confirmation prompts before destructive reset/import/delete actions.
- Data validation and normalization for required names, dates, points, statuses, and task relationships.
- Light and dark theme toggle with saved preference.
- Saved focus-mode preference.
- Local persistence with guarded `localStorage` reads and writes.
- Modular source structure for components, board data, and storage utilities.
- Node-based tests for storage, preferences, project/activity records, task creation, backup import/export, validation, and legacy migrations.
- Capacitor configuration for Android and iOS native shells.
- JSON-backed `localStorage` persistence across web and Capacitor WebView.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Quality Checks

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

The current version has been checked with `npm test`, `npm run build`, `npm audit --audit-level=moderate`, and `npm run mobile:sync`.

## GitHub Pages

The production web build is published from the `gh-pages` branch at [taskpilot.innovalogic.tech](https://taskpilot.innovalogic.tech). The custom domain is preserved by `public/CNAME`.

```bash
npm run deploy
```

The deploy script builds the application first and then updates the `gh-pages` branch with the contents of `dist`.

## Data Portability

TaskPilot stores projects, activities, and tasks as JSON in `localStorage`. Use the Settings page to download a backup or restore one later. Imported files are validated and normalized before replacing local data.

## Project and Activity Status

Projects and activities can be marked `Planning`, `Active`, `Paused`, or `Done` from Administration. `Planning` and `Active` records are operational and appear in Home and Workspace. `Paused` and `Done` records remain available in Administration but are hidden from Workspace by default so standby or completed work does not distract from active execution. Use the Workspace `Show paused/done` control when archived work needs to be reviewed.

## Objective Completion

A task counts as objective met only when it is in the Done column, is not blocked, and every checklist item is complete. The app shows this status on the task card, in the task drawer, in board metrics, and as an Administration filter.

## Mobile Builds

```bash
npm run mobile:sync
npm run mobile:android
npm run mobile:ios
```

`mobile:sync` builds the web app and syncs it into the native Android/iOS projects. Android opens with Android Studio. iOS opens with Xcode and requires macOS for actual device/simulator builds.

## Project Goals

TaskPilot is not meant to be a Trello clone. It is a focused project workflow board that can grow toward AI-assisted planning, weekly status summaries, blocked-work detection, and lightweight project reporting.

## Current Scope

TaskPilot is frontend-only. It does not include authentication, multi-user collaboration, real-time sync, backend storage, database storage, or production AI features yet. Database work is intentionally deferred until the product flow is stable.

## Suggested GitHub Topics

`react`, `vite`, `kanban`, `task-manager`, `drag-and-drop`, `productivity`, `portfolio-project`
