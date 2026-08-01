# ADR-0003: GitHub Pages Deployment

- Status: Accepted
- Date: 2026-07-28

## Context

TaskPilot needs a low-maintenance public web environment while remaining a static client application.

## Decision

Build with Vite and publish `dist` to the `gh-pages` branch. Serve the app through the custom domain `taskpilot.innovalogic.tech`. Track `public/CNAME` so every build preserves the domain.

The deploy command runs the automated release baseline before publishing.

## Consequences

- Hosting remains simple and does not require a server runtime.
- The application cannot provide server-side secrets or APIs.
- Manual release gates are still required beyond the automated predeploy command.
- Future automated Pages deployment should use a new or superseding ADR.
