# TaskPilot Quality Review

Use this checklist before publishing screenshots, creating a GitHub repository, or linking the project from the portfolio.

## Product

- [x] A new visitor understands the product in under 10 seconds.
- [x] The board has realistic sample tasks.
- [x] Tasks belong to a project and an activity.
- [x] Project and activity filters update the Kanban view.
- [x] Home is a dashboard instead of the primary working board.
- [x] Home surfaces priority work, upcoming due dates, and review-lane tasks.
- [x] Workspace contains Kanban movement, search, and board filters.
- [x] Workspace supports compact collapsible cards plus show-more limits for large phases.
- [x] Workspace columns show useful empty states.
- [x] Workspace hides Paused/Done projects and activities by default.
- [x] Workspace can temporarily show Paused/Done work for review.
- [x] Administration view lists projects, activities, and tasks.
- [x] Administration view supports creating and editing projects, activities, and tasks.
- [x] Administration view supports pagination, per-column filters, and sortable columns.
- [x] Administration view prevents deleting projects or activities that still contain records.
- [x] Sidebar navigation exposes Home, Workspace, Administration, Settings, Documentation, and About.
- [x] Settings contains theme, focus mode, import/export, and reset controls.
- [x] Drag and drop works across every column.
- [x] Keyboard controls can move tasks left and right.
- [x] Creating a task opens the drawer.
- [x] Editing task fields persists after refresh when storage is available.
- [x] Checklist items can be added, renamed, completed, and removed.
- [x] Objective met appears only when a Done task is unblocked and all checklist items are complete.
- [x] Administration view can filter tasks by objective status.
- [x] Reset demo data works.
- [x] Reset, import, and delete actions ask for confirmation.
- [x] JSON backups can be exported and imported.
- [x] Theme and focus mode preferences persist.
- [x] Show paused/done preference persists.
- [x] Capacitor uses the Vite `dist` build as its native web bundle.

## UX

- [x] Layout works on laptop width.
- [x] Layout works on mobile width.
- [x] Workspace layout is compact enough to keep filters, metrics, and board context visible.
- [x] Busy columns remain readable when many tasks share the same phase.
- [x] Home dashboard remains light and does not carry the working board controls.
- [x] Header remains focused on primary task creation while global actions live in Settings.
- [x] Priority queue is secondary and does not compete with the hero message.
- [x] Expanded cards expose a detail action that works on mobile without relying on double click.
- [x] Cards remain readable in light and dark themes.
- [x] Objective badges and drawer status remain readable in light and dark themes.
- [x] Filters do not collapse the layout.
- [x] Empty columns still accept dropped cards.
- [x] Detail drawer has dialog semantics, initial focus, focus trap, and Escape close.

## Technical

- [x] `npm run build` passes.
- [x] `npm test` passes.
- [x] Unit, integration, and contract test groups pass.
- [x] `npm run mobile:sync` passes.
- [x] `npm audit --audit-level=moderate` reports no vulnerabilities.
- [x] Local storage errors fail gracefully.
- [x] Legacy checklist data is normalized on load.
- [x] Objective status utility is covered by tests.
- [x] Legacy task grouping is normalized on load.
- [x] Invalid imported data is normalized before storage.
- [x] Empty task arrays remain empty instead of reloading demo tasks.
- [x] README matches actual MVP features.
- [x] Documentation is generated under `/docs/` with no duplicated `/docs/docs/` routes.
- [x] Documentation navigation, search, theme, internal page, and app-return link pass real Chrome checks.
- [x] `.private/` is ignored before publishing.

## Remaining Manual Checks

- [ ] Smoke test first load in the deployed GitHub Pages or portfolio environment.
- [ ] Capture final desktop and mobile screenshots.
- [ ] Run on Android emulator or physical Android device.
- [ ] Run on iOS simulator or physical iPhone from macOS/Xcode.
- [ ] Complete the applicable 13-gate [release checklist](RELEASE_CHECKLIST.md).
