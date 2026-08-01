# Test Suite

TaskPilot separates tests by purpose:

- `unit/`: isolated business rules and storage helpers.
- `integration/`: interactions across modules and real JSON fixtures.
- `contract/`: stable backup and persistence schemas.
- `e2e/`: browser workflows; harness pending.
- `fixtures/`: versioned, non-sensitive test data.
- `property/`: generated invariant checks; harness pending.
- `fuzz/`: malformed and adversarial input checks; harness pending.
- `regression/`: tests added for previously fixed defects.
- `performance/`: bundle and runtime budgets; harness pending.

See `docs/TESTING.md` for release gates and current coverage.
