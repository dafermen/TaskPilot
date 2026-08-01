# Contributing to TaskPilot

## Before Starting

Read:

- `README.md`
- `AGENTS.md`
- `CURRENT_STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/TESTING.md`

Discuss changes that alter persistence, backup compatibility, mobile behavior, or the frontend-only product boundary before implementing them.

## Workflow

1. Create a focused branch from current `main`.
2. Make the smallest coherent change.
3. Add or update tests for changed behavior.
4. Update the relevant documentation.
5. Run:

```bash
npm ci
npm run verify:release
```

6. Complete relevant manual checks.
7. Open a pull request using the repository template.

## Code and UX Expectations

- Follow existing React and utility patterns.
- Keep shared rules out of presentation components.
- Preserve JSON backup and `localStorage` compatibility.
- Keep the operational interface compact, responsive, keyboard accessible, and usable on touch devices.
- Do not add a backend or database without explicit approval and an ADR.
- Do not silently delete or hide user data.

## Tests

Place tests in the directory matching their purpose. A bug fix should include a regression test when practical. Deployment changes must follow all applicable gates in `docs/TESTING.md`.

## Commits and Pull Requests

Use concise, imperative commit messages. Pull requests should explain the problem, solution, user impact, validation evidence, compatibility risk, and recovery plan when relevant.

## Security and Privacy

Never commit secrets or real task data. Sanitize screenshots and JSON fixtures. Report vulnerabilities according to `docs/SECURITY.md`.

## Licensing

By contributing, you confirm that you have the right to submit the work. No contribution changes the repository license unless the owner explicitly updates `LICENSE`.
