# Accessibility and Storage Notes

TaskPilot is a frontend-only MVP, but it should still behave predictably for keyboard users and for browsers that restrict local storage.

## Accessibility

- Task cards can still be moved with native drag-and-drop.
- Each task card also includes left and right movement buttons so users do not need a pointer device to move work across the workflow.
- Task cards can be expanded or collapsed with Enter or Space.
- The full task drawer opens with double click or Shift + Enter.
- Expanded task cards include a visible Details action for touch and mobile users.
- Workspace task cards use a compact layout, can be expanded/collapsed inline, and long columns expose additional tasks through a show-more button.
- Empty columns show a clear state and keep the Add task action available.
- Paused/Done project and activity records are hidden from Workspace by default, and the Workspace toolbar includes a native checkbox to show them temporarily.
- The task drawer uses `role="dialog"`, `aria-modal="true"`, a labelled heading, initial focus on the title field, a focus trap, and Escape-to-close behavior.
- Visible focus styles are defined for buttons, inputs, selects, textareas, and task cards.
- Checklist items use native checkboxes and text inputs so progress can be edited with a keyboard.
- The Administration view uses native inputs and selects for project, activity, and task CRUD operations.
- The sidebar uses real buttons for Home, Workspace, Administration, Settings, Documentation, and About navigation.

## Local Storage

- Stored board data is loaded from `localStorage` only when it parses into an array.
- Projects, activities, and tasks are stored as separate JSON arrays in `localStorage`.
- Legacy checklist arrays made of strings are normalized into editable checklist item objects.
- Legacy tasks without grouping are assigned to the default project and activity.
- Invalid stored data falls back to the demo board instead of breaking the app.
- Writes return a success/failure result.
- Theme and focus-mode preferences are saved separately from board data.
- Card expansion preference is saved separately from board data.
- Show paused/done preference is saved separately from board data.
- If a browser blocks saving, TaskPilot keeps the in-memory session active and shows a status message explaining that changes are not persisted.
- Capacitor builds use the same JSON-backed `localStorage` model inside the native WebView.
- JSON backups can be exported and imported from Settings.
- Imported data is normalized before it replaces local data.
- Reset, import, and delete actions ask for confirmation before changing local records.

## Known Limits

- Native drag-and-drop remains limited on some touch devices.
- Android/iOS native shells are configured, but store-ready release work still needs icons, splash screens, signing, and real-device QA.
- There is no backend sync, account model, or cross-device persistence.

## Recommended Next Step

Add component tests for field editing, filtering, reset behavior, storage failures, and keyboard task movement.
