# React Lecture

A Hebrew RTL React learning world. Installation instructions, troubleshooting,
presentation lessons, code, live experiments, quizzes, and the hands-on workshop
share one spatial graph and one guided camera.

## Run

Use the Node and pnpm versions specified in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. For a production preview:

```sh
pnpm build
pnpm preview
```

## Navigation

- A deliberate downward wheel gesture advances one logical stop. Upward gestures
  return one stop. Camera travel and a quiet interval suppress repeated transitions
  from a single gesture or its momentum.
- At a decision, a horizontal or diagonal trackpad gesture chooses the physical
  left or right branch, including balanced downward diagonals. Mouse-wheel users
  can place the pointer over a branch region and scroll down. Clicking the region
  is optional.
  Short input previews its direction/progress before committing.
- Arrow keys and Enter/Space on a focused branch offer keyboard alternatives.
  Up/Down and PageUp/PageDown support reading and movement. Touch supports swipes
  and branch taps.
- Long content has one focusable reading surface. Scroll through it first; a new
  deliberate gesture at its boundary changes the stop. The document itself does
  not compete for scrolling.
- The compact trail identifies the current path. The searchable map can revisit
  older explored branches. Choices change freely without confirmation dialogs.
- The bottom bar measures camera position in the exposed path. Visits and
  scrolling do **not** certify that commands or exercises worked on another computer.

## Hands-on workshop

At **“יוצרים את הפרויקט”**, below the Vite command, the left branch opens the
workshop; the right branch continues installation. The workshop stays in the same
world and rejoins the shared learning path.

The 120-minute plan has H01–H11 and two class pauses: 13 units. The 90-minute plan
uses H01–H08, skips the first pause, budgets H06 at 12 minutes and H08 at 13 minutes,
and ends with a five-minute class check: 85 + 5 = 90. Snapshot, Effect, and the final
challenge remain available as bonuses and are never automatically completed.

Each station has a goal, mission, starter snippet or command, expected result,
question, two progressive hints, and a hidden solution. Complete code remains readable within its stop; copying and downloading preserve
the exact file. The H04–H11
solutions build one consistent task application. H10 loads validated saved tasks
before synchronizing changes, and its timer cleanup demonstration is separate.

Optional personal checks, skipped flags, hint levels, the time plan, and instructor
preferences persist independently of navigation. Instructor tools include larger
code, a manual timer, station selection, questions, and solutions. Class checks
ask participants to show screens or raise hands. There is no class-monitoring API.

## Architecture

```text
src/app/App.tsx                   Mounts the immersive world
src/content/worldGraph.ts         Canonical graph, composed from educational data
src/content/handsOnGraph.ts       Workshop nodes, branches, and merge points
src/constants/graphNavigation.ts  Coordinates, gesture thresholds, camera settings
src/lib/graph-navigation.ts       Path expansion, reachability, wheel normalization
src/store/graph-store.ts          Authoritative route, cursor, visits, traversed edges
src/hooks/useGraphGesture.ts      One gesture interpreter for navigation and reading
src/hooks/useGraphCamera.ts       GSAP camera targets and continuous path progress
src/components/tree/              World-space paths, content, branches, trail, map
src/components/hands-on/          Exercises, source utilities, live task board, timer
src/content/handsOnSolutions.ts   Complete learner project snapshots
src/store/hands-on-store.ts       Separate versioned personal practice state
src/constants/atmosphere.ts       Nebulae, particles, orbitals, cursor, 3D budget
src/content/                     Presentation copy, commands, files, questions, hints
```

Nodes and SVG connections use the same world coordinates. Single-edge chains open
up to the next decision; returning troubleshooting branches rejoin their original
command. An active branch change replaces the current suffix while retaining an
archive of visited nodes and actual traversed connections. Retry history is
compacted when it rejoins an earlier node, preventing unbounded loops.

Only the active node mounts its full interactive content. Surrounding nodes remain
as smaller landmarks; SVG connections remain mounted throughout camera travel.
Camera and progress updates write transforms and CSS values without React state
updates on every animation frame. Arrival animations reveal stable text after
landing. The active application uses guided GSAP targets, not competing native
scroll or ScrollTrigger handlers. Historical renderers remain for reference and
legacy component tests; they are not mounted by `App`.

Motion drives the desktop atom cursor while retaining the normal cursor. The
optional lazy React Three Fiber/Drei atmosphere limits DPR and frame frequency,
pauses rendering when hidden, and falls back to SVG on touch, reduced motion,
unsupported WebGL, or software rendering. CSS nebulae and orbital layers provide
the remaining atmosphere. Fonts are local, with licenses under `src/assets/fonts`.

## Persistence and scope

Navigation uses versioned `react-world-navigation` storage and migrates meaningful
legacy installation progress. Practice uses `react-hands-on-progress`; the live task
board uses `react-workshop-demo-tasks`. Malformed values are sanitized. The live
board can keep working in memory if storage is unavailable. No backend, login,
telemetry, arbitrary-code execution, or fake classroom statistics are involved.

Commands are copied exactly and run only in the learner's terminal. The website
does not install Node, inspect local files, execute commands, or validate external
work. Optional self-checks are explicit personal statements.

## Validation

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm test:workshop
pnpm exec playwright test
```

The production build includes strict TypeScript checks. Vitest covers graph
transitions, retries, storage, commands, lesson experiments, cleanup, hints, timers,
and task persistence. The workshop check creates isolated temporary projects from
each complete H04–H11 snapshot and runs strict TypeScript plus a Vite production
build for each.

Playwright uses a production preview on port 5176 with desktop, mobile, and reduced
motion Chromium profiles, plus WebKit navigation regressions. Install browser
binaries with `pnpm exec playwright install chromium webkit`. It checks wheel-only
installation, diagonal gestures,
momentum, backward navigation, branch switching, commands, existing projects,
workshop entry, source copying, persistence, long reading, SVG alignment, resizing,
keyboard focus, RTL overflow, and automated WCAG checks through axe.

Current QA fixes and the physical macOS trackpad checklist are in
[docs/qa-navigation-followup.md](docs/qa-navigation-followup.md). The earlier
[regression investigation](docs/navigation-debug.md) is retained as history.
Synthetic traces and browser wheel injection do not verify physical trackpad
hardware.

Set `NAVIGATION_SCREENSHOT_DIR` to export before/after screenshots for right, left,
forward, backward and the long reading surface across browser profiles.
Set `SCREENSHOT_DIR` when running Playwright to export the verified desktop and
mobile decision views. Browser tests create their own isolated storage; they do not
reset the user's development preview.

## Specifications and workflow

`REQUIREMENTS.md`, `DESIGN.md`, `TASKS.md`, and `HANDS_ON.md` are tracked here, with
mirrored copies in the parent workspace. Later navigation amendments override the
historical manual-confirmation and linear-layout requirements. `TASKS.md` records
validation evidence and preserves the original task history.

Use a dedicated feature branch for each phase and Conventional Commits. Validate
before merging locally into `main`, then push the validated merge to `origin` as
authorized. Fetch remote changes first and preserve history; never force push or
commit secrets.

The pinned Fiber Timer compatibility patch in `patches/` is applied by pnpm
through `pnpm-workspace.yaml`; use `pnpm install --frozen-lockfile` to reproduce it.
