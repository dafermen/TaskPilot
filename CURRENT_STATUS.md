# Current Status

Last updated: September 9, 2026.

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
- Imported JSON now repairs malformed records, duplicate identifiers, invalid calendar dates, missing checklists, and projects with orphaned tasks without discarding those tasks.
- Unsupported backup versions and non-object backup roots are rejected before replacing local data.
- Deterministic property tests generate 300 boards and verify relationships, ranges, unique checklist identifiers, and backup round trips.
- Deterministic fuzz tests mutate 750 backup inputs and exercise parser and browser-storage failures.
- Performance gates cover 10,000-task normalization plus production JavaScript and CSS budgets.
- Application E2E automation covers CRUD persistence, objective completion, paused-project visibility, and responsive navigation in Chrome.
- `npm start` generates documentation and starts the complete frontend application at `http://127.0.0.1:5179/`.

## Latest Validation

- `npm test`: passed, 22 tests.
- `npm run test:unit`: passed, 14 tests.
- `npm run test:integration`: passed, 1 test.
- `npm run test:contract`: passed, 1 test.
- `npm run test:property`: covered by the passing full suite, 2 tests with seed `0x5eed1234`.
- `npm run test:fuzz`: covered by the passing full suite, 3 tests with seed `0x1badb002`.
- `npm run test:performance`: covered by the passing full suite; 10,000 tasks normalized in approximately 121 ms against a 2.5-second budget.
- `npm run test:e2e`: passed in installed Chrome for CRUD persistence, objective completion, paused visibility, and responsive navigation.
- `npm run performance:budget`: passed at 236.2 KiB JavaScript and 25.2 KiB CSS.
- `npm run build`: passed.
- `npm run verify:release`: passed.
- `npm audit --audit-level=moderate`: passed, 0 vulnerabilities.
- `npm run docs:build`: passed, 25 pages generated.
- `npm run docs:check`: passed, no broken generated links or assets.
- `npm run docs:browser`: passed in installed Chrome at 1440x900 and 390x844, including light/dark themes and both navigation directions.
- `npm run mobile:sync`: passed for Android, iOS, and web assets.
- Local dev server requested at `http://127.0.0.1:5179/`.
- Vulnerable transitive versions of `@xmldom/xmldom`, `brace-expansion`, and `nanoid` were updated to audited versions.
- GitHub Pages publication was last revalidated on July 28, 2026.

## Pending Validation

- Manual Android/iOS device or simulator tests remain pending.
- Mutation testing remains pending.
- File-picker backup restore, reset confirmation, and drag gestures remain manual E2E scenarios.
- Multi-tab concurrency, interrupted imports, and recovery remain manual resilience scenarios.
- Browser memory and sustained large-board interaction measurements remain pending.
- No deployment should be described as fully release-gated until all applicable entries in `docs/RELEASE_CHECKLIST.md` have evidence.

## Next Recommended Steps

1. Configure mutation testing for `src/utils/` and record an initial score.
2. Automate backup download/reset/file-picker restore where browser download fixtures are acceptable.
3. Add multi-tab and interrupted-import resilience coverage.
4. Add sustained browser performance and memory measurements for large boards.
5. Run Android/iOS device or simulator checks.
6. Keep database work deferred until the workflow stabilizes.

## Useful Commands

```bash
npm run verify:release
npm run test:unit
npm run test:property
npm run test:fuzz
npm run test:integration
npm run test:contract
npm run test:performance
npm run test:e2e
npm start
```

## Notes For The Next Codex Session

- Start by reading `AGENTS.md`, this file, and `git status -sb`.
- Do not assume `C:\Projects\TaskPilot` is inside the active sandbox; commands there may require approval.
- Preserve the deterministic seeds unless a failing input is first retained as a regression fixture.
- Browser E2E scripts require an installed Chrome or Chromium and start an isolated preview on an available local port.
