# Nyasa Patel — Cinematic Portfolio Hero

A fullscreen, sticky video hero built with Next.js App Router, Three.js, and GSAP.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Note: this was built and verified in a sandboxed environment without access
> to `fonts.googleapis.com`, so the production build could only be confirmed
> up through webpack module resolution (all code compiles and resolves) —
> the final font fetch step needs normal internet access, which you'll have
> locally. Everything else has been checked end to end.

## Structure

```
app/
  layout.jsx            Root layout, loads Fraunces / Inter / JetBrains Mono
  page.jsx               Assembles <VideoIntro /> + a placeholder next section
  globals.css             Design tokens (color, type scale, motion) + resets

components/
  VideoIntro/
    VideoIntro.jsx                 Hero markup, video refs, play/mute state
    VideoIntro.module.css          All hero visual styling
    useVideoIntroAnimations.js     GSAP entrance timeline + scroll-to helper
  CinematicLayer/
    CinematicLayer.jsx             Three.js bokeh/particle atmosphere

public/videos/hero.mp4    Your uploaded talking-head video
```

## Design notes

**Token system** (see `globals.css`):
- `--color-void` #05060a / `--color-ink` #0b0d12 — the dark cinematic base
- `--color-ember` #ff7a3d / `--color-ember-soft` #ffb37a — warm practical light
- `--color-monitor` #4f8cff — the cool "monitor glow" accent, used sparingly
- `--color-paper` #f5f1e8 — off-white text (never pure white, keeps it warm)
- Display face: **Fraunces** (italic/light for "Patel") — expressive serif for
  the huge stacked name. Body: **Inter**. Utility/mono: **JetBrains Mono** for
  the eyebrow, HUD timecode, and control labels — a technical, film-slate voice.

**Signature element:** a viewfinder-style HUD frame (four corner brackets +
a live `REC ● 00:00:00` timecode in the top-right) that ticks in sync with
the video. It's the one place the page winks at both halves of the brief —
"cinematic" and "CS/AI" — without being cute about either.

**Layering (back to front):** blurred backdrop video → foreground video →
gradient + vignette + film grain → Three.js particle field → HUD frame →
text content → glass controls.

## Customizing

- Swap copy in `VideoIntro.jsx` (eyebrow, name, subtitle).
- Swap `public/videos/hero.mp4` for a different clip — everything (blur sync,
  timecode, aspect handling) adapts automatically.
- Particle count/palette: `CinematicLayer.jsx`, top of the component.
- Entrance timing/easing: `useVideoIntroAnimations.js`.
- Build out the real content below the fold in `app/page.jsx`, replacing the
  `next-section` placeholder (that's the scroll indicator's target).

## Accessibility & performance

- Respects `prefers-reduced-motion` (GSAP entrance skips to end state, Three.js
  particle drift stops, only the parallax and pulse remain calm).
- All interactive controls are real `<button>` elements with `aria-label`s and
  visible focus states.
- Three.js: single draw call for the whole particle field, capped device pixel
  ratio, paused via `IntersectionObserver` when off-screen, and every
  geometry/material/texture/renderer is disposed on unmount.
