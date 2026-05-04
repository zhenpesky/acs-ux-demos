# ACS Prototype Development Workflow

## Project Structure

```
local-ui-prototype-vite/   # (npm package name remains "acs-prototype")

## Upstream parity (StackRox monorepo)

- Run **`npm run sync-assets`** before demos when you want **global CSS / nav chrome / logo** to match the sibling clone **`../stackrox`** (same tree as Central on **8443**). Script: `scripts/copy-platform-static.mjs`.
- **Prototype-only (do not overwrite with platform TS):** vulnerability **reporting** and **workload results** UX — keep editing the existing JSX under `src/pages/` for those flows.
- For **full feature parity** with shipping ACS UI, changes belong in **`../stackrox/ui/apps/platform`** on a git branch; this Vite app cannot import that tree wholesale without a full stack migration.
├── src/                      # Your prototype source code
│   ├── assets/               # Copied assets from StackRox (logos, icons)
│   ├── components/           # Reusable prototype components
│   ├── pages/                # Page-level prototype components
│   │   └── UserWorkloadVulnerabilities.jsx
│   ├── styles/               # Copied CSS from StackRox
│   ├── mockData.js           # Realistic mock data (clusters, deployments, CVEs)
│   ├── App.jsx
│   └── main.jsx
├── public/                   # Static assets (favicon, etc.)
├── stackrox-upstream/        # READ-ONLY reference (cloned from GitHub)
├── figma-exports/            # Screenshots/exports from Figma for reference
├── .cursor/rules/            # AI assistant rules for this project
├── package.json
├── vite.config.js
└── WORKFLOW.md               # This file
```

## Quick Start Commands

```bash
# Start development server (uses mock data by default)
npm run dev

# Update StackRox reference (safe - read-only)
npm run update-upstream

# Sync latest assets from upstream
npm run sync-assets
```

## Connecting to Real StackRox

The prototype can connect to a real StackRox/RHACS instance to show live data.

### Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your StackRox credentials:
   ```
   VITE_STACKROX_URL=https://central.example.com
   VITE_STACKROX_TOKEN=your-api-token-here
   ```

3. Get your API token from StackRox:
   - Go to **Platform Configuration > Integrations > API Token**
   - Create a new token with appropriate permissions
   - Copy the token value

4. Restart the dev server:
   ```bash
   npm run dev
   ```

### Connection Status

The header shows a badge indicating the data source:
- 🟢 **Live Data** - Connected to real StackRox
- 🟠 **Mock Data** - Using local mock data (no API configured or connection failed)
- 🔴 **Disconnected** - API configured but connection failed

### Fallback Behavior

If the real API is unavailable, the prototype automatically falls back to mock data.
This ensures the prototype always works, even without network access.

## Figma to Code Workflow

### Step 1: Analyze the Figma Mock
1. Get the Figma URL for your design
2. Use `get_design_context` MCP tool to extract:
   - Component structure
   - Color tokens
   - Layout information
   - Interactive states

### Step 2: Identify Required Components
1. List all PatternFly components needed
2. Check if StackRox has custom implementations in `stackrox-upstream/ui/`
3. Note any custom styling or behavior

### Step 3: Create the Prototype Page
1. Create new file in `src/pages/YourNewPage.jsx`
2. Copy relevant components from StackRox upstream as reference
3. Import PatternFly components
4. Match the Figma layout

### Step 4: Add Interactive States
1. Identify all interaction points from Figma frames
2. Add React state management
3. Implement transitions between states

### Step 5: Test and Iterate
1. Compare prototype with Figma side-by-side
2. Use browser DevTools to fine-tune spacing/colors
3. Test all interactive flows

## Keeping StackRox Reference Updated

The `stackrox-upstream/` folder is a **read-only reference**. You can safely:

- Pull latest changes: `cd stackrox-upstream && git pull`
- Browse code for patterns and components
- Copy files to your `src/` folder

You **cannot** accidentally push changes because:
1. You don't have write access to the repo
2. The folder is marked as a reference, not your working code

### Manual Update Command
```bash
cd stackrox-upstream && git pull origin master
```

### Full Re-clone (if needed)
```bash
rm -rf stackrox-upstream
git clone --depth 1 https://github.com/stackrox/stackrox.git stackrox-upstream
```

## Asset Sync Process

When you need to update assets from StackRox:

```bash
# Copy CSS
cp stackrox-upstream/ui/apps/platform/src/css/*.css src/styles/

# Copy images/logos
cp stackrox-upstream/ui/apps/platform/src/images/*.svg src/assets/
cp stackrox-upstream/ui/apps/platform/src/images/*.ico public/
```

## Common Patterns from StackRox

### Masthead/Header
- Location: `stackrox-upstream/ui/apps/platform/src/Containers/MainPage/Header/`
- Uses: PatternFly Masthead, BrandLogo component

### Navigation Sidebar
- Location: `stackrox-upstream/ui/apps/platform/src/Containers/MainPage/Navigation/`
- Uses: PatternFly Nav, NavExpandable

### Vulnerabilities Pages
- Location: `stackrox-upstream/ui/apps/platform/src/Containers/Vulnerabilities/`
- Subfolders: WorkloadCves, NodeCves, PlatformCves, etc.

### Filter/Search Components
- Location: `stackrox-upstream/ui/apps/platform/src/Components/CompoundSearchFilter/`

## Tips for Fast Prototyping

1. **Start with PatternFly components** - They match StackRox styling
2. **Copy structure from upstream** - Don't reinvent patterns
3. **Use Figma screenshots** - Save them in `figma-exports/` for reference
4. **Keep prototype code simple** - Focus on visual fidelity, not full functionality
5. **Use mock data** - See `src/mockData.js` for realistic StackRox data structure

## Mock Data

The `src/mockData.js` file contains realistic StackRox data:
- **CLUSTERS** - 4 clusters with health status, labels, counts
- **NAMESPACES** - 8 namespaces across clusters
- **DEPLOYMENTS** - 12 deployments with vulnerability counts
- **CVES** - 6 sample CVEs with severity, CVSS scores
- **SAVED_FILTERS** - 5 pre-configured filters

This data structure matches the real StackRox API responses, making it easy to:
- Test filter interactions
- Verify UI with realistic data volumes
- Eventually connect to a real StackRox backend

## Safety Notes

- The `stackrox-upstream/` folder is READ-ONLY reference material
- You cannot push to the StackRox GitHub repo (no write access)
- All your prototype code lives in `src/` - this is YOUR code
- Git operations (clone, pull) only download data, never upload

## Adding New Pages

1. Create a new file in `src/pages/NewPage.jsx`
2. Look at `stackrox-upstream/ui/apps/platform/src/Containers/` for patterns
3. Import components from PatternFly 6
4. Add mock data to `src/mockData.js` if needed
5. Add routing in `src/App.jsx` (use react-router-dom if multi-page)
