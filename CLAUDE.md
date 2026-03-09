# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page portfolio for **Krishna Nagalla**, Sr. Salesforce Developer. No build tools, bundlers, or package managers — open `index.html` directly in a browser.

## Architecture

Three files drive everything:

| File | Role |
|---|---|
| `index.html` | All markup and section structure |
| `style.css` | All styles — variables, layout, animations, responsive |
| `script.js` | All interactivity — runs in strict mode, no imports |

`assets/cert-badges.png` — official Salesforce badge strip extracted from the resume docx (`NK SF9 Resume.docx`).

### CSS organisation (in order)

1. CSS custom properties (`:root`) — all design tokens live here
2. Reset + base
3. Premium cursor system (`.cur-dot`, `#trailCanvas`)
4. Navbar
5. Buttons + gradient text utilities
6. Section base (`.section`, `.section-header`)
7. Per-section blocks: Hero → About → Skills → Experience → Projects → Certifications → Contact → Footer
8. Reveal animation classes (`.reveal-up/left/right`, `.revealed`)
9. Responsive breakpoints (960px, 768px, 480px)
10. `@media (hover: none)` — disables cursor on touch devices

### JS organisation (in order)

1. Cursor system — dot position (exact), trail canvas (particle), hover/click state classes
2. Background particle canvas — floating connected dots
3. Navbar scroll class + active link highlighting
4. Hamburger menu toggle
5. `IntersectionObserver` reveal — adds `.revealed` to scroll-animated elements; also triggers skill bar fills
6. Hero load trigger — fires `.revealed` on hero elements after 100ms
7. Rotating words — cycles `.active`/`.exit` on `.word` spans every 2600ms
8. Counter animation — counts up `data-target` values on `.stat-num`
9. 3D tilt on `.project-card` via mousemove
10. Magnetic effect on `.btn-primary`, `.nav-cta`
11. Contact form submit — fake success state after 1200ms
12. Smooth scroll
13. `sizeRotatingWords()` — measures widest `.word` after fonts load, sets container `min-width`
14. Page fade-in on `load`
15. Hero orb parallax on mousemove

## Key Conventions

**Reveal animations** — add class `reveal-up`, `reveal-left`, or `reveal-right` to any element; `IntersectionObserver` in `script.js` adds `.revealed` when it enters the viewport. Use CSS variable `--delay` for stagger: `style="--delay:0.2s"`.

**Design tokens** — all colours, radii, transitions defined in `:root`. Never hardcode colours outside of the cursor/canvas sections (which use raw hex for canvas API compatibility).

**Accent colours** — `--indigo: #6366f1` and `--cyan: #06b6d4`. Gradients always go indigo → cyan (left-to-right or 135deg).

**Cursor** — `.cur-dot` is positioned via direct `style.left/top` on every `mousemove` (no CSS transition on position). The `curRing` element exists in HTML but is `display:none` — do not remove it as JS still references it.

**Section IDs** — `#home`, `#about`, `#skills`, `#experience`, `#certifications`, `#contact`. Nav links use these exact IDs via `data-link` attribute for active-state tracking.

**Fonts** — Inter (body), Space Grotesk (headings/logo/numbers), Fira Code (code block, dates, percentages). All loaded via Google Fonts CDN.
