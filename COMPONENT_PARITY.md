# Component & UI/UX Parity Audit

**Generated:** March 30, 2026
**Design System:** PatternFly 6 (`@patternfly/react-core@^6.4.1`, `@patternfly/react-icons@^6.4.0`, `@patternfly/react-table@^6.4.1`)
**React:** `^18.3.1` | **Router:** `react-router-dom@^7.13.2` | **Build:** Vite 5

---

## 1. Reusable Component Catalog

### Shell Components (`src/components/`)

| Component | File | Props | PF Components Used | Design Tokens | Match |
|-----------|------|-------|--------------------|---------------|-------|
| **AppMasthead** | `src/components/AppMasthead.jsx` | `dashboardPath` | `Masthead`, `MastheadBrand`, `MastheadContent`, `MastheadLogo`, `MastheadMain`, `MastheadToggle`, `PageToggleButton`, `Button`, `Dropdown`, `DropdownList`, `DropdownItem`, `MenuToggle`, `Flex`, `FlexItem` | `--pf-t--global--spacer--md` (masthead padding) | Yes |
| **NavigationSidebar** | `src/components/NavigationSidebar.jsx` | `routes`, `version` | `Nav`, `NavExpandable`, `NavItem`, `NavList`, `PageSidebar`, `PageSidebarBody` | Inherits PF nav tokens | Yes |
| **ApiStatusBadge** | `src/components/ApiStatusBadge.jsx` | *(none)* | `Label`, `Tooltip` | PF `Label` color API (`green`, `blue`, `orange`, `red`, `grey`) | Yes |

### Inline Page Components (defined within page files)

| Component | File(s) | Purpose | Tokens | Match |
|-----------|---------|---------|--------|-------|
| **SeverityBadge** | `UserWorkloadVulnerabilities.jsx`, `v2/V2UserWorkloadVulnerabilities.jsx` | Severity count with icon | `--pf-t--global--color--status--danger/warning/info--default`, `--pf-t--global--text--color--subtle` | Yes |
| **CompoundSearchFilter** | `UserWorkloadVulnerabilities.jsx`, `v2/V2UserWorkloadVulnerabilities.jsx` | Multi-category filter toolbar | PF `Toolbar`, `TextInputGroup`, `Select`, `Label` | Yes |
| **DefaultFilterModal** | `UserWorkloadVulnerabilities.jsx`, `v2/V2UserWorkloadVulnerabilities.jsx` | Default CVSS/fixability filter config | PF `Modal`, `Checkbox` | Yes |
| **ManageSavedFiltersModal** | `UserWorkloadVulnerabilities.jsx` | CRUD for saved vulnerability filters | PF `Modal`, `TextInput`, `Label`, `Table` | Yes |
| **ManageSavedFiltersModalV2** | `v2/V2UserWorkloadVulnerabilities.jsx` | V2 saved filter management | PF `Modal`, `TextInput`, `Label` | Yes |
| **ScopeDefineToolbar** | `CreateReportWizard.jsx`, `v2/V2CreateReportWizard.jsx` | Scope selection toolbar for reports | PF `Toolbar`, `Select`, `MenuToggle` | Yes |
| **ReportCompoundFilter** | `CreateReportWizard.jsx` | Report-scoped compound filter | PF `Toolbar`, `TextInputGroup` | Yes |
| **CveCompoundFilter** | `v2/V2CreateReportWizard.jsx` | CVE-specific compound filter (V2) | PF `Toolbar`, `TextInputGroup` | Yes |
| **ReportActionsDropdown** | `VulnerabilityReportingPage.jsx` | Per-report kebab actions | PF `Dropdown`, `MenuToggle` | Yes |
| **ReportRowActionsDropdown** | `v2/V2ReportsPage.jsx` | Per-report kebab actions (V2) | PF `Dropdown`, `MenuToggle` | Yes |
| **HealthStatusIcon** | `SystemHealthPage.jsx` | Status label with icon | PF `Label` color API | Yes |
| **SummaryCounts** | `DashboardPage.jsx` | Top-bar summary metric counts | PF `Split`, `Button`, utility classes | Yes |
| **ScopeBar** | `DashboardPage.jsx` | Cluster/namespace scope selector | PF `Select`, `MenuToggle` | Yes |
| **ViolationsBySeverityCard** | `DashboardPage.jsx` | Severity violation card | Status tokens | Yes |
| **ImagesAtMostRiskCard** | `DashboardPage.jsx` | Top risky images card | Status tokens | Yes |
| **DeploymentsAtMostRiskCard** | `DashboardPage.jsx` | Top risky deployments card | Status tokens | Yes |
| **AgingImagesCard** | `DashboardPage.jsx` | Aging images bar chart | Status tokens | Yes |
| **PolicyViolationsByCategoryCard** | `DashboardPage.jsx` | Policy violations by category | Status tokens | Yes |
| **ComplianceByStandardCard** | `DashboardPage.jsx` | Compliance progress bars | Status tokens | Yes |

