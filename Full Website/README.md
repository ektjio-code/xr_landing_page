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
- **Truth files (repo root):** **`index_v3.html`** = ACTIVE, single responsive (desktop + mobile) · `index_v2.html`
  = desktop fallback · `index.html` = LEGACY mobile (superseded, pending retirement — flip the line-8 redirect) ·
  `strings.js` = EN+ID copy.
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

## Ship polish — kill the "made by AI" tells (audit 2026-07-13)
The repo is **PUBLIC** and this is a **craft studio's** site — obviously-AI prose in the source/copy undercuts
the pitch. The code LOGIC / naming (`pmx`,`curF`,`exitP`) / architecture read hand-built (leave them). The tell
is the **PROSE** — comments + copy. Three to-dos:

1. **Source comments — DONE via build, PENDING deploy-wiring.** `index_v3.html` had **125 em-dashes (—) + 138
   arrows (→)** in comments plus narrator "explain-the-why" verbosity = textbook AI. Fixed by the strip build
   (below): `index_v3.min.html` removes ALL comments. ⚠️ NOT live until the `.min` becomes the served entry —
   pairs with the **retire-`index.html` / line-8-redirect flip** (rename `index_v3.min.html`→`index.html` or
   point the entry at it). Until then, View-Source / the public repo still expose the notes.
2. **Copy dashes — DEFERRED launch copy-sweep (separate job).** Em-dashes in USER-VISIBLE text: `strings.js`
   (~15), the `<title>` **`XRZENO — Scene`** (browser tab — and "Scene" is a leftover; set the real tagline),
   `Shinobu — whisky bottle`, `Asset 2/3 — title`, and the iOS motion toast `iOS remembers this — Settings → …`.
   Replace `—` with commas / periods / rewrites. See [[project-dash-sweep-finalization]].
3. **Copy CADENCE — the subtler tell (do with the sweep).** AI marketing rhythm: the staccato triad
   `Scan. Rebuild. Deliver.`, balanced antithesis lines, rule-of-N lists (`glass, liquid, label print, packaging
   texture`). Loosen the rhythm so it reads human, not generated.

### Build — the strip step (added 2026-07-13)
`index_v3.html` stays the commented working **source** (edit as normal). `npm install` once, then **`npm run
build`** → **`index_v3.min.html`** at the repo root with every HTML/CSS/JS comment removed via REAL parsers
(html-minifier-terser → clean-css + terser). **JS compress + mangle are OFF** — comment-removal only, so the
WebGL/three.js code is behaviourally identical and GLSL shader template-literals / `https` URLs / string literals
are never touched. Output at root so relative asset paths (`strings.js`, `shinobu.glb`, `Tokonama Scene/`, AR)
resolve. `node_modules/` gitignored; commit `index_v3.min.html` + `package.json`/lock. **Verify after build:**
`node --check` each `<script>` in the `.min`; `#version 300 es` / `gl_Position` occurrence counts match the
source (shaders intact); importmap parses as JSON. (2026-07-13 run: 165KB→112KB, comment em-dashes 125→8, the
8 remaining = visible copy = job #2 above.)

---

## Current state

### Session 2026-07-15 — SEO infra, copy sweep, new content sections, section reorder, About drawer, footer
Content-fill + polish pass on `index_v3.html` + `strings.js` (both languages). All committed + pushed.
- **SEO / share infra (in `<head>`):** GA4 `G-DH5EJKW9N7` (shared with the live site), meta description/robots/canonical,
  favicon + apple-touch-icon (`logo_xrzeno.png`), Open Graph + Twitter cards, JSON-LD `LocalBusiness` + `FAQPage`.
  `og:image` points at the live `https://xrzeno.com/assets/images/xrzeno_og_image.png` (swap for a v3-specific one later).
- **Copy AI-tell sweep:** em-dashes/arrows stripped from ALL visible copy (EN+ID); `<title>` = just `XRZENO`; iOS toast +
  Android AR-viewer titles cleaned. Cadence: rewrote `howwework.title`, `about.p1`, `portfolio.body`; left `cta.title`
  ("Show your product, not a picture of it") + `howwework.step1` per Ed. **`process.*` strings are now orphaned + DELETED**
  (only `process.eyebrow` renders) — that killed the dead `Scan. Rebuild. Deliver.` triad + rule-of-4 list.
- **Real social handles** (from the live footer): IG `xrzeno.ar`, TikTok `@xrzeno.ar`, FB `61576647629594`, X `xrzeno`,
  **+ YouTube `@hello.xrzeno`** (6th icon). Threads `@xrzeno` KEPT but UNVERIFIED (not on the live site).
- **New TEXT sections (reused `.steps` pattern, no new CSS/JS, inherit the reveal motion):**
  **"How it works"** now = eyebrow + `howwework.title` + 4 numbered steps (Discuss / Scan / Build / Deliver) in a `#howwework`
  lead block, THEN the tokonoma scene (`#process`, eyebrow removed so it reads as one section). Steps are a SEPARATE section
  before `#process` on purpose — text inside `#process` would eat the scene's scroll runway (`min-height:440vh`,
  `scrollProgress` = `-top/(height-innerHeight)`) and skip its opening beats.
  **"The Payoff"** (`#benefits`, eyebrow "The payoff") = 3 benefit steps (They trade up / No surprises / It spreads),
  ported+generalized from the old site's ROI section, rewritten in the site voice.
