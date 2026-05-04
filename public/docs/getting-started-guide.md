# ACS Prototype — Communicating Effectively with the Agent

> A practical guide for designers on how to brief AI agents clearly and precisely to produce high-fidelity prototypes that match production-quality expectations.

---

## 1. How This Prototyping Workflow Works

This workspace uses **React + PatternFly 6** to build interactive prototypes of Red Hat Advanced Cluster Security (RHACS) features. An AI agent assists through eight specialized roles organized in three phases:

| Phase | Roles | What Happens |
|-------|-------|--------------|
| **Kickstart** | Design Analyst, Scaffold Architect, Reference Inspector | Extract Figma designs, scaffold project structure, inspect upstream StackRox code |
| **Build** | Component Builder, API Integration Engineer, Interaction Developer | Implement pages, connect data, add interactivity |
| **Maintain** | QA Auditor, Bug Triage & Version Manager | Audit parity, fix bugs, manage versions |

### Starting a Session

Every new chat presents a workflow selector. Choose the option that matches the task:

- **Kickstart a New Prototype** — when a Figma design is available and the work starts fresh
- **Build / Continue a Replica** — when the scaffold exists and implementation continues
- **Create a New Version** — when forking from an existing version (e.g., v2 → v3)
- **Audit the Prototype** — when checking quality and parity
- **Fix a Bug or Issue** — when something specific is broken

---

## 2. Communicating Effectively with the Agent

Prototype quality depends on clarity and precision in how design intent is described. The principles below reflect lessons from real prototyping sessions.

### Five principles for effective agent communication

**1. Share the Figma link to the specific frame**
The agent can read Figma files directly, but it needs the exact link to the page or frame you are referring to — not just the project URL.

**2. Map each frame to its interactive state**
Clarify which Figma frame represents the default view, which shows a dropdown open, which is the confirmation dialog — the agent cannot infer state transitions from static frames alone.

**3. Specify the toolbar order explicitly**
Describe controls from left to right exactly as they appear in Figma. Misaligned toolbar order has been the single most recurring source of rework across all prototyping sessions.

**4. Differentiate similar-sounding concepts**
Terms like "saved filters" can refer to entirely different behaviors depending on context. If two concepts share a name, define each one explicitly and state where each lives in the UI.

**5. Describe the UI patterns you expect**
Tell the agent what the interface should look and behave like — a table with columns that stay side by side, rows that expand to reveal details, a dialog with a title and action buttons, or a dropdown triggered by a button. Describing the visual and behavioral outcome is more effective than naming code components.

**Bonus: Point to existing product behavior**
When the prototype must mirror production, reference specific areas of the existing StackRox product so the agent inspects the right patterns.

### Unclear vs. clear briefing

**Unclear briefing:**
> "Build the reports page"

**Clear briefing:**
> "Build the Reports page from this Figma link: [url]. There are 4 frames:
> - Frame 1: Default table view with no filters applied
> - Frame 2: Dropdown open showing saved filters
> - Frame 3: Create Report wizard — Step 1 (Report Details)
> - Frame 4: Confirmation dialog after wizard completion
>
> Toolbar controls from left to right: Name, Report status, Severity, CVE, [separator], Apply button. The table should display columns side by side, not stacked."

### Why framing matters

The agent extracts component information from Figma but cannot infer **which frames represent which states** or the **exact order of toolbar controls** without an explicit description.

### Example: distinguishing "saved filters"

Two distinct concepts share similar language in the RHACS reporting workflow:

| Concept | Where It Lives | Behavior |
|---------|---------------|----------|
| **Saved filters as wizard scope** | Inside the Create Report wizard, as a radio option alongside "Collection" and "Custom Filters" | Selects a pre-defined filter as the report scope |
| **Saved filters on results page** | On the vulnerability results toolbar | User selects a saved filter → filters are applied → user clicks "Create Report" → those filters carry over into the wizard as custom filters |

**Clear briefing for V3 (removes wizard scope but keeps results-page carry-over):**
> "In V3, remove 'Saved Filters' as a wizard scope option. Keep only 'Collection' and 'Custom Filters' as scope choices. However, saved filters on the vulnerability results page should still work: when a user selects a saved filter there and clicks 'Create Report', the active filters should carry over into the wizard as custom filters."

### Interactive states in the briefing

**Unclear:**
> "Add a dropdown to the toolbar"

**Clear:**
> "Add a 'More Views' dropdown to the vulnerability toolbar. States:
> - **Closed**: Shows a button with the text 'More Views'
> - **Open**: Dropdown reveals 5 items: Platform CVEs, Node CVEs, All Vulnerabilities, Exception Management, Reports
> - **Each item**: Navigates to the corresponding page on click
> - **Active indicator**: The current page is highlighted with a checkmark or active style"

