# TaskPilot Quality Review

Use this checklist before publishing screenshots, creating a GitHub repository, or linking the project from the portfolio.

## Product

- [x] A new visitor understands the product in under 10 seconds.
- [x] The board has realistic sample tasks.
- [x] Drag and drop works across every column.
- [x] Keyboard controls can move tasks left and right.
- [x] Creating a task opens the drawer.
- [x] Editing task fields persists after refresh when storage is available.
- [x] Reset demo data works.

## UX

- [x] Layout works on laptop width.
- [x] Layout works on mobile width.
- [x] Cards remain readable in light and dark themes.
- [x] Filters do not collapse the layout.
- [x] Empty columns still accept dropped cards.
- [x] Detail drawer has dialog semantics, initial focus, and Escape close.

## Technical

- [x] `npm run build` passes.
- [x] `npm audit --audit-level=moderate` reports no vulnerabilities.
- [x] Local storage errors fail gracefully.
- [x] README matches actual MVP features.
- [x] `.private/` is ignored before publishing.

## Remaining Manual Checks

- [ ] Smoke test first load in the deployed GitHub Pages or portfolio environment.
- [ ] Capture final desktop and mobile screenshots.
