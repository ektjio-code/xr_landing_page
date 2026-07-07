# XRZENO — Session handover (2026-07-07, end of day 2)

Read this, then `CLAUDE.md` (same folder) for the deep per-step history and levers.

## TL;DR
Desktop AND mobile are now **feature-complete pending real assets.** Everything is committed and pushed (`origin/main` at `0bdf587`). Next session is Ed dropping in the real assets.

## Where it stands
- **Desktop (`index_v2.html`, three r0.169):** cinematic narrative (materialize → journey rail → clay/final → beats → cold-night finale relight → solid-white XRZENO) → scroll-lock handoff blurs the scene into a cold background and the site fades in over it → cold Monture-themed body + drawer. Plus mouse parallax on the rail, perf-freeze once the site is in, and reveal-on-scroll body life.
- **Mobile (`index.html`, three r0.160):** pinch to materialize (1-finger rotate, kept AR button) → **tap anywhere once formed** → the 3D defocuses and the website blurs into view → 3D disabled. Same cold body + drawer + social. No beats/finale on mobile (scratched — too busy for the small screen).
- Both drawers: Portfolio / How it works / FAQ / Contact + EN↔ID toggle + WhatsApp + a social row (Instagram, TikTok, Threads, Facebook, X).

## File / git state
- Working files: repo-root `index_v2.html` (desktop, truth) and `index.html` (mobile). `strings.js` (EN+ID) at repo root, loaded by both.
- `Full Website/index_v2.html` is kept **in sync** with the repo-root copy (reconciled every desktop commit). Mobile `index.html` has no second copy.
- NOT committed on purpose: `.claude/settings.json` (pinned), the `xrzeno-concept` package/zip, `Screenshot_8.png`.
- ⚠️ **Git flakiness:** `.git` writes intermittently fail (repack `Permission denied`, `couldn't set 'refs/...'`) — almost certainly OneDrive/AV locking files under "WORK STUFF". `gc.auto`/`maintenance.auto` are disabled to reduce it. Pushes still land on GitHub; when a ref-write errors, verify with `git ls-remote origin -h refs/heads/main` (the local tracking ref lags, shows false "ahead"). Real fix (Ed): exclude the repo `.git` from OneDrive/AV, or move the repo out of the synced folder.

## How to run / test
- Desktop: `python -m http.server 8000 --bind 127.0.0.1` from repo root, open `http://127.0.0.1:8000/index_v2.html?stay`.
- Mobile: Ed tests on a real device off the pushed GitHub Pages URL (`ektjio-code.github.io/...`), not localhost. **So push after every mobile change.**
- `&lang=id` or the drawer toggle for Indonesian. After a JS edit, extract the module and `node --check`.

## TOMORROW — assets (Ed inputs), then finalize
1. **Portfolio:** GLB/USDZ for cards 2 & 3 (card 1 already uses `shinobu_2k_ar.glb/.usdz`). Update `src`/`ios-src` + titles in both files' portfolio cards.
2. **Compare slider:** the real photo + render pair. They MUST be the same angle/framing or the compare trick dies. Currently placeholder gradients (`.ph-real` warm, `.ph-render` cold); swap to `background-image:url(...)`.
3. **Social handles:** real URLs for the 5 drawer icons (currently `instagram.com/xrzeno` etc. placeholders) in both files.
4. **Copy dash-sweep** (deferred to finalization): strip AI-dash tells from `strings.js` (EN+ID) and body copy. ID copy is machine-drafted — native review before launch.

## Parked / possible later (not blocking)
- The compare-slider one-time "nudge" hint on reveal (signals it's draggable) — proposed, not built.
- Desktop keyboard-scroll parity inside the locked site (space/PageD, currently wheel/trackpad only).
- Three.js version convergence (0.160 mobile vs 0.169 desktop).
- Deployment/hosting is OUT OF SCOPE (Ed's web admins own it).

## Working style and pins (honour these)
- One change at a time, test live. Ed eyeballs everything and cannot see my screen. (Batch-and-eyeball is fine when he asks for speed.)
- **Push after every mobile change** so Ed can test on device; flag natural checkpoints.
- **Watch the AI-copywriting dash tell** in copy and prose. The copy sweep is deferred to finalization.
- **Ignore hosting/deploy/DNS entirely.**
- Commits use `ed@localhost`; do not commit `.claude/settings.json`. He goes by Ed.

## Load-bearing gotchas
- Reversibility: the rail, relight, and parallax read from **damped scalars** and set state DIRECTLY. Never a per-frame `camera.position.lerp` follow (lags asymmetrically, breaks reverse-scroll).
- A running CSS `animation` overrides inline `style.opacity` — hide pulsing elements with a class that sets `animation:none` (both the desktop hint and the mobile hint hit this).
- Desktop scroll-lock magic number `RAMP=innerHeight*0.9` must stay matched to the `bodyP` denom AND `#release` height.
- Reveal-on-scroll uses a **viewport** IntersectionObserver root, not `#siteBody` (the fixed internally-scrolled container didn't fire it on desktop).
- `--warm` is `#siteBody`-scoped; the drawer hardcodes `#ff8a3d`. Keep in sync.
- Mobile entry is a TAP, not scroll (scroll fought the camera orbit). Do not reintroduce mobile scroll-into-body.
