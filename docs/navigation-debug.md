# Navigation regression investigation — 2026-11-23

Scope: repair navigation without changing the layout, theme, content, or workshop.
Baseline: main commit `75594ba6bc198166be82d07a4384c0c5d6825058`.

## Reproduced causes

1. The previous wheel handler rejected each horizontal sample of 2px or less before
   accumulating intent. A stream of 160 positive 1.5px samples (240px in total)
   never selected RIGHT. Negative samples failed identically.
2. A shared `sum` combined axes. Vertical 110px followed by horizontal 110px selected
   a branch even though neither axis reached the 180px intent threshold.
3. A vertical reading lock swallowed deliberate horizontal input in the same
   session. Reading 40px and then moving horizontally 220px did not select a branch.
4. The old 0.65 diagonal ratio accepted horizontal intent even when vertical travel
   was larger. Axis ownership was implicit, making mixed-axis input inconsistent.
5. `verify → project` and `browser → tools` were labelled RIGHT but had identical
   source/target x coordinates. Their cameras could only move vertically.
6. Camera completion depended on GSAP's globally compensated ticker. Slow frames
   stretched the tween and held the navigation lock. Chromium diagnostics recorded
   about six animation frames per second in the local software-rendering run. A
   controlled regression delivering frames 650ms apart reproduced the lock beyond
   the seven-second assertion deadline, before the camera fix.

7. Chromium sometimes programmatically scrolled the outer `.world-viewport` after
   workshop interactions. Instrumented repeats captured `scrollLeft: -200` and
   `scrollTop: 578`, while the camera still had the correct coordinates. CSS
   `overflow: hidden` allows this focus/scrollIntoView behavior; it did not make
   the world a non-scrollable viewport. This explains jumps and clipped content
   that were independent of the gesture state.

Four new Vitest regressions failed before the changes. The fractional-RIGHT and
mixed-axis browser cases both failed in Chromium and WebKit. The separate slow-frame
camera regression failed in Chromium before the camera-clock change. These failures
explain why the earlier suite, which mainly used large isolated deltas, missed this.

## Listener and state audit

The active App mounts `ImmersiveWorld`, one `useGraphGesture`, and one
`useGraphCamera`. There is no active Lenis or ScrollTrigger controller. The old
`useWorldCamera`, `useBranchGesture`, and Motion scroll renderers are historical
modules outside the active navigation tree. Motion's cursor and atmospheric effects
do not mutate the navigation store. Browser-native document scrolling is disabled;
the active node has the sole controlled reading surface. Utility inputs and dialogs
retain local input. The old handler already read `getState()` at event time; stale
closures were not the cause of the reproduced gesture failures.

## Repair

- `graph-gesture.ts` owns wheel session interpretation with explicit intent, reading,
  and navigation modes, separate signed x/y accumulation, a 1.25 dominance ratio,
  and a 24px axis-lock threshold. Fractional samples are retained. Balanced
  diagonals do not choose a branch. All settings live in `GRAPH_GESTURE`.
- One accepted command consumes the continuous stream, including momentum after
  arrival. A 240ms quiet interval starts a new gesture. A full 180px reversal after
  arrival allows immediate intentional backtracking; small elastic bounce does not.
- Reading owns its complete vertical stream, including at its boundary. A deliberate
  horizontal axis change can leave reading. A stop change cannot carry a reading
  session into the next node.
- The hook maps positive x to physical RIGHT and negative x to LEFT independently
  of RTL; it normalizes pixel, line, and page units. Repeated keys and in-flight
  touches are consumed. Touch cancellation and every listener have cleanup.
- The store locks step/select/jump atomically and guards arrival by revision.
  Camera code owns one paused GSAP interpolator sought from elapsed wall-clock
  time. Its own completion deadline snaps to exact coordinates even if animation
  frames are throttled. There is no second running tween. Cleanup cancels its frame,
  deadline, and interpolator; obsolete revisions cannot finish a newer flight.
