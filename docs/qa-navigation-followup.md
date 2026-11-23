# QA report follow-up — 23 November 2026

The attached Hebrew QA report is the primary debugging reference for this repair.
This document supersedes the earlier policy that ignored balanced diagonal input.
The existing world, educational content, camera interpolation, diagonal coordinates,
reverse navigation, and eased stops remain in use.

## Controller audit

The mounted `ImmersiveWorld` uses one `useGraphGesture` subscription and one
`useGraphCamera` controller. Keyboard, touch, wheel, and branch clicks update the
same graph store; the camera only follows accepted revisions. Event listeners are
removed on cleanup. Historical ScrollTrigger/branch hooks are not mounted, and
Lenis is not installed. These QA failures were in gesture classification, input
ownership, and intent lifetime, rather than competing camera animations. The
existing GSAP camera easing and exact arrival coordinates were preserved.

## QA-01 — diagonal intent

The old classifier required `abs(x) > 1.25 * abs(y)` or the reverse. Both expressions
were false for 650/650 and 300/350, independently of the commitment threshold. The
previous tests explicitly expected that dead zone, so lowering a threshold alone
could not fix the report.

`graphGestureAxis` now receives the node context. At a decision, downward diagonals
with a meaningful horizontal component follow its physical sign, including equal
components. Clearly vertical movement follows the selected path. Upward diagonals
return along the path. Non-branching nodes favor vertical progression. RTL and the
hovered branch do not reverse the physical direction.

The same session engine still owns signed per-axis accumulation, intent locking,
reading, momentum consumption, and deliberate reversal. It emits one navigation
command; the existing camera controller interpolates continuously to that node and
settles at the exact coordinates with its existing easing.

Before the change, five new unit cases and the two large-diagonal browser cases
failed. The repaired cases now pass, including near-diagonal input over the opposite
branch and representative packet sequences with acceleration, jitter, and decay.
Those packet sequences are constructed regression inputs, not recordings from a
physical Mac trackpad.

Reduced-motion coverage also exposed a discrete-input ownership bug: a keyboard
return overwrote the previous wheel gesture's axis, suppressing an immediate
opposite horizontal branch. Keyboard/touch commands now leave wheel ownership
with the wheel controller. A regression checks that old wheel momentum remains
consumed while the opposite branch is accepted after the keyboard return.

## QA-02 — reading and branch hit areas

The buttons started at 48% of the viewport, while the reader could extend below
that point. The branch layer sat above the reader. The wheel handler then disabled
reading when it found a branch button under the pointer. This explains the report's
unintended done/error selection over visible commands.

`useGraphBranchLayout` measures the actual reading rectangle on arrival and through
ResizeObserver. Each hit region starts below the reader plus the configured gap,
or below the existing relative minimum when that is farther down. This changes the
input boundary without moving the existing labels or resizing the content cards.

The gesture controller also checks DOM ownership and event coordinates against the
reading rectangle. A temporarily stale overlay cannot turn vertical reading into a
branch selection. Pointer clicks have the same reader guard; keyboard activation
of branch buttons is retained.

Tests cover the report's 1789×819 / DPR 1.5 viewport and both 1100/420 and 600/420
requests, plus responsive boundaries at verify, H05, and pause-2. Instructions scroll
from the top on each side and remain at verify. Unit tests independently reproduce
a stale overlay and verify reading priority.

The resize regression waits for the camera transform to match the new viewport,
then samples the reader and branch rectangles in the same browser evaluation.
This avoids comparing a pre-resize reader rectangle with a post-resize hit area;
checking only the previous `data-camera-busy=false` value could race the viewport's
ResizeObserver update. The no-overlap assertion remains in place.

## QA-03 — short input

The existing engine accumulated fractional input, but gave no visible indication
before commitment. A pause ended that session. The report correctly distinguished
browser control requests from actual WheelEvent samples: in our Chromium DPR 1.5
reproduction, a horizontal request of 120 produced a pixel-mode deltaX of 80.

