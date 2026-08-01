# Current Status

Last updated: August 1, 2026.

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
- GitHub Pages deployment documented for `taskpilot.innovalogic.tech`, with `public/CNAME` tracked to preserve the custom domain.
- Canonical documentation added for architecture, data contracts, development, testing, deployment, operations, security, troubleshooting, and architecture decisions.
- Repository governance added with CI, issue forms, a pull request template, Dependabot, contribution guidance, changelog, source-available license, and direct dependency license inventory.
- Tests organized by purpose, with executable unit, integration, and backup-contract groups plus documented directories for future quality gates.
- The deployment command now runs `npm run verify:release` before publishing.
- Canonical Markdown documentation now generates 25 static pages under `/docs/` with responsive sidebar navigation, mobile menu, local search, current-page highlighting, page outlines, previous/next links, and shared light/dark theme preference.
- The application Documentation item now opens `/docs/` in the same tab, and every documentation page provides a real link back to `/`.
- Documentation checks cover generated routes, internal assets, duplicated path prevention, desktop/mobile layouts, theme switching, search, internal navigation, and application return in Chrome.

## Latest Validation

- `npm test`: passed, 15 tests.
- `npm run test:unit`: passed, 13 tests.
- `npm run test:integration`: passed, 1 test.
- `npm run test:contract`: passed, 1 test.
- `npm run build`: passed.
- `npm run verify:release`: passed.
- `npm audit --audit-level=moderate`: passed, 0 vulnerabilities.
- `npm run docs:build`: passed, 25 pages generated.
- `npm run docs:check`: passed, no broken generated links or assets.
- `npm run docs:browser`: passed in installed Chrome at 1440x900 and 390x844, including light/dark themes and both navigation directions.
- `npm run mobile:sync`: passed for Android, iOS, and web assets.
- Local dev server requested at `http://127.0.0.1:5179/`.
- GitHub `main` and Pages publication revalidated on July 28, 2026.

## Pending Validation

- Manual browser smoke test at `http://127.0.0.1:5179/` after the dev server is started.
- Manual Android/iOS device or simulator tests remain pending.
- Automated property/invariant testing remains pending.
- Mutation testing remains pending.
- Deterministic fuzzing remains pending.
- Automated browser end-to-end testing remains pending.
- Formal concurrency/resilience and performance/resource gates remain pending.
- No deployment should be described as fully release-gated until all applicable entries in `docs/RELEASE_CHECKLIST.md` have evidence.
- The new `/docs/` site has not yet been pushed or deployed.

## Next Recommended Steps

1. Add generated property and invariant tests for data normalization.
2. Configure mutation testing for `src/utils/`.
3. Add deterministic fuzz tests for backup import and storage failures.
4. Add browser end-to-end coverage for the critical Workspace and Administration workflows.
5. Define performance budgets and large-board test fixtures.
6. Verify the Workspace `Show paused/done` toggle manually with Paused and Done records.
7. Run Android/iOS device or simulator checks.
8. Keep database work deferred until the workflow stabilizes.
9. Push the validated documentation structure, test organization, and generated-site source after final review.

## Useful Commands

```bash
npm run verify:release
npm run test:unit
npm run test:integration
npm run test:contract
npm run dev -- --port 5179
```

## Notes For The Next Codex Session

- Start by reading `AGENTS.md`, this file, and `git status -sb`.
- Do not assume `C:\Projects\TaskPilot` is inside the active sandbox; commands there may require approval.
- Check `git status -sb`; this documentation and quality-structure session has uncommitted work until a later commit is recorded.
