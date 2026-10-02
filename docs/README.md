# TaskPilot Documentation

This directory contains the canonical technical and operational documentation.

The generated documentation site is available at `/docs/`. Run `npm run docs:build` before serving or building the application. The generator keeps these Markdown files as the source of truth and adds responsive navigation, local search, page outlines, theme switching, and previous/next links.

## Core Guides

- [Architecture](ARCHITECTURE.md)
- [Data and persistence contracts](API.md)
- [Development](DEVELOPMENT.md)
- [Testing strategy](TESTING.md)
- [Release checklist](RELEASE_CHECKLIST.md)
- [Deployment](DEPLOYMENT.md)
- [Operations](OPERATIONS.md)
- [Security](SECURITY.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Architecture decisions](adr/README.md)

## Product-Specific Guides

- [Capacitor mobile shells](mobile-capacitor.md)
- [Accessibility and local storage](accessibility-and-storage.md)
- [Quality review](quality-review.md)
- [Developer guide](developer-guide.md)

`README.md` at the repository root remains the entry point for users and contributors. `AGENTS.md` and `CURRENT_STATUS.md` provide continuity for future Codex sessions.

## DOC-STD-20261002 — Canonical sources

Documentation standard v1.0 · reviewed 2026-10-02. Primary language: English.

Frontend-only task planning application with optional mobile shells.

Progress and backups use localStorage and JSON; no server database is required. Keep Planning/Active and Paused/Done semantics consistent with the app. Markdown is the source for the generated /docs/ site; never edit generated public/docs files directly.

| Need | Authoritative source |
| --- | --- |
| Presentation | [README.md](../README.md) |
| Current state | [CURRENT_STATUS.md](../CURRENT_STATUS.md) |
| Development | [docs/DEVELOPMENT.md](DEVELOPMENT.md) |
| Architecture | [docs/ARCHITECTURE.md](ARCHITECTURE.md) |
| API / contracts | [docs/API.md](API.md) |
| Testing | [docs/TESTING.md](TESTING.md) |
| Security | [docs/SECURITY.md](SECURITY.md) |
| Deployment | [docs/DEPLOYMENT.md](DEPLOYMENT.md) |
| Operations | [docs/OPERATIONS.md](OPERATIONS.md) |
| Troubleshooting | [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Usage and development | [docs/developer-guide.md](developer-guide.md) |
| Storage and accessibility | [docs/accessibility-and-storage.md](accessibility-and-storage.md) |
| Mobile | [docs/mobile-capacitor.md](mobile-capacitor.md) |
| History | [CHANGELOG.md](../CHANGELOG.md) |
| Decisions | [docs/adr/README.md](adr/README.md) |

Start with the presentation and current state, then read the user guide to try the product, development/architecture to contribute, or deployment/operations to maintain it. The existing detailed index remains valid.

### Evidence and updates

Keep current state, change history and decisions separate. Existing dated test results remain historical evidence. Adding this map does not rerun every documented command or complete pending product acceptance. Record actual checks, their environment and unresolved limits before publication.

Update the source guide whenever commands, configuration, behavior, permissions or deployment change. Keep existing links and portal routes stable. Use real screenshots with synthetic data; never publish env values, access keys, user data or operational logs. A local commit, a remote commit and a deployed artifact are separate states.
