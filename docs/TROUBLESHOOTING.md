# Troubleshooting

## The Development Server Does Not Start

Run `npm ci`, verify a Vite-compatible Node.js version, and retry `npm run dev -- --port 5179`. If the port is occupied, choose another port.

## The App Shows Demo Data Again

Confirm the same browser profile, domain, protocol, and port are being used. `localStorage` is isolated by origin. Clearing site data, uninstalling the native app, or changing the origin can remove access to previous records.

Restore from Settings with a previously exported JSON backup.

## A Backup Does Not Import

Keep the original file. Confirm it is valid JSON and follows the envelope in [API.md](API.md). Do not edit the only copy of a user backup. Use a duplicate for repair attempts.

## Paused or Completed Work Is Missing

Paused and Done projects or activities are hidden from Home and Workspace by default. They remain visible in Administration. Enable `Show paused/done` in Workspace or reactivate the record in Administration.

## A Task Does Not Show Objective Completion

The task must be in Done, not blocked, contain at least one checklist item, and have every checklist item complete.

## GitHub Pages Uses the Wrong Domain

Confirm `public/CNAME` contains `taskpilot.innovalogic.tech`, rebuild, redeploy, and verify the `gh-pages` branch also contains `CNAME`.

## GitHub Pages Is Blank

Check that `npm run build` succeeds, `dist/index.html` exists, JavaScript and CSS assets return successfully, and the browser console has no loading errors. Compare the Pages commit with the last known-good release.

## Documentation Is Missing or Out of Date

Run `npm run docs:build`, then restart the development server. Markdown is the source of truth; `public/docs/` is generated and intentionally ignored. For a production check, run `npm run build`, `npm run docs:check`, and `npm run docs:browser`.

Documentation URLs must begin with `/docs/` only once. A `/docs/docs/` route indicates an incorrect navigation entry or Markdown link and should fail `npm run docs:check`.

## Capacitor Does Not Show Recent Changes

Run `npm run mobile:sync` after the web change. Rebuild from Android Studio or Xcode. Confirm Capacitor still uses `dist` as `webDir`.

## Tests Are Not Discovered

Test filenames must end in `.test.js` and live under `test/`. Group-specific scripts use:

```bash
npm run test:unit
npm run test:integration
npm run test:contract
```

## Storage Is Blocked

Private mode, browser policy, full quota, or device restrictions may block `localStorage`. The app should continue with in-memory state, but persistence cannot be guaranteed. Export a backup whenever storage becomes available.
