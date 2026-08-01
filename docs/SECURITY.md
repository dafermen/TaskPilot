# Security

## Supported Version

Only the latest commit on `main` and the current published build receive fixes during the MVP phase.

## Reporting a Vulnerability

Do not publish credentials, private task data, or exploit details in a public issue. Use the repository's private GitHub security advisory channel when available, or contact the repository owner privately.

Include the affected commit or URL, impact, reproduction steps, and a minimal proof of concept that contains no real user data.

## Current Threat Model

TaskPilot is a client-only application. Primary risks are:

- Malicious or malformed imported JSON.
- Accidental exposure of task data stored on a shared device.
- Cross-site scripting introduced by unsafe rendering changes.
- Secrets accidentally committed or embedded in Vite client variables.
- Vulnerable npm or Capacitor dependencies.
- Excessive native platform permissions.
- Data loss caused by local-storage clearing or incompatible schema changes.

## Security Rules

- Never commit passwords, tokens, private keys, SSH keys, or production credentials.
- Never place secrets in variables prefixed with `VITE_`; they are shipped to the browser.
- Keep React text rendering escaped and review any future raw HTML use.
- Validate and normalize imported data before replacing stored data.
- Require confirmation for import, reset, and delete operations.
- Keep dependencies locked and run `npm audit --audit-level=moderate`.
- Review Android and iOS permissions before every native release.
- Use HTTPS and preserve the verified GitHub Pages custom-domain configuration.

## Data Classification

Task data may contain private business information even though it is stored locally. JSON backups should be treated as user data, kept out of source control, and shared only through approved channels.

## Release Security Gate

Before deployment:

1. Run the dependency audit.
2. Review the diff for secrets and unsafe HTML or URL handling.
3. Test malformed backup imports and storage failure behavior.
4. Review native permissions when mobile assets change.
5. Record the result in the release checklist.
