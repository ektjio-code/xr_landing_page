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

## Where it stands (committed `73eed99`, NOT pushed)
Desktop `index_v2.html` (three r0.169) + mobile `index.html` (r0.160) — both **feature-complete pending
real assets**:
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
- HEAD **`73eed99`** (ed@localhost), **not pushed** (origin/main at `0bdf587`). Push when Ed asks.
- Truth files: repo-root `index_v2.html` (desktop) + `index.html` (mobile) + `strings.js` (EN+ID).
  `Full Website/index_v2.html` is kept **byte-identical** to the root desktop copy — mirror after every
  desktop edit (`cp "Full Website/index_v2.html" index_v2.html` from repo root).
- `.git` writes intermittently fail (OneDrive/AV lock). Pushes still land — verify with
  `git ls-remote origin -h refs/heads/main` if a ref-write errors (local tracking ref lags).

## How to run / test
- Desktop: serve repo root (`python -m http.server 8000 --bind 127.0.0.1`) →
  `http://127.0.0.1:8000/index_v2.html?stay`. If patches don't show, suspect **browser cache / stacked
  servers** — a no-cache server avoids it (`scratchpad/serve_nocache.py DIR PORT`).
- Mobile: Ed tests on device off GitHub Pages — **push first**.
- `&lang=id` or the drawer toggle for Indonesian. After a module JS edit: extract the
  `<script type="module">` block and `node --check` it.

## NEXT — what we're supposed to do
1. **Rework the hero scroll (Ed's active idea, "cooking").** Reference **Lusion's astronaut piece**.
   Carry-over lesson: drive the camera/timeline from a scroll-**position** scalar, NOT an integrated
   velocity — that's exactly what made the auto-scroll feel inverted.
2. **"Print Pass" strips-wipe hero→body transition** (owner-approved spec, in hand — variant B "Strips").
   Replaces the current Step-7 canvas release: as scroll passes `#track`, the hero scrim dissolves in
   ~34px vertical strips (random static order, per-strip bottom→top wipe), the body "prints" in, fully
   scrub-reversible (**static hash, NO time term** = the reversibility rule). Fragment shader + a
   critically-damped SOD (f=2.0, ζ=1.0, r=0). **BLOCKED on Ed dropping in the reference demo file
   `xrzeno-bleed-transition-demo-v2.html`** — the spec says lift the shader/constants from it. Dark-on-dark
   contrast is known/accepted: default mitigation = stronger `EDGE_TINT`; the blue edge line / body
   brightness lift need Ed's explicit OK. (Full spec pasted 2026-07-08; see also CLAUDE-ADDENDUM gotcha #1.)
3. **Real assets (Ed inputs):**
   - Portfolio GLB/USDZ for **cards 2 & 3** (card 1 uses the bottle). Update `src`/`ios-src` + titles in
     both files.
   - Compare slider: the real **photo + render pair** — MUST be the same angle/framing or the compare
     trick dies (currently placeholder gradients `.ph-real` / `.ph-render`).
   - Real **social handles** for the 5 drawer icons (currently `instagram.com/xrzeno` etc. placeholders)
     in both files.
4. **Copy dash-sweep at finalization:** strip AI-dash tells from `strings.js` (EN+ID) + body copy; ID is
   machine-drafted (native review before launch).

## Parked / later (not blocking)
Compare-slider one-time "nudge" hint · desktop keyboard-scroll parity inside the locked site (wheel/
trackpad only now) · three.js version convergence (0.160 mobile vs 0.169 desktop) · the "dock" idea
(finale XRZENO shrinks + travels into the drawer control).

## Load-bearing gotchas
- **Reversibility:** the rail / relight / parallax read damped **scalars** and set state **directly** —
  never a per-frame `camera.position.lerp` follow (lags asymmetrically → breaks reverse-scroll). This is
  also why the velocity auto-scroll failed.
- A running CSS `animation` overrides inline `style.opacity` — hide pulsing elements with a class that
  sets `animation:none`.
- Scroll-lock `RAMP = innerHeight*0.9` must stay matched to the `bodyP` denominator AND the `#release`
  height.
- Reveal-on-scroll uses a **viewport** IntersectionObserver root, not `#siteBody`.
- `--warm` is `#siteBody`-scoped; the drawer hardcodes `#ff8a3d` — keep in sync when tuning the orange.
- Mobile entry is a **TAP**, not scroll (scroll fought the camera orbit) — don't reintroduce mobile
  scroll-into-body.
- **Contact:** WhatsApp **+62 823-4273-6941** → `wa.me/6282342736941`; email `hello@xrzeno.com`.
