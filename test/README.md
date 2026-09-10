# Test Suite

TaskPilot separates tests by purpose:

- `unit/`: isolated business rules and storage helpers.
- `integration/`: interactions across modules and real JSON fixtures.
- `contract/`: stable backup and persistence schemas.
- `e2e/`: browser workflow documentation; executable harness in `scripts/check-app-browser.mjs`.
- `fixtures/`: versioned, non-sensitive test data.
- `property/`: generated relationship, range, and round-trip invariant checks.
- `fuzz/`: deterministic malformed-input and storage-failure checks.
- `regression/`: tests added for previously fixed defects.
- `performance/`: large-board normalization tests; production asset budgets live in `scripts/check-performance.mjs`.

See `docs/TESTING.md` for release gates and current coverage.
