# Current Status

Last updated: July 27, 2026.

## Current Phase

TaskPilot is in MVP refinement. The product is frontend-only, using React + Vite, `localStorage`, JSON import/export, and Capacitor shells for Android/iOS.

## Completed

- Project -> Activity -> Task grouping.
- Home dashboard separated from the Workspace board.
- Workspace Kanban with compact cards, expanded/collapsible modes, show-more limits, search, filters, and empty-column states.
- Administration CRUD for projects, activities, and tasks with pagination, sortable columns, and per-column filters.
- Objective completion signal for tasks that are Done, unblocked, and fully checked off.
- Sidebar navigation for Home, Workspace, Administration, Settings, Documentation, and About.
- JSON backup export/import and demo reset controls.
- Capacitor Android/iOS shell setup.
- Visual cleanup for compact operational use.
- Logical archive behavior:
  - `Planning` and `Active` projects/activities are shown in Home/Workspace.
  - `Paused` and `Done` projects/activities remain editable in Administration.
  - Workspace can temporarily show paused/done work through `Show paused/done`.
- Continuity files added: `AGENTS.md` and `CURRENT_STATUS.md`.

## Latest Validation

- `npm test`: passed, 13 tests.
- `npm run build`: passed.
- `npm audit --audit-level=moderate`: passed, 0 vulnerabilities after `npm audit fix`.
- `npm run mobile:sync`: passed for Android, iOS, and web assets.
- Local dev server requested at `http://127.0.0.1:5179/`.

## Pending Validation

- Manual browser smoke test at `http://127.0.0.1:5179/` after the dev server is started.
- Manual Android/iOS device or simulator tests remain pending.

## Next Recommended Steps

1. Verify the Workspace `Show paused/done` toggle with a Paused project and a Done activity.
2. Review whether the `gh-pages` deployment scripts should remain, be documented, or be replaced by a GitHub Actions Pages workflow.
3. Add component tests for Workspace filtering, Administration editing, import/export, and sidebar navigation.
4. Create a non-root deployment user on the test server before any server deployment work.
5. Keep database work deferred until the workflow stabilizes.

## Useful Commands

```bash
npm test
npm run build
npm audit --audit-level=moderate
npm run dev -- --port 5179
```

## Notes For The Next Codex Session

- Start by reading `AGENTS.md`, this file, and `git status -sb`.
- Do not assume `C:\Projects\TaskPilot` is inside the active sandbox; commands there may require approval.
- The current implementation has uncommitted work unless this file says a later commit was made.
