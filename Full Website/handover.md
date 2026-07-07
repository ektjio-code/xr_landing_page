# XRZENO — Session handover (2026-07-07, updated end of day)

Read this, then `CLAUDE.md` (same folder) for the deep per-step history. This doc is where things actually stand right now.

## TL;DR
The desktop narrative (`index_v2.html`) plus the DOM **body** and the **canvas-to-website handoff** are done and confirmed, and the **drawer nav is built**. All committed and pushed (`175d881` on `origin/main`). The transition that was "in flight" last handover is now settled: the 3D scene **relights cold**, then blurs into a cold blobby background that stays, and the site fades in over it. The body is themed on the Monture cold blue palette with a warm-orange highlight (teal/orange split).

## File / git state
- The working file is the **repo-root copy**: `XRLanding\index_v2.html`. This is the truth.
- `Full Website\index_v2.html` was stale; it has now been **reconciled** (copied from repo-root) and committed, so the two are identical again. Keep them in sync going forward, or merge to one file later.
- `strings.js` (repo root) is committed. `index_v2.html` loads it plus model-viewer from CDN.
- Last commit `175d881` (pushed to origin/main): cold finale relight, scroll-lock handoff, blue palette + teal/orange, glass buttons, drawer.
- NOT committed on purpose: `.claude/settings.json` (harness noise, pinned), `Full Website/CLAUDE.md` + `handover.md` (docs, updating now), the `xrzeno-concept` package/zip, `Screenshot_8.png`.
- Live homepage still serves the OLD scene; `index_v2.html` is unreferenced. Deployment/hosting OUT OF SCOPE (Ed's web admins own it, pinned).

## How to run / test
- Server from repo root: `python -m http.server 8000 --bind 127.0.0.1` (dies between sessions, restart it).
- URL: `http://127.0.0.1:8000/index_v2.html?stay` (the `?stay` overrides the mobile redirect).
- Indonesian copy: `&lang=id`, or use the drawer language toggle.
- After a JS edit, extract the module and `node --check` it (awk one-liner in shell history).

## What was confirmed this session (2026-07-07)
1. **Cold-night finale relight (not a veil).** At the XRZENO finale the actual scene lights ease from warm to cold moonlight (`spot` 0xffda95 -> `#5f80e8`, `museum` 0xfff4e2 -> `#86a4ff`), riding a shared reveal-factor `revF` in the loop so the lights-down dim and the cold relight stay in lockstep. Earlier attempts at a full-screen blue veil / multiply gel were rejected by Ed ("it's still a veil dude") in favour of relighting. `revF` is pinned to 0 in 3D-view/inspect so free-cam is always default warm.
2. **Canvas-to-site handoff = scroll-lock.** The `#coolVeil` (blue radial) now only carries the body **background** transition, driven by `bodyP`. Past `#track` there is an `#release` runway (`80vh` = 0.8 screens, cut to 1/3 after Ed found the longer version too slow). Once the site fully fades in (`bodyP>=0.99`) `enterBodyLock()` freezes the page scroll (`documentElement/body overflow:hidden`) and `#siteBody` (fixed, `overflow-y:auto`, `overscroll-behavior:none`) owns scrolling. Pull up at the site's top -> a `wheel` listener calls `exitBodyLock()`, restores page scroll at `bodyP~=0.9`, and the narrative eases back. One active scroll zone at all times, no desync.
3. **Body themed to the Monture cold palette**, scoped to `#siteBody` so the warm narrative is untouched: `--accent:#1e40ff` cobalt, `--ink:#eaf1ff`, `--bg-deep:#0a1633` navy, cool hairlines. **Teal/orange split:** warm `--warm:#ff8a3d` is reserved for the one *highlighted* action (both WhatsApp CTAs, identical solid pills) plus the compare-slider signature line. Everything else is cold.
4. **Frosted-glass buttons.** Non-highlighted buttons (Email, portfolio AR) took the "View 3D Model" treatment: transparent + `backdrop-filter:blur(6px)` + thin cool border + pill. The `#ar` "View 3D Model" button keeps its warm border (it lives in the warm narrative) — shared glass *treatment*, border tint matches each button's world.
5. **Drawer built (was build-step 2).** The corner `XRZENO` is now `#drawerCtl` (button + chevron, z-index 100) opening a **translucent blue glass pane** `#drawer` (`rgba(18,34,82,.42)` + `blur(16px)`). Links: Portfolio / How it works / FAQ / Contact, an EN<->ID language toggle (re-renders copy in place), and a solid-warm WhatsApp deep link matching the bottom CTA. Nav is **lock-aware** (`window.__nav`): from the narrative it flies the whole rail into the body (~1s happy accident preserved) then lands on the section; from inside the site it smooth-scrolls `#siteBody`. Scrim + Escape close it.

## Next-session priorities (in order)
1. **Perf: freeze the settled background.** The full Three.js composer loop still renders forever behind the site. Once the blurred cold background settles, freeze it to a static image/texture and stop/skip the RAF so the site stays light. Reversible on scroll-up.
2. **Real assets (NEED FROM ED):** portfolio GLB/USDZ set (cards 2 and 3 are placeholders, card 1 can use the bottle) and the real photo+render pair for the slider (must be SAME angle/framing or the compare trick dies).
3. **Mouse parallax (Step 7):** the parked +/-2-3 degree camera lean on the rail, the antidote to the "on-rails" feel.
4. **Mobile (Step 5):** pinch-gate -> scroll-unlock + the body/drawer on the `index.html` lineage (pure DOM ports 1:1; the 3D journey is the expensive part).

## Known rough edges
- While scroll-locked in the site, **keyboard scrolling** (space/PageDown/arrows) won't move it unless `#siteBody` has focus, since the window is frozen. Wheel/trackpad work. Add keyboard parity if wanted.
- Git threw a `Permission denied` on a background **repack** during commit (auto-maintenance), not on the commit itself. If future git ops complain, something has a lock on `.git/objects/pack`.

## Working style and pins (honour these)
- One change at a time, test live, discuss when asked. Ed eyeballs everything, he cannot see my screen. (Relaxed to batch-and-eyeball when he asks for speed.)
- **Ignore hosting/deploy/DNS/cutover entirely.** Web admins own it.
- **Watch the AI-copywriting tell (dashes).** The copy dash sweep on `strings.js` + body text is DEFERRED to finalization (Ed's call), not mid-build.
- Keep Ed's real email out of git, commits use `ed@localhost`.
- Do not commit `.claude/settings.json`.
- He goes by Ed.

## Load-bearing gotchas
- The finale relight and the rail read from **damped scalars** (`xrReveal`, `curJ`) and set state DIRECTLY, so everything is reversible on scroll-up. Do not reintroduce a per-frame `camera.position.lerp` follow, it lags asymmetrically and breaks reverse-scroll.
- A running CSS `animation` overrides inline `style.opacity` (hid the pulsing hint with a `.gone{opacity:0;animation:none}` class, not opacity alone).
- The scroll-lock magic number (`RAMP = innerHeight*0.8`) must stay matched to the `bodyP` formula denominator AND the `#release` height, or the fade won't land at the page bottom.
- `--warm` is defined only inside `#siteBody`; the drawer (outside it) hardcodes `#ff8a3d`. Keep those in sync when tuning the orange.
- Camera JSON, material timings, dust flare, inspect/dolly details all live in `CLAUDE.md`. Do not re-derive them.