---

## 2. Per-Page Parity Audit

### Pages with Full Match (Yes)

| Page | File | Notes |
|------|------|-------|
| Access Control | `AccessControlPage.jsx` | PF Tabs, Table, Modal — all token-based |
| Administration Events | `AdministrationEventsPage.jsx` | PF Table, Pagination, SearchInput |
| Clusters | `ClustersPage.jsx` | PF Table, Alert, Modal, Progress — no hex |
| Collections | `CollectionsPage.jsx` | PF Table, Modal, Form — no hex |
| Compliance Coverage | `ComplianceCoveragePage.jsx` | PF Table, ToggleGroup, Progress |
| Compliance Schedules | `ComplianceSchedulesPage.jsx` | PF Table, Select, Alert |
| CVE Detail | `CveDetailPage.jsx` | PF Nav subnav, Breadcrumb, Table, Card |
| Deployment Detail | `DeploymentDetailPage.jsx` | PF Tabs, Table, Toolbar — no hex |
| Exception Management | `ExceptionManagementPage.jsx` | PF Table, Tabs, Modal |
| Integrations | `IntegrationsPage.jsx` | PF Tabs, Card grid |
| Listening Endpoints | `ListeningEndpointsPage.jsx` | PF Table, Toolbar |
| Node CVEs | `NodeCvesPage.jsx` | PF Nav subnav, Table, Toolbar |
| Placeholder | `PlaceholderPage.jsx` | PF EmptyState (current API) |
| Platform CVEs | `PlatformCvesPage.jsx` | PF Nav subnav, Table, Toolbar |
| Policies | `PoliciesPage.jsx` | PF Tabs, Table, Alert, Modal |
| Report Detail | `ReportDetailPage.jsx` | PF Tabs, DescriptionList, LabelGroup, Stack |
| Reports (V1) | `VulnerabilityReportingPage.jsx` | PF Table, Toolbar, Alert |
| Reports (V2) | `v2/V2ReportsPage.jsx` | PF Table, EmptyState, Alert |
| Risk | `RiskPage.jsx` | PF Table, Toolbar |
| Saved Filter Detail (V2) | `v2/V2SavedFilterDetail.jsx` | PF Table, Breadcrumb |
| System Config | `SystemConfigPage.jsx` | PF Card, DescriptionList, Alert |
| System Health | `SystemHealthPage.jsx` | PF Card, Label, Spinner, Alert |
| User Workloads (V1) | `UserWorkloadVulnerabilities.jsx` | PF Nav subnav, Table, Toolbar, compound filter |
| User Workloads (V2) | `v2/V2UserWorkloadVulnerabilities.jsx` | PF Nav subnav, Table, Toolbar, compound filter |
| Violation Detail | `ViolationDetailPage.jsx` | PF Tabs, Breadcrumb, Table, Card |
| Violations | `ViolationsPage.jsx` | PF Tabs, Table, Toolbar, Select |
| All Vulnerabilities | `AllVulnerabilitiesPage.jsx` | PF Nav subnav, Table, Toolbar |