- **Section reorder:** Portfolio → How it works (steps + scene) → **The Payoff** → FAQ → Contact. The scene's exit-wipe now
  **reveals The Payoff** in place: the pin was reassigned CSS-only `#faqReveal>#faq` → `#faqReveal>#benefits`; **FAQ is
  unpinned** to normal flow after. (Whole reveal is pure CSS — no JS touches `#faqReveal`.)
- **Drawer nav fixes (post-reorder):** "How it works" → `#howwework`; **"Benefits" special-cased in BOTH `__nav` defs**
  (desktop + mobile) to scroll to the END of the scene runway where the wipe reveals the pinned Payoff (its DOM position is
  pulled up 240vh by the reveal wrapper, so `scrollIntoView` lands mid-scene).
- **About = drawer accordion (Ed's design):** new "About" item after Contact; click EXPANDS an inline `#aboutPanel` (chevron
  flips, drawer stays open). 3 short paragraphs cleaned+generalized from the live `/about`. EN+ID. CSS: `#drawer .d-about`
  max-height transition; JS toggle next to the drawer handlers.
- **Footer build-out:** bare 1-line strip → 4 flex-wrap blocks: brand+tagline · Studio (location + hours) · Contact
  (email + WhatsApp text links) · Privacy + `© 2026 XRZENO`. All text/links, no new buttons/images.
