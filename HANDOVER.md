# XRZENO Hero — Handover / Note to self

## ⛔ STOP — READ FIRST
**The user wants to TEST THE CURRENT BUILD LIVE before any patches.**
**DO NOT PATCH / EDIT index.html until explicitly told to.** The mobile-perf fix below is
PROPOSED ONLY. Wait for the go-ahead. One change at a time, eyeball after each.

---

## What this is
Marketing hero for **XRZENO** (WebAR product visualization for Indonesian FMCG/F&B clients;
photogrammetry → Blender → GLB/USDZ → web pipeline). The page is the "thesis" hero: ~36k glowing
points start scattered, gather on scroll, and resolve into the real scanned product (GI Joe
**Firefly** GLB). Single self-contained `index.html` (HTML + CSS + three.js module).

Run locally over http (NOT file://): `python -m http.server 8000` in this folder, open
`http://127.0.0.1:8000/`. Currently served on port 8000 in the background.

## Current state — WORKING / CONFIRMED GOOD (do not re-break)
- **Loads & runs over http.** Three.js 0.160.0 + addons from jsdelivr (needs internet).
- **`sampler.sample(tmpP)`** — position arg ONLY. Passing `null` crashes MeshSurfaceSampler. Leave it.
- **Sequence is correct and signed off:**
  1. Top of page: scattered floating dots, **no figure silhouette** (any angle, incl. rear).
  2. Scroll: dots gather → figure forms.
  3. Fully formed: solid textured mesh, **ZERO dots** anywhere.
- **Silhouette fix:** mesh is `mesh.visible = meshIn > 0` — while invisible it was writing depth
  and punching a figure-shaped hole in the dot cloud (read as black shadow). Now off until forming.
- **No more dots-on-mesh / occlusion saga:** points fade FULLY to 0 (`0.9*(1-meshIn)`) and
  `points.visible = meshIn < 1`. The whole "rear dots vanish dead-on" problem is moot — dots are
  gone by full formation. (Earlier depthTest:false / polygonOffset / vertex-sampling detours are all
  DEAD ENDS — do not revisit.)
- **Glow / real-time emission (user called it "beautiful"):**
  - Post chain: `EffectComposer → RenderPass → UnrealBloomPass(0.85, 0.45, 0.2) → OutputPass`.
  - Each point is a soft radial-gradient sprite (`makeDotSprite()`), `size:0.011`, additive.
  - `scene.background = 0x16130f` (warm charcoal) — dark base bloom needs; canvas now opaque.
  - Render loop uses `composer.render()`. Resize updates `composer.setSize()`.
- `depthTest:true` on points. Keep it.

## OPEN QUESTION the user is evaluating: mobile performance
User asked "is this heavy on mobile?" — answer: **yes, moderately.** Will run on modern phones but
mid-range/old devices will drop frames. Three stacked costs:
1. **Bloom** — UnrealBloomPass = ~5 blur passes/frame at full res × pixelRatio (capped 2). Biggest cost.
2. **Fillrate** — 36k additive soft sprites = heavy overdraw; mobile GPUs are fillrate-bound.
3. **CPU/bandwidth** — `setForm()` rewrites all 36k positions AND re-uploads the 108k-float buffer
   EVERY frame, even when idle and even after dots are hidden. Pure waste.

## PROPOSED FIX (mobile perf) — NOT YET APPLIED. Wait for go-ahead.

### Tier A — no visual change, apply for everyone
1. **Skip point update when nothing changed.** In `setForm()` / `loop()`: only rewrite + re-upload
   the position buffer when `curF` actually moved since last frame; bail entirely once
   `points.visible === false` (fully formed). Rotation is on the pivot, so it needs NO buffer
   rewrite — idle/auto-rotate should cost ~0 CPU for the cloud. Removes most idle cost.
2. **Half-res bloom.** Construct `UnrealBloomPass` with resolution `new THREE.Vector2(W/2, H/2)`
   (and `composer.setSize` stays full). Bloom is blurry anyway → ~4× cheaper, near-indistinguishable.

### Tier B — mobile branch, tiny trade-off
3. **Detect mobile** (e.g. `matchMedia('(pointer:coarse)').matches` or UA + small viewport) and:
   - `COUNT` 36000 → ~14000.
   - `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`.
   - Bloom strength slightly down (~0.85 → ~0.6) to ease fillrate.
4. **Optional:** respect `prefers-reduced-motion` (also a roadmap TODO) — reduce/disable the
   coalesce animation, drop bloom.

### How to verify
Apply ONE change at a time. After each: hard-refresh (Ctrl+F5), eyeball in BOTH Chrome and the VS
Code preview, confirm **desktop look is unchanged**. Tier A must be visually identical.

## Tuning knobs (current values)
- `COUNT = 36000`; point `size: 0.011`; bloom `(strength 0.85, radius 0.45, threshold 0.2)`.
- scale `0.62 / maxDim`; `wrap.rotation.x = -Math.PI/2 * 0.15` (orientation).
- fly-home window `f/0.7`; mesh fade `(f-0.55)/0.45`; track height `400vh` (CSS).
- Dead leftovers (harmless): `tmpC`, `hasColor` in the sampling block — unused.

## ROADMAP (not built)
- Real WebAR: replace stubbed `arBtn` alert with `<model-viewer>` (GLB + USDZ); desktop QR fallback.
- Catalog/gallery of FMCG/F&B SKUs (each spinnable).
- Mobile tuning (see above), reduced-motion, keyboard focus.
- Possibly vendor Three.js locally for offline/venue-wifi demos.
- Optional: per-texel point color instead of the uniform warm tint (0.92, 0.74, 0.52).

## Design intent (keep the feeling on any refactor)
Apple-modern restraint. Warm charcoal stage (`--stage:#16130f`), warm amber accent (`#e8a05c`),
product's own texture carries the color. AVOID near-black + acid-green (generic AI default). One
bold move (the coalesce + glow); everything else quiet. The object is the hero.
