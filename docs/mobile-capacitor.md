# Mobile Capacitor Guide

TaskPilot is now configured as a Capacitor app for Android and iOS while keeping the current frontend-only storage model.

## Current Mobile Scope

- Capacitor app configuration is available in `capacitor.config.json`.
- Android native project is available in `android/`.
- iOS native project is available in `ios/`.
- Capacitor uses the Vite production build from `dist`.
- Project, activity, task, theme, active-filter, and focus-mode data still use browser `localStorage`.
- Stored product data is JSON serialized with guarded reads and writes.
- JSON backups can be exported/imported in the WebView from Settings using the same app controls as the web build.

## Commands

```bash
npm run mobile:sync
```

Builds the Vite app and syncs `dist` into both native projects.

```bash
npm run mobile:android
```

Builds, syncs, and opens the Android project in Android Studio.

```bash
npm run mobile:ios
```

Builds, syncs, and opens the iOS project in Xcode. This requires macOS with Xcode installed.

## Storage Decision

The first mobile version intentionally keeps `localStorage` instead of adding a database. This keeps the MVP simple and makes the same JSON project/activity/task model work across web, Android WebView, and iOS WebView.

Future storage options:

- Capacitor Preferences for simple key/value settings.
- SQLite for larger boards, multi-project data, or offline-first sync.
- Backend API once accounts or multi-device sync are part of the product.

## Known Mobile Limits

- Native HTML drag-and-drop can be limited on touch devices.
- The left/right card buttons and status selector remain the reliable mobile movement path.
- App Store and Google Play releases still require real-device testing, icons, splash screens, signing, and store metadata.
