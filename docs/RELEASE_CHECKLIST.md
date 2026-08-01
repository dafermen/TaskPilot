# Release Checklist

Release commit:

Release date:

Reviewer:

Target: GitHub Pages / Android / iOS / Other

## Required Gates

- [ ] 1. Acceptance testing completed.
- [ ] 2. Unit tests passed.
- [ ] 3. Property and invariant tests passed.
- [ ] 4. Mutation testing passed and survivors reviewed.
- [ ] 5. Fuzzing passed with a recorded seed.
- [ ] 6. Integration tests passed.
- [ ] 7. Contract tests passed.
- [ ] 8. End-to-end tests passed.
- [ ] 9. Regression tests passed.
- [ ] 10. Security checks passed.
- [ ] 11. Concurrency and resilience checks passed.
- [ ] 12. Performance and resource checks passed.
- [ ] 13. Compatibility and deployment checks passed.

## Automated Evidence

```text
npm ci:
npm run verify:release:
npm run mobile:sync:
```

## Manual Evidence

Tested browsers and versions:

Tested viewports:

Tested Android devices/emulators:

Tested iOS devices/simulators:

Large-board or performance result:

Backup and restore result:

## Not Applicable Decisions

Record the gate number, reason, risk, and project-owner approval. A blank entry means no gate was excluded.

## Deployment Verification

- [ ] Published URL responds successfully.
- [ ] Main application assets load.
- [ ] Custom domain and HTTPS remain active.
- [ ] A critical workflow succeeds on the deployed build.
- [ ] Rollback reference is recorded.

Rollback reference:

Final decision: Approved / Blocked
