# XRZENO Website — README / single source of truth

Marketing site for **XRZENO**, a WebAR product-visualization studio (menu/restaurant AR is one service
line, not the identity). Site language **English**. Goal: the site itself must demonstrate the capability —
a visitor should think "these guys can do this." This README is the ONLY handover/instructions doc (merged
from the old `handover.md` + root `HANDOVER.md`; renamed `CLAUDE.md`→`README.md` 2026-07-10). Read it first
each session.

---

## Who / preferences (honor these)
- **The user goes by "Ed."** Address him as Ed.
- **Site ships in ENGLISH.** An Indonesian translation exists in `strings.js` but is machine-drafted
  (native review before launch; not the default).
- **Commits:** author **`Ed <ed@localhost>`** (keep his real email out of git) + the
  `Co-Authored-By: Claude Opus 4.8 (1M context)` trailer. Commit to **`main`** (project convention — don't
  branch). **Never commit** `.claude/`, the `xrzeno-concept` package/zip, or screenshots.
- **Hosting / deploy / DNS is OUT OF SCOPE** — Ed's web admins own Cloudflare Pages / cutover / bilingual
  serving. Deliverable stops at working static files. Don't propose or set up deployment.
- **Working style:** one change at a time, test live — Ed eyeballs everything and can't see my screen
  (batch only when he asks). When a behavior can't be eyeballed, **instrument it** (on-screen HUD) rather
  than guess. Discuss/diagnose before patching when asked.
- **Watch the AI em-dash tell** in site copy and my own prose. The copy dash-sweep is deferred to launch.
- **Push after any MOBILE change** — Ed tests mobile on the GitHub Pages URL, not localhost.
- **Contact:** WhatsApp **+62 823-4273-6941** → `wa.me/6282342736941`; email `hello@xrzeno.com`.

## Files & git
- Repo: **github.com/ektjio-code/xr_landing_page** (`origin`/`main`). Pages (real AR + phone testing):
  `ektjio-code.github.io/xr_landing_page/` — phones can't reach localhost, so **push before phone testing.**
- **Truth files (repo root):** **`index_v3.html`** = ACTIVE desktop · `index_v2.html` = desktop fallback ·
  `index.html` = mobile · `strings.js` = EN+ID copy.
- Helpers at root (committed): `squiggle-scroll.html` / `squiggle-demo.html` (squiggle prototypes) +
  `xrzeno-bleed-transition-demo-v2.html` (Print Pass reference). `Backup/` is gitignored (local snapshots).
- `.git` writes intermittently fail (OneDrive/AV lock) — e.g. `update_ref failed for refs/remotes/...`, or
  `couldn't set refs/heads/main`. **Pushes still land** — verify with `git ls-remote origin -h
  refs/heads/main`; clear stale `.git/*.lock` and retry if a write errors.

## How to run / test
- Serve repo root: `python -m http.server 8000 --bind 127.0.0.1` → `http://127.0.0.1:8000/index_v3.html?stay`
  (`?stay` overrides the device redirect). `index_v2.html?stay` for the old cinematic. `&lang=id` or the
  drawer toggle for Indonesian.
- After a JS edit, extract each `<script>` and `node --check` it (v3 = 1 module + several classic scripts:
  strips scrim, squiggle bg, body-motion, focus-cards). If patches don't show, suspect **browser cache /
  stacked servers.**

---

## Current state

### Desktop v3 — the new front door (`index_v3.html`, ACTIVE, updated 2026-07-10 EOD)
Built off a copy of v2. The tokonoma/shinobu cinematic is DROPPED from the initial view (scene still loads +
compiles up front — feeds the load bar) and is now **re-homed as the "How it works" section** (see below).
Flow, all **native scroll**:
1. **White loading hero** — big black `XRZENO` decodes L→R (matrix) and DOUBLES as the real load bar
   (EXR+GLB byte progress → 0–90%, shader compile fills the last 10%, min 1.5s; cobalt cursor on the active
   letter). White-on-black by design → high contrast for the reveal (INVERTS + kills the dark-on-dark the
   Print Pass worried about).
2. **Strips Print Pass** wipe (WebGL2 scrim `#bleed`, variant B, from `xrzeno-bleed-transition-demo-v2.html`):
   the white hero is eaten strip-by-strip THROUGH the wordmark to print the body up. `STRIP_PX 34`,
   `STRIP_WIPE 0.18`, SOD f2/ζ1/r0. Static-hash → scrub-reversible. `#release` runway removed so Real vs
   Render sits right behind the scrim and prints up THROUGH the wipe.
