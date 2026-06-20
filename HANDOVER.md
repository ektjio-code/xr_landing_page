# XRZENO Hero — Handover / Note to self

## ▶ NEXT SESSION STARTS HERE: mobile = PINCH model (AGREED with Ed, not yet patched)
**Why:** the old scroll-driven mobile model was the root of every mobile problem — pull-to-refresh,
overscroll bounce, AND the touch-rotate-vs-scroll collision ("rotate moves a bit then stops" because
the browser hijacks the touch as a page-scroll → `pointercancel`). Dropping scroll on mobile kills
all three at once. Desktop is unaffected.

**Agreed model:**
- **Desktop:** unchanged — scroll-to-form (the 400vh track). Do NOT touch desktop behavior.
- **Mobile (pointer:coarse / touch):** NO scrolling — single fixed viewport. Page zoom disabled
  (Ed OK'd the accessibility trade-off). Drive the form amount `f`/`targetF` from a **pinch**:
  - **Squeeze (2-finger distance shrinking) → form** (`f`→1, dots gather into the figure).
  - **Spread (2-finger distance growing) → disperse** (`f`→0, figure explodes back to dots).
  - Use a RELATIVE pinch (accumulate per-move delta into targetF), not absolute span. Existing
    `curF += (targetF-curF)*0.1` smoothing gives inertia for free.
  - **1 finger drag = rotate** (this is the long-standing rotation fix — no scroll to collide now).
    Gesture split by finger count: 1 touch = rotate, 2 touches = pinch. On 2→1 transition, stop
    pinch / start rotate.
- **Hint:** show "Pinch to materialize" (text only). NO auto-demo — Ed: "discovery is half the fun."
- **Narrative copy (c1/c2/c3):** LEAVE AS-IS for now — decide later. They key off `curF`, so they
  still fire as the figure forms; just don't redesign them this pass.

**Implementation notes / gotchas:**
- Kill page zoom reliably with BOTH: viewport meta `maximum-scale=1, user-scalable=no` AND
  `touch-action:none` on the canvas/stage + `preventDefault` in the pinch `touchmove` (iOS Safari
  ignores user-scalable alone). Scope `touch-action:none` to the stage if possible.
- On mobile, `scrollProgress()` must NOT drive `curF` (there's no scroll) — pinch drives `targetF`
  instead. Make `#track` height 100vh (or static) on mobile via media query so the page doesn't scroll.
- Prefer one unified touch handler on mobile (1 vs 2 touches) over mixing pointer+touch events
  (they double-fire). Keep desktop on its current pointer-drag + scroll path.
- Detect mobile via `matchMedia('(pointer:coarse)')` (also gates the perf Tier B below).

**Suggested build sequence (one change at a time, eyeball each, desktop must stay identical):**
1. Mobile branch: disable scroll + zoom, drive `targetF` from pinch (form/disperse).
2. 1-finger drag → rotate on mobile.
3. "Pinch to materialize" hint for mobile.
(Narrative copy + mobile perf tiers come after.)

---

## What this is
Marketing hero for **XRZENO** (WebAR product visualization for Indonesian FMCG/F&B clients;
photogrammetry → Blender → GLB/USDZ → web pipeline). The "thesis" hero: ~36k glowing points start
scattered, gather on scroll, and resolve into the real scanned product (GI Joe **Firefly**). Single
self-contained `index.html` (HTML + CSS + three.js module).

Run locally over http (NOT file://): `python -m http.server 8000` in this folder → `http://127.0.0.1:8000/`.

## Git / hosting
- Repo: **https://github.com/ektjio-code/xr_landing_page** (remote `origin`, branch `main`).
- Author identity is repo-local: `Ed <ed@localhost>` (placeholder email by request — keep real email out).
- **⚠️ 1 unpushed commit:** `origin/main` = the AR-wiring commit; local has the styled-toast commit
  on top, NOT pushed (user said don't push yet). Push when told.
- Ignored: `files.zip`, `Backup/`, Claude temp files. CRLF warnings are harmless (no .gitattributes yet).
- For real AR testing: enable **GitHub Pages** (Settings→Pages→main/root) → `https://ektjio-code.github.io/xr_landing_page/`.
  AR launchers need a public, reachable (https-preferred) URL — they CANNOT hit a phone's localhost.
  Watch `.usdz` MIME on Pages (iOS Quick Look may balk; `.glb`/Android fine).

## Current state — WORKING / CONFIRMED GOOD (do not re-break)
- `sampler.sample(tmpP)` — position arg ONLY. Passing `null` crashes MeshSurfaceSampler. Leave it.
- **Sequence signed off:** (1) top = scattered dots, NO figure silhouette any angle; (2) scroll =
  dots gather → figure forms; (3) fully formed = solid textured mesh, ZERO dots anywhere.
- **Silhouette fix:** `mesh.visible = meshIn > 0` (invisible mesh was writing depth → black-shadow
  hole in dot cloud). **Dots fade FULLY to 0** (`0.9*(1-meshIn)`) + `points.visible = meshIn < 1`.
  The old "rear dots vanish dead-on" problem is moot. DEAD ENDS — do not revisit: `depthTest:false`,
  polygonOffset, vertex/even-per-face sampling.
- **Glow (user: "beautiful"):** `EffectComposer → RenderPass → UnrealBloomPass(0.85,0.45,0.2) →
  OutputPass`. Points are soft radial sprites (`makeDotSprite()`), `size:0.011`, additive,
  `depthTest:true`. `scene.background = 0x16130f` (warm charcoal; canvas now opaque). Loop uses
  `composer.render()`; resize updates `composer.setSize()`.
- **AR button "View in your space" — DONE, fires NATIVE AR (no web 3D viewer):**
  - iOS: AR Quick Look via `firefly.usdz` (`rel="ar"` anchor, programmatic click).
  - Android: Scene Viewer via `firefly.glb`, `mode=ar_only` (straight to camera; fallback = this page).
  - Desktop: on-brand styled toast (`#toast`, warm blurred glass) "View on mobile for AR…", auto-dismiss.
  - Helpers: `isIOS`/`isAndroid`/`baseURL`/`launchAR()`/`showToast()`. Assets present:
    `firefly.glb` (5.7MB), `firefly.usdz` (9.0MB).

## OPEN: mobile performance (discussed, NOT applied)
Moderately heavy. Costs: (1) bloom = ~5 blur passes/frame at full res×pixelRatio; (2) fillrate from
36k additive sprites; (3) `setForm()` rewrites + re-uploads the 108k-float buffer EVERY frame, even
idle/after dots hidden — pure waste.
- **Tier A (no visual change, everyone):** only rewrite/re-upload point buffer when `curF` moved;
  bail once `points.visible===false`. Construct bloom at half res `Vector2(W/2,H/2)`.
- **Tier B (mobile branch, tiny trade-off):** detect mobile (`matchMedia('(pointer:coarse)')`),
  `COUNT` 36000→~14000, cap `setPixelRatio` at 1.5, bloom strength ~0.85→0.6. Optional: respect
  `prefers-reduced-motion`.

## Tuning knobs (current)
`COUNT=36000`; point `size:0.011`; bloom `(0.85, 0.45, 0.2)`; scale `0.62/maxDim`;
`wrap.rotation.x=-Math.PI/2*0.15`; fly-home `f/0.7`; mesh fade `(f-0.55)/0.45`; track `400vh`.
Dead leftovers (harmless): `tmpC`, `hasColor` in sampling block.

## ROADMAP (not built)
- Catalog/gallery of FMCG/F&B SKUs (each spinnable).
- Mobile tuning (rotation fix above + perf tiers), reduced-motion, keyboard focus.
- Possibly vendor Three.js locally for offline/venue-wifi demos.
- Optional: per-texel point color instead of uniform warm tint (0.92, 0.74, 0.52).

## Working style (user = Ed)
Tests live before patches. One change at a time, eyeball BOTH Chrome and the VS Code preview after
each, desktop look must stay identical. Discuss/diagnose before patching when asked.

## Design intent (keep the feeling)
Apple-modern restraint. Warm charcoal stage (`#16130f`), warm amber accent (`#e8a05c`), product's
own texture carries the color. AVOID near-black + acid-green (generic AI default). One bold move
(the coalesce + glow); everything else quiet. The object is the hero.
