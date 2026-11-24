# Continuous movement and cinematic arrival

The 24 November request supersedes the historical one-gesture/one-stop contract.
Branch choices still use the repaired signed wheel classifier, accumulated short
intent, normalized units, and reading-area ownership. Choosing a branch now only
configures the route. It does not advance the cursor or start a camera flight.

## Runtime ownership

The graph store owns one mutable motion model. It stores arc distance, input target,
velocity, and an optional magnetic target. Runtime frames do not persist to storage
or re-render the whole graph; only changed route/visit/cursor metadata is published.
`useGraphGesture` is the only input subscription. `useGraphCamera` is the only frame
controller. There is no GSAP flight, navigation timeout, arrival lock, or animation
completion callback controlling input.

`graph-path` uses the same cubic curve as the persistent SVG and samples arc length
for proportional travel. All movement, attraction, and reveal settings are in
`constants/graphMotion.ts`. Browser momentum packets remain input, with no invented
coasting impulse. Reversal discards following lag in the old direction. Outlier
packets and route endpoints are bounded; a small reverse packet cannot target the
previous node.

A continuing gesture retains its original decision ownership while moving and
reading. Changing classification from vertical travel to diagonal choice at a new
decision cannot select a second branch from the same momentum tail. A fresh gesture
or deliberate physical reversal can choose another path. Vertical input transfers
to readable content at arrival without waiting for an animation.

## Magnetic positioning and text

Both target and actual camera position must be within the attraction radius.
Input velocity must decay and camera velocity must be low before attraction starts.
A critically damped spring settles without excessive bounce. Opposing stale velocity
is discarded when attraction begins. Capture uses a generous 240-world-unit radius;
release hysteresis keeps incidental motion from dislodging the reader. Signed input
accumulates toward a 26-unit intentional release, with reversal and quiet-period
reset. The full accumulated input is applied on release, without a navigation lock.
The released stop cannot recapture a deliberate departure until the user reverses
or exits its 330-unit outer radius. Between stops, small inputs remain proportional.
Zero wheel packets do not release or prolong a stop. Decision interaction remains
available within 220 world units; choosing locally preserves the camera position
and gently recenters, without starting travel along the new branch.

Text opacity, small translate/scale, blur, and path glow follow camera proximity.
A critically damped focus signal smooths changes and reverses on backtracking.
Nearby readers remain mounted, preserving identity through cursor boundaries.
There are no timed entrance keyframes to replay or block scrolling. Upcoming
workshop stations do not record visits or change a plan just because they are
pre-rendered. Reduced motion removes decorative text effects, follows input directly,
and retains gentle local positioning instead of a sudden snap.

The camera frame loop drains spring velocity as well as positional error. Endpoint
clamping can reach the exact coordinate while velocity is still decaying; stopping
frames at that point previously prevented the stable-arrival focus handoff. Reading
focus waits for the current reader to mount and the camera to settle. Native Space
activation on branch buttons remains available, as do vertical arrow navigation
after keyboard branch selection.

## Revisiting decisions

Original decision definitions are rendered independently of visited/completed state.
Every decision keeps its full question, explanation, typography and branch layout;
history only supplies context and a subtle highlight of the previous choice. The
compact distant-summary rendering has been removed. Inactive nodes remain inert
and hidden from assistive technology.

Entering a decision prepares its original reading position once, so a previously
scrolled long explanation cannot hide the question on return. This does not reset
reading within the current stop or on resize. Preparation follows reader identity
before arrival, without controlling camera movement or input.

Backtracking marks reached decision nodes as awaiting a fresh choice. The old route
is retained for continuous reverse movement and accurate distance progress, but
forward movement cannot silently reuse its previous decision. Selecting either
branch clears that pending choice; changing it replaces the route suffix while
preserving the archive of visited nodes and connections. Pending choices are
validated on storage restoration and pruned when a route changes.

Local recentering after a choice also rebases the backward-movement observer. It
must not interpret the changed arc-distance origin as reverse user input and arm
the same decision again. Regression tests reproduce this for both reselecting the
same branch and switching branches just outside the exact node center.

## Verification and limits

Unit coverage includes proportional distances, small reverse packets, bounded large
input, momentum, branch-only selection, shared geometry, magnetic radius/velocity,
release, reduced-motion positioning, stable readers, and cleanup. Browser coverage
uses native injected wheel input and constructed packet traces in Chromium and
WebKit, including RTL, mobile, reduced motion, QA-01–QA-03, and content utilities.

The previous design/trackpad behavior was confirmed by the user. Physical Mac
trackpad validation of this new continuous model has not been performed by the
agent. Check diagonals, repeated short gestures, long momentum, mid-path reversal,
near-text release, and reading on hardware before treating it as hardware sign-off.

Final software validation on 24 November 2026: 131 Vitest tests across 26 files,
235 Playwright scenarios with no retries, and 16 strict TypeScript/production-build
workshop checks passed. Lint, formatting, application and E2E typechecks, and the
production build passed. The browser matrix covers the QA-report viewport/DPR,
Chromium desktop/mobile/reduced motion, and WebKit. Arrival, reversal and revisited
decision screenshots were inspected at desktop and mobile sizes. Hardware
acceptance remains separate.