- **Tumble hero:** base letters `INK` → pure white + a **front fill light** so faces read white not grey. **Accent bloom was
  TRIED + REVERTED** — `UnrealBloomPass` thresholds on luminance (can't isolate the low-luminance blue accents) AND broke the
  transparent-canvas background (opaque black). Real fix would be selective/layer bloom (parked). Shadow (#5) was rejected:
  the hero bg is dark navy `#0a1633`, a dark contact shadow can't read on near-black. Leave the tumble alone for now (Ed).
- **Cache gotcha fixed:** `strings.js` is now loaded as **`strings.js?v=2`** — a plain reload re-fetches the HTML but reuses a
  cached `strings.js`, which kept showing stale copy (cost a round-trip debugging a "phantom" em-dash). **Bump the `?v=`
  whenever you edit `strings.js`.** (Verify served content with `curl`, don't trust the browser.)
- ⚠️ **STILL THE KEY DEPLOY BLOCKER:** the **line-8 device redirect still sends phones to `index.html`** (the old legacy
  mobile) unless `?stay`. v3 is the responsive file, but real phones won't see it until that redirect is flipped/removed.
  Retire `index.html` at the same time. Not done this session.

### Session 2026-07-14 — portfolio rebuilt (real assets), desktop hover-3D, drawer + mobile-AR fixes, USDZ compressor fix
**Compare "Real vs Render" (`#cmp`) — DONE, real images.** Ed used **Shinobu** after all: photo `Shinobu studio
shot.jpeg` + `shinobu_edited.jpeg` (a render he HAND-ALIGNED to the photo). Placeholder gradients gone. Web assets
`compare-photo.jpg`/`compare-render.jpg` are built by a Pillow script: detect the dark-bronze body bbox, scale onto a
common 1600×1000 (16:10) canvas, **base pinned** (~5% floor). For the hand-aligned render I applied the PHOTO's exact
transform (not re-detected) so his overlap survives → tight registration.

**Portfolio (`#portfolio`) — fully rebuilt, NO inline 3D viewers (Ed's rule).** `<model-viewer>` + its CDN import
removed. 5 cards:
- **eCommerce Website Demo** + **Restaurant Menu Demo** — full-width `.card.featured` **16:9 photo** cards
  (`XRZENOSHOP.png` / `XRCAFE.png`), button **"Visit Demo"** → external links (`ar-shop.` / `xrmenu.xrzeno.com`),
  plain `<a>` (no `data-glb`). XRCAFE is a wide cream logo → `object-fit:contain` on `#f8f5ef` (blends the letterbox).
- **Labubu / Duke / Pizza** — static product photos (`img.thumb`) + **"View in your space"** AR pill, wired by a
  per-card launcher (`.arb[data-glb]`: iOS Quick Look usdz / Android Scene Viewer glb / desktop toast).
- Featured-card frame unified to wrap image+text+button. **Fake-depth/focus-pull REMOVED** (Labubu was briefly a
  `canvas.fcard` + synthesized `labubu_depth.png`; Ed: "lose it for uniformity" — script + CSS + png deleted).

**DESKTOP hover-3D preview (new, `<script type=module>` after the AR launcher).** Hovering an AR card fades a live
Three.js **turntable** in over the photo — HORIZONTAL only (polar locked), drag-to-spin, RoomEnvironment PBR, ONE
shared WebGL context, GLBs **preloaded on idle**. `matchMedia('(pointer:coarse)')`-gated → desktop only. Per-model
elevation `POLAR_BY`: Pizza gets a raised isometric look-down (flat model). Soft light: `environmentIntensity 0.6`,
exposure 0.9, directional 0.25. Knobs: `SPIN`, `POLAR`, the `ENABLED` set.

**Drawer.** Social icons **centered** (`justify-content:center`). WhatsApp CTA was clipped on mobile because `#drawer`
was `100vh` (counts the area behind the mobile browser UI) → now `100dvh` + `overflow-y:auto`.

**Mobile Shinobu scene — "View In Your Space" AR.** After full materialize (`curF>0.98`), a frosted pill (like the
tokonoma `#ar`) fades in and launches **`shinobu_2k_ar.glb/.usdz`** (iOS Quick Look / Android Scene Viewer); hidden on
exit-wipe / section leave. Inside the coarse-pointer-gated scene script.

**USDZ compressor bug FIXED (`D:\WORK STUFF\Blender Workflow\compress_usdz.py`).** Symptom: Pizza's glossy cheese
rendered **black in AR** on the `*_slim.usdz` only. Cause: a texture **shared by two materials** was converted+deleted
for the first, the second material's ref was then skipped (file gone) → **dangling reference** after flatten → missing
diffuse → black. Fix: convert each physical texture once (dedupe) + rewrite **all** refs via `UsdUtils.ModifyAssetPaths`
BEFORE flatten (flatten KEPT — it's the mesh-compression win; Labubu output byte-identical). `Pizza_slim.usdz`
re-slimmed, verified 0 dangling refs (10.4→4.9 MB). ⚠️ Re-run the `.bat` on any other multi-material USDZ slimmed earlier.

### Desktop v3 — the new front door (`index_v3.html`, ACTIVE, updated 2026-07-11)
Built off a copy of v2. The tokonoma/shinobu cinematic is DROPPED from the initial view (scene still loads +
compiles up front — feeds the load bar) and is now **re-homed as the "How it works" section** (see below).
**2026-07-11 session added:** scan-field background (replaced the squiggle) · Method-A exit wipe + FAQ
reveal-in-place · emissive card frames + drop shadows · **autoplay-scroll on How-it-works**. Labs at repo
root: `bg-lab.html`, `frame-lab.html`, `autoplay-lab.html`.
Flow (native scroll everywhere EXCEPT How-it-works, which CAPTURES the wheel to auto-play — see its section):
1. **White loading hero** — big black `XRZENO` decodes L→R (matrix) and DOUBLES as the real load bar
   (EXR+GLB byte progress → 0–90%, shader compile fills the last 10%, min 1.5s; cobalt cursor on the active
   letter). White-on-black by design → high contrast for the reveal (INVERTS + kills the dark-on-dark the
   Print Pass worried about).
2. **Strips Print Pass** wipe (WebGL2 scrim `#bleed`, variant B, from `xrzeno-bleed-transition-demo-v2.html`):
   the white hero is eaten strip-by-strip THROUGH the wordmark to print the body up. `STRIP_PX 34`,
   `STRIP_WIPE 0.18`, SOD f2/ζ1/r0. Static-hash → scrub-reversible. `#release` runway removed so Real vs
   Render sits right behind the scrim and prints up THROUGH the wipe.
3. **Scan-field background** on `#liquidBg` (2026-07-11, REPLACED the noise→∞ squiggle) — a soft dot-grid under
   the same blurred plane (`blur(5px)`, **DPR-1**, always-on). A slow warm hotspot drifts for ambient life,
   the cursor reveals dots locally, lit dots EMIT (additive `lighter`) cobalt→warm `#ff8a3d`. Light (~1–2ms/
   frame, no per-pixel work — cheaper than the simplex squiggle). Sandbox: `bg-lab.html` (6 bg directions).
4. DOM **body** (cold Monture palette) + glass **drawer** — as v2, but now normal in-flow DOM.
5. **"How it works" scene** (`#process`, see the dedicated section below) — the tokonoma cinematic plays here.
- **The scroll-lock is GONE in v3** (Ed's call). No `enterBodyLock`/`exitBodyLock`, no window wheel listener,
  no `bodyP` fade, no fixed `#siteBody` overlay. The 3D render loop runs ONLY while `#process` is on-screen
  (`sceneActive` via IntersectionObserver — replaced the old `v3Idle`), and self-pauses otherwise.
- **Mobile: PORTED (2026-07-13)** — v3 is now the single responsive file; see the "Mobile v3" section below.

### "How it works" scene (`index_v3.html` `#process`, updated 2026-07-11) — the tokonoma re-homed
The shinobu tokonoma cinematic (from v2) now lives in the **`#process` section** as a Lusion-astronaut-style
embedded scene. `#process` is a tall **440vh runway**; `scrollProgress()` reads its rect, and the whole
sequence is a pure function of that scroll scalar `sp` (reversible). Fixed fullscreen `#gl` (z-4) with the
DOM scrolling behind it.
**AUTOPLAY-SCROLL (2026-07-11, Lusion astronaut model — the last block before `</body>`):** while `#process`
is on-screen a CAPTURED `wheel` listener drives an autoplay — scroll DIRECTION sets forward/rewind, an
autoplay clock drifts that way, and we `scrollTo` a damped target (Lenis-style), so `sp` (and the whole
sequence below) is autoplay-driven, not raw scroll. Scroll up rewinds; stop = keeps drifting; releases at the
top/bottom edges to native scroll (→ Portfolio / → Contact). It drives the SCROLL POSITION (not the scene
directly) so every beat + the exit + the FAQ are UNTOUCHED — they just follow scroll. Listener attaches only
while `#process` is on-screen (limits the compositor fast-path hit); `scroll-behavior` forced to `auto` during
capture (html is `scroll-behavior:smooth`). Values LOCKED `SPEED 0.030 / GAIN 0.0001 / DAMP 0.30`, desktop
only. Sandbox: `autoplay-lab.html`. NOTE: it auto-plays the FULL range incl. the exit+FAQ (Ed approved). Beats:
1. **Embedded window → fullscreen.** The scene sits in a rounded card (`#sceneWindow`) inside a **sticky
   stage** (`#sceneStage`, pins the card at viewport centre). `#gl` is clip-path'd to the card's live rect.
   When scroll reaches the card, it **auto-opens to fullscreen on a TIME tween** (`winExpand`, ~0.7s ease) —
   NOT scroll-scrubbed (scroll only *arms* it; scrubbing was stop-and-go and rejected).
2. **The "sun."** Windowed state = the point cloud at full scatter (`form 0`), scaled compact (`0.10`),
   **dim + warm** (low opacity so the additive stack doesn't clip to white → amber), gently **pulsing**
   (light/scale/bloom breathe — never a frozen frame), **no spin**. `camera.setViewOffset()` parks the sun
   at the *card's* screen position (both axes) so it's framed dead-centre IN the card, not a peephole crop.
   (2026-07-11: the settle-to-centre opacity fade was REMOVED — `#gl` is fully opaque the whole time it's
   on-screen; only the exit fades it. The old fade made the windowed card scroll in faint.)
3. **Play.** Opening spins up + scatters, then materialize (`sp .15–.40`) → journey rail (`.40–.67`), same
   RAIL/beats as v2. **Finale DROPPED** (no XRZENO wordmark, no cold/blue relight — warm throughout,
   `xrReveal=0` forced). Beats fixed: SCAN's decode plateau widened so it actually *lands* (was skipped
   between frames at the fast journey start); DELIVER given a real fade-out band + sized to match Scan/Rebuild.
4. **"View in 3D" pill.** The v2 inspect (`#ar`/`enterInspect`/`exitInspect`, free-orbit ±45°) surfaced as an
   iOS frosted-glass pill, bottom-centre, shown once fullscreen+formed. Toggles `#gl` `pointer-events` on
   enter (else the always-`none` canvas can't receive the orbit drag) — safe, inspect freezes the page.
   Inspect hard-holds fullscreen (`winExpand=1`); `sp` is forced 0 during inspect so guard against collapse.
5. **Exit wipe (Pass 2) — Method A (2026-07-11, REPLACED the CSS mask).** At `sp .67–1.0` a 2nd WebGL2 strips
   scrim (`#bleed2`, z-5 above `#gl`) SAMPLES the live scene each frame (drawn right after `composer.render`,
   via `window.__exitWipe.frame`) and eats it strip-by-strip — same shader family as the load Print Pass
   (ink-edge + SOD glide), own seed `17.31`. `#gl` fades to 0 during the exit so eaten columns reveal the
   site. Sidesteps the `alpha:true` load-hang landmine (separate canvas). Shader knobs: `EX_STRIP_PX 34 /
   EX_WIPE 0.18 / EX_FEATHER 0.012 / EX_TINT 0.22`. ⚠️ Show-toggle MUST be `display:'block'`, not `''` (`''`
   reverts to the CSS `#bleed2{display:none}` and the scrim never composites — cost a debug session).
   **FAQ reveal-in-place (REPLACED `#processResume`).** The "Typical turnaround…" note is DELETED. The FAQ is
   wrapped in `#faqReveal`, which overlaps the scene's last screen (`--faq-overlap 240vh`) and PINS the FAQ
   (sticky, `top:0`) BEHIND the fullscreen scene, so the rising bars uncover it in place (no scroll-slide),
   then it releases into normal scroll (→ Contact). Knobs: `--faq-overlap / --faq-pin` (CSS `:root`). MATH:
   overlap must be big enough that the FAQ is pinned BEFORE the bars start (`sp .67`) — 100vh was too small.

### Card frames — emissive hover-lit borders + shadows (`index_v3.html`, 2026-07-11)
Portfolio cards, the compare photo (`.cmp`), and the windowed scene card get an EMISSIVE glowing border drawn
on `#fx` (canvas, z-5 above `#gl`): a stroked ROUNDED-RECT path whose points MAGNETIZE toward the cursor
(`R 185 / MAXPULL 54`); hovering ignites the whole border cobalt, and the cursor spot heats to warm-white.
REAL bloom (points → offscreen buffer → composited back at growing blur radii, additive → hot cores bleed).
Idle-cheap (only draws when something's lit; off-screen cards skipped). The scene card's rect is fed live via
`window.__sceneFrame` (set by the scene loop; lit by windowed-ness `1-expand`, off during inspect + exit).
Drove `--mx/--my`? no — that was the earlier SPECULAR SHEEN attempt, which this REPLACED (removed). Drop
shadows on `.card` / `.card.featured .fwrap` / `.cmp` so nothing sits flat. Sandbox: `frame-lab.html` (6
frame directions: reticle · tilt · sweep · bevel · sheen · emissive). Featured card keeps its depth focus-pull
INSIDE the glowing frame. Cards 2 & 3 are still `<model-viewer>` placeholders (pending real GLB/USDZ).

### Mobile v3 — the responsive port (`index_v3.html`, 2026-07-13) — v3 IS the mobile experience now
Mobile-only changes are guarded by `IS_COARSE` / `@media (pointer:coarse)` / touch props so desktop can't
regress. **Testing:** phone → `ektjio-code.github.io/xr_landing_page/index_v3.html?stay` (HTTPS is REQUIRED for
DeviceMotion/Orientation — shake + tilt), or `python -m http.server 8000` on a LAN IP + `?stay` for everything
EXCEPT shake/tilt. `?stay` is REQUIRED everywhere — line 8 redirects phones to `index.html` without it.
- **Hero = topple headline.** Touch = cursor (swept toppling); **shake-to-tumble** via DeviceMotion (gravity
  follows tilt). iOS 13+ has NO global Motion setting — it's a per-site `requestPermission()` prompt fired on
  **`touchend`** (pointerdown was unreliable), result toasted (granted / blocked / unavailable) via `#toast`
  directly (desktop `showToast` is inside the `!isMobile` wrap). iOS CACHES a denial → clear Safari website data
  to re-ask. Portrait-only gate (`#rotateGate`); zoom disabled; horizontal contained via **`overflow-x:CLIP` on
  the root** (not body `hidden` — clip contains transformed descendants on iOS AND doesn't break sticky).
- **How-it-works = the Shinobu materialize** (NOT the desktop tokonoma). The OLD `index.html` scene, ported
  verbatim into a mobile-only `#glm` module (dynamic imports, three r0.169, RoomEnvironment IBL, 16k additive
  dots, fake-glass, UnrealBloom). **The desktop `#gl` tokonoma is fully KILLED on mobile** — its whole scene body
  is wrapped in `if(!isMobile){…}` (no renderer/PMREM/RT/composer created); only the intro gate + `window.__nav`
  run. ⚠️ The `#intro` fade-on-scroll listener lived in that wrap — re-added to the mobile branch or scroll freezes.
  Timeline zones on `#process` (440vh, pure **SCROLL-SCRUB**): windowed card 0–.06 · card opens · materialize
  .14–.44 · hold .44–.67 · EXIT wipe .67–1.
  - **card→expand:** scene framed in `#sceneWindow` (mobile 74vw×50vh), clip-path tracks the card rect,
    TIME-tween open (`winExpand`); ember compressed (`points.scale .12`) while windowed.
  - **exit→site:** the shared `#bleed2` scrim samples `#glm` (glCanvas = `glm` on coarse / `gl` on desktop) and
    eats it → FAQ (pinned behind via `#faqReveal`). `window.__exitWipe.frame(exitP)` right after render.
  - **turntable:** horizontal drag spins the bottle (Y only, `userRotY`, `ROT_SENS .008`); vertical stays native
    scroll (axis locked on first decisive move).
  - **"Scroll to continue ↓" cue** (`#glmHint`): on while playing, off the instant the exit starts.
  - **PRE-WARM:** hidden warm frames (scattered+bloom, formed) after the GLB loads fix the first-materialize
    shader-compile/upload stutter.
  - ⚠️ **Autoplay + scroll-reverse was BUILT then SCRAPPED** (Ed: wouldn't reverse, too much hassle). Leave it
    scroll-scrubbed. Don't re-try (also in Dead ends).
- **Tilt-reactive background:** the `#liquidBg` scan-field glow hotspot follows **device tilt**
  (`deviceorientation` beta/gamma) on mobile — no hover on touch, so tilt replaces the cursor reveal. Rides the
  same Motion&Orientation grant the shake requests.
- **PERF LESSON (big):** the mobile jank was NEVER the scene (the old index runs a near-identical scene
  smoothly). It was `#liquidBg`'s `filter:blur(5px)` on a FIXED fullscreen canvas — the compositor re-blurs it
  every scroll frame across the whole page. Fix: `@media(coarse){#liquidBg{filter:none}}` + pause its repaint
  while `#glm` occludes it (`window.__pauseLiquid`). The scene is kept rendering EXACTLY like the smooth old
  index (composer always on, `antialias:true`) — the composer-bypass/antialias micro-opts were reverted. Emissive
  card frames (`#fx`) and the autoplay-scroll wheel-capture stay desktop-only.

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
- ✅ Done 2026-07-10: squiggle bg, white loading hero, **Print Pass strips-wipe**, scroll-lock removed; the
  **"How it works" 3D scene** (tokonoma re-homed into `#process`).
- ✅ Done 2026-07-11: **scan-field bg** (replaced squiggle) · **Method-A exit wipe** + **FAQ reveal-in-place**
  (replaced the CSS-mask exit + `#processResume`) · **emissive card frames + shadows** (replaced a sheen
  attempt) · scene card always-opaque · DELIVER load-flash fixed · **autoplay-scroll on How-it-works**.
1. ✅ **Ported v3 to MOBILE (2026-07-13)** — full responsive port; see "Mobile v3" above (Shinobu How-it-works,
   turntable, tilt bg, shake, jank/overflow fixes). REMAINING: flip the line-8 device redirect → retire
   `index.html`; featured-card `.fcard` depth-canvas → plain `<img>` on mobile (Ed OK'd, not built).
- ✅ Done 2026-07-14: **compare real images** (Shinobu photo + hand-aligned render) · **portfolio fully rebuilt**
  (2 web-demo cards + 3 product cards, no inline 3D) · **desktop hover-3D turntable** on the AR cards · **drawer**
  centered-icons + WhatsApp `100dvh` fix · **mobile Shinobu "View In Your Space" AR** · **USDZ compressor bug fixed**
  (Pizza black-cheese) + `Pizza_slim.usdz` re-slimmed.
2. **Real assets — DONE** except **real social handles** for the 5 drawer icons (`instagram.com/xrzeno` etc. are
   still placeholders).
3. **▶ TOMORROW (2026-07-14 EOD hand-off): COPYWRITING** — the launch copy dash-sweep + real copy. Strip AI-dash
   tells from `strings.js` (EN+ID) + body copy; set the real `<title>` (currently `XRZENO — Scene`, "Scene" is a
   leftover); fix the portfolio/compare/toast copy. See [[project-dash-sweep-finalization]].
- **Parked (Ed, revisit):** the scene-card opacity "still out of place" per Ed — he made it opaque but wasn't
  100% happy; nail down exactly what's off when he flags it. Also floated but not built: warping the *photo*
  inside a frame WITH the magnet (SVG `feDisplacementMap` for flat photos / vertex warp on the WebGL focus-pull
  card) — Ed said "forget it" for now.
- **v3 polish open (Ed-eyeball):** autoplay feel across trackpad vs wheel; whether the autoplay should cap at
  the journey end instead of auto-running the exit+FAQ; emissive frame brightness/magnet on the real cards;
  compare/scene emissive glow (Ed: "not there yet" earlier, then the frames landed — recheck); intro→scrim
  wordmark alignment.

## Load-bearing gotchas
- **Reversibility rule (whole site):** drive camera/timeline/reveal from a scroll-**POSITION** scalar, read
  fresh each frame, set state DIRECTLY. NEVER a per-frame `.lerp` follow or integrated velocity (lags
  asymmetrically → breaks reverse-scroll). This is why the wheel-driven auto-scroll was reverted, and why
  the rail reads a damped scalar (`curJ += (journeyP-curJ)*0.1`) then sets the pose directly.
- **Scroll-lock:** the OLD v2/mobile canvas-release scroll-lock is v2/mobile ONLY — don't port THAT into v3.
  BUT v3 now has a NEW, scoped scroll-capture for How-it-works only (see below). (v2/mobile: `RAMP =
  innerHeight*0.9` must match the `bodyP` denominator AND `#release`.)
- **How-it-works autoplay-scroll (2026-07-11):** the LAST script before `</body>` adds a non-passive `wheel`
  listener that CAPTURES the wheel and drives `window.scrollTo` while `#process` is on-screen (autoplay). This
  intentionally reverses the old "no window wheel handlers" rule — but scoped: the listener is attached only
  while `#process` intersects, and removed otherwise, to limit the compositor fast-path hit. It forces
  `html.style.scrollBehavior='auto'` during capture (html is `scroll-behavior:smooth`, which would double-smooth
  the per-frame drive). It drives the SCROLL POSITION, so the scene/exit/FAQ are unaffected. Only `wheel` is
  captured (keyboard/scrollbar fall through to native). Locked values `SPEED .030 / GAIN .0001 / DAMP .30`.
- **v3 scroll traps (cost real time):** OrbitControls on a `pointer-events` canvas eats the wheel — keep
  idle/hidden canvases `pointer-events:none`. (The general "no window wheel handlers" rule now has the one
  scoped exception above.)
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
a flavor-text scrim (text-shadow won) · the raster JPEG logo ("tacky") · SCAN wireframe state ("too jarring") ·
**mobile How-it-works autoplay + scroll-reverse** (built 2026-07-13, wouldn't reverse cleanly → Ed scrapped it,
leave the mobile scene scroll-scrubbed) · **JS smooth-scroll on mobile touch** (Lenis-style — fights native
momentum, feels laggier; the "jumpy" was really the `#liquidBg` blur compositing, now fixed).
