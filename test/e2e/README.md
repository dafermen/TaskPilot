# End-to-End Tests

Run the production-browser harness after `npm run build`:

```bash
npm run test:e2e
```

The Chrome flow creates and persists a project, activity, and task, completes the task objective, pauses the project, verifies default and explicit archived visibility, and checks desktop/mobile navigation. Export-download, destructive reset, file-picker restore, drag gestures, and native shells remain manual acceptance scenarios.
