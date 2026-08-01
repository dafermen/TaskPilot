# Development

## Prerequisites

- Node.js 22 or a current release compatible with Vite 8.
- npm.
- Git.
- Android Studio for Android builds.
- macOS with Xcode for iOS builds.

## Setup

```bash
git clone https://github.com/dafermen/TaskPilot.git
cd TaskPilot
npm ci
npm run dev
```

The requested local port for shared work is:

```bash
npm run dev -- --port 5179
```

## Useful Commands

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:contract
npm run docs:build
npm run docs:check
npm run docs:browser
npm run build
npm run verify:release
npm run mobile:sync
```

## Repository Layout

```text
TaskPilot/
  .github/             GitHub automation and templates
  docs/                Technical and operational documentation
  scripts/             Documentation generation and validation
  src/                 React application
  test/                Tests and fixtures grouped by purpose
  android/             Capacitor Android shell
  ios/                 Capacitor iOS shell
  public/              Static assets and custom-domain CNAME
  AGENTS.md             Mandatory guidance for future Codex sessions
  CURRENT_STATUS.md     Current handoff state and pending work
```

## Working Conventions

- Keep the application frontend-only until a backend or database is explicitly approved.
- Preserve compatibility with existing `localStorage` and JSON backups.
- Put shared domain rules in `src/utils/` instead of duplicating them in components.
- Keep Home focused on summary, Workspace on execution, and Administration on CRUD.
- Add or update tests when changing normalization, persistence, record status, or objective-completion rules.
- Update relevant documentation and `CURRENT_STATUS.md` before handing off meaningful work.

## Environment Variables

No environment variables are required today. `.env.example` documents this explicitly and is the place to declare future non-secret client configuration.

Never commit credentials, private keys, tokens, passwords, or production secrets. Vite variables prefixed with `VITE_` are embedded into client assets and must never contain secrets.

## Mobile Workflow

```bash
npm run mobile:sync
npm run mobile:android
npm run mobile:ios
```

`mobile:sync` creates the web build and copies it into both native shells. See [mobile-capacitor.md](mobile-capacitor.md).

Vite development middleware rewrites only `/docs/` directory-style routes to their generated `index.html` files. This keeps local development URLs identical to production without intercepting application routes or documentation assets.

## Before Opening a Pull Request

Follow [CONTRIBUTING.md](../CONTRIBUTING.md), run `npm run verify:release`, and complete the applicable sections of [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## Documentation Workflow

Edit the Markdown sources in `docs/` or the linked root files. Navigation lives in `docs/site/docs.config.mjs`; styles and browser behavior live beside it. `npm run docs:build` generates the ignored `public/docs/` directory, and Vite copies it into `dist/docs/`.

Do not edit generated files in `public/docs/` or `dist/docs/`. Use `npm run docs:check` for static route and asset checks and `npm run docs:browser` for real Chrome validation.
