# ADR-0001: Frontend-Only JSON Persistence

- Status: Accepted
- Date: 2026-07-27

## Context

TaskPilot is refining its project, activity, and task workflow before introducing accounts, synchronization, or server operations. A database would add deployment, migration, authentication, and operational complexity before the product model is stable.

## Decision

Use browser `localStorage` for runtime persistence and versioned JSON export/import for portability. Use the same web bundle and storage approach inside Capacitor WebViews.

## Consequences

- The app works without a backend.
- Data remains local to an origin, browser profile, or installed native app.
- Users must export backups for portability and recovery.
- Multi-user collaboration and cross-device synchronization are unavailable.
- Schema normalization and compatibility tests are required.

A backend or database requires a new ADR and an explicit product decision.
