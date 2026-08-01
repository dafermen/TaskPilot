# Deployment

## Policy

Do not deploy solely because the application builds. Complete all applicable gates in [TESTING.md](TESTING.md) and record evidence with [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

The `predeploy` script runs `npm run verify:release`, which covers the current automated baseline. Manual and pending gates remain the release reviewer's responsibility.

The automated baseline also generates the documentation, checks all generated routes and assets, and opens the built site in Chrome at desktop and mobile sizes.

## GitHub Pages

TaskPilot publishes the contents of `dist` to the `gh-pages` branch and serves them at [taskpilot.innovalogic.tech](https://taskpilot.innovalogic.tech).

`public/CNAME` must remain in source control so the custom domain survives every deployment.

## Procedure

1. Confirm `main` is current and the working tree contains only intended changes.
2. Update `CHANGELOG.md`, documentation, and `CURRENT_STATUS.md`.
3. Install the locked dependencies with `npm ci`.
4. Complete all 13 testing gates and the release checklist.
5. Commit and push the validated source revision.
6. Run:

```bash
npm run deploy
```

7. Confirm `/` and `/docs/` are present in `dist` and the `gh-pages` branch advanced.
8. Verify HTTPS, page title, application assets, documentation search, and one critical workflow on the public site.
9. Record the source commit, Pages commit, URL, and results in `CURRENT_STATUS.md` or the release record.

## Mobile

```bash
npm run mobile:sync
```

Android releases then continue through Android Studio. iOS releases require macOS, Xcode, signing, and App Store provisioning. Web success is not evidence that a native release is compatible.

## Rollback

Identify the last known-good source and `gh-pages` commits before deployment. To roll back, rebuild and republish the known-good source revision through a normal, reviewed Git operation. Never force-push or discard unrelated work as a shortcut.

After rollback, verify the public URL and document the incident in `CHANGELOG.md` and `CURRENT_STATUS.md`.