### Pages with Fixes Applied (Previously Partial, Now Yes)

| Page | File | Issue | Fix Applied |
|------|------|-------|-------------|
| **Config Management** | `ConfigManagementPage.jsx` | `#fff` white text on severity tile; `#eee` compliance track | Replaced with `--pf-t--global--text--color--on-brand--default` and `--pf-t--global--background--color--secondary--default` |
| **Dashboard** | `DashboardPage.jsx` | `#fff` severity tile text; `#F2F2F2` pill bg; `#F0F0F0` compliance track | Replaced with `--pf-t--global--text--color--on-brand--default` and `--pf-t--global--background--color--secondary--default` |
| **Network Graph** | `NetworkGraphPage.jsx` | `#1b1d21` dark bg; `#fff` text; `#4394e5` blue border; `#999` muted text; `rgba(67,148,229,0.1)` bg | Replaced with `--pf-t--global--background--color--primary--default`, `--pf-t--global--text--color--regular`, `--pf-t--global--color--status--info--default`, `--pf-t--global--text--color--subtle`, `--pf-t--global--background--color--status--info/success--default` |
| **AppMasthead** | `src/components/AppMasthead.jsx` | `paddingRight: '16px'` hardcoded pixel spacing | Replaced with `--pf-t--global--spacer--md` |

### Pages with Intentional Hex (Not a Bug)

| Page | File | Hex Values | Reason |
|------|------|-----------|--------|
| **Version Selector** | `VersionSelector.jsx` | `#1a1a2e`, `#16213e`, `#0f3460`, `#fff`, `#004080`, `#006EC7`, `#A30000` | Custom splash/landing page with branded gradients — not part of the StackRox product UI |
| **Create Report Wizard (V1)** | `CreateReportWizard.jsx` | `#fff`, `#f0f0f0` | Used as CSS variable fallbacks only (`var(--pf-token, #fallback)`) — resolves to token at runtime |
| **Create Report Wizard (V2)** | `v2/V2CreateReportWizard.jsx` | `#fff`, `#f0f0f0` | Same — CSS variable fallbacks |

---

## 3. Interactive States Audit

### Hover States

| Component | Hover Behavior | Match |
|-----------|---------------|-------|
| PF `Button` (all variants) | Inherits PF hover tokens automatically | Yes |
| PF `Nav > NavItem` (horizontal-subnav) | Pill hover effect from PF base CSS | Yes |
| PF `Tabs > Tab` | Underline/highlight from PF base CSS | Yes |
| PF `Table > Tr` | Row hover highlight (PF default) | Yes |
| PF `Dropdown > DropdownItem` | Menu item highlight (PF default) | Yes |
| PF `Select > SelectOption` | Option highlight (PF default) | Yes |
| PF `MenuToggle` | Toggle hover (PF default) | Yes |
| PF `Label` (clickable) | PF label hover | Yes |
| PF `SearchInput` | Input focus ring (PF default) | Yes |
| Custom suggestion rows (report wizard) | `onMouseEnter`/`onMouseLeave` with `--pf-t--global--background--color--primary--hover` fallback | Yes |
| Dashboard severity tiles | Wrapped in `Button variant="plain"` — PF hover | Yes |

### Focus States

| Component | Focus Behavior | Match |
|-----------|---------------|-------|
| All PF `Button` variants | Focus ring via `--pf-t--global--border--color--clicked` | Yes |
| PF `TextInput`, `TextArea`, `SearchInput` | Blue focus border (PF default) | Yes |
| PF `Select` / `MenuToggle` | Focus outline (PF default) | Yes |
| PF `Checkbox`, `Radio` | Focus ring (PF default) | Yes |
| PF `Tab` | Focus outline + tab indicator | Yes |
| PF `NavItem` | Focus ring on pill shape | Yes |

### Active/Selected States