### Matching existing product behavior

When a prototype should match what already exists in StackRox:

> "Match the top navigation bar from the existing StackRox product. It should include: logo linking to the dashboard, a search icon, a CLI download dropdown, theme toggle, help menu with an About dialog, and a user avatar dropdown with 'Log out'. Every control should be functional — no decorative-only elements."

### Describing UI patterns in the briefing

Instead of naming code components, describe the behavior you expect:

> "The table should show a list of CVE vulnerabilities. Each row should be expandable — clicking it reveals additional detail about affected deployments beneath the row. Clicking again collapses it. Columns should stay side by side on desktop, not stack vertically."

> "For the confirmation dialog, include a title, a content area with the summary, and two action buttons at the bottom: Cancel and Confirm."

---

## 3. Communication Templates by Workflow Phase

### Phase 1: Kickstart

```
KICKSTART BRIEFING TEMPLATE:

Figma link: [paste the link to the specific frame or page]

Frames and states:
- Frame "[name]": [what state this shows — default view, dropdown open, dialog, etc.]
- Frame "[name]": [description]
...

Key interactions:
- [Describe dropdowns, dialogs, navigation flows]

Toolbar/filter order (left to right):
- [Control 1], [Control 2], [Separator], [Control 3]...

UI patterns expected:
- [Table, step-by-step wizard, dialog, tabs, expandable rows, etc.]

Match existing product behavior from:
- [StackRox feature or area, if applicable]
```

### Phase 2: Build

```
BUILD BRIEFING TEMPLATE:

Page: [PageName] at route /vN/main/[path]

Data requirements:
- Table columns: [list exactly]
- Filters: [list in order from left to right]
- Sortable columns: [list which ones]

Interactive behaviors:
- [Describe each interactive element and how it should behave]
- [Describe what happens when navigating between pages and what information carries over]

Sample data: [Describe what data to show, or point to existing sample data]

Live data:
- Endpoint: [API path, if connecting to a real server]
- Keep all existing sample data (saved filters, reports) when the real API connects
- Data should refresh automatically after syncing — no manual page reload needed
```

### Phase 3: Maintain / New Version

```
VERSION FORK BRIEFING TEMPLATE:

Base: v[N] (the version to fork from)
New: v[N+1]

What changes:
- [List specific differences]

What stays the same:
- [List what must NOT change]

Important: Do not break v[N] when creating v[N+1].
```

---

## 4. Common Pitfalls & How to Avoid Them

### Pitfall 1: Wrong Toolbar/Filter Order
**Symptom:** Filters appear in a different sequence than Figma.
**Prevention:** Describe filter controls from left to right as they appear in Figma and name the source frame.

### Pitfall 2: "Saved Filters" Ambiguity
**Symptom:** The agent removes results-page filter carry-over when asked to remove the wizard scope option.
**Prevention:** Clearly describe which "saved filters" you mean — the one inside the wizard as a scope option, or the one on the results page that carries selected filters into the wizard.

### Pitfall 3: Table Columns Stack Vertically
**Symptom:** Table columns appear on top of each other instead of side by side.
**Prevention:** Tell the agent that table columns should stay in a horizontal row on desktop screens, not collapse into a vertical stack.

### Pitfall 4: Expandable Rows Don't Work
**Symptom:** Clicking a row's expand button does nothing, or detail content doesn't appear.
**Prevention:** Describe the behavior: clicking a row should reveal additional detail below it, and clicking again should collapse it back.

### Pitfall 5: Dead Links and Controls
**Symptom:** Navigation icons, dropdown items, and buttons do nothing when clicked.
**Prevention:** State clearly that every control should either do something when clicked or appear visibly disabled with an explanation.

### Pitfall 6: Live Data Doesn't Refresh
**Symptom:** UI shows stale data after syncing with the live API until you manually reload the page.
**Prevention:** Tell the agent that data should update automatically after syncing — the user should never need to manually refresh the page.

### Pitfall 7: Sample Data Disappears After API Connection
**Symptom:** Saved filters, reports, and other sample data vanish when the real API connects.
**Prevention:** Ask the agent to keep all existing sample data intact when connecting to the live API — don't silently remove named items.

### Pitfall 8: Version Conflicts
**Symptom:** Changes to v3 break v1 or v2.
**Prevention:** Specify that changes to one version must not affect earlier versions, and confirm that page routes stay isolated.

---

## 5. Agent Roles — When to Invoke Each

### Role 1: Design Analyst
**Invoke when:** A Figma design is available and the goal is to understand what UI patterns are needed.
**What it does:** Reads the Figma file, inventories components, and flags anything that doesn't have a direct PatternFly equivalent.
**Briefing note:** Include the Figma link and describe what each frame represents.

