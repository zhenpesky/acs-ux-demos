import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Label,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  CommentsIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  HandshakeIcon,
  MapMarkerIcon,
  RedoIcon,
  HeartIcon,
} from '@patternfly/react-icons';
import '../styles/guide.css';

function TipCard({ icon, title, children, accent }) {
  return (
    <Card className="guide-rule-card" isCompact>
      <CardBody>
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
            <Icon size="md" style={{ color: accent }}>{icon}</Icon>
            <strong style={{ fontSize: '16px' }}>{title}</strong>
          </Flex>
          <Content component="div" style={{ fontSize: '15px', lineHeight: '1.65' }}>
            {children}
          </Content>
        </Flex>
      </CardBody>
    </Card>
  );
}

function ConversationCard({ bad, good, why }) {
  return (
    <Card isCompact style={{ marginBottom: '16px' }}>
      <CardBody>
        <Grid hasGutter>
          <GridItem md={5}>
            <Label color="red" isCompact>Instead of saying</Label>
            <Content component="blockquote" style={{ marginTop: '8px', opacity: 0.7 }}>{bad}</Content>
          </GridItem>
          <GridItem md={7}>
            <Label color="green" isCompact>Try something like</Label>
            <Content component="blockquote" style={{ marginTop: '8px' }}>{good}</Content>
          </GridItem>
        </Grid>
        {why && <Content component="small" style={{ display: 'block', marginTop: '12px', opacity: 0.6 }}>{why}</Content>}
      </CardBody>
    </Card>
  );
}