| Component | Active Behavior | Match |
|-----------|----------------|-------|
| PF `NavItem isActive` | Bold text + pill background | Yes |
| PF `Tab isActive` | Bottom border highlight | Yes |
| PF `ToggleGroupItem isSelected` | Filled background | Yes |
| PF `Select isOpen` | Expanded with chevron flip | Yes |
| PF `Dropdown isOpen` | Expanded menu below | Yes |

### Disabled States

| Component | Disabled Behavior | Match |
|-----------|------------------|-------|
| PF `Button isDisabled` | Muted color + no pointer events | Yes |
| PF `ToggleGroupItem` (selected + disabled) | Custom CSS in `acs.css` preserves selected color | Yes |
| PF `TextInput isDisabled` | Grayed-out input | Yes |
| Wizard steps (future) | Grayed step title (PF Wizard default) | Yes |

### Loading States

| Component | Loading Behavior | Match |
|-----------|-----------------|-------|
| `Bullseye > Spinner` | Centered spinner during data fetch | Yes |
| `Skeleton` (workload pages) | PF Skeleton shimmer placeholders for table rows | Yes |
| PF `Progress` (clusters, compliance) | Animated fill bar | Yes |

### Error States

| Component | Error Behavior | Match |
|-----------|---------------|-------|
| `EmptyState status="danger"` | Error icon + message + retry action | Yes |
| `Alert variant="danger"` | Red alert banner with close button | Yes |
| `Alert variant="success"` | Green confirmation alert | Yes |
| Form validation (Formik + Yup) | Red error text below fields | Yes |

---

## 4. Responsive Behavior Audit

PatternFly 6 handles responsive behavior through its built-in grid/flex system. The prototype uses PF layout components (`Flex`, `Split`, `Stack`, `Gallery`, `Grid`) which are inherently responsive.

### Breakpoint Behavior

| Breakpoint | Behavior | Match |
|-----------|----------|-------|
| **375px** (mobile) | PF `PageSidebar` collapses to hamburger menu. Content stacks vertically. Tables scroll horizontally. `Gallery minWidths` wraps cards to single column. | Yes |
| **768px** (tablet) | Sidebar remains collapsed or togglable. Dashboard cards stack 1-2 per row. Toolbar items wrap. | Yes |
| **1024px** (small desktop) | Sidebar visible. Dashboard shows 2-column layout. Tables display all columns. | Yes |
| **1440px** (large desktop) | Full layout. Dashboard shows 2-3 column grid. No wasted space. | Yes |

### Components That Could Break at Small Viewports

| Component | Breakpoint | Issue | Status |
|-----------|-----------|-------|--------|
| Compound filter toolbar | < 768px | Filter chips may overflow — PF `Toolbar` wraps naturally | OK |
| Report wizard steps | < 768px | PF `Wizard` stacks step nav vertically below `md` breakpoint | OK |
| `Table` (all pages) | < 768px | Horizontal scroll via browser overflow — PF does not truncate columns | Acceptable |
| Dashboard widget gallery | 375px | `minWidths: '350px'` may cause horizontal scroll at 375px viewport | Minor |
| Version Selector cards | 375px | `minWidths: '380px'` exceeds 375px viewport — horizontal scroll | Minor |

---

## 5. Animations & Transitions Audit

### PatternFly Built-in Transitions

| Animation | Component | Duration/Easing | Trigger | Match |
|-----------|-----------|-----------------|---------|-------|
| Sidebar expand/collapse | `PageSidebar` | `250ms ease-in-out` (PF default) | Hamburger toggle | Yes |
| Dropdown open/close | `Dropdown`, `Select` | `250ms ease-in-out` (PF default) | Toggle click | Yes |
| Modal overlay + slide | `Modal` | `250ms ease-in` fade + slide (PF default) | Open/close trigger | Yes |
| Tab indicator slide | `Tabs` | `250ms ease` underline position (PF default) | Tab switch | Yes |
| Spinner rotation | `Spinner` | Infinite CSS `@keyframes spin` 750ms linear | Data loading | Yes |
| Skeleton shimmer | `Skeleton` | CSS gradient animation (PF default) | Placeholder | Yes |
| Progress bar fill | `Progress` | Width transition `300ms ease` (PF default) | Value change | Yes |
| Tooltip fade | `Tooltip` | `200ms ease` opacity (PF default) | Hover trigger | Yes |
| Alert slide-in | `Alert` (in groups) | `300ms ease` slide (PF default) | Show/dismiss | Yes |

