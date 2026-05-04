import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Grid,
  GridItem,
  List,
  ListItem,
  Icon,
  Label,
  Flex,
  FlexItem,
  Divider,
  ExpandableSection,
  ClipboardCopy,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  BookOpenIcon,
  CodeIcon,
  BugIcon,
  SearchIcon,
  WrenchIcon,
  ListIcon,
  DownloadIcon,
  OutlinedBookmarkIcon,
} from '@patternfly/react-icons';
import '../styles/guide.css';

const GUIDE_MARKDOWN_PATH = '/docs/getting-started-guide.md';

function PhaseCard({ phase, title, roles, color, icon, children }) {
  return (
    <Card className="guide-phase-card" isCompact>
      <CardHeader className={`guide-phase-header guide-phase-header--${color}`}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
          <FlexItem>
            <Icon size="lg" style={{ color: '#fff' }}>{icon}</Icon>
          </FlexItem>
          <FlexItem>
            <Label color={color} isCompact>Phase {phase}</Label>
          </FlexItem>
          <FlexItem>
            <span className="guide-phase-title">{title}</span>
          </FlexItem>
        </Flex>
        <Content component="small" className="guide-phase-roles">{roles}</Content>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function PitfallCard({ title, symptom, prevention }) {
  return (
    <Card className="guide-pitfall-card" isPlain isCompact>
      <CardBody>
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
              <Icon status="warning"><ExclamationTriangleIcon /></Icon>
              <strong>{title}</strong>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Content component="small"><strong>Symptom:</strong> {symptom}</Content>
          </FlexItem>
          <FlexItem>
            <Content component="small">
              <Icon status="success" size="sm"><CheckCircleIcon /></Icon>{' '}
              <strong>Fix:</strong> {prevention}
            </Content>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
}

function TemplateBlock({ title, template }) {
  return (
    <ExpandableSection toggleText={title} className="guide-template-section">
      <ClipboardCopy isCode isReadOnly variant="expansion" hoverTip="Copy" clickTip="Copied">
        {template}
      </ClipboardCopy>
    </ExpandableSection>
  );
}

export default function GuidePage() {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = GUIDE_MARKDOWN_PATH;
    link.download = 'ACS-Prototype-Getting-Started-Guide.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="guide-page">
      <div className="guide-content">
        {/* Hero */}
        <PageSection className="guide-hero">
          <div className="guide-hero-topright">
            <Button variant="secondary" onClick={() => navigate('/')} icon={<ArrowLeftIcon />} className="guide-hero-btn">
              Back to Prototypes
            </Button>
            <Button variant="secondary" onClick={() => navigate('/guide/general')} icon={<ArrowRightIcon />} className="guide-hero-btn">
              Universal Guide
            </Button>
            <Button variant="primary" onClick={handleDownload} icon={<DownloadIcon />} className="guide-hero-btn">
              Download Guide
            </Button>
          </div>
          <div className="guide-hero-content">
            <Label color="red" className="guide-hero-label">Designer + Agent Workflow</Label>
            <Title headingLevel="h1" size="4xl" className="guide-hero-title">
              Getting Started Guide
            </Title>
            <Content className="guide-hero-subtitle">
              Master clear, structured communication with the AI agent to produce prototypes that match
              your design vision—leverage agent roles and avoid common pitfalls when building high-fidelity RHACS prototypes.
            </Content>
          </div>
        </PageSection>

        <Divider />

        {/* Section 1: How It Works */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" status="info"><InfoCircleIcon /></Icon>
            <Title headingLevel="h2" size="2xl">How This Prototyping Workflow Works</Title>
          </Flex>
          <Content className="guide-section-intro">
            This workspace uses <strong>React + PatternFly 6</strong> with AI agents organized in 8 specialized roles across 3 phases.
            Each role handles a specific part of the prototype lifecycle.
          </Content>
          <Grid hasGutter className="guide-phases-grid">
            <GridItem md={4}>
              <PhaseCard phase="1" title="Kickstart" roles="Design Analyst, Scaffold Architect, Reference Inspector" color="blue" icon={<SearchIcon />}>
                <List isPlain>
                  <ListItem><Icon status="info" size="sm"><CheckCircleIcon /></Icon> Extract designs from Figma via MCP</ListItem>
                  <ListItem><Icon status="info" size="sm"><CheckCircleIcon /></Icon> Scaffold project structure and routes</ListItem>
                  <ListItem><Icon status="info" size="sm"><CheckCircleIcon /></Icon> Inspect upstream StackRox patterns</ListItem>
                </List>
              </PhaseCard>
            </GridItem>
            <GridItem md={4}>
              <PhaseCard phase="2" title="Build" roles="Component Builder, API Engineer, Interaction Developer" color="green" icon={<CodeIcon />}>
                <List isPlain>
                  <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Implement PF6 pages from specs</ListItem>
                  <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Connect mock + live API data</ListItem>
                  <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Wire interactive behaviors</ListItem>
                </List>
              </PhaseCard>
            </GridItem>
            <GridItem md={4}>
              <PhaseCard phase="3" title="Maintain" roles="QA Auditor, Bug Triage & Version Manager" color="orange" icon={<WrenchIcon />}>
                <List isPlain>
                  <ListItem><Icon status="warning" size="sm"><CheckCircleIcon /></Icon> Run visual and data parity tests</ListItem>
                  <ListItem><Icon status="warning" size="sm"><CheckCircleIcon /></Icon> Diagnose and fix bugs</ListItem>
                  <ListItem><Icon status="warning" size="sm"><CheckCircleIcon /></Icon> Manage version forks safely</ListItem>
                </List>
              </PhaseCard>
            </GridItem>
          </Grid>
        </PageSection>

        <Divider />

        {/* Section 2: Communicating Effectively with the Agent */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg"><BookOpenIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Communicating Effectively with the Agent</Title>
          </Flex>
          <Content className="guide-section-intro">
            Prototype fidelity depends on clarity and precision in how design intent is described.
            The patterns below come from real sessions where ambiguity drove unnecessary rework.
          </Content>

          <Grid hasGutter>
            <GridItem md={6}>
              <Card className="guide-prompt-card guide-prompt-card--bad">
                <CardHeader>
                  <CardTitle><Label color="red" isCompact>Avoid</Label> Vague instructions</CardTitle>
                </CardHeader>
                <CardBody>
                  <Content component="blockquote">"Build the reports page"</Content>
                  <Content component="small" className="guide-prompt-why">
                    Missing context leaves the agent guessing—omitting Figma references, frame states, toolbar order, or component specifics results in misinterpretation.
                  </Content>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card className="guide-prompt-card guide-prompt-card--good">
                <CardHeader>
                  <CardTitle><Label color="green" isCompact>Do</Label> Precise, structured briefings</CardTitle>
                </CardHeader>
                <CardBody>
                  <Content component="blockquote">
                    "Build the Reports page from this Figma link [url]. Frame 1 shows the default table view.
                    Frame 2 shows the filter dropdown open. Toolbar controls from left to right: Name, Report status,
                    [separator], Apply button. The table should display columns side by side, not stacked."
                  </Content>
                  <Content component="small" className="guide-prompt-why">
                    A structured briefing ties each frame to a state, spells out the toolbar order, and describes the expected visual behavior.
                  </Content>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Title headingLevel="h3" size="xl" className="guide-subsection-title">5 Principles for Effective Agent Communication</Title>
          <Grid hasGutter>
            <GridItem md={6} lg={4}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="blue" isCompact>Rule 1</Label>
                    <strong>Share the Figma link to the specific frame</strong>
                    <Content component="small">The agent can read Figma files directly, but it needs the exact link to the page or frame you are referring to — not just the project URL.</Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6} lg={4}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="blue" isCompact>Rule 2</Label>
                    <strong>Map each frame to its interactive state</strong>
                    <Content component="small">Clarify which Figma frame represents the default view, which shows a dropdown open, which is the modal confirmation—the agent cannot infer state transitions from static frames alone.</Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6} lg={4}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="blue" isCompact>Rule 3</Label>
                    <strong>Specify the toolbar order explicitly</strong>
                    <Content component="small">Describe controls from left to right exactly as they appear in Figma. Misaligned toolbar order has been the single most recurring source of rework across all prototyping sessions.</Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6} lg={4}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="blue" isCompact>Rule 4</Label>
                    <strong>Differentiate similar-sounding concepts</strong>
                    <Content component="small">Terms like &apos;saved filters&apos; can refer to entirely different behaviors depending on context. If two concepts share a name, define each one explicitly and state where each lives in the UI.</Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6} lg={4}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="blue" isCompact>Rule 5</Label>
                    <strong>Describe the UI patterns you expect</strong>
                    <Content component="small">Tell the agent what the interface should look and behave like — a table with columns that stay side by side, rows that expand to reveal details, a dialog with a title and action buttons, or a dropdown triggered by a button.</Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6} lg={4}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="orange" isCompact>Bonus</Label>
                    <strong>Point to upstream reference code</strong>
                    <Content component="small">When the prototype must mirror production behavior, cite specific paths under stackrox-upstream/ so the agent inspects the right StackRox patterns.</Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </PageSection>

        <Divider />

        {/* Section 3: Communication Templates */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg"><ListIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Communication Templates</Title>
          </Flex>
          <Content className="guide-section-intro">
            Use these structured templates as a starting point when briefing the agent. Fill in the details specific to your feature.
          </Content>
          <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
            <TemplateBlock title="Kickstart — New Prototype Briefing" template={`Figma URL: [paste URL with node-id]

Frames and states:
- Frame "[name]": [description of what state this represents]
- Frame "[name]": [description]

Key interactions:
- [Describe dropdowns, modals, navigation flows]

Toolbar/filter order (left to right):
- [Control 1], [Control 2], [Separator], [Control 3]

Components I expect:
- [Table / Wizard / Modal / Tabs / etc.]

Match upstream pattern from:
- [stackrox-upstream path, if applicable]`} />
            <TemplateBlock title="Build — Page Implementation Briefing" template={`Page: [PageName] at route /vN/main/[path]

Data requirements:
- Table columns: [list exactly]
- Filter attributes: [list in order]
- Sort columns: [list which are sortable]

Interactive behaviors:
- [Describe each interactive element and its states]
- [Describe navigation flows and what information carries between pages]

Sample data: [Describe what data to show or point to existing sample data]

Live data:
- Endpoint: [API path, if connecting to a real server]
- Preserve all sample data (saved filters, reports) when connecting to the live API
- Data should refresh automatically after syncing — no manual page reload needed`} />
            <TemplateBlock title="Fork — Version Branching Briefing" template={`Base version: v[N] (fork from this)
New version: v[N+1]

What changes in v[N+1]:
- [List specific differences]

What stays the same:
- [List what must NOT change from base]

Critical: Do not break v[N] when creating v[N+1].
Update VersionSelector with clear description of differences.`} />
          </Flex>
        </PageSection>

        <Divider />

        {/* Section 4: Common Pitfalls */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" status="warning"><BugIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Common Pitfalls & Fixes</Title>
          </Flex>
          <Content className="guide-section-intro">
            These issues have surfaced repeatedly across prototyping sessions. Understanding them ahead of time prevents unnecessary iteration cycles.
          </Content>
          <Grid hasGutter>
            <GridItem md={6}>
              <PitfallCard
                title="Wrong Toolbar / Filter Order"
                symptom="Filters appear in different sequence than Figma"
                prevention="Communicate filter controls left-to-right as in Figma and name the frame they come from."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Saved Filters Ambiguity"
                symptom="Agent removes results-page carry-over when asked to remove wizard scope"
                prevention="Clearly describe which 'saved filters' you mean — the one inside the wizard as a scope option, or the one on the results page that carries selected filters into the wizard."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Table Columns Stack Vertically"
                symptom="Table columns appear on top of each other instead of side by side"
                prevention="Tell the agent that table columns should stay in a horizontal row on desktop screens, not collapse into a vertical stack."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Expandable Rows Don't Work"
                symptom="Clicking a row's expand button does nothing or detail content doesn't appear"
                prevention="Describe the behavior: clicking a row should reveal additional detail below it, and clicking again should collapse it back."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Dead Links and Controls"
                symptom="Masthead icons, buttons do nothing when clicked"
                prevention="State clearly that every control needs a click handler or a disabled state with a tooltip."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Live Data Doesn't Refresh"
                symptom="UI shows stale data after syncing with the live API until you manually reload the page"
                prevention="Tell the agent that data should update automatically after syncing — the user should never need to manually refresh the page."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Sample Data Disappears"
                symptom="Saved filters, reports, and other sample data vanish when the real API connects"
                prevention="Ask the agent to keep all existing sample data (saved filters, reports, named items) intact when connecting to the live API — don't silently remove them."
              />
            </GridItem>
            <GridItem md={6}>
              <PitfallCard
                title="Version Conflicts"
                symptom="Changes to v3 break v1 or v2"
                prevention="Specify that changes to vN must not affect earlier versions and confirm routes stay isolated."
              />
            </GridItem>
          </Grid>
        </PageSection>

        <Divider />

        {/* Section 5: Pre-Session Briefing Checklist */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" status="success"><OutlinedBookmarkIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Pre-Session Briefing Checklist</Title>
          </Flex>
          <Content className="guide-section-intro">
            Before starting a conversation with the agent about building a page, confirm that you can provide these details.
          </Content>
          <Card className="guide-checklist-card">
            <CardBody>
              <Grid hasGutter>
                <GridItem md={6}>
                  <List isPlain>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Figma link to the specific frame or page</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Which frame shows which state (default view, dropdown open, etc.)</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Toolbar and filter order (left to right, matching Figma)</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Table columns and which ones are sortable</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Interactive elements and their behaviors</ListItem>
                  </List>
                </GridItem>
                <GridItem md={6}>
                  <List isPlain>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Navigation flows and what information transfers between pages</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Reference to existing product behavior (if matching production)</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Expected UI patterns (tables, step-by-step wizards, dialogs, dropdowns)</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Sample data needs or live API endpoints</ListItem>
                    <ListItem><Icon status="success" size="sm"><CheckCircleIcon /></Icon> Version safety: "don't break other versions"</ListItem>
                  </List>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </PageSection>

        {/* Footer */}
        <PageSection className="guide-footer" variant="darker">
          <Flex justifyContent={{ default: 'justifyContentCenter' }} alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
            <Content component="small" style={{ opacity: 0.6 }}>
              ACS Prototype Getting Started Guide &middot; Red Hat User Experience Design &middot; HPUX-1160
            </Content>
          </Flex>
        </PageSection>
      </div>
    </div>
  );
}
