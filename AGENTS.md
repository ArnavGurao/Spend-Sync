# AGENTS Guide

Keep this file current whenever commands, architecture, or conventions change.

## Stack and Runtime

- Full-stack app built with Nitro v3 + h3, Vite, React, React Router, Tailwind CSS, and Drizzle ORM.
- Package manager: npm (`package-lock.json` is present).
- Module system: ESM (`"type": "module"` in `package.json`).
- Server code is under `src/` via `nitro.config.js` (`serverDir: "./src"`).
- Client route entry is `src/routes/app.jsx`.

## Repository Layout

- `src/api/`: API endpoints (`/api/*`).
- `src/routes/`: client React routes and route loaders.
- `src/middleware/`: Nitro middleware (numbered prefixes indicate order).
- `src/lib/`: shared server utilities (`auth`, `db`).
- `src/error.js`: global server error handler.
- `db/schema.ts`: Drizzle schema definitions.
- `db/migrate.ts`: migration runner.
- `nitro.config.js`: Nitro runtime and server settings.
- `vite.config.js`: Vite plugins (`tailwindcss`, `react`, `nitro`).
- `.oxfmtrc.json`: canonical formatting rules.

## Build, Dev, Lint, DB, and Test Commands

Run these from repository root.

### Install and run

- `npm install` - install dependencies.
- `npm run dev` - start local dev server.
- `npm run build` - production build.
- `npm run preview` - preview production build.

### Lint/format

- `npm run lint:check` - format/lint gate via `oxfmt --check`.
- `npx oxfmt .` - apply formatting fixes.

### Database

- `npm run db:generate` - generate Drizzle migrations.
- `npm run db:migrate` - apply migrations (uses `db/migrate.ts`).
- `npm run db:studio` - launch Drizzle Studio.

### Secrets/bootstrap

- `npm run generate:secrets` - generate local secrets scaffold.

### Tests (current state)

- There is currently no configured test runner script in `package.json`.
- No `vitest`, `jest`, or test config files are present today.
- If you add tests, also add scripts so agents can run them consistently.

### Single-test execution guidance (when a runner is added)

- Vitest file: `npx vitest run path/to/file.test.ts`
- Vitest one test name: `npx vitest run path/to/file.test.ts -t "test name"`
- Jest file: `npx jest path/to/file.test.ts`
- Jest one test name: `npx jest path/to/file.test.ts -t "test name"`

## Required Agent Workflow

- Before finishing code changes, run at least:
  - `npm run lint:check`
  - `npm run build`
- If tests are added later, run impacted tests and preferably full test suite.
- For DB-related changes, run appropriate Drizzle command(s) and note migration impacts.

## Coding Style (Source of Truth)

Formatting is defined by `.oxfmtrc.json`.

- Use double quotes.
- No semicolons.
- Trailing commas where supported (`"trailingComma": "all"`).
- `printWidth: 80` and `tabWidth: 2`.
- Keep formatting automated; do not hand-style against formatter output.

## Import and Module Conventions

- Prefer ESM `import`/`export` syntax only.
- Group imports: third-party first, then internal aliases/relative imports.
- Use alias `@/*` for project-root imports (configured in `tsconfig.json`).
- Keep imports minimal and remove unused ones.
- Keep side-effect imports explicit and rare.

## Server Conventions (Nitro/h3)

- Use `defineHandler()` for route and middleware handlers.
- API handlers live in `src/api/`.
- Middleware files are ordered lexically (e.g., `1.cors.js`, `2.auth.js`).
- Use `event.url.pathname` for path checks.
- Use `event.req` / `event.res` APIs from current Nitro/h3 style.
- Return values directly; throw errors for failure paths.

## Nitro File-Based Routing (Backend)

- Nitro server source is `src/` (`serverDir` in `nitro.config.js`).
- Files in `src/api/` become backend API routes under `/api/*`.
- Files in `src/routes/` with server extensions (`.js`, `.ts`) become non-API backend routes.
- In this repo, `nitro.config.js` ignores `src/routes/**/*.{jsx,tsx}`, so React route components are never treated as server routes.
- Dynamic route params use `[param]` segments and catch-all uses `[...param]` (e.g., `src/api/auth/[...all].js`).
- Route path comes from file path, so `src/api/hello.js` maps to `/api/hello` and `src/routes/home.js` maps to `/home`.

## Error Handling Guidelines

- Prefer `HTTPError` for expected HTTP failures.
- Include meaningful status code + message.
- Avoid leaking secrets/tokens in error messages or logs.
- Let `src/error.js` shape consistent JSON error responses.
- Log structured metadata (`method`, `path`, `status`) when possible.

## Type and Data Guidelines

- Current codebase is mostly JS with a TS schema file.
- Keep DB schema and DB access types aligned via Drizzle schema imports.
- Add TS types where complexity or shared contracts justify it.
- Avoid `any` in TypeScript; prefer explicit types or inferred safe types.
- Validate external input at route boundaries.

## Naming Conventions

- React components: `Kebab-Case` (`Home`, `About`, `AppLayout`).
- Functions/variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- File names:
  - React route components use `PascalCase.jsx` in `src/routes/`.
  - Server endpoints/middleware use lowercase or numeric-prefix style in `src/api/` and `src/middleware/`.
- Keep names descriptive and domain-focused, not abbreviated.

## React/Frontend Guidelines

- Use functional components and hooks.
- Keep route loaders in `src/routes/loaders.jsx` or split logically as app grows.
- Prefer clear loading/error states for async UI paths.
- Reuse Tailwind utility patterns consistently.
- Keep router structure centralized in `src/routes/app.jsx` unless intentionally refactored.

## Auth and Security Guidelines

- Auth is powered by Better Auth + Drizzle adapter (`src/lib/auth.js`).
- Protected API logic is enforced in auth middleware.
- Never commit real credentials or tokens.
- Runtime secrets come from Nitro runtime config (`APP_` prefix).
- Treat CORS and trusted origins as security-sensitive changes.

## Nitro Docs and Upgrade Notes

- Prefer local docs in `node_modules/nitro/skills/nitro/docs/` before web search.
- Follow Nitro v3 / h3 v2 conventions:
  - `defineHandler()` over legacy `eventHandler()` patterns.
  - `HTTPError` over legacy error helpers.
  - `event.req`/`event.res` APIs and explicit return values.

## Cursor/Copilot Rules Status

- `.cursor/rules/`: not found.
- `.cursorrules`: not found.
- `.github/copilot-instructions.md`: not found.
- If any of these files are added, update this document to mirror their rules.

## PR and Change Hygiene for Agents

- Keep diffs focused; avoid unrelated refactors.
- Update docs when behavior or commands change.
- Add or update tests for non-trivial logic changes once test infra exists.
- Include verification notes (commands run, outcomes, known gaps).
- Do not remove or weaken security checks without explicit justification.

## Specialized Agent Profiles

- Frontend Design Agent: `FRONTEND_DESIGN_AGENT.md`
  - Use this profile when the task is strictly UI/UX, visual design, route
    component styling, or responsive frontend behavior.
  - It is intentionally scoped to frontend work and uses
    `spendsync-design-system.json` as design source of truth.
