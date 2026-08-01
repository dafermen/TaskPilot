# Testing Strategy

## Release Policy

Every deployment must evaluate all 13 quality gates below. A production gate may be marked `Not applicable` only with an explicit reason recorded in the release checklist and approved by the project owner. A pending required gate blocks deployment.

`npm run verify:release` enforces the automated checks currently available. It does not replace manual acceptance, device, performance, or resilience checks.

## Quality Gates

| # | Gate | Required evidence | Current automation |
| --- | --- | --- | --- |
| 1 | Acceptance testing | Product scenarios and `docs/quality-review.md` completed. | Manual |
| 2 | Unit testing | Domain and storage helpers pass. | `npm run test:unit` |
| 3 | Property and invariant testing | Generated data preserves relationships, ranges, and supported states. | Pending |
| 4 | Mutation testing | Mutation score and surviving mutations reviewed. | Pending |
| 5 | Fuzzing | Malformed JSON, legacy data, and storage failures tested reproducibly. | Pending |
| 6 | Integration testing | Module interactions and JSON fixture import pass. | `npm run test:integration` |
| 7 | Contract testing | Backup version and schema remain compatible. | `npm run test:contract` |
| 8 | End-to-end testing | Critical browser workflows pass from UI to persistence. | Manual; harness pending |
| 9 | Regression testing | Existing suite passes and escaped defects have focused tests. | `npm test`; visual checks manual |
| 10 | Security testing | Dependency audit, secret review, input handling, and platform permissions checked. | `npm audit --audit-level=moderate`; partial |
| 11 | Concurrency and resilience | Storage failure, multi-tab behavior, interrupted import, and recovery checked. | Partial/manual |
| 12 | Performance and resources | Bundle size, large-board responsiveness, memory, and startup checked. | Manual; budgets pending |
| 13 | Compatibility and deployment | Production build, supported browsers, Pages, Android, and iOS verified. | Build automated; devices manual |

## Automated Baseline

```bash
npm ci
npm run verify:release
```

This runs all Node tests, the Vite production build, and the dependency security audit.

It also runs the generated-documentation link checker and Chrome browser checks for `/docs/`, an internal page, search, light/dark themes, responsive navigation, and the return link to `/`.

## Acceptance Scenarios

At minimum:

1. Create, edit, filter, and delete valid projects, activities, and tasks.
2. Move a task through every Kanban phase.
3. Complete all checklist items and verify objective completion.
4. Pause and reactivate a project or activity.
5. Export data, reset the app, and restore the backup.
6. Verify Home, Workspace, Administration, Settings, Documentation, and About.
7. Repeat core workflows at desktop and mobile widths, in light and dark themes.

## Property and Invariants

Generated tests must prove:

- Every activity references an existing project.
- Every task references an existing project and an activity in that project.
- Points remain an integer from 1 through 13.
- Columns, priorities, and statuses remain within documented sets.
- Backup export/import preserves valid relationships.
- Objective completion never becomes true for blocked, incomplete, or non-Done tasks.

## Mutation Testing

Mutation testing should target `src/utils/` first. A future harness must publish its score and list surviving mutations. The initial target is a mutation score of at least 80% for domain utilities; raising that threshold requires a documented decision.

## Fuzzing

Use deterministic seeds and retain any input that causes a failure as a regression fixture. Primary targets are backup parsing, normalization, legacy migration, long strings, malformed dates, numeric boundaries, and storage exceptions.

## Security

Security checks include dependency audit, accidental-secret scanning, unsafe HTML review, import validation, confirmation of destructive actions, and Android/iOS permission review. See [SECURITY.md](SECURITY.md).

## Performance and Compatibility

Record production asset sizes, test a board with hundreds of tasks, and verify supported browser/device combinations. Mobile shells require real emulator or device evidence before a mobile release.

## Evidence

For each deployment, copy [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) into the release record or pull request, record command results, identify the tested commit, and list any approved `Not applicable` decisions.
