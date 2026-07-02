# Accessibility and Storage Notes

TaskPilot is a frontend-only MVP, but it should still behave predictably for keyboard users and for browsers that restrict local storage.

## Accessibility

- Task cards can still be moved with native drag-and-drop.
- Each task card also includes left and right movement buttons so users do not need a pointer device to move work across the workflow.
- Task cards can be opened with Enter or Space.
- The task drawer uses `role="dialog"`, `aria-modal="true"`, a labelled heading, initial focus on the title field, and Escape-to-close behavior.
- Visible focus styles are defined for buttons, inputs, selects, textareas, and task cards.

## Local Storage

- Stored board data is loaded from `localStorage` only when it parses into an array.
- Invalid stored data falls back to the demo board instead of breaking the app.
- Writes return a success/failure result.
- If a browser blocks saving, TaskPilot keeps the in-memory session active and shows a status message explaining that changes are not persisted.

## Known Limits

- Native drag-and-drop remains limited on some touch devices.
- The drawer does not yet implement a full focus trap.
- There is no backend sync, account model, or cross-device persistence.

## Recommended Next Step

Add component tests for task creation, field editing, filtering, reset behavior, storage failures, and keyboard task movement.
