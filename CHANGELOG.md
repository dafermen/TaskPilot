# Changelog

All notable changes to TaskPilot are documented here. Dates use `YYYY-MM-DD`.

## Unreleased

### Added

- Canonical architecture, data-contract, development, testing, deployment, operations, security, and troubleshooting documentation.
- Architecture Decision Records for local JSON persistence, operational record visibility, and GitHub Pages.
- GitHub CI, issue forms, pull request template, and dependency update configuration.
- Unit, integration, contract, fixture, end-to-end, property, fuzz, regression, and performance test organization.
- Integration and contract tests for versioned JSON backups.
- Release checklist covering 13 mandatory quality gates.
- Generated documentation site under `/docs/` with responsive navigation, local search, page outlines, light/dark themes, and previous/next links.
- Static link validation and real Chrome checks for desktop, mobile, search, theme persistence, and application return navigation.

### Changed

- GitHub Pages deployment now runs the automated release baseline before publishing.
- The application Documentation navigation now opens the canonical `/docs/` site in the same tab instead of showing a duplicate in-app summary.
- Vite development serves documentation directory URLs the same way as the production preview.

## 0.1.0 - 2026-07-28

### Added

- Project, activity, and task administration.
- Home dashboard and dedicated Kanban Workspace.
- Compact, collapsible task cards and high-volume board controls.
- Objective-completion status.
- JSON import/export and guarded local persistence.
- Paused and completed record visibility controls.
- Capacitor Android and iOS shells.
- GitHub Pages publication with a custom domain.
