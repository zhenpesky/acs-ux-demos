# RHACS UX Prototypes

Interactive UX prototypes for **Red Hat Advanced Cluster Security (RHACS)**, hosted on GitHub Pages.

**Live site:** https://zhenpesky.github.io/rhacs-ux-prototypes

---

## Overview

This repository holds the static deployments for all RHACS UX prototypes. Each prototype lives in its own sub-path so they can be built, versioned, and shared independently.

| Prototype | Path | Status |
|-----------|------|--------|
| Saved Filters — v1 | [`/saved-filters/`](https://zhenpesky.github.io/rhacs-ux-prototypes/saved-filters/) | ✅ Done |

The root `index.html` is a searchable, filterable catalog of all prototypes.

---

## Repository structure

```
rhacs-ux-prototypes/
├── index.html          # Landing page — prototype catalog
├── 404.html            # GitHub Pages SPA fallback (deep-link support)
├── saved-filters/      # Prototype: Saved Filters v1
│   ├── index.html
│   ├── mockServiceWorker.js
│   └── static/         # Hashed JS/CSS/asset bundles
└── README.md
```

---

## How prototypes are built

Prototypes are built from the [`stackrox-vm-sandbox`](https://github.com/zhenpesky/stackrox-vm-sandbox) fork of the RHACS UI. Mock Service Worker (MSW) intercepts all API calls so no live Central backend is needed.

### Build a new version of the saved-filters prototype

```bash
# From the stackrox-vm-sandbox repo
cd ui/apps/platform
npm run build:prototype

# Copy build output into this repo
BUILD=build
DEPLOY=/path/to/rhacs-ux-prototypes/saved-filters
find "$DEPLOY" -mindepth 1 -delete
cp -r "$BUILD"/* "$DEPLOY/"
```

### Environment variables used by the build

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_MOCK_MODE` | `true` | Enables MSW + sets base path to `/rhacs-ux-prototypes/saved-filters/` |

The `build:prototype` npm script in `stackrox-vm-sandbox` sets this automatically.

---

## Adding a new prototype

1. Add a new sub-path folder (e.g. `network-policies/`) with its own build output.
2. Add a card to `index.html` following the existing `qs-card-wrapper` pattern — set `data-area`, `data-status`, `data-title`, and `data-desc`.
3. Update `404.html` to point at the correct hashed JS/CSS bundle for deep-link support.

---

## In-prototype version switcher

Each prototype includes a **version switcher** in the masthead (visible on Vulnerability Results and Vulnerability Reporting pages). It lets viewers toggle between:

- **Baseline UI** — the production RHACS interface, no prototype changes
- **Prototype v1 — Saved filters** — the prototype variant (`?prototype=v1`)

The switcher also links back to this catalog page.

---

## Notes

- This is an **internal UX design tool** — not for production use.
- No Central backend is required; all data is mocked.
- Changes here do **not** affect the official `stackrox/stackrox` repository.
