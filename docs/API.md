# Data and Persistence Contracts

TaskPilot has no HTTP API in the current MVP. This document defines the internal JSON and browser-storage contracts that function as its data interface.

## Backup Envelope

```json
{
  "version": 1,
  "exportedAt": "2026-07-28T12:00:00.000Z",
  "projects": [],
  "activities": [],
  "tasks": []
}
```

- `version`: backup schema version. Current value: `1`.
- `exportedAt`: ISO 8601 timestamp.
- `projects`, `activities`, `tasks`: arrays normalized during import.

## Project

| Field | Type | Rules |
| --- | --- | --- |
| `id` | string | Required identifier; generated when missing. |
| `name` | string | Non-empty after normalization. |
| `owner` | string | Non-empty after normalization. |
| `color` | string | Six-digit hex color. |
| `status` | string | `Planning`, `Active`, `Paused`, or `Done`. |

## Activity

| Field | Type | Rules |
| --- | --- | --- |
| `id` | string | Required identifier; generated when missing. |
| `projectId` | string | Must reference an existing project after normalization. |
| `name` | string | Non-empty after normalization. |
| `owner` | string | Non-empty after normalization. |
| `status` | string | `Planning`, `Active`, `Paused`, or `Done`. |

## Task

| Field | Type | Rules |
| --- | --- | --- |
| `id` | string | Required identifier; generated when missing. |
| `projectId` | string | Must reference an existing project. |
| `activityId` | string | Must reference an activity in the same project. |
| `title` | string | Non-empty after normalization. |
| `description` | string | Free text. |
| `column` | string | `backlog`, `ready`, `progress`, `review`, or `done`. |
| `owner` | string | Non-empty after normalization. |
| `priority` | string | `High`, `Medium`, or `Low`. |
| `tag` | string | Non-empty category label. |
| `due` | string | Calendar-valid `YYYY-MM-DD`. |
| `points` | number | Integer from 1 through 13. |
| `blocked` | boolean | Blocking signal. |
| `checklist` | array | Checklist item objects. |

Checklist items use `{ "id": "string", "text": "string", "done": true }`. Legacy string items are migrated during load, and malformed or duplicate checklist identifiers are repaired.

## Storage Keys

| Key | Content |
| --- | --- |
| `taskpilot-board-v3` | Tasks |
| `taskpilot-projects-v1` | Projects |
| `taskpilot-activities-v1` | Activities |
| `taskpilot-theme` | Theme preference |
| `taskpilot-focus-mode` | Focus-mode preference |
| `taskpilot-card-view` | Card display preference |
| `taskpilot-show-paused-done` | Archived visibility preference |
| `taskpilot-active-project` | Active project filter |
| `taskpilot-active-activity` | Active activity filter |

## Compatibility Policy

- Existing keys are not renamed without a migration.
- Backup schema changes require a version increment, contract tests, migration notes, and a changelog entry.
- Unknown or malformed values are normalized to supported defaults.
- Non-object backup roots and backup versions newer than the supported schema are rejected before data replacement.
- Duplicate identifiers are repaired, and a recovery activity is created when imported tasks reference a project with no available activity.
- Empty task arrays remain empty and do not silently restore demo tasks.

The fixture in `test/fixtures/board-backup-v1.json` and tests in `test/contract/` are executable evidence for this contract.
