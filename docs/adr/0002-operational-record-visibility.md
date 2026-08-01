# ADR-0002: Operational Record Visibility

- Status: Accepted
- Date: 2026-07-27

## Context

Paused and completed projects or activities made Home and Workspace noisy but still needed to remain available for review and reactivation.

## Decision

Treat `Planning` and `Active` records as operational. Keep `Paused` and `Done` records stored and editable in Administration, but hide them from Home and Workspace by default. Workspace provides a `Show paused/done` preference for temporary review.

## Consequences

- Active work remains easier to scan.
- Historical records are not deleted.
- Administration is the source of truth for status changes and reactivation.
- Filters and metrics must use the centralized record-status utility.
