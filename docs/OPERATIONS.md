# Operations

## Service Model

TaskPilot is a static client application. GitHub Pages serves the web assets; each browser or Capacitor WebView owns its own local data.

There is no server process, central database, account recovery, remote backup, or operational queue in the current MVP.

## Routine Checks

- Confirm the public URL returns HTTPS successfully.
- Confirm JavaScript and CSS assets load without console errors.
- Exercise one create/edit/move workflow.
- Review GitHub dependency alerts and CI status.
- Verify the custom domain remains associated with Pages.

## User Data

Users should export a JSON backup before clearing browser data, changing devices, testing destructive actions, or installing a replacement native build.

Local browser data can be lost through storage clearing, private browsing, browser policy, device reset, app uninstall, or origin/domain changes.

## Incident Priorities

- P1: site unavailable, deployment serves blank content, or widespread data corruption.
- P2: critical workflow broken, imports fail, or persisted data is not loaded.
- P3: degraded UX, isolated visual issue, or non-critical feature failure.

For an incident:

1. Stop further deployment.
2. Capture the URL, commit, browser/device, time, console error, and reproduction steps.
3. Preserve any affected JSON backup without posting sensitive task content publicly.
4. Compare against the last known-good deployment.
5. Roll back or fix through a reviewed commit.
6. Add a regression test and update the changelog.

## Recovery

- Invalid or legacy data: export when possible, retain the original file, and test import against normalization.
- Failed deployment: republish the last known-good source revision.
- Lost local data without a JSON backup: recovery is not guaranteed.
- Broken native shell: rebuild from a validated web bundle with `npm run mobile:sync`.

## Observability Limits

The app has no telemetry or centralized logs. Browser developer tools, GitHub Pages availability, CI results, and user-provided reproduction evidence are the current sources of operational information.
