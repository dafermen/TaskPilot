# Testing Strategy

## Release Policy

Every deployment must evaluate all 13 quality gates below. A production gate may be marked `Not applicable` only with an explicit reason recorded in the release checklist and approved by the project owner. A pending required gate blocks deployment.

`npm run verify:release` enforces the automated checks currently available. It does not replace manual acceptance, device, performance, or resilience checks.

## Quality Gates

| # | Gate | Required evidence | Current automation |
| --- | --- | --- | --- |
| 1 | Acceptance testing | Product scenarios and `docs/quality-review.md` completed. | Manual |
| 2 | Unit testing | Domain and storage helpers pass. | `npm run test:unit` |
| 3 | Property and invariant testing | Generated data preserves relationships, ranges, and supported states. | `npm run test:property` |
| 4 | Mutation testing | Mutation score and surviving mutations reviewed. | Pending |
| 5 | Fuzzing | Malformed JSON, legacy data, and storage failures tested reproducibly. | `npm run test:fuzz` |
| 6 | Integration testing | Module interactions and JSON fixture import pass. | `npm run test:integration` |
| 7 | Contract testing | Backup version and schema remain compatible. | `npm run test:contract` |
| 8 | End-to-end testing | Critical browser workflows pass from UI to persistence. | `npm run test:e2e`; backup restore remains manual |
| 9 | Regression testing | Existing suite passes and escaped defects have focused tests. | `npm test`; visual checks manual |
| 10 | Security testing | Dependency audit, secret review, input handling, and platform permissions checked. | `npm audit --audit-level=moderate`; partial |
| 11 | Concurrency and resilience | Storage failure, multi-tab behavior, interrupted import, and recovery checked. | Storage failure automated; remaining scenarios manual |
| 12 | Performance and resources | Bundle size, large-board responsiveness, memory, and startup checked. | Normalization and asset budgets automated; browser memory manual |
| 13 | Compatibility and deployment | Production build, supported browsers, Pages, Android, and iOS verified. | Build automated; devices manual |

## Automated Baseline

```bash
npm ci
npm run verify:release
```

This runs all Node tests, the Vite production build, production asset budgets, application and documentation Chrome checks, and the dependency security audit.

The application E2E check creates and persists a project, activity, and completed task; verifies the objective signal; pauses the project; confirms default hiding and explicit archived visibility; and checks responsive navigation. The documentation browser check covers `/docs/`, an internal page, search, light/dark themes, responsive navigation, and the return link to `/`.

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

The generated storage suite uses the fixed seed `0x5eed1234` and runs 300 boards per execution.

## Mutation Testing

Mutation testing should target `src/utils/` first. A future harness must publish its score and list surviving mutations. The initial target is a mutation score of at least 80% for domain utilities; raising that threshold requires a documented decision.

## Fuzzing

Use deterministic seeds and retain any input that causes a failure as a regression fixture. Primary targets are backup parsing, normalization, legacy migration, long strings, malformed dates, numeric boundaries, and storage exceptions.

The current parser fuzz suite uses seed `0x1badb002`, mutates 750 inputs, verifies non-object and unsupported-version rejection, and exercises read/write storage failures.

## Security

Security checks include dependency audit, accidental-secret scanning, unsafe HTML review, import validation, confirmation of destructive actions, and Android/iOS permission review. See [SECURITY.md](SECURITY.md).

## Performance and Compatibility

The automated resource gate normalizes a 10,000-task board within 2.5 seconds and limits uncompressed production JavaScript to 750 KiB and CSS to 200 KiB. Browser memory, sustained interaction, and mobile shells still require real browser, emulator, or device evidence before release.

## Evidence

For each deployment, copy [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) into the release record or pull request, record command results, identify the tested commit, and list any approved `Not applicable` decisions.
