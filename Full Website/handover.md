# XRZENO — Session handover (current: 2026-07-08, end of day 3)

Read this first, then `CLAUDE.md` (same folder) for deep per-step history + levers. The repo-root
`HANDOVER.md` is a separate, older **deep-technical** note (bottle lean, transmission verdict, glass
recipe, AR asset build) — still valid reference, don't overwrite it.

## Who / preferences (honor these)
- **Site language: ENGLISH.** The site ships in English. (An Indonesian translation exists in
  `strings.js`, but it's machine-drafted — native review before launch; it is not the default.)
- **The user goes by "Ed."** Address him as Ed.
- **Commits:** author **`ed@localhost`** (keep his real email out of git). **Never commit**
  `.claude/settings.json`, the `xrzeno-concept` package/zip, or screenshots.
- **Hosting / deploy / DNS is OUT OF SCOPE** — Ed's web admins own Cloudflare Pages / cutover / bilingual
  serving. My deliverable stops at working static files. Don't propose or set up deployment.
- **Working style:** one change at a time, test live — Ed eyeballs everything and can't see my screen
  (batch only when he asks for speed). When I *can't* eyeball a behavior, **instrument it** (an on-screen
  HUD / readout) rather than guess — blind iteration on the auto-scroll burned many cycles before a HUD
  found the actual bug.
- **Watch the AI em-dash tell** in site copy and my own prose. The copy dash-sweep is deferred to
  finalization.
- **Push after every MOBILE change** — Ed tests mobile on the GitHub Pages URL, not localhost.

