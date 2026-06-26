# XRZENO Hero — Handover / Note to self

## ⚠️ READ FIRST — the gotcha that cost a full day
**DO NOT stand the bottle upright. The lean is load-bearing.**
`wrap.rotation.x = -Math.PI/2 * 0.15` (~13.5°) is what makes the glass read as glass on the FRONT.
A clear glass cylinder, head-on/upright, reflects only the dark void behind the camera → the front
looks flat/dead (physics, NOT a bug). The lean tilts the front off-axis so it catches reflections.
Straightening it to "upright / base parallel to ground" is exactly what made the front go flat and
triggered an entire day of chasing softboxes / point lights / layers / normal-flips / HDRI swaps —
all red herrings. If the front ever looks flat again, **check the lean first.**

## What this is
Marketing "thesis" hero for **XRZENO** (WebAR product viz, Indonesian FMCG/F&B). Single self-contained
`index.html` (three.js 0.160 via jsdelivr import map). ~36k glowing points scatter, gather on
interaction, and resolve into the scanned **Shinobu** whisky bottle. "View in your space" fires native AR.

Run over http (NOT file://): `python -m http.server 8000` in this folder → `http://127.0.0.1:8000/`.

## Git / hosting
- Repo: **https://github.com/ektjio-code/xr_landing_page** (`origin`/`main`). Author `Ed <ed@localhost>`.
  `.claude/settings.json` shows modified constantly — harness noise, never commit it. Commits sometimes
  fail "couldn't set refs/heads/main" — just retry (clear stale `.git/*.lock`); pushes need sandbox off.
- GitHub Pages for real AR + on-device testing: `https://ektjio-code.github.io/xr_landing_page/`.
  Phones can't reach a localhost dev server — **push before testing anything on a phone.**
- **`Backup/index.html`** is a manual safety copy (gitignored). It is CURRENT (byte-identical to
  index.html as of the last commit). Restoring it is safe. Git history is the real backup — every
  version is recoverable (e.g. the working glass was pulled from commit `4698e98`).

## Current state (single bottle — GOOD, do not re-break)
- **Model:** `shinobu.glb` (case `3DModel`, `GlossyCoat`, glass `BottleGlass` — a 1-mesh cylinder).
  Leaned (see gotcha). Texture 2K.
- **Environment:** procedural **`RoomEnvironment`** (neutral; museum HDRI was deleted — too warm).
  `pmrem.fromScene(new RoomEnvironment(), 0.04)`. Background warm charcoal `#16130f`.
- **Glass — THE WORKING RECIPE (from git 4698e98), keep it simple:** black base + alpha **opacity 0.12**
  + **roughness 0.04** + **envMapIntensity 1.1** + FrontSide + `depthWrite false`. **NO softboxes, NO
  clearcoat, NO DoubleSide, NO point-lights/layers.** Every one of those was tried today and made it
  worse. (Glass stays faked because it's the proven shipped recipe — NOT because real transmission is
  broken. The old "transmission whites out in bloom" claim was wrong — see **⚠️ Transmission** below.)
- **Lighting:** warm studio key/fill/rim/amb fade to a 40% floor as it forms; RoomEnvironment does most
  of the formed lighting. Non-glass `envMapIntensity` 1.3. Exposure 0.95.
- **Quality (PC/desktop ONLY):** 4× MSAA on the composer targets (`samples = isMobile ? 0 : 4`) +
  anisotropic filtering (`if(!isMobile) ... map.anisotropy`). Mobile skips both.
- **Sequence:** scattered dots (no silhouette) → gather → solid bottle, ZERO dots. `sampler.sample(tmpP)`
  position arg ONLY (null crashes it). Non-glass goes OPAQUE at full form so the glass sorts over it.
- **Bloom:** dots phase only — `bloom.strength`→0 and `bloom.enabled=false` once formed.

## Interaction
- **Desktop:** scroll-to-form (400vh track), drag to spin.
- **Mobile (`pointer:coarse`):** NO scroll — pinch to form (squeeze gather / spread disperse),
  1-finger drag = rotate, page zoom off. Hint "Pinch to materialize".
- **Page copy is minimal by design:** only `XRZENO` (brand), the materialize hint (Scroll/Pinch), and the
  "View in your space" AR button. The old scroll-narrative beats (c1/c2/c3), AR sub-note, and loader text
  were deleted (all viewports) — their CSS + the `toggle()` helper went with them. Don't reintroduce.

## AR (native, no web viewer)
- iOS: AR Quick Look `shinobu_2k_ar.usdz` (4.4MB). Android: Scene Viewer `shinobu_2k_ar.glb` (5.1MB),
  `mode=ar_only`. Desktop: on-brand toast. (Quick Look is Safari-only on iOS; Chrome iOS downloads the
  usdz first so it launches LATE — small size keeps that short.)
- **2K AR assets, compressed — replaced the old 1K slim, now higher-res AND smaller.** Both use a 2048²
  JPEG texture (q92; the source texture's alpha was fully opaque, so JPEG is safe and visually lossless).
  Built with **`usd-core`** + Pillow (both pip-installed here):
  - usdz: flatten stage → binary `.usdc` (geometry 11.5MB ASCII → 3.5MB binary) + rewrite the texture
    asset path png→jpg, then `UsdUtils.CreateNewUsdzPackage`. **19MB → 4.4MB** at full 2K.
  - glb: rebuild the GLB buffer swapping the 4096² texture for 2048² JPEG and re-offsetting every
    bufferView (the image view is mid-buffer, so everything after it shifts). Validated accessor bounds
    + image decode. **7.2MB → 5.1MB.**
  - Source high-res originals live in git history at `8e1f42e^` (`shinobu_ar.usdz` 19MB / `shinobu_ar.glb`
    7.2MB, 4K texture) if you ever need to rebuild.

## Perf (all in)
- **Always `composer.render()`** (no composer↔direct path switch → no mass recompile = the stutter).
- **Warm-up reveal:** pre-compiles the formed pipeline off-screen via composer (both bloom states) so
  first materialize doesn't compile live. See `warmupReveal()`.
- **Idle-skip:** `setForm` only rewrites the point buffer when `curF` changed (was every frame = heat).
- **Mobile tier:** `pixelRatio` 1.5, `COUNT` 16k, no MSAA/aniso.
- DEAD ENDS — do not retry: half-res bloom (flickery on dots), the composer↔direct switch (stutter),
  and the whole softbox/clearcoat/point-light/layer/normal-flip glass chase (the lean was the actual
  answer). (Real transmission was previously listed here as "white" — that was WRONG, see below.)

## ⚠️ Transmission — CORRECTED (the earlier note was WRONG)
Proven live in a standalone test rig (since removed — clean tree). Findings:
- Real `MeshPhysicalMaterial` transmission on a **clean single-mesh glass** renders **perfectly through
  the exact hero pipeline** — RoomEnvironment + EffectComposer + UnrealBloom(0.85,0.45,0.2) + OutputPass,
  bloom ON or OFF. Bloom was never the problem.
- The original "white slab" was an **oversized `thickness`** (set thicker than the whole model → milky) +
  the liquid going invisible, misread as the pipeline breaking. Not bloom, not a dead end.
- A 2nd transmissive **liquid inside the glass does NOT break it** — three.js screen-space transmission
  simply can't refract another transmissive/transparent mesh, so the liquid vanishes (visible only down
  the open rim). **Translucent liquid-in-glass is still impossible** (must be opaque to read through walls;
  faking it with a fresnel emissive looked plastic). Photoreal liquid = bake in Blender or path-trace only.
- Gotchas that cost hours: the model must be **added to the scene** (`scene.add(obj)` — yes, really), must
  have **real faces + applied transforms**, and `thickness` must be **sized to the model**.
- **TESTED on the Shinobu bottle (throwaway copy) → it WHITES OUT. Verdict in.** Root cause: the bottle
  glass is a **SOLID cylinder, not a hollow thin-walled vessel.** Real transmission treats a solid as a
  glass ROD/LENS — thick curved volume → heavy lens distortion + grazing-angle mirror rim + bright env
  reflection = opaque white. The practice tumbler only worked because it's **hollow with thin ~parallel
  walls** (light enters the outer wall and exits the inner wall a hair later → barely bends → see-through).
- **THE REAL LESSON:** real glass transmission needs **hollow thin-walled geometry**, full stop. On a
  solid mesh it can't look like glass. The **fake-alpha recipe is the CORRECT tool** for the hero's solid
  cylinder (not a compromise) — it lays a dark glassy sheen + reflections over the label instead of trying
  to refract a solid. **Do NOT retry real transmission on the bottle** unless it's re-modelled hollow
  (Solidify thin walls + air cavity + label as a separate inner mesh).

## Tuning knobs
`COUNT` 36k/16k; point `size 0.011`; bloom `(0.85,0.45,0.2)`; glass `opacity 0.12 / roughness 0.04 /
env 1.1`; exposure 0.95; light floor `1 - 0.6*formed`; camera FOV 38, pos `(0,-0.06,1.15)`;
`wrap.rotation.x = -Math.PI/2*0.15` (the lean — leave it); scale `0.62/maxDim`.

## 🚧 Tokonoma "scene materialize" page — WIP (NOT live; hero index.html untouched)
A second, richer landing: the Shinobu bottle materializes from dust **inside a tokonoma alcove** (tray,
shoji, hanging scroll, plaster walls). Built in **`index_scene.html`**; runs **three 0.169** (not 0.160 —
needs `environmentRotation`/`environmentIntensity`). Reference rig: **`tokonoma_view.html`** (scene-only,
all lights/camera/DOF dialed there first, then ported). Assets in **`Tokonama Scene/`**
(`shinobu_tokonoma.glb` 26MB single transmission glass, `japanese-room_2K_*.exr` HDRI).

- **Done:** dust→bottle coalesce (samples bottle only), **set fades in at the form tail**; bloom on the
  dust embers (manual UnrealBloom, fades as it forms); constrained **±45° orbit** (locked zoom/pan, baked
  start cam); **mask-blur DOF** (bottle stays sharp via a silhouette mask, set goes soft — depth-independent,
  because bottle≈background distance is tiny); **real transmission** glass; baked lights (shoji `SpotLight`
  casting the lattice grid + a museum down-`SpotLight`, env at intensity 0); brand + hint + **AR button**
  (same bottle-only `shinobu_2k_ar.*`). Desktop full quality, **mobile tier gated by `isMobile`** (½ shadow,
  ½ transmission res, 1 blur pass, no MSAA, 16k pts).
- **NOT done:** real **phone test** (mobile tier coded, unverified); not swapped into the live hero.
- **LESSONS (load-bearing):**
  - **First-form stutter = parallel shader compile.** `renderer.compile()`+render does NOT block with
    `KHR_parallel_shader_compile`; the link finalizes on first real use → hitch. Fix = **`await
    renderer.compileAsync(scene,camera)`** in the warm-up (cover formed + dust states). This was THE fix.
  - **Real transmission re-renders the whole scene per frame** (the cost the hero faked away). Half-res on
    mobile via `renderer.transmissionResolutionScale`.
  - **Don't put a reflection probe on the lacquer tray** — it mirrored the bright plaster walls and washed
    the dark wood uniformly pale. Removed → natural `DarkWood`+clearcoat. (And a *smooth* env on a clearcoat
    reads as a uniform pale film; keep the transient env dark — see `makeDarkEnv`.)
  - **UnrealBloomPass additively blends onto the target** and does NOT copy the base — `copyTex(sharp→bloomRT)`
    first, then `bloom.render`. Glow tuned hot: strength 1.3, radius 0.7, threshold 0.0.

## Abandoned (don't reopen unless asked)
- **Hero scene** (`shinobu_hero_scene_2k.glb`, bottle+tray+glasses+whiskey) — deleted. Translucent
  whiskey + molded glass can't be done in this fake-alpha pipeline (milky / accumulates opaque / plastic
  when baked opaque). Ed chose the single bottle.

## Backlog
- Optional 1K display texture / mesh decimation if mobile still runs warm (test on device first).
- Reduced-motion, keyboard focus. (Narrative copy was removed entirely — no longer a backlog item.)

## Working style (Ed)
One change at a time, test live, eyeball both Chrome + VS Code preview, desktop must stay identical.
Discuss/diagnose before patching when asked. Push before any phone test. Keep a local server running.

## Design intent
Apple-modern restraint. Warm charcoal stage (`#16130f`), warm amber accent (`#e8a05c`), product's own
texture carries the color. AVOID near-black + acid-green. One bold move (coalesce + glow); object is the hero.