3. **Squiggle background** on `#liquidBg` — a noise→infinity loopy line (cobalt→warm `#1e40ff→#ff8a3d`,
   HIGH mouse-pull, `blur(5px)`, **DPR-1**), scroll-driven top (messy tangle) → footer (steady emissive,
   CLOSED ∞). Replaces the old metaball field. Figure-eight spine blended by structure; tip-taper +
   closePath seals the ∞. Prototypes: `squiggle-scroll.html` (recipe) / `squiggle-demo.html` (sandbox).
4. DOM **body** (cold Monture palette) + glass **drawer** — as v2, but now normal in-flow DOM.
5. **"How it works" scene** (`#process`, see the dedicated section below) — the tokonoma cinematic plays here.
- **The scroll-lock is GONE in v3** (Ed's call). No `enterBodyLock`/`exitBodyLock`, no window wheel listener,
  no `bodyP` fade, no fixed `#siteBody` overlay. The 3D render loop runs ONLY while `#process` is on-screen
  (`sceneActive` via IntersectionObserver — replaced the old `v3Idle`), and self-pauses otherwise.
- ⚠️ **Mobile NOT ported** — v3 is desktop-only so far.

### "How it works" scene (`index_v3.html` `#process`, built 2026-07-10 EOD) — the tokonoma re-homed
The shinobu tokonoma cinematic (from v2) now lives in the **`#process` section** as a Lusion-astronaut-style
embedded scene. `#process` is a tall **440vh runway**; `scrollProgress()` reads its rect, and the whole
sequence is a pure function of that scroll scalar `sp` (reversible). Fixed fullscreen `#gl` (z-4) with the
DOM scrolling behind it. Beats:
1. **Embedded window → fullscreen.** The scene sits in a rounded card (`#sceneWindow`) inside a **sticky
   stage** (`#sceneStage`, pins the card at viewport centre). `#gl` is clip-path'd to the card's live rect.
   When scroll reaches the card, it **auto-opens to fullscreen on a TIME tween** (`winExpand`, ~0.7s ease) —
   NOT scroll-scrubbed (scroll only *arms* it; scrubbing was stop-and-go and rejected).
2. **The "sun."** Windowed state = the point cloud at full scatter (`form 0`), scaled compact (`0.10`),
   **dim + warm** (low opacity so the additive stack doesn't clip to white → amber), gently **pulsing**
   (light/scale/bloom breathe — never a frozen frame), **no spin**. `camera.setViewOffset()` parks the sun
   at the *card's* screen position (both axes) so it's framed dead-centre IN the card, not a peephole crop.
   Fades in as the card settles toward centre (kills a "black card then POP" on entry).
3. **Play.** Opening spins up + scatters, then materialize (`sp .15–.40`) → journey rail (`.40–.67`), same
   RAIL/beats as v2. **Finale DROPPED** (no XRZENO wordmark, no cold/blue relight — warm throughout,
   `xrReveal=0` forced). Beats fixed: SCAN's decode plateau widened so it actually *lands* (was skipped
   between frames at the fast journey start); DELIVER given a real fade-out band + sized to match Scan/Rebuild.
4. **"View in 3D" pill.** The v2 inspect (`#ar`/`enterInspect`/`exitInspect`, free-orbit ±45°) surfaced as an
   iOS frosted-glass pill, bottom-centre, shown once fullscreen+formed. Toggles `#gl` `pointer-events` on
   enter (else the always-`none` canvas can't receive the orbit drag) — safe, inspect freezes the page.
   Inspect hard-holds fullscreen (`winExpand=1`); `sp` is forced 0 during inspect so guard against collapse.
5. **Exit wipe (Pass 2).** At `sp .67–1.0` (the long exit runway, ~a full viewport of scroll), soft **bars
   RISE UP** the scene and the next section (`#processResume` "Typical turnaround…", then the site) scrolls
   up normally behind. STRIP ONLY — no white curtain, no scene-fade, no pinning. Implemented as a **CSS mask**
   on `#gl` (per-column `linear-gradient` layers, soft feathered front, own hash seed `17.31` ≠ the top's).
   Knobs: `EX_START 0.67`, `EX_STRIP 24px`, `EX_WIPE 0.16`, `EX_FEATHER 3.0`.

### v2 + mobile (prior, still valid — scroll-lock still LIVES here)
- `index_v2.html` (three r0.169): hero cinematic (materialize → journey rail → clay→final PBR → pinned
  beats SCAN/REBUILD/DELIVER → cold-night finale relight → XRZENO wordmark) → scroll-lock canvas-release
  handoff → cold-palette DOM body + drawer. 5 rail camera stops live in `RAIL[]`; body "Lusion motion pass"
  (word-fly h2, matrix-decode eyebrows, reversible reveals, magnetic buttons, springy parallax). `.lede` +
  `.note` are the only STATIC text; everything else animates.
- `index.html` (mobile, three r0.160): pinch-to-materialize → **TAP** anywhere to enter the site (scroll
  fought the 1-finger orbit, so entry is a tap, NOT scroll). Bottle-only, no room/DOF/heavy bloom. Body +
  drawer ported 1:1. Beats/finale during materialize were SCRATCHED (small screen, too busy).

## NEXT
- ✅ Done 2026-07-10: squiggle bg, white loading hero, **Print Pass strips-wipe**, scroll-lock removed. The
  old "hero scroll rework via Lusion astronaut" is **moot** — v3 replaced that whole hero.
- ✅ Done 2026-07-10 EOD: **"How it works" 3D scene** — tokonoma re-homed into `#process` (embedded window →
  auto-open → pulsing sun → play → View-in-3D pill → soft strips exit wipe). See the dedicated section above.
1. **Port v3 to MOBILE** (`index.html` still on the old tap model). Apply the "does this port cheaply?" check.
   The whole How-it-works scene is desktop-only so far.
2. **Real assets (Ed inputs):** portfolio GLB/USDZ for cards 2 & 3 (card 1 = bottle); the real photo+render
   pair for the compare slider (SAME angle/framing or the trick dies — currently placeholder gradients);
   real social handles for the 5 drawer icons (`instagram.com/xrzeno` etc. are placeholders).
3. **Copy dash-sweep at finalization** — strip AI-dash tells from `strings.js` (EN+ID) + body copy.
- **How-it-works polish open (all Ed-eyeball tuning):** exit-strip pace/width/feather feel; whether the
  CSS-mask exit is smooth enough (many per-column layers/frame — widen columns or throttle if janky);
  the sun size/pulse; the resume ("Typical turnaround…") reveal position/timing during the wipe; whether
  to add the soft ink-EDGE the top wipe has (would need the render-pipeline alpha approach — see gotcha).
- **v3 polish open:** intro→scrim wordmark alignment at the handoff; strip/wipe/edge-tint feel.

## Load-bearing gotchas
- **Reversibility rule (whole site):** drive camera/timeline/reveal from a scroll-**POSITION** scalar, read
  fresh each frame, set state DIRECTLY. NEVER a per-frame `.lerp` follow or integrated velocity (lags
  asymmetrically → breaks reverse-scroll). This is why the wheel-driven auto-scroll was reverted, and why
  the rail reads a damped scalar (`curJ += (journeyP-curJ)*0.1`) then sets the pose directly.
- **Scroll-lock is v2/mobile ONLY — v3 REMOVED it.** Don't port it into v3. (v2/mobile: `RAMP =
  innerHeight*0.9` must match the `bodyP` denominator AND `#release`.)
- **v3 scroll traps (cost real time):** a non-passive `wheel` listener on `window` disables Chrome's fast
  compositor scroll page-wide (stalls until a mouse-move flushes it); OrbitControls on a `pointer-events`
  canvas eats the wheel. Keep idle/hidden canvases `pointer-events:none`; no window wheel handlers.
- **Reveal-on-scroll:** viewport IntersectionObserver root (not `#siteBody`). v3: observers attach
  immediately (body always on-screen) + **hysteresis** (show ≥12%, hide only when fully out) or the reveal
  `translateY` re-trips a single threshold → edge jitter.
- A running CSS `animation` overrides inline `style.opacity` — hide pulsing elements with a class that sets
  `animation:none`.
- `--warm` is `#siteBody`-scoped; the drawer hardcodes `#ff8a3d` — keep in sync when tuning the orange.
- Portfolio model-viewer AR button suppressed; "View in your space" calls `.activateAR()` on its card.
- The tray reflection-probe was removed but `rebakeProbe()`/`window._trayProbe` plumbing remains — don't
  clean it up without asking.
- **How-it-works window/exit gotchas (2026-07-10 EOD):**
  - **`sp` is forced 0 during inspect** (`const sp = (!isMobile && !inspectMode) ? scrollProgress() : 0`).
    Anything sp-driven collapses in the 3D view unless guarded — that's why `winExpand` is hard-held to 1
    while `inspectMode`, and why the "View in 3D" pill hides on `sp≥EX_START`.
  - **Card→fullscreen open is a TIME tween, not scroll-scrubbed.** Scroll only sets the target (`sp>0.05`);
    `winExpand` eases on the dt clock. Scroll-scrubbing the open was stop-and-go and Ed rejected it.
  - **`setViewOffset` centres the sun in the CARD** (not the viewport) so it rides inside the card as it
    scrolls in. Cleared (`clearViewOffset`) once `expand≈1`. Without it the sun sits at screen-centre and
    the card "finds" it only at the halfway point.
  - **`alpha:true` on the renderer BROKE loading** — it runs inside the async loader (`warmFrame`→
    `composer.render`) and wedged the intro on a white screen. The exit strips are therefore a **CSS mask on
    `#gl`**, NOT a composer alpha pass. If you ever want the top's soft *ink edge* on the exit, that needs the
    render-pipeline alpha route — reintroduce it CAREFULLY behind the load, or it hangs on white again.
  - **Two Claude chats writing `index_v3.html` at once WILL clobber/interleave.** Happened 2026-07-10 (a
    resumed stale chat). Keep ONE session on the file; if edits seem to vanish/appear, suspect a second chat.

## Design intent
Premium product-viz studio. Cold Monture palette in the body (`--accent` cobalt `#1e40ff` for structure;
warm `#ff8a3d` reserved for the ONE highlighted action — WhatsApp CTAs + the compare line). Frosted-glass
non-highlighted buttons. Montserrat display. One bold move at a time; the object/idea is the hero.

---

## Deep-technical reference — the 3D bottle & scene (relevant when the bottle returns in How-it-works)

**⚠️ THE BOTTLE LEAN IS LOAD-BEARING — cost a full day.** `wrap.rotation.x = -Math.PI/2*0.15` (~13.5°) is
what makes the glass read as glass on the FRONT. A clear cylinder head-on/upright reflects only the dark
void behind the camera → front looks flat/dead (physics, not a bug). If the front ever looks flat, **check
the lean FIRST** before chasing lights/HDRI/normals (all red herrings last time).

**Glass = FAKE-ALPHA recipe (the CORRECT tool for a solid cylinder, not a compromise):** black base +
opacity **0.12** + roughness **0.04** + envMapIntensity **1.1** + FrontSide + `depthWrite:false`, with its
OWN HDRI envMap so it reads glassy despite env=0. **NO softboxes / clearcoat / DoubleSide / point-lights /
layers** (all tried, all worse).

**Real transmission — VERDICT: do NOT retry on the bottle.** The bottle glass is a SOLID cylinder; real
`MeshPhysicalMaterial` transmission treats a solid as a glass ROD/LENS → heavy distortion + grazing mirror
rim + bright env = opaque white. It only works on HOLLOW thin-walled geometry. Translucent liquid-in-glass
is also impossible in three's screen-space transmission (can't refract a second transmissive mesh; fresnel
fake looks plastic → bake in Blender / path-trace only). Would need re-modelling hollow to reconsider.

**compileAsync warm-up (THE first-form-stutter fix):** `renderer.compile()`+render does NOT block with
`KHR_parallel_shader_compile` — the link finalizes on first real use → hitch. Fix = `await
renderer.compileAsync(scene,camera)` in the warm-up, covering the formed + dust states.

**Bloom must be a native composer pass** (`composite → bloom → OutputPass`) — manual `bloom.render()` never
composites the glow. Dust: bloom 0.85/0.45/0.2, `strength=0.85·(1−formed)`, `enabled=formed<1`.

**AR assets (2K, compressed, built with usd-core + Pillow):** iOS `shinobu_2k_ar.usdz` (4.4MB, Quick Look,
Safari-only), Android `shinobu_2k_ar.glb` (5.1MB, Scene Viewer), desktop = toast. 4K source originals in git
history at `8e1f42e^` if a rebuild is needed.

**Tokonoma scene (v2 lineage, `Tokonama Scene/` — note `%20` in URLs):** `shinobu_tokonoma.glb` + 2K EXR
HDRI. Baked lights (shoji SpotLight lattice + museum down-spot, env intensity 0). Mask-blur DOF (bottle
sharp via silhouette mask). Ambient dust motes (~300 additive, beam-flare off the shoji shaft) = the "static
scene" fix — a fixed diorama + locked camera has no perpetual motion, so the dust supplies it. `dustPivot`
spirals-in and unwinds to a clean lock by 70%.

**Tuning knobs:** point size `0.011`; bloom `(0.85,0.45,0.2)`; glass `opacity 0.12 / rough 0.04 / env 1.1`;
exposure 0.95; the lean `-Math.PI/2*0.15` (leave it). Debug hotkeys in v2/v3 module: **C** log camera JSON,
D toggle DOF, R reset cam, `[` `]` exposure, E cycle env, B toggle HDRI bg.

**Dead ends — do NOT reopen:** real transmission on the solid bottle · half-res bloom (flickery) ·
composer↔direct render switch (stutter) · reflection probe on the lacquer tray (washed it pale) · the
softbox/clearcoat/point-light/normal-flip glass chase · the wheel-driven auto-scroll (velocity backlog) ·
a flavor-text scrim (text-shadow won) · the raster JPEG logo ("tacky") · SCAN wireframe state ("too jarring").