The repair exposes preview direction and progress from the same accumulated intent.
The existing branch shows a small progress indication and directional guidance,
with a polite accessible status. This preview does not change the navigation state
or create another camera controller. It expires at the gesture boundary, clears on
navigation/cancellation, and respects reduced motion. A deliberate opposite intent
resets direction; small jitter does not flip it.

Uncommitted horizontal intent and its feedback use a 650ms pause window. After a
command has been accepted, the existing 240ms momentum re-arm rule remains in use.
Tests verify that 350ms gaps accumulate and 700ms gaps reset uncommitted intent.

The branch commitment distance is configured separately from vertical progression.
Wheel units are normalized before accumulation. Tests check exact logical samples,
five short packets, packet timestamps/deltaMode, direction reset, feedback expiry,
continued momentum, and forward/backward branch switching. Native browser requests
are assessed using the packets actually delivered, rather than assuming the request
distance is the same unit. No physical-device calibration is claimed.

## OBS-01 — renderer clock

The source was Fiber 9.8.2's store initialization (`new THREE.Clock()`), not the
navigation handlers. The npm registry returned that same Fiber version during the
investigation, so there was no newer release to apply for this change.

The tracked pnpm patch migrates that initialization to a `THREE.Timer` adapter in
the ESM, development CJS, and production CJS distributions. It preserves the clock
methods and writable elapsedTime/oldTime used by Fiber's demand and manual modes.
Console output is not filtered in production. The lockfile and
`pnpm-workspace.yaml` apply the patch reproducibly; frozen installation was verified.
Review/remove the patch when upgrading Fiber to an upstream Timer implementation.

Integration tests instantiate a fresh real renderer store and test start/stop,
delta/elapsed time, demand mode, and manually advanced frames. Browser tests enable
the existing scene on software-backed WebGL to exercise actual Canvas initialization
and continuing draw calls in Chromium and WebKit. They assert no deprecated Clock
warning and also navigate forward/backward. This is not a physical GPU benchmark.

## Final automated validation

All checks passed on the repaired implementation; Playwright used no retries.

| Check                                             | Result                      |
| ------------------------------------------------- | --------------------------- |
| Prettier and ESLint                               | Passed                      |
| Application and regression-test strict TypeScript | Passed                      |
| Vitest                                            | 99 tests in 24 files passed |
| Production build                                  | Passed                      |
| Workshop source TypeScript/build checks           | 16 passed                   |
| Full Playwright suite                             | 195 passed                  |
| Additional resize repetitions                     | 15 passed                   |

The browser matrix includes Chromium at the report's 1789×819 / DPR 1.5 (13 cases),
WebKit navigation/QA/renderer initialization (31), Chromium desktop (51), mobile
390×844 (50), and reduced motion (50). The QA resize case additionally exercises
1280×720. Screenshots before/after right, left, forward, and backward navigation,
reading, branch switching, and short-intent feedback were captured. Desktop and
mobile images were visually reviewed. Assertions check exact camera arrival,
continuous SVG connections, reading boundaries, input cleanup, RTL overflow,
history, one transition per gesture, and browser errors.

QA-01, QA-02, and QA-03 are verified as repaired under this automated coverage.
The existing camera easing, diagonal paths, educational content, and workshop
remain in place. Physical-device acceptance is separately open as HW-01.

## Current macOS acceptance checklist

Physical Mac trackpad testing has **not** been performed. HW-01 remains open; the
software fixes are not a claim of physical inertia acceptance. No user progress was
reset by the isolated browser tests.

In Brave/Chrome and Safari, at the report size and another viewport:

1. Try right/down and left/down diagonals with similar components, then slightly
   unequal components. The horizontal sign should choose the corresponding branch,
   even while the pointer is over the opposite branch.
2. At verify, scroll over both sides of the visible code. Read the remaining
   instructions without selecting done/error; then choose a visible branch.
3. Start with a short horizontal gesture and observe direction/progress. Continue
   it to choose one branch, let the momentum finish, then reverse and change a
   previous choice. One continuous gesture must not skip extra nodes.
4. Read long workshop content to its boundary, lift fingers, and continue. Repeat
   with reduced motion. Check that camera stops, reverse movement, and paths remain
   stable. Record actual WheelEvent units/timing if a problem remains.
