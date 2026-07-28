# AGENTS.md

Mandatory guidance for any Codex session working on TaskPilot.

## Project Location

- Primary local project path: `C:\Projects\TaskPilot`.
- Main branch: `main`.
- Remote repository: `https://github.com/dafermen/TaskPilot.git`.

## Working Rules

- Preserve user work. Never reset, checkout, or delete changes unless the user explicitly asks.
- Keep persistence frontend-only for now. Use `localStorage` and JSON backups; do not add a database until the user asks.
- Prefer focused changes that match the existing React + Vite structure.
- Keep the UI compact, light, and operational. Home is a dashboard; Workspace is the Kanban work area; Administration is the CRUD area.
- Update documentation when behavior changes: `README.md`, `docs/developer-guide.md`, `docs/quality-review.md`, and any relevant topic doc.
- Update `CURRENT_STATUS.md` before ending a meaningful work session.

## Validation Checklist

Run these before publishing or handing off:

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

Run this when mobile shell assets need to be refreshed:

```bash
npm run mobile:sync
```

## Current Product Decisions

- Projects and activities use status values: `Planning`, `Active`, `Paused`, `Done`.
- `Planning` and `Active` are operational.
- `Paused` and `Done` remain in Administration but are hidden from Home/Workspace by default.
- Workspace has a `Show paused/done` toggle for reviewing paused or completed work.
- Tasks count as objective met only when they are in Done, not blocked, and all checklist items are complete.
- Compact/collapsible task cards are the default direction for board readability.

## Local Dev Server

For this handoff, the requested local port is:

```bash
npm run dev -- --port 5179
```

Then open:

```text
http://127.0.0.1:5179/
```
