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
