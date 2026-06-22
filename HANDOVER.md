# XRZENO Hero — Handover / Note to self

## What this is
Marketing "thesis" hero for **XRZENO** (WebAR product viz for Indonesian FMCG/F&B). Single
self-contained `index.html` (three.js 0.160 via jsdelivr import map). ~N glowing points scatter,
gather on interaction, and resolve into a real scanned product — currently the **Shinobu** samurai
whisky bottle. A "View in your space" button fires native AR.

Run over http (NOT file://): `python -m http.server 8000` in this folder → `http://127.0.0.1:8000/`.

## Git / hosting
- Repo: **https://github.com/ektjio-code/xr_landing_page** (`origin`/`main`). Author `Ed <ed@localhost>`
  (placeholder email by request). Ignored: `files.zip`, `Backup/`, Claude temp. CRLF warnings harmless.
- Real AR + on-device perf testing need the live URL — enable **GitHub Pages** (Settings→Pages→main/root)
  → `https://ektjio-code.github.io/xr_landing_page/`. Phones can't reach a localhost dev server.

## Assets
- `shinobu.glb` — display hero model (2 glTF meshes → 3 three.js meshes: case `3DModel`, `GlossyCoat`,
  glass `Cylinder`/`BottleGlass`). Materials use clearcoat/specular/ior. **Texture was 4096² → resized
  to 2048²** with gltf-transform (see Perf). Main mesh ~142k tris.
- `museum_of_ethnography_2k.hdr` — old HDRI env. **No longer used** — lighting is now the procedural
  `RoomEnvironment`. File + `RGBELoader` import kept INTENTIONALLY for an easy revert/A-B. Don't delete.
- `shinobu_ar.glb` / `shinobu_ar.usdz` — separate AR-optimized models (NOT the display model). The
  `.usdz` is 20 MB (heavy first load — see Backlog).

## Interaction model
- **Desktop:** scroll-to-form (400vh track drives `curF` 0→1).
- **Mobile (`pointer:coarse`):** NO scroll — single fixed viewport, page zoom disabled. **Pinch** drives
  form (squeeze = gather, spread = disperse); **1-finger drag = rotate**; 2 fingers = pinch. Hint says
  "Pinch to materialize". Narrative copy (c1/c2/c3) hidden on mobile — AR button only. (Mobile copy:
  decide later, currently just dropped.)

## Materials / look (CONFIRMED GOOD — do not re-break)
- **Glass:** three.js physical **transmission renders as a white slab** in this bloom/IBL pipeline —
  DEAD END, abandoned. Glass is faked: **black base color + alpha (opacity 0.12) + envMapIntensity 1.1 +
  depthWrite:false** → clear label with glassy reflection highlights. (White base = milky veil; black
  base = only reflections show. That's the trick.)
- **Environment / lighting:** IBL is the procedural **`RoomEnvironment`** (`pmrem.fromScene(new
  RoomEnvironment(), 0.04)`) — neutral studio, generated synchronously (no async load). Retuned for it:
  `envMapIntensity` **1.3** non-glass / **1.1** glass (were 3.0/2.5 for the dim museum HDR). Studio
  key/fill/rim/amb fade to a **20% floor** as it forms (`lit = 1 - 0.8*formed`) — RoomEnvironment wraps
  evenly so it needs little fill. Background stays warm charcoal `#16130f` (bloom's dark base).
- **Bloom/emission:** for the DOT phase only. `bloom.strength` fades to 0 as formed AND `bloom.enabled`
  flips false once formed (composer skips the passes). Sampler/points: `sampler.sample(tmpP)` position
  arg ONLY (null crashes it).
- Dot→mesh: points fade fully to 0 + `points.visible=false` when formed (zero dots on the final object).
  Non-glass meshes fade opacity 0→1 and **stay transparent throughout** (no opaque flip — see Perf).

## Perf (this session's big fight — all FIXED)
First-formation stutter + mobile heat. Causes & fixes, all landed:
1. **Idle waste:** `setForm()` rewrote + re-uploaded the whole point buffer EVERY frame forever. Now
   gated on `f !== lastFormF` → skips when settled/idle. (Was the mobile-heat-at-rest killer.)
2. **Formation recompile:** rendering formed state DIRECTLY vs through the composer = two shader variants
   (tonemap baked for canvas, not for render-target) → mass recompile on the switch. Fix: **always**
   `composer.render()` (glass is alpha now, composer-safe; no path switch). Direct-render path removed.
3. **Warm-up reveal:** loader waits for the model (env is now synchronous → `envReady` starts true),
   then compiles the formed-state pipeline off-screen via `composer.render()` (renderToScreen=false, both
   bloom states) so first form doesn't compile live. See `warmupReveal()`.
4. **4K texture = 89 MB GPU upload** (decode+mipmap) = the residual stutter. Resized 4096²→2048² (→22 MB)
   with `npx @gltf-transform/cli resize shinobu.glb out.glb --width 2048 --height 2048`. Original 4K is
   in git history.
5. **Mid-form `transparent→opaque` flip** (leftover from the transmission era) popped one frame. Removed —
   non-glass stays transparent the whole way (Firefly did this; it's smooth).
6. **Mobile tier:** `pixelRatio` capped 1.5 (vs 2), `COUNT` 16k (vs 36k desktop).
- DEAD ENDS, don't retry: physical transmission, half-res bloom (blocky/flickery on the tiny dot sprites),
  the composer↔direct render switch.

## AR
- "View in your space" → native AR, no web viewer. iOS: AR Quick Look `shinobu_ar.usdz` (`rel="ar"`).
  Android: Scene Viewer `shinobu_ar.glb`, `mode=ar_only`. Desktop: on-brand toast. Ed owns the AR models.

## Backlog
- **`shinobu_ar.usdz` is 20 MB** (ASCII `.usda` geometry ~11 MB + 8.4 MB 2K PNG). Needs USD tooling to
  regenerate (binary usdc + smaller texture) → ~3–5 MB. No Mac / no USD lib on this Windows box; parked.
- **Mobile depth:** optionally drop display texture to 1024² (→5.6 MB GPU) and/or `gltf-transform simplify`
  the 142k-tri mesh for more iPad headroom.
- Narrative copy on mobile (currently hidden) — design decision pending.
- Per-texel point color (currently uniform warm tint 0.92,0.74,0.52); reduced-motion; keyboard focus.

## Working style (Ed)
One change at a time, test live, eyeball BOTH Chrome + VS Code preview, desktop must stay identical.
Discuss/diagnose before patching when asked. Keep a local server running; re-run on request.
Git note: commits intermittently fail with "couldn't set refs/heads/main" — just retry (clear stale
.git/*.lock first); pushes need sandbox off.

## Design intent
Apple-modern restraint. Warm charcoal stage (`#16130f`), warm amber accent (`#e8a05c`), product's own
texture carries the color. AVOID near-black + acid-green. One bold move (coalesce + glow); the object is
the hero.