- The outer world uses `overflow: clip` so native focus/scrollIntoView cannot move
  it behind the camera. The controlled `.graph-reading` surface remains scrollable.
- Only project/tools coordinates changed, restoring the labelled rightward geometry.
  Shared SVG endpoints still use the same node positions as the camera.

## Automated coverage

`src/lib/graph-gesture.test.ts`, `src/hooks/useGraphGesture.test.tsx`,
`src/hooks/useGraphCamera.test.tsx`, and `src/lib/graph-navigation.test.ts` cover
intent, session ownership, momentum, cancellation, listener cleanup, and geometry.

`e2e/gesture-regression.spec.ts` runs in Chromium desktop, mobile, reduced motion,
and WebKit. It covers all requested scenarios:

| Scenario               | Browser evidence                                                     |
| ---------------------- | -------------------------------------------------------------------- |
| Positive / negative x  | Browser-injected wheel, fractional synthetic streams, RTL            |
| Down / up              | One stop each; exact camera coordinates and screenshots              |
| Diagonal intent        | Horizontal/vertical dominance and ambiguous diagonals                |
| Rapid input / momentum | Bursts spanning flight and arrival; decaying tails                   |
| Re-arming              | Fresh gesture after flight and deliberate reversal without quiet     |
| Change previous choice | Backtracking, replacement suffix, preserved visited history          |
| Stable viewport        | No document x/y scroll or overflow; camera/node alignment            |
| Continuous lines       | Actual SVG start/end coordinates match all source/target nodes       |
| Other input            | Keyboard, click fallback, synthetic touch, utility input isolation   |
| Long content           | Full H04 solution read to its boundary before a new gesture advances |
| Lifecycle              | Resize in flight, one active wheel listener, slow-frame completion   |
| Runtime errors         | No console errors, page errors, or unhandled rejections              |

Set `NAVIGATION_SCREENSHOT_DIR` when running Playwright to export before/after
images for right, left, down and up, plus long reading at its boundary. Normal
Playwright attachments retain the same images. The existing end-to-end suite also
covers commands, the complete workshop, source copying, persistence, accessibility,
reading, and responsive layouts.

Run:

```sh
pnpm format:check
pnpm lint
pnpm exec tsc -b
pnpm test
pnpm build
pnpm exec playwright install chromium webkit
pnpm exec playwright test
```

## Validation result

- Formatting, lint, application typecheck, strict TypeScript checking of the new
  Playwright tests, and production build passed.
- All 82 Vitest tests passed across 22 files.
- All 128 Playwright cases passed: Chromium desktop, mobile, reduced motion, and
  the 17 navigation regression cases in WebKit. No tests were skipped.
- All 16 workshop snapshot TypeScript/build checks passed.
- Before/after screenshots for all four directions were captured and inspected
  at desktop and mobile sizes. Tests check exact snaps, monotonic diagonal camera
  movement, stable viewport offsets, connected SVG endpoints, and readable code.
- Test input targets avoid utility inputs, and seeded stops wait for the arrival
  reveal. A file selector intentionally retains native wheel interaction.

## Physical macOS trackpad check — still manual

Synthetic WheelEvents and Playwright browser wheel injection cannot prove physical
Mac trackpad behavior, macOS natural-scroll settings, or hardware momentum phases.
The automated tests therefore do not claim that verification.

1. In Safari and Chrome, use small deliberate horizontal movements toward RIGHT,
   then return upward and choose LEFT. Verify the labelled physical side and the
   matching diagonal camera movement.
2. Try horizontal-dominant diagonals in both directions, vertical-dominant movement,
   and near-45-degree movement. Ambiguous movement should not select a branch.
3. Flick down and let all momentum finish: only one stop should advance. Repeat
   deliberately, reverse upward, and change a previous decision. No alert or stuck
   lock should appear.
4. At a long workshop solution, read to the bottom, lift fingers, then scroll again
   to advance. Repeat with reduced motion enabled; verify stable text and connected
   lines. Check normal and natural-scroll settings if both are used.