## Where it stands (committed + pushed `1e28664`)
**Desktop is now `index_v3.html`** — a new front door (2026-07-10). `index_v2.html` (the tokonoma cinematic)
is kept UNTOUCHED as the fallback/reference. Mobile `index.html` (r0.160) unchanged — **not touched this
session** (Ed's instruction: desktop-only).

### Desktop v3 — the new front door (`index_v3.html`, 2026-07-10)
Built off a copy of v2. The tokonoma/shinobu cinematic is DROPPED from the initial view (the scene still
loads + compiles, HIDDEN, to feed the load bar and preload for a future "How it works"). The flow:
- **White loading hero** — big black `XRZENO` decodes L→R (matrix style) and DOUBLES as the real load bar
  (EXR+GLB byte progress → 0–90%, shader compile fills the last 10%, min 1.5s; cobalt cursor on the active
  letter). White-on-black by design → high contrast for the reveal (this INVERTS + kills the dark-on-dark
  the Print Pass spec worried about).
- **Squiggle background** = the persistent site bg: a noise→infinity loopy line (cobalt→warm, high
  mouse-pull, `blur(5px)`, DPR-1) on `#liquidBg`, scroll-driven top (messy tangle) → footer (steady
  emissive ∞). Replaces the old metaball field. Prototyped in `squiggle-scroll.html` / `squiggle-demo.html`.
- **Strips Print Pass** hero→body transition (variant B) — WebGL2 scrim `#bleed`; the white hero is eaten
  strip-by-strip (through the wordmark) to print the body up through it. Static-hash → scrub-reversible.
  Lifted from `xrzeno-bleed-transition-demo-v2.html` (now in-repo). Body content sits directly behind the
  scrim (no runway spacer) so Real vs Render prints up THROUGH the wipe.
- **NATIVE scroll — the entire scroll-lock is GONE in v3.** No `enterBodyLock`/`exitBodyLock`, no fixed
  `#siteBody` overlay, no `bodyP` fade: `#siteBody` is normal in-flow DOM; the page scrolls like any site.
  The hidden 3D render loop is STOPPED after load (`v3Idle`) → main thread free → smooth scroll. (This was
  the fix for the scroll-up stall: a non-passive `window` wheel listener + OrbitControls wheel capture were
  gating Chrome's compositor scroll — only a mouse-move flushed it.)
- Reveal-on-scroll observers attach immediately + **hysteresis** (show ≥12%, hide only when fully out) → no
  edge jitter. Image surfaces (compare slider, cards, portfolio viewers) got rounded corners.

### v2 + mobile (prior state, still valid — scroll-lock still LIVES here)
- Hero cinematic (materialize → journey rail → clay→final PBR → pinned beats → cold-night finale relight
  → XRZENO wordmark) → scroll-lock handoff → cold Monture-palette DOM **body** + glass **drawer**.
- **Body "Lusion motion pass" (this session):** liquid metaball backdrop, word-fly section headers (`h2`),
  matrix-decode subheaders (`.eyebrow`), reversible reveal-on-scroll on photos / cards / steps / FAQ /
  buttons / footer, magnetic buttons, springy mouse parallax on the rail.
- **Body TEXT blurbs (`.lede`, `.note`) are STATIC** by Ed's call — every *other* element animates.
- ❌ **Auto-scroll was tried and REVERTED.** A wheel-driven momentum auto-scroll for the hero didn't work
  and was dropped — back to native scroll driving the cinematic. Why it failed: the camera reads a heavily
  damped follower (`curJ += (journeyP-curJ)*0.1`), so a velocity driver built a backlog that discharged
  *after* release → felt inverted. Snapshot preserved at the session scratchpad
  `index_v2.AUTOSCROLL-EXPERIMENT-backup.html`.

## Git / files
- HEAD **`1e28664`** (ed@localhost), **pushed** to origin/main. Push when Ed asks.
- Truth files: repo-root **`index_v3.html`** (desktop, ACTIVE) + `index_v2.html` (desktop fallback) +
  `index.html` (mobile) + `strings.js` (EN+ID). v3 lives ONLY at repo root (no Full Website mirror).
- Disposable-but-committed helpers at repo root: `squiggle-scroll.html` / `squiggle-demo.html` (squiggle
  prototypes) + `xrzeno-bleed-transition-demo-v2.html` (Print Pass reference). `Backup/` is gitignored
  (local snapshots only; a copy of `index_v3.html` lives there).
- `.git` writes intermittently fail (OneDrive/AV lock) — e.g. `update_ref failed for refs/remotes/...`.
  Pushes still land — verify with `git ls-remote origin -h refs/heads/main` if a ref-write errors.

## How to run / test
- Desktop: serve repo root (`python -m http.server 8000 --bind 127.0.0.1`) →
  `http://127.0.0.1:8000/index_v3.html?stay` (v3 = active). `index_v2.html?stay` for the old cinematic.
  If patches don't show, suspect **browser cache / stacked servers**.
- Mobile: Ed tests on device off GitHub Pages — **push first**.
- `&lang=id` or the drawer toggle for Indonesian. After a module JS edit: extract the
  `<script type="module">` block and `node --check` it (v3 has 3 more classic scripts to check too:
  strips scrim, squiggle bg, body-motion).

## NEXT — what we're supposed to do
- ✅ **DONE (2026-07-10): the Print Pass strips-wipe is built** — integrated into v3, variant B, from the
  reference demo. And the old "hero scroll rework via Lusion astronaut" item is **moot** — v3 replaced the
  scroll-driven cinematic hero entirely (white loading hero + strips reveal + native scroll).
1. **Port v3 to MOBILE** — v3 is desktop-only. Mobile `index.html` still has the old tap-into-body model.
   Decide how the white hero / squiggle / strips port cheaply (the "does this port cheaply?" check).
2. **"How it works" 3D** — v3 hides the tokonoma scene but keeps it compiled. Bring the bottle back HERE
   (Ed's plan: shinobu demoted from hero to a How-it-works section). Will need the v3 render loop re-enabled
   for that section only (`v3Idle`).
3. **Real assets (Ed inputs):**
   - Portfolio GLB/USDZ for **cards 2 & 3** (card 1 uses the bottle). Update `src`/`ios-src` + titles.
   - Compare slider: the real **photo + render pair** — MUST be the same angle/framing or the compare
     trick dies (currently placeholder gradients `.ph-real` / `.ph-render`).
   - Real **social handles** for the 5 drawer icons (currently `instagram.com/xrzeno` etc. placeholders).
4. **Copy dash-sweep at finalization:** strip AI-dash tells from `strings.js` (EN+ID) + body copy; ID is
   machine-drafted (native review before launch).
- **Polish still open on v3:** intro→scrim wordmark alignment at the handoff; strip width / wipe / edge-tint
  feel; whether the compare/first section should sit STATIC behind the wipe (sticky pin) vs printing up
  through it (current).

## Parked / later (not blocking)
Compare-slider one-time "nudge" hint · three.js version convergence (0.160 mobile vs 0.169 desktop) · the
"dock" idea (finale XRZENO shrinks + travels into the drawer control). (Desktop keyboard-scroll parity is
now MOOT on v3 — native scroll restores space/PageDown/arrows.)

## Load-bearing gotchas
- **Reversibility:** the rail / relight / parallax read damped **scalars** and set state **directly** —
  never a per-frame `camera.position.lerp` follow (lags asymmetrically → breaks reverse-scroll). This is
  also why the velocity auto-scroll failed.
- A running CSS `animation` overrides inline `style.opacity` — hide pulsing elements with a class that
  sets `animation:none`.
- **Scroll-lock is v2/mobile ONLY — v3 REMOVED it.** In v2/mobile: `RAMP = innerHeight*0.9` must stay
  matched to the `bodyP` denominator AND the `#release` height. In **v3** none of that exists (native
  scroll, in-flow `#siteBody`, `#release` display:none, 3D loop stopped via `v3Idle`). Don't port the
  scroll-lock into v3.
- **v3 scroll gotchas (hard-won):** a non-passive `wheel` listener on `window` disables Chrome's fast
  compositor scroll for the whole page (stalls until a mouse-move); and OrbitControls on a `pointer-events`
  canvas eats the wheel. Keep hidden/idle canvases `pointer-events:none` and don't add window wheel handlers.
- Reveal-on-scroll uses a **viewport** IntersectionObserver root, not `#siteBody`. **v3:** observers attach
  immediately (body is always on-screen now) + **hysteresis** (show ≥12%, hide only when fully out) to stop
  edge jitter — the reveal `translateY` was re-tripping a single threshold.
- `--warm` is `#siteBody`-scoped; the drawer hardcodes `#ff8a3d` — keep in sync when tuning the orange.
- Mobile entry is a **TAP**, not scroll (scroll fought the camera orbit) — don't reintroduce mobile
  scroll-into-body.
- **Contact:** WhatsApp **+62 823-4273-6941** → `wa.me/6282342736941`; email `hello@xrzeno.com`.
