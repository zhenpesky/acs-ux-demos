# ACS Prototype

Prototyping workspace for Red Hat Advanced Cluster Security (RHACS/ACS) UI designs. Built with React 18 + PatternFly 6, using StackRox upstream code as read-only reference.

## Quick Start

```bash
npm install
npm run sync-assets   # copy platform CSS / nav chrome / logo from native StackRox repo (see below)
npm run dev           # http://localhost:5173
```

### Parity with the StackRox monorepo (`localhost:8443`)

- **Global styling / branding:** `npm run sync-assets` runs `scripts/copy-platform-static.mjs`, which copies **the same files** the platform app uses from **`../stackrox`** (sibling path `Documents/ACS-workspace/stackrox`) when present, otherwise `stackrox-upstream/`. That includes `ui/apps/platform/src/css/*.css`, main nav CSS, `RHACS-Logo.svg`, and favicon.
- **Application logic:** this repo is still a **standalone Vite prototype** (PF6, JSX). The full product UI lives in **`stackrox/ui/apps/platform`** (TypeScript, PF5, Redux, etc.). **Line-for-line parity for every screen’s React code** means **working in that platform package** (or a fork), not expanding this prototype to embed the whole platform.
- **Do not replace from upstream (by design):** vulnerability **reporting** and **workload results** flows — keep the prototype pages under `src/pages/` for those areas (e.g. `VulnerabilityReportingPage.jsx`, `CreateReportWizard.jsx`, `ReportDetailPage.jsx`, `UserWorkloadVulnerabilities.jsx`, `pages/v2/*`, `pages/v3/*` reporting/results).

Override platform root: `STACKROX_PLATFORM_ROOT=/path/to/stackrox npm run sync-assets`.

### Connecting to a Real StackRox Central

Create a `.env.local` file:

```
VITE_STACKROX_URL=https://your-central-instance.example.com
VITE_STACKROX_TOKEN=your-api-token-here
```

The prototype merges live API data with mock data automatically. Mock-only entries (saved filters, demo reports) are preserved alongside real data.

## Project Structure

```
src/
├── App.jsx                    # Router + version layouts (V1Routes, V2Routes, V3Routes)
├── routes.js                  # Route path constants + prefixRoutes()
├── mockData.js                # Shared mock data arrays
├── main.jsx                   # Entry point
├── api/
│   ├── config.js              # Env vars, base URL, auth headers
│   ├── client.js              # Real StackRox API client
│   ├── mockClient.js          # Mock API client
│   ├── liveSync.js            # Polls real API + merges into mock arrays
│   ├── index.js               # Unified client (delegates to real or mock)
│   ├── hooks.js               # React hooks for data fetching
│   └── reportStore.js         # In-memory report configuration store
├── assets/
│   └── RHACS-Logo.svg         # Official RHACS logo
├── components/
│   ├── AppMasthead.jsx        # Top header bar
│   ├── NavigationSidebar.jsx  # Left nav sidebar
│   ├── ApiStatusBadge.jsx     # Live/Mock/Syncing status indicator
│   └── LocalSyncBanner.jsx    # Sync status banner
├── pages/
│   ├── VersionSelector.jsx    # Landing page to choose v1/v2/v3
│   ├── DashboardPage.jsx      # Shared across versions
│   ├── UserWorkloadVulnerabilities.jsx
│   ├── CreateReportWizard.jsx
│   ├── VulnerabilityReportingPage.jsx
│   ├── ... (20+ shared pages)
│   ├── v2/                    # V2-specific pages
│   │   ├── V2ReportsPage.jsx
│   │   ├── V2CreateReportWizard.jsx
│   │   ├── V2UserWorkloadVulnerabilities.jsx
│   │   └── V2SavedFilterDetail.jsx
│   └── v3/                    # V3-specific pages
│       ├── V3ReportsPage.jsx
│       └── V3CreateReportWizard.jsx
└── styles/
    ├── acs.css
    ├── style.css
    ├── dark.theme.css
    ├── light.theme.css
    └── trumps.css
```

## Versions

| Version | URL | Focus |
|---------|-----|-------|
| V1 — MVP | `/v1/main/dashboard` | Collection-based resource scoping, 5-step wizard |
| V2 — Saved Filters | `/v2/main/dashboard` | Saved filter-based scoping, 4-tab reports view |
| V3 — MVP (No Saved Filter Scope) | `/v3/main/dashboard` | Collection + Custom Filters scope, saved filters on results view carry over |

## NPM Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run sync` | Sync data from StackRox Central |
| `npm run sync:watch` | Sync with file watching |
| `npm run dev:sync` | Sync then start dev server |
| `npm run test:visual` | Playwright visual regression tests |
| `npm run test:data` | API schema diff tests |
| `npm run test:tokens` | PatternFly design token usage check |
| `npm run test:qa` | Full QA suite (data + tokens + visual) |
| `npm run clone-upstream` | Clone StackRox repo as reference |
| `npm run update-upstream` | Pull latest StackRox upstream |
| `npm run sync-assets` | Copy CSS/logo/favicon from upstream |

## Reference Material

StackRox upstream code lives in `stackrox-upstream/` (read-only, never edit):

- **Header:** `stackrox-upstream/ui/apps/platform/src/Containers/MainPage/Header/`
- **Navigation:** `stackrox-upstream/ui/apps/platform/src/Containers/MainPage/Navigation/`
- **Vulnerabilities:** `stackrox-upstream/ui/apps/platform/src/Containers/Vulnerabilities/`
- **Branding:** `stackrox-upstream/ui/apps/platform/src/constants/productBranding.ts`

## Agent Workflow System

This project uses Cursor rules (`.cursor/rules/`) to define a structured agent workflow for prototyping. The system has 3 phases with 8 agent roles:

### Phase 1: Kickstart a New Prototype

Tell the agent: **"kickstart a new prototype for [feature]"** with a Figma URL.

1. **Design Analyst** — Extracts Figma design into a component inventory using Figma MCP and PatternFly MCP
2. **Scaffold Architect** — Sets up project skeleton, routes, version directory, and placeholder pages
3. **Reference Inspector** — Searches StackRox upstream for matching patterns and API shapes

### Phase 2: Build the Replica

Tell the agent: **"build the replica"**

4. **Component Builder** — Implements pages with PF6 components matching Figma designs
5. **API Integration Engineer** — Wires mock data, real API proxy, and live sync merge layer
6. **Interaction Developer** — Adds interactive states, filter carry-over, wizard logic, navigation

### Phase 3: Maintenance

Tell the agent: **"audit the prototype"** or **"fix [issue]"**

7. **QA Auditor** — Runs visual/data/token tests, produces parity audit reports
8. **Bug Triage / Version Manager** — Fixes bugs, creates new versions, manages version isolation

### Cursor Rules

| Rule File | Scope |
|-----------|-------|
| `acs-prototyping.mdc` | Core project context, PF6 guidelines, file organization, branding |
| `agent-roles.mdc` | 8 agent role definitions with triggers, responsibilities, deliverables |
| `api-patterns.mdc` | Mock+live merge strategy, MOCK_ID_PREFIX, syncState.version |
| `version-management.mdc` | Step-by-step guide for creating new prototype versions |
| `figma-workflow.mdc` | Figma-to-code process with PF6 component verification |

---

HPUX-1160 -- Red Hat User Experience Design -- Confidential