### Custom Animations

| Animation | Location | Duration/Easing | Trigger | Match |
|-----------|----------|-----------------|---------|-------|
| API sync icon spin | `ApiStatusBadge` | PF utility class `pf-v6-u-spin` (inherits PF keyframes) | Sync in progress | Yes |
| Network graph mock | `NetworkGraphPage` | None — static layout | N/A | N/A |
| Dashboard scrollbar force | `acs.css` | `overflow-y: scroll !important` — prevents Victory chart resize flicker | Page load | Fix for known PF/Victory interaction |

### Missing Animations (vs. Live Product)

| Feature | Live Product | Prototype | Gap |
|---------|-------------|-----------|-----|
| Network graph node transitions | D3/Canvas animation | Static mock boxes | Expected — full graph engine not replicated |
| Compliance chart animations | Victory.js transitions | Static progress bars | Expected — charting library not included |
| Dashboard chart hover tooltips | Victory.js hover tooltips | Static values | Expected — prototype uses inline data |

---

## 6. Summary Table

| Component / Page | Match Level | Issue | Fix Applied |
|------------------|-------------|-------|-------------|
| AppMasthead | Yes | Hardcoded `16px` padding | Replaced with `--pf-t--global--spacer--md` |
| NavigationSidebar | Yes | — | — |
| ApiStatusBadge | Yes | — | — |
| DashboardPage | Yes | `#fff`, `#F2F2F2`, `#F0F0F0` hex colors | Replaced with PF tokens |
| ConfigManagementPage | Yes | `#fff`, `#eee` hex colors | Replaced with PF tokens |
| NetworkGraphPage | Yes | `#1b1d21`, `#fff`, `#4394e5`, `#999`, `rgba()` hex colors | Replaced with PF tokens |
| ViolationsPage | Yes | — | — |
| ViolationDetailPage | Yes | — | — |
| UserWorkloadVulnerabilities | Yes | — | — |
| V2UserWorkloadVulnerabilities | Yes | — | — |
| CveDetailPage | Yes | — | — |
| DeploymentDetailPage | Yes | — | — |
| PlatformCvesPage | Yes | — | — |
| NodeCvesPage | Yes | — | — |
| AllVulnerabilitiesPage | Yes | — | — |
| VulnerabilityReportingPage | Yes | — | — |
| V2ReportsPage | Yes | — | — |
| ReportDetailPage | Yes | — | — |
| CreateReportWizard | Yes | `#fff`, `#f0f0f0` used as CSS var fallbacks only | Acceptable — tokens resolve at runtime |
| V2CreateReportWizard | Yes | `#fff`, `#f0f0f0` used as CSS var fallbacks only | Acceptable — tokens resolve at runtime |
| ClustersPage | Yes | — | — |
| PoliciesPage | Yes | — | — |
| CollectionsPage | Yes | — | — |
| ComplianceCoveragePage | Yes | — | — |
| ComplianceSchedulesPage | Yes | — | — |
| ExceptionManagementPage | Yes | — | — |
| IntegrationsPage | Yes | — | — |
| AccessControlPage | Yes | — | — |
| SystemConfigPage | Yes | — | — |
| SystemHealthPage | Yes | — | — |
| RiskPage | Yes | — | — |
| ListeningEndpointsPage | Yes | — | — |
| AdministrationEventsPage | Yes | — | — |
| PlaceholderPage | Yes | — | — |
| V2SavedFilterDetail | Yes | — | — |
| VersionSelector | N/A | Custom branded splash page — intentional hex colors | Not part of StackRox product UI |

