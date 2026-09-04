# Arun Karthik N — Portfolio

Static, dependency-free personal portfolio. No build step, no framework — open
`index.html` in a browser and it runs.

## Structure

```
site/
├── index.html      # all markup — one page, anchor-linked sections
├── style.css       # design tokens, base type, media queries, hover states
├── script.js       # scroll reveals, pointer motion, mobile menu
├── images/
│   ├── portrait-cutout.png   # hero portrait (background removed)
│   └── portrait.jpg          # original photograph
├── doc/
│   └── ArunKarthik-CV.pdf    # résumé, linked from the hero and About
└── assets/         # additional downloads / media
```

## Sections

| Anchor | Section |
| --- | --- |
| `#top` | Hero — heading, intro, stats, portrait |
| `#work` | Selected work — DevsBot, Argus, design system |
| `#platforms` | Websites — `energy.devsbot.com` highlight, main sites, client work |
| `#writing` | Published articles |
| `#about` | Experience, education, capabilities |
| `#contact` | Contact block and social links |

## How it works

**CSS.** Colour, spacing and shadow live as custom properties in `:root`
(`--ak-*`). Layout is set per element in `index.html`; `style.css` carries the
tokens, base resets, all media queries, and the `.h1`–`.h49` hover classes.

**JavaScript.** Three independent initialisers in `script.js`:

- `initMenu()` — hamburger panel below 720px; click-outside and Escape close it.
- `initReveals()` — `IntersectionObserver` fades in every `[data-reveal]` once.
- `initMotion()` — GSAP cursor ring, cursor-reactive heading (`[data-ch]`),
  magnetic buttons (`[data-magnet]`), hero smoke trail. Pointer-only, so it is
  skipped entirely on touch devices and when `prefers-reduced-motion` is set.

GSAP 3 loads from CDN. If it fails, reveals fall back to plain visible content.

## Responsive

Fluid throughout via `clamp()`. Breakpoints: **900px** (capabilities to 2
columns, cursor ring off), **720px** (hamburger nav, stacked experience,
3-up stat cards), **560px / 460px** (single-column capabilities, tighter hero).

## Editing

- **Copy** — edit `index.html` directly.
- **Colours** — change the `--ak-*` values at the top of `style.css`.
- **Résumé** — replace `doc/ArunKarthik-CV.pdf`, keeping the filename.
- **Portrait** — replace `images/portrait-cutout.png` (transparent PNG).

## Deploying

Any static host. For GitHub Pages, push these files to the repository root of
`<username>.github.io` and enable Pages on the default branch.
