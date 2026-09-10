# TaskPilot

TaskPilot is a React project and task board MVP for managing work across projects, activities, and a simple left-to-right workflow. It is designed as a portfolio project that demonstrates product thinking, grouped task state, accessible workflow movement, editable checklists, filters, metrics, CRUD administration, and local persistence.

The current version is intentionally frontend-only. It stores board data in `localStorage` and uses realistic demo tasks so the product can be evaluated without a backend.

The documentation site is published at [taskpilot.innovalogic.tech/docs/](https://taskpilot.innovalogic.tech/docs/), and its Markdown source index is available at [docs/README.md](docs/README.md).

Canonical technical guides cover [architecture](docs/ARCHITECTURE.md), [development](docs/DEVELOPMENT.md), [testing](docs/TESTING.md), [deployment](docs/DEPLOYMENT.md), [operations](docs/OPERATIONS.md), [security](docs/SECURITY.md), and [troubleshooting](docs/TROUBLESHOOTING.md).

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
- Data validation and normalization for required names, dates, points, statuses, unique identifiers, and task relationships, including recovery of orphaned imported tasks.
- Light and dark theme toggle with saved preference.
- Saved focus-mode preference.
- Local persistence with guarded `localStorage` reads and writes.
- Modular source structure for components, board data, and storage utilities.
- Automated unit, property, fuzz, integration, contract, performance, and browser E2E checks for storage, CRUD persistence, backup compatibility, data relationships, archived visibility, and responsive navigation.
- Capacitor configuration for Android and iOS native shells.
- JSON-backed `localStorage` persistence across web and Capacitor WebView.

## Run Locally

```bash
npm install
npm start
```

Then open `http://127.0.0.1:5179/`. This one command generates the documentation site and starts the complete frontend application; no backend process is required.

## Quality Checks

```bash
npm run verify:release
```

The automated baseline runs unit, property, fuzz, integration, contract, and performance tests; creates the production build; enforces asset budgets; exercises critical application and documentation flows in Chrome; and audits dependencies. It is only one part of the 13-gate release policy in [docs/TESTING.md](docs/TESTING.md). Every deployment must also complete and record the applicable manual and specialized checks in [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).

## Documentation Site

```bash
npm run docs:build
npm start
```

Open `http://127.0.0.1:5179/docs/`. The site is generated from the repository Markdown files. The production build validates its pages, assets, internal links, responsive navigation, local search, and return path to the application.

## GitHub Pages

The production web build is published from the `gh-pages` branch at [taskpilot.innovalogic.tech](https://taskpilot.innovalogic.tech). The custom domain is preserved by `public/CNAME`.

```bash
npm run deploy
```

The deploy script runs the automated release baseline first and then updates the `gh-pages` branch with the contents of `dist`. A successful command does not replace the complete release checklist.

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

## Contributing, Security, and License

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [docs/SECURITY.md](docs/SECURITY.md) for private vulnerability reporting and release security requirements.

TaskPilot is currently source-available for evaluation and portfolio use under the terms in [LICENSE](LICENSE). Direct third-party dependencies are listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