---

## 7. Inline Style Density

Pages ranked by number of `style={{...}}` occurrences (potential candidates for CSS class extraction):

| Page | Inline Styles | Priority |
|------|--------------|----------|
| DashboardPage | 68 | High — consider extracting to `dashboard.css` |
| CreateReportWizard | 54 | Medium — wizard step layouts |
| V2CreateReportWizard | 42 | Medium — same pattern |
| DeploymentDetailPage | 35 | Medium |
| VersionSelector | 29 | Low — standalone page |
| ViolationDetailPage | 27 | Medium |
| UserWorkloadVulnerabilities | 23 | Medium |
| NetworkGraphPage | 22 | Low — mock graph layout |
| V2UserWorkloadVulnerabilities | 19 | Medium |
| ConfigManagementPage | 19 | Medium |
| CveDetailPage | 17 | Medium |
| ComplianceCoveragePage | 15 | Low |
| ExceptionManagementPage | 15 | Low |
| ClustersPage | 18 | Low |
| PoliciesPage | 11 | Low |
| CollectionsPage | 9 | Low |

---

## 8. Design Token Coverage

### Tokens Actively Used

| Token Category | Examples | Coverage |
|---------------|----------|----------|
| **Status colors** | `--pf-t--global--color--status--danger/warning/info/success--default` | 100% — all severity/status indicators |
| **Text colors** | `--pf-t--global--text--color--regular`, `--pf-t--global--text--color--subtle`, `--pf-t--global--text--color--on-brand--default` | 100% |
| **Background colors** | `--pf-t--global--background--color--primary/secondary--default` | 100% |
| **Border colors** | `--pf-t--global--border--color--default` | 100% |
| **Spacing** | `--pf-t--global--spacer--md` (masthead); PF props `gap`, `padding` | Partial — many px values inline |
| **Component tokens** | `--pf-v6-c-toggle-group__button--m-selected--BackgroundColor/Color` (acs.css) | Used where needed |

### Token Gaps (Inline px that could use tokens)

| Pattern | Count | Token Alternative |
|---------|-------|-------------------|
| `padding: '16px'` / `padding: '24px'` | ~30 | `--pf-t--global--spacer--md` / `--pf-t--global--spacer--lg` |
| `marginBottom: '16px'` | ~20 | `--pf-t--global--spacer--md` |
| `fontSize: '12px'` / `'14px'` | ~15 | `--pf-t--global--font--size--xs` / `--pf-t--global--font--size--sm` |
| `fontWeight: 600` | ~10 | `--pf-t--global--font--weight--heading--bold` |
| `borderRadius: '4px'` / `'8px'` | ~8 | `--pf-t--global--border-radius--small` / `--pf-t--global--border-radius--medium` |
| `gap: '8px'` / `'16px'` | ~12 | PF `Flex gap` responsive props |

These are functional but could be migrated to tokens in a future refinement pass for full design system compliance.

---

## 9. CSS Files Summary

| File | Purpose | Token Usage |
|------|---------|-------------|
| `@patternfly/react-core/dist/styles/base.css` | PF6 base styles, tokens, component CSS | Complete PF token set |
| `src/styles/style.css` | `#root`, `#PageParent`, `#BodyRoutes` layout | `--pf-t--global--background--color--secondary--default` |
| `src/styles/acs.css` | PF overrides: toggle-group disabled, popover close, chrome-picker, dashboard scroll | `--pf-v6-c-toggle-group__button--m-selected--*`, `--pf-t--global--text--color--regular`, `--pf-v6-c-popover__close--sibling--PaddingInlineEnd` |
| `src/styles/light.theme.css` | Theme light custom properties | **Not imported** — dormant |
| `src/styles/dark.theme.css` | Theme dark custom properties | **Not imported** — dormant |
| `src/styles/trumps.css` | Migration/override utilities | **Not imported** — dormant |
