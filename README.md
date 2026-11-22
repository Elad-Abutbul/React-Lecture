# React-Lecture

React Journey is a Hebrew learning experience based on the React workshop presentation.
This repository currently contains **T01–T02**: a minimal React + TypeScript + Vite
application with code-quality tooling and one application smoke test. The
specification and task plan are in the parent directory:
`../REQUIREMENTS.md`, `../DESIGN.md`, and `../TASKS.md`.

## Run locally

Use a Node.js version satisfying `engines.node` in `package.json`; this range
accounts for Vite and the development/test tools. The pnpm version is also recorded
in `package.json`. Run these commands from this directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. To build and preview the production application:

```sh
pnpm build
pnpm preview
```

## Checks

```sh
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

- `lint` uses ESLint with the recommended JavaScript, TypeScript, React Hooks, and
  Vite Fast Refresh rules. Warnings fail the check. Oxlint has been removed.
- `format:check` verifies Prettier formatting; `pnpm format` applies it. Generated
  output and the package-manager lockfile are excluded.
- `test` runs Vitest once in jsdom with React Testing Library and jest-dom
  matchers. The smoke test checks that the application renders its Hebrew title
  and introduction inside the main landmark. `pnpm test:watch` starts watch mode.
- `build` checks the application and Vite configuration with TypeScript strict
  mode before generating the production bundle. Test/setup files are type-checked
  but are not part of the browser entry point or its production bundle.

The `@/` import alias resolves to `src/` in TypeScript, Vite, and Vitest. Test
cleanup runs after each case. TypeScript uses the latest stable release within
the installed typescript-eslint version's
[supported range](https://typescript-eslint.io/users/dependency-versions/).

## Structure and scope

```text
index.html           Hebrew RTL document and React mount point
src/main.tsx         React entry point with StrictMode
src/app/App.tsx      Minimal application component
src/app/App.test.tsx  Application smoke test
src/content/app.ts   Centralized application copy
src/test/setup.ts    DOM matchers and test cleanup
vite.config.ts       React plugin, source alias, and Vitest configuration
tsconfig*.json       Strict TypeScript configuration
eslint.config.js    ESLint rules and Prettier compatibility
.prettierrc.json     Shared formatting conventions
```

The existing repository and its original title were retained. The scaffold was
generated separately with the official `react-ts` template, then copied here
without its demo, styles, or assets. Styling, fonts, layout components, the Hero,
and journey features belong to later tasks. T03 (Tailwind and design tokens) has
not been started.
