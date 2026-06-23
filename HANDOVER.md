# XRZENO Hero — Handover / Note to self

## What this is
Marketing "thesis" hero for **XRZENO** (WebAR product viz for Indonesian FMCG/F&B). Single
self-contained `index.html` (three.js 0.160 via jsdelivr import map). ~36k glowing points scatter,
gather on interaction, and resolve into the scanned **Shinobu** whisky bottle. "View in your space"
fires native AR.

Run over http (NOT file://): `python -m http.server 8000` in this folder → `http://127.0.0.1:8000/`.

## Git / hosting
- Repo: **https://github.com/ektjio-code/xr_landing_page** (`origin`/`main`). Author `Ed <ed@localhost>`
  (placeholder email by request). `.claude/settings.json` shows modified constantly — harness noise,
  never commit it. Git note: commits intermittently fail "couldn't set refs/heads/main" — just retry
  (clear stale `.git/*.lock`); pushes need sandbox off.
- GitHub Pages for real AR + on-device perf testing: `https://ektjio-code.github.io/xr_landing_page/`.
  Phones can't reach a localhost dev server.
- **`Backup/index.html`** is a manual safety copy (gitignored). It is CURRENT as of this writing
  (identical to index.html). If you ever "restore the backup," verify it's current first — an ancient
  backup caused a big time-wasting detour.

## Current state (single bottle — CONFIRMED GOOD)
- **Model:** `shinobu.glb` (case `3DModel`, `GlossyCoat`, glass `BottleGlass`). Texture 2K. Upright
  along Y → `wrap.rotation.x = 0` (the old `-Math.PI/2*0.15` was a Firefly lean; gone).
- **Environment:** procedural **`RoomEnvironment`** (neutral; the museum HDRI read too warm — deleted).
  `pmrem.fromScene(new RoomEnvironment(), 0.04)`. Background stays warm charcoal `#16130f`.
- **Glass (faked — real transmission renders WHITE in this bloom pipeline, DEAD END):** black base +
  alpha (opacity 0.2) + `envMapIntensity 2.4` + `clearcoat 1` + FrontSide + `depthWrite false`. The
  clearcoat gives a Fresnel rim so it reads head-on; black base avoids the milky veil.
- **Softboxes:** two `RectAreaLight`s (intensity 3, up high) — RoomEnvironment is too even to give the
  glass crisp highlights up front, so these give it something bright to reflect. Don't fade them.
- **Lighting:** warm studio key/fill/rim/amb fade to a 40% floor as it forms (`lit = 1 - 0.6*formed`);
  RoomEnvironment does most of the formed lighting. `envMapIntensity` 1.3 non-glass. Exposure 0.95.
- **Anti-aliasing:** 4× MSAA on the composer's render targets (`composer.renderTarget1/2.samples = 4`).
  The renderer's own `antialias:true` is bypassed by post-processing — MUST be on the composer.
- **Anisotropy:** `getMaxAnisotropy()` on all texture maps (sharp at grazing angles).
- **Sequence:** scattered dots (no silhouette) → gather → solid bottle, ZERO dots. `sampler.sample(tmpP)`
  position arg ONLY (null crashes it). Non-glass meshes fade opacity 0→1 then go OPAQUE at full form
  so the transparent glass sorts over the label.
- **Bloom:** dots phase only. `bloom.strength` fades to 0 and `bloom.enabled=false` once formed.

## Interaction
- **Desktop:** scroll-to-form (400vh track), drag to spin.
- **Mobile (`pointer:coarse`):** NO scroll — pinch to form (squeeze gather / spread disperse),
  1-finger drag = rotate, page zoom off. Hint "Pinch to materialize". Narrative copy hidden.

## AR (DONE, native — no web viewer)
- iOS: AR Quick Look `shinobu_1k_ar.usdz` (`rel="ar"`). Android: Scene Viewer `shinobu_1k_ar.glb`,
  `mode=ar_only`. Desktop: on-brand toast. (AR Quick Look is Safari-only on iOS — Chrome iOS downloads
  the usdz first, so it launches LATE; the 6MB size keeps that short.)
- usdz was slimmed 20MB→6MB: 1K texture + binary `.usdc` geometry via **`usd-core`** (pip-installed on
  this box) — `Usd.Stage.Open(...).Export('x.usdc')` then `UsdUtils.CreateNewUsdzPackage`. Lossless.

## Perf (all in)
First-formation stutter + mobile heat — all fixed:
- **Always `composer.render()`** (no composer↔direct path switch → no mass shader recompile = the stutter).
- **Warm-up reveal:** loader waits for the model, pre-compiles the formed pipeline off-screen via the
  composer (both bloom states) so the first materialize doesn't compile live. See `warmupReveal()`.
- **Idle-skip:** `setForm` only rewrites/re-uploads the point buffer when `curF` changed (was every
  frame forever = mobile heat).
- **Mobile tier:** `pixelRatio` cap 1.5, `COUNT` 16k.
- DEAD ENDS — do not retry: physical transmission (white), half-res bloom (flickery on the dots), the
  composer↔direct render switch (stutter).

## Tuning knobs
`COUNT` 36k/16k; point `size 0.011`; bloom `(0.85, 0.45, 0.2)`; glass `opacity 0.2 / env 2.4 /
clearcoat 1`; softbox intensity 3; exposure 0.95; light floor `1 - 0.6*formed`; camera FOV 38,
pos `(0, -0.06, 1.15)`; scale `0.62/maxDim`; fly-home `f/0.7`; mesh fade `(f-0.55)/0.45`; track `400vh`.

## Abandoned this week (don't reopen unless asked)
- **Hero scene** (`shinobu_hero_scene_2k.glb`, bottle + tray + glasses + whiskey) — deleted. The
  whiskey LIQUID could never look right: real whiskey is translucent, but transmission renders white
  here and alpha-faking it is either milky, accumulates to opaque, or (opaque bake) looks like plastic.
  Molded glass also went opaque from alpha accumulation. Verdict: this pipeline can't do translucent
  glass+liquid; would need real transmission (direct render, risky) or a baked look. Ed chose the
  single bottle instead.

## Backlog
- Optional: 1K display texture / mesh decimation if mobile still runs warm (test on device first).
- Narrative copy on mobile (currently hidden) — design decision pending.
- Reduced-motion, keyboard focus. Per-texel point color (currently uniform warm tint 0.92,0.74,0.52).

## Working style (Ed)
One change at a time, test live, eyeball both Chrome + VS Code preview, desktop must stay identical.
Discuss/diagnose before patching when asked. Keep a local server running; re-run on request.

## Design intent
Apple-modern restraint. Warm charcoal stage (`#16130f`), warm amber accent (`#e8a05c`), product's own
texture carries the color. AVOID near-black + acid-green. One bold move (coalesce + glow); object is the hero.