export default function GenericGuidePage() {
  const navigate = useNavigate();

  return (
    <div className="guide-page">
      <div className="guide-content">
        {/* Hero */}
        <PageSection className="guide-hero">
          <div className="guide-hero-topright">
            <Button variant="secondary" onClick={() => navigate('/guide')} icon={<ArrowLeftIcon />} className="guide-hero-btn">
              ACS-Specific Guide
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')} icon={<ArrowLeftIcon />} className="guide-hero-btn">
              Back to Prototypes
            </Button>
          </div>
          <div className="guide-hero-content">
            <Label color="blue" className="guide-hero-label">Universal Guide</Label>
            <Title headingLevel="h1" size="4xl" className="guide-hero-title">
              How to Talk to an AI Agent
            </Title>
            <Content className="guide-hero-subtitle">
              A friendly, practical guide for designers — applicable to any prototype project, any design system, any team.
              Think of this as a conversation cheat sheet for getting the best results from your AI collaborator.
            </Content>
          </div>
        </PageSection>

        <Divider />

        {/* Section 1: The Big Idea */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" style={{ color: '#006EC7' }}><LightbulbIcon /></Icon>
            <Title headingLevel="h2" size="2xl">The One Thing That Matters Most</Title>
          </Flex>
          <Content className="guide-section-intro" style={{ fontSize: '17px', lineHeight: '1.7' }}>
            Here's the honest truth: the agent is genuinely good at building things, but it can't read your mind.
            The gap between "what you pictured" and "what you got" almost always comes down to one thing —
            <strong> how clearly you described what you wanted</strong>.
          </Content>
          <Content style={{ fontSize: '16px', lineHeight: '1.7', maxWidth: '800px' }}>
            That doesn't mean you need to write a technical spec. It means you should talk to the agent the way
            you'd talk to a talented teammate who just joined the project today. They're skilled, they're eager,
            but they don't have the context that's been living in your head for weeks.
          </Content>
        </PageSection>

        <Divider />

        {/* Section 2: How to Describe What You Want */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" style={{ color: '#3e8635' }}><CommentsIcon /></Icon>
            <Title headingLevel="h2" size="2xl">How to Describe What You Want</Title>
          </Flex>
          <Content className="guide-section-intro">
            You don't need to speak code. Just be specific about what you see in your head. Here are real examples
            of how a small shift in how you describe things makes a huge difference.
          </Content>

          <ConversationCard
            bad={'"Make me a table page."'}
            good={'"I need a page with a data table. It should have 5 columns: Name, Status, Severity, Date, and Actions. The Name column should be sortable. Each row should be clickable to see more details."'}
            why="The agent doesn't know what table you're imagining. Five words of description save two rounds of back-and-forth."
          />
          <ConversationCard
            bad={'"Add a filter."'}
            good={'"Add a filter bar above the table. From left to right: a text search for Name, a dropdown for Status (with options Active, Inactive, Pending), and an Apply button on the far right."'}
            why="Filters are where most rework happens. Describing the order and options up front prevents the most common iteration loop."
          />
          <ConversationCard
            bad={'"It should look like the Figma."'}
            good={'"Here\'s the Figma link [url]. Frame 1 is the default view with everything collapsed. Frame 2 is what it looks like when a user opens the dropdown. Frame 3 is the confirmation dialog after submitting."'}
            why="The agent can read Figma, but it needs to know which frame shows which state. Static mockups don't tell a story by themselves."
          />
          <ConversationCard
            bad={'"Fix the layout, it looks wrong."'}
            good={'"The table columns are stacking vertically instead of sitting side by side. On desktop, they should all be in one horizontal row. The sidebar should be 240px wide and the main content should fill the rest."'}
            why={'"Looks wrong" can mean a hundred things. Describing what you see vs. what you expected gives the agent a clear fix target.'}
          />
        </PageSection>

        <Divider />

        {/* Section 3: Six Habits */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" style={{ color: '#c46100' }}><MapMarkerIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Six Habits of Designers Who Get Great Results</Title>
          </Flex>
          <Content className="guide-section-intro">
            These aren't rules — they're patterns we've noticed from designers who consistently get prototypes
            that match their vision on the first or second try.
          </Content>

          <Grid hasGutter>
            <GridItem md={6} lg={4}>
              <TipCard icon={<MapMarkerIcon />} title="1. Start with the Figma link" accent="#006EC7">
                Don't just say "build this page." Drop the Figma link and tell the agent which frame shows what.
                "Frame 1 is the default state, Frame 2 is when the dropdown is open, Frame 3 is the confirmation
                dialog." That one sentence eliminates most guesswork.
              </TipCard>
            </GridItem>
            <GridItem md={6} lg={4}>
              <TipCard icon={<CommentsIcon />} title="2. Describe what you see, not what to code" accent="#3e8635">
                You don't need to say "use a MenuToggle with a Menu component." Just say "there's a button
                that opens a dropdown menu with five options." The agent knows how to translate your description
                into the right technical pattern.
              </TipCard>
            </GridItem>
            <GridItem md={6} lg={4}>
              <TipCard icon={<CheckCircleIcon />} title="3. Spell out the order of things" accent="#8f4700">
                If your toolbar has controls in a specific order, list them left to right. If your wizard has steps,
                list them 1 through 5. The agent can't eyeball your Figma and guess which thing goes where —
                especially when there are 6 filters and they all look similar.
              </TipCard>
            </GridItem>
            <GridItem md={6} lg={4}>
              <TipCard icon={<ExclamationCircleIcon />} title="4. Say what should happen, not just what it looks like" accent="#c9190b">
                "There's a delete button" is about appearance. "Clicking delete opens a confirmation dialog that
                says 'Are you sure?' with Cancel and Delete buttons — Delete is red" is about behavior. The agent
                needs both, but behavior is where most gaps show up.
              </TipCard>
            </GridItem>
            <GridItem md={6} lg={4}>
              <TipCard icon={<HandshakeIcon />} title="5. Name what's different when things look similar" accent="#6753ac">
                If your design has two things called "saved filters" in different places, explain the difference:
                "The saved filters in the sidebar let users pick a preset. The saved filters on the results page
                carry the current search into the next step." Same name, totally different behavior — the agent
                needs that distinction.
              </TipCard>
            </GridItem>
            <GridItem md={6} lg={4}>
              <TipCard icon={<RedoIcon />} title="6. When something's wrong, describe what you expected" accent="#004080">
                Instead of "this is broken," try "I expected the table columns to be side by side, but they're
                stacking vertically" or "clicking this button should open a dialog, but nothing happens." The more
                specific the gap between expected and actual, the faster the fix.
              </TipCard>
            </GridItem>
          </Grid>
        </PageSection>

        <Divider />

        {/* Section 4: The Iteration Mindset */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" style={{ color: '#6753ac' }}><RedoIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Getting Comfortable with Iteration</Title>
          </Flex>
          <Content style={{ fontSize: '16px', lineHeight: '1.7', maxWidth: '800px', marginBottom: '24px' }}>
            Even with a perfect briefing, the first result won't always be exactly right. That's normal — and it's
            actually fine. Prototyping with an agent works best as a conversation, not a single command.
          </Content>

          <Grid hasGutter>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="blue" isCompact>First message</Label>
                    <strong>Give the big picture</strong>
                    <Content component="small">
                      Describe the page, the layout, the key interactions. Include the Figma link and frame map.
                      This gets you 70-80% of the way there.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="green" isCompact>Follow-ups</Label>
                    <strong>Refine what's not right</strong>
                    <Content component="small">
                      "The filter order is wrong — it should be Name, then Status, then Severity."
                      "The dialog is missing a cancel button." "The sidebar should be fixed, not scrollable."
                      Short, specific corrections are the fastest path to the result you want.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="orange" isCompact>If it's way off</Label>
                    <strong>Re-describe, don't just say "wrong"</strong>
                    <Content component="small">
                      If the result misses the mark significantly, re-describe what you wanted from scratch.
                      The agent may have misunderstood the original intent, and saying "that's wrong, try again"
                      doesn't give it new information to work with.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-rule-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <Label color="purple" isCompact>Pro tip</Label>
                    <strong>Protect what's already working</strong>
                    <Content component="small">
                      When asking for changes, mention what should stay the same: "Update the filter bar,
                      but don't touch the table layout or the sidebar — those are correct." This prevents
                      the agent from accidentally changing things that were already right.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </PageSection>

        <Divider />

        {/* Section 5: Common Conversations */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" style={{ color: '#c9190b' }}><ExclamationCircleIcon /></Icon>
            <Title headingLevel="h2" size="2xl">Things That Trip Everyone Up</Title>
          </Flex>
          <Content className="guide-section-intro">
            These aren't mistakes — they're just patterns where a little extra detail goes a long way.
          </Content>

          <Grid hasGutter>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-pitfall-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <strong>Assuming the agent remembers everything</strong>
                    <Content component="small">
                      Long conversations lose context. If you're 30 messages in and switching topics, re-state the
                      important constraints: "Remember, we're working on the V2 reports page, and changes shouldn't
                      affect V1."
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-pitfall-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <strong>Saying "make it look better"</strong>
                    <Content component="small">
                      "Better" is subjective. Instead: "Increase the spacing between cards," "Make the header font
                      larger," "The background should be darker," or "Add more padding around the content area."
                      Specific visual adjustments get specific results.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-pitfall-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <strong>Describing the final result without the journey</strong>
                    <Content component="small">
                      If a page has a wizard with 5 steps, don't just show the final confirmation. Walk through
                      each step: "Step 1 asks for report name and description. Step 2 lets you choose a scope.
                      Step 3 shows a summary. Step 4 is the confirmation."
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-pitfall-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <strong>Forgetting to mention what carries between pages</strong>
                    <Content component="small">
                      If a user selects filters on one page and those filters should appear pre-filled on the next
                      page, say so. The agent doesn't know that Filter A on Page 1 connects to the scope on Page 2
                      unless you explain the relationship.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-pitfall-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <strong>Multiple requests in one long paragraph</strong>
                    <Content component="small">
                      If you need three different things done, number them: "1) Fix the table columns. 2) Add a
                      search filter. 3) Make the sidebar collapsible." This helps the agent track all your requests
                      and not accidentally skip one.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={6}>
              <Card isPlain isCompact className="guide-pitfall-card">
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <strong>Not saying which version or page you mean</strong>
                    <Content component="small">
                      If your project has multiple versions or pages, always start with context: "On the V2 reports
                      page..." or "In the create report wizard, step 3..." The agent may be looking at the wrong
                      file without this anchor.
                    </Content>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </PageSection>

        <Divider />

        {/* Section 6: Quick Start Template */}
        <PageSection className="guide-section">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="guide-section-header">
            <Icon size="lg" style={{ color: '#3e8635' }}><HeartIcon /></Icon>
            <Title headingLevel="h2" size="2xl">A Simple Starting Template</Title>
          </Flex>
          <Content className="guide-section-intro">
            Not sure how to start? Copy this and fill in the blanks. It works for almost any prototype page.
          </Content>

          <Card className="guide-checklist-card" style={{ maxWidth: '720px' }}>
            <CardBody>
              <Content component="div" style={{ fontSize: '15px', lineHeight: '1.8', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`Hey, I need to build [page name].

Here's the Figma: [paste link]
- Frame 1 shows: [the default state]
- Frame 2 shows: [a dropdown/dialog/panel open]
- Frame 3 shows: [another state, if applicable]

The page should have:
- [Describe the layout: sidebar + main content, full-width table, cards, etc.]
- [List key elements: table with columns X, Y, Z / filter bar / action buttons]

When the user interacts:
- Clicking [element] should [behavior]
- [Element] has these options: [list them]
- After [action], navigate to [destination]

Important:
- [Any constraints: "don't break other pages", "match the existing nav", etc.]
- [Any data needs: "use sample data for now", "connect to this API", etc.]`}
              </Content>
            </CardBody>
          </Card>
        </PageSection>

        {/* Footer */}
        <PageSection className="guide-footer" variant="darker">
          <Flex justifyContent={{ default: 'justifyContentCenter' }} alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
            <Content component="small" style={{ opacity: 0.6 }}>
              Universal Prototyping Guide &middot; Applicable to any design system and any AI-assisted workflow
            </Content>
          </Flex>
        </PageSection>
      </div>
    </div>
  );
}