### Role 2: Scaffold Architect
**Invoke when:** Starting a new prototype or adding a new version.
**What it does:** Creates the file structure, page routes, and empty page shells.
**Briefing note:** Include the version number and list all new pages needed.

### Role 3: Reference Inspector
**Invoke when:** The prototype must match real StackRox behavior.
**What it does:** Reads upstream product code (read-only) and documents patterns.
**Briefing note:** Point to the specific area of the product to inspect.

### Role 4: Component Builder
**Invoke when:** Pages need to be implemented from design specs.
**What it does:** Builds pages using PatternFly 6 components with correct behavior.
**Briefing note:** List the toolbar order, table columns, and interactive behaviors.

### Role 5: API Integration Engineer
**Invoke when:** Pages need real or sample data.
**What it does:** Creates data connections, sample data, and merge logic.
**Briefing note:** Describe the data shape and how sample data should coexist with live data.

### Role 6: Interaction Developer
**Invoke when:** Pages are built but need interactive behaviors wired up.
**What it does:** Adds state management, navigation flows, and cross-page data transfer.
**Briefing note:** Describe what happens when navigating between pages and what information carries over.

### Role 7: QA Auditor
**Invoke when:** After significant changes or before a stakeholder review.
**What it does:** Runs visual, data, and design-token tests; updates audit reports.
**Briefing note:** Ask for an "audit" or a specific quality check.

### Role 8: Bug Triage & Version Manager
**Invoke when:** Something is broken or a new version is needed.
**What it does:** Diagnoses and fixes bugs; manages version forks.
**Briefing note:** Describe what you see, what page it's on, and what you expected to happen.

---

## 6. Pre-Session Briefing Checklist

Before starting a conversation with the agent about building a page, confirm that you can provide these details:

- [ ] Figma link to the specific frame or page
- [ ] Which frame shows which state (default view, dropdown open, etc.)
- [ ] Toolbar and filter order (left to right, matching Figma)
- [ ] Table columns and which ones are sortable
- [ ] Interactive elements and their behaviors (open/closed/active/disabled)
- [ ] Navigation flows and what information transfers between pages
- [ ] Reference to existing product behavior (if matching production)
- [ ] Expected UI patterns (tables, step-by-step wizards, dialogs, dropdowns)
- [ ] Sample data needs or live API endpoints
- [ ] Version safety: "don't break other versions"

---

## 7. Project Structure Reference

```
src/
├── App.jsx              # Top-level routing (/, /v1/*, /v2/*, /v3/*)
├── main.jsx             # React root, PF6 base CSS
├── routes.js            # Route constants
├── mockData.js          # Shared sample data
├── api/                 # API layer
│   ├── index.js         # Unified client (real vs sample fallback)
│   ├── client.js        # Live StackRox HTTP client
│   ├── mockClient.js    # Sample data implementation
│   ├── liveSync.js      # Poll/merge live + sample data
│   ├── hooks.js         # Data-fetching hooks
│   ├── config.js        # Environment config (StackRox URL, token)
│   └── reportStore.js   # In-memory report config store
├── components/          # Shared components
│   ├── AppMasthead.jsx  # Top navigation bar
│   ├── NavigationSidebar.jsx
│   ├── ApiStatusBadge.jsx
│   └── LocalSyncBanner.jsx
├── pages/               # V1 pages (shared with v3 where noted)
│   ├── VersionSelector.jsx    # Landing page
│   ├── DashboardPage.jsx
│   ├── UserWorkloadVulnerabilities.jsx
│   ├── CreateReportWizard.jsx
│   └── ... (all other v1 pages)
├── pages/v2/            # V2-specific pages
│   ├── V2ReportsPage.jsx
│   ├── V2CreateReportWizard.jsx
│   └── V2SavedFilterDetail.jsx
├── pages/v3/            # V3-specific pages
│   ├── V3ReportsPage.jsx
│   └── V3CreateReportWizard.jsx
├── assets/              # SVGs, images
│   └── RHACS-Logo.svg
└── styles/              # CSS layers
    ├── style.css        # Global layout
    ├── acs.css          # ACS-specific overrides
    ├── light.theme.css
    ├── dark.theme.css
    └── trumps.css
```

---

## 8. Environment Setup

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Optional: connect to live StackRox instance
# Create .env.local with:
VITE_STACKROX_URL=https://your-central-instance.example.com
VITE_STACKROX_TOKEN=your-api-token-here

# Build for production
npm run build

# Run QA suite
npm run test:qa
```

---

*This guide is maintained alongside the ACS Prototype workspace. For questions, refer to the agent roles documentation in `.cursor/rules/agent-roles.mdc`.*
