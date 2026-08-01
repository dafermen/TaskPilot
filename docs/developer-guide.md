# TaskPilot Developer Guide

## Stack

- React
- Vite
- lucide-react
- Browser `localStorage`
- Capacitor native shells for Android and iOS
- Native HTML drag-and-drop events
- Keyboard-accessible movement controls
- Node test runner

## Structure

```text
TaskPilot/
  index.html
  package.json
  capacitor.config.json
  android/
  ios/
  src/
    components/
      AdminPanel.jsx
      Metric.jsx
      TaskCard.jsx
      TaskDrawer.jsx
    data/
      boardData.js
    utils/
      recordStatus.js
      storage.js
      taskStatus.js
    main.jsx
    styles.css
  test/
    unit/
    integration/
    contract/
    e2e/
    fixtures/
    property/
    fuzz/
    regression/
    performance/
  docs/
    ARCHITECTURE.md
    API.md
    DEVELOPMENT.md
    TESTING.md
    DEPLOYMENT.md
    OPERATIONS.md
    SECURITY.md
    TROUBLESHOOTING.md
    adr/
    site/
      docs.config.mjs
      docs.css
      docs.js
    developer-guide.md
    quality-review.md
  scripts/
    build-docs.mjs
    check-docs.mjs
    check-docs-browser.mjs
  AGENTS.md
  CURRENT_STATUS.md
```

## Current Architecture

The app is split into a small set of focused modules. `src/main.jsx` coordinates application state, the app shell, and page-level layout. Reusable UI lives in `src/components/`, demo board data lives in `src/data/boardData.js`, and browser persistence helpers live in `src/utils/storage.js`.

The data model has three levels:

- Projects: `id`, `name`, `owner`, `color`, and `status`.
- Activities: `id`, `projectId`, `name`, `owner`, and `status`.
- Tasks: `id`, `projectId`, `activityId`, `title`, `description`, `column`, `owner`, `priority`, `tag`, `due`, `points`, `blocked`, and `checklist`.

Checklist items use `{ id, text, done }` objects. Legacy string checklist items are normalized on load so older local data does not break the app. Legacy tasks without `projectId` or `activityId` are assigned to the default project and activity.

Objective completion is centralized in `src/utils/taskStatus.js`. A task is considered objective met when it is in the `done` column, is not blocked, has at least one checklist item, and every checklist item is complete. Cards, drawer status, metrics, and Administration filters use that helper so the rule stays consistent.

Operational project/activity status is centralized in `src/utils/recordStatus.js`. `Planning` and `Active` records are operational. `Paused` and `Done` records remain stored and editable in Administration, but Home and Workspace hide their tasks by default. The Workspace `Show paused/done` preference temporarily includes them for review without changing any data.

State changes are persisted with JSON in `localStorage` through separate project, activity, and task storage keys. Reads and writes are guarded so the app can keep working if stored JSON is invalid, storage quota is exceeded, or the browser blocks local persistence. Theme, focus mode, active project, active activity, card view, and the show paused/done preference are also persisted independently.

`src/utils/storage.js` owns normalization, validation, backup creation, and backup parsing. It repairs missing task grouping, invalid columns, invalid priorities, out-of-range points, malformed dates, blank names, invalid colors, and legacy checklist strings. Empty task arrays remain empty so imported or manually cleared boards do not silently reload demo tasks.

The app exports backups as JSON with `version`, `exportedAt`, `projects`, `activities`, and `tasks`. Imports replace local project/activity/task data only after user confirmation and successful parsing.

Task movement works through native drag-and-drop and through explicit card controls for keyboard and assistive-technology users. The task drawer uses dialog semantics, moves focus into the title field when opened, traps keyboard focus while open, and closes with Escape.

The Workspace view is optimized for operational Kanban movement. It uses compact task cards, an expanded/collapsible card view preference, empty-column states, and a show-more limit so phases with many tasks remain readable without collapsing the workflow columns. In Collapsible mode, switching into the mode starts every task closed; clicking a task opens or closes its inline details, double-clicking opens the drawer, Shift + Enter opens the drawer for keyboard users, and expanded cards show a Details action for mobile users. Workspace filters out Paused/Done projects and activities by default and offers a `Show paused/done` control for historical review. The Administration view is the CRUD surface for all projects, activities, and tasks, so editing larger sets of records or reactivating paused work does not overload the board UI. Administration uses compact tables with per-column filters, sortable headers, pagination, and an objective column for quickly separating completed outcomes from pending work.

Navigation is handled with lightweight local state instead of a router. The collapsible sidebar exposes Home, Workspace, Administration, Settings, Documentation, and About. Home is now a dashboard with high-level metrics, a priority queue, upcoming due dates, review-lane work, an operational snapshot, and quick actions. Workspace owns Kanban filters and task movement. Administration owns CRUD tables. Settings owns global controls such as theme, focus mode, JSON backup import/export, and demo reset. Documentation links to repository docs. About summarizes the current MVP scope and local record counts.

Capacitor uses `dist` as its `webDir`. Run `npm run mobile:sync` after changing the web app so Android and iOS receive the latest built assets.

`AGENTS.md` and `CURRENT_STATUS.md` are continuity files for future Codex sessions. Update `CURRENT_STATUS.md` whenever a meaningful implementation, validation, deployment, or product decision changes the current handoff state.

## Verification

Run the automated baseline before publishing:

```bash
npm run verify:release
npm run mobile:sync
```

Then complete all applicable gates in `TESTING.md` and record them with `RELEASE_CHECKLIST.md`. The automated baseline does not replace acceptance, mutation, fuzzing, end-to-end, resilience, performance, or device evidence.

## GitHub Pages Deployment

TaskPilot is published from the `gh-pages` branch and uses the custom domain `taskpilot.innovalogic.tech`. Keep `public/CNAME` in source control so Vite copies it into `dist` and the deployment retains the domain configuration.

```bash
npm run deploy
```

The `predeploy` script runs `npm run verify:release` before `gh-pages` publishes `dist`.

## Next Technical Steps

1. Add React component tests for filtering, moving cards, reset behavior, and drawer editing.
2. Replace native drag events with `@dnd-kit` if touch/mobile drag behavior becomes a priority.
3. Add real-device checks for Android and iOS.
4. Add component tests around sidebar navigation, import/export UI, destructive confirmations, and Administration editing flows.
5. Keep local JSON storage until the product flow is stable enough to justify backend or database work.
6. Add workspace grouping if multiple clients or teams become part of the product.

## Do Not Claim Yet

- Multi-user collaboration.
- Real-time sync.
- AI planning.
- Authentication.
- Integrations.

These are roadmap items, not current MVP capabilities.
