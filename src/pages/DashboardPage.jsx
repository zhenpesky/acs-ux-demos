import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Divider,
  Flex,
  FlexItem,
  MenuToggle,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  Split,
  SplitItem,
  Stack,
  Title,
} from '@patternfly/react-core';
import {
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';
import { prefixRoutes } from '../routes';
import { SUMMARY_COUNTS, VIOLATION_SEVERITY, DASHBOARD_WIDGETS, DEPLOYMENTS, COMPLIANCE_PROFILES } from '../mockData';
import { useLiveSync } from '../api/hooks';

const summaryTiles = [
  { key: 'clusterCount', noun: 'Clusters' },
  { key: 'nodeCount', noun: 'Nodes' },
  { key: 'violationCount', noun: 'Violations' },
  { key: 'deploymentCount', noun: 'Deployments' },
  { key: 'imageCount', noun: 'Images' },
  { key: 'secretCount', noun: 'Secrets' },
];

const violationsByPolicy = {
  low: VIOLATION_SEVERITY.low,
  medium: VIOLATION_SEVERITY.medium,
  high: VIOLATION_SEVERITY.high,
  critical: VIOLATION_SEVERITY.critical,
};

const imagesAtMostRisk = DASHBOARD_WIDGETS.imagesAtMostRisk.map((img) => ({
  name: img.name,
  riskPriority: img.critical > 5 ? 1 : 2,
  criticalCves: `${img.critical} fixable`,
  importantCves: `${img.important} fixable`,
}));

const recentViolations = DASHBOARD_WIDGETS.violationsByPolicy.map((v, i) => ({
  policy: v.policy,
  deployment: 'my-webapp',
  time: `Mar 30, 2026, 10:17:${46 - i} AM PDT`,
}));

const deploymentsAtMostRisk = DASHBOARD_WIDGETS.deploymentsAtMostRisk.map((d) => ({
  name: d.name,
  location: `in "${d.cluster} / ${d.namespace}"`,
  riskPriority: 1,
}));

const agingImagesData = [
  { range: '<30 days', count: DASHBOARD_WIDGETS.agingImages.inactive30 },
  { range: '30-60', count: DASHBOARD_WIDGETS.agingImages.inactive60 },
  { range: '60-90', count: DASHBOARD_WIDGETS.agingImages.inactive90 },
  { range: '90-120', count: DASHBOARD_WIDGETS.agingImages.inactive180 },
  { range: '>120', count: DASHBOARD_WIDGETS.agingImages.inactive365 },
];

const violationTotal = VIOLATION_SEVERITY.total;

const severityBarColors = {
  low: 'var(--pf-t--global--color--status--success--default)',
  medium: 'var(--pf-t--global--color--status--warning--default)',
  high: 'var(--pf-t--global--color--status--warning--default)',
  critical: 'var(--pf-t--global--color--status--danger--default)',
};


function SummaryCounts({ routes }) {
  const navigate = useNavigate();
  const summaryTileRoutes = {
    clusterCount: routes.clustersPath,
    nodeCount: routes.systemHealthPath,
    violationCount: routes.violationsPath,
    deploymentCount: routes.riskPath,
    imageCount: `${routes.vulnerabilitiesUserWorkloadsPath}?view=Images`,
    secretCount: routes.configManagementPath,
  };
  const now = new Date();
  const lastUpdated = now.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit',
    hour12: true, timeZoneName: 'short',
  });

  return (
    <Split className="pf-v6-u-align-items-center">
      <SplitItem isFilled>
        <Split className="pf-v6-u-flex-wrap">
          {summaryTiles.map((tile) => (
            <Button key={tile.key} variant="link" style={{ textDecoration: 'none' }} onClick={() => navigate(summaryTileRoutes[tile.key])}>
              <Stack className="pf-v6-u-px-xs pf-v6-u-px-sm-on-xl pf-v6-u-align-items-center">
                <span className="pf-v6-u-font-size-lg-on-md pf-v6-u-font-size-sm pf-v6-u-font-weight-bold">
                  {SUMMARY_COUNTS[tile.key].toLocaleString()}
                </span>
                <span className="pf-v6-u-font-size-md-on-md pf-v6-u-font-size-xs">
                  {tile.noun}
                </span>
              </Stack>
            </Button>
          ))}
        </Split>
      </SplitItem>
      <div className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mr-md pf-v6-u-mr-lg-on-lg">
        {`Last updated ${lastUpdated}`}
      </div>
    </Split>
  );
}

function ScopeBar() {
  const [clusterFilter, setClusterFilter] = useState('All clusters');
  const [namespaceFilter, setNamespaceFilter] = useState('All namespaces');
  const [isClusterOpen, setIsClusterOpen] = useState(false);
  const [isNamespaceOpen, setIsNamespaceOpen] = useState(false);

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
      <FlexItem>
        <span className="pf-v6-u-font-weight-bold pf-v6-u-font-size-sm">Resources:</span>
      </FlexItem>
      <FlexItem>
        <Select
          isOpen={isClusterOpen}
          onOpenChange={setIsClusterOpen}
          selected={clusterFilter}
          onSelect={(_e, val) => { setClusterFilter(val); setIsClusterOpen(false); }}
          toggle={(toggleRef) => (
            <MenuToggle ref={toggleRef} onClick={() => setIsClusterOpen(!isClusterOpen)} isExpanded={isClusterOpen} style={{ minWidth: '140px' }}>
              {clusterFilter}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="All clusters">All clusters</SelectOption>
          </SelectList>
        </Select>
      </FlexItem>
      <FlexItem>
        <Select
          isOpen={isNamespaceOpen}
          onOpenChange={setIsNamespaceOpen}
          selected={namespaceFilter}
          onSelect={(_e, val) => { setNamespaceFilter(val); setIsNamespaceOpen(false); }}
          toggle={(toggleRef) => (
            <MenuToggle ref={toggleRef} onClick={() => setIsNamespaceOpen(!isNamespaceOpen)} isExpanded={isNamespaceOpen} style={{ minWidth: '140px' }}>
              {namespaceFilter}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="All namespaces">All namespaces</SelectOption>
          </SelectList>
        </Select>
      </FlexItem>
    </Flex>
  );
}

function ViolationsBySeverityCard({ routes }) {
  const navigate = useNavigate();
  const { violationsPath, deploymentDetailPath } = routes;
  const severities = [
    { key: 'low', label: 'Low', value: violationsByPolicy.low, color: severityBarColors.low },
    { key: 'medium', label: 'Medium', value: violationsByPolicy.medium, color: severityBarColors.medium },
    { key: 'high', label: 'High', value: violationsByPolicy.high, color: severityBarColors.high },
    { key: 'critical', label: 'Critical', value: violationsByPolicy.critical, color: severityBarColors.critical },
  ];

  return (
    <Card isFullHeight>
      <CardHeader
        actions={{ actions: <Button variant="link" isInline onClick={() => navigate(violationsPath)}>View all</Button>, hasNoOffset: true }}
      >
        <CardTitle>
          {violationTotal.toLocaleString()} policy violations by severity
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Flex gap={{ default: 'gapSm' }} style={{ marginBottom: '24px' }}>
          {severities.map((s) => (
            <FlexItem key={s.key} style={{ flex: 1 }}>
              <div
                style={{
                  backgroundColor: s.color,
                  borderRadius: '4px',
                  padding: '8px 12px',
                  textAlign: 'center',
                  color: 'var(--pf-t--global--text--color--on-brand--default)',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                {s.value.toLocaleString()}
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                {s.label}
              </div>
            </FlexItem>
          ))}
        </Flex>

        <div style={{ borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: '16px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>
            Most recent violations with critical severity
          </div>
          {recentViolations.map((v, i) => (
            <Flex key={i} alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} style={{ padding: '6px 0', borderTop: i > 0 ? '1px solid var(--pf-t--global--border--color--default)' : undefined }}>
              <FlexItem>
                <ExclamationTriangleIcon style={{ color: 'var(--pf-t--global--color--status--danger--default)' }} />
              </FlexItem>
              <FlexItem style={{ flex: 1 }}>
                <Button variant="link" isInline onClick={() => navigate(violationsPath + '/v-00' + (i + 3))}>{v.policy}</Button>
              </FlexItem>
              <FlexItem>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '12px', padding: '2px 8px', fontSize: '12px',
                }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--color--status--info--default)' }}></span>
                  <Button variant="link" isInline style={{ fontSize: '12px', padding: 0 }} onClick={() => {
                    const dep = DEPLOYMENTS.find((d) => d.name === v.deployment);
                    navigate(`${deploymentDetailPath}/${dep ? dep.id : v.deployment}`);
                  }}>{v.deployment}</Button>
                </span>
              </FlexItem>
              <FlexItem>
                <span style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>{v.time}</span>
              </FlexItem>
            </Flex>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function ImagesAtMostRiskCard({ routes }) {
  const navigate = useNavigate();
  const { vulnerabilitiesUserWorkloadsPath } = routes;
  return (
    <Card isFullHeight>
      <CardHeader
        actions={{ actions: <Button variant="link" isInline style={{ color: 'var(--pf-t--global--danger-color--100)' }} onClick={() => navigate(vulnerabilitiesUserWorkloadsPath)}>View all</Button>, hasNoOffset: true }}
      >
        <CardTitle>Images at most risk</CardTitle>
      </CardHeader>
      <CardBody style={{ padding: 0 }}>
        <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Image</th>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Risk priority</th>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Critical CVEs</th>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Important CVEs</th>
            </tr>
          </thead>
          <tbody>
            {imagesAtMostRisk.map((img, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                <td style={{ padding: '8px 16px' }}>
                  <Button variant="link" isInline onClick={() => navigate(vulnerabilitiesUserWorkloadsPath)}>{img.name}</Button>
                </td>
                <td style={{ padding: '8px 16px' }}>{img.riskPriority}</td>
                <td style={{ padding: '8px 16px' }}>
                  <span style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>&#9873;</span> {img.criticalCves}
                </td>
                <td style={{ padding: '8px 16px' }}>
                  <span style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}>&#9873;</span> {img.importantCves}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function DeploymentsAtMostRiskCard({ routes }) {
  const navigate = useNavigate();
  const allDeployments = DEPLOYMENTS.slice().sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 8);

  return (
    <Card isFullHeight>
      <CardHeader
        actions={{ actions: <Button variant="link" isInline onClick={() => navigate(routes.riskPath)}>View all</Button>, hasNoOffset: true }}
      >
        <CardTitle>Deployments at most risk</CardTitle>
      </CardHeader>
      <CardBody style={{ padding: 0 }}>
        <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Deployment</th>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Resource location</th>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>Risk priority</th>
            </tr>
          </thead>
          <tbody>
            {allDeployments.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                <td style={{ padding: '8px 16px' }}>
                  <Button variant="link" isInline onClick={() => navigate(`${routes.deploymentDetailPath}/${d.id}`)}>{d.name}</Button>
                </td>
                <td style={{ padding: '8px 16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  in "{d.clusterName} / {d.namespace}"
                </td>
                <td style={{ padding: '8px 16px' }}>{d.priority || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function AgingImagesCard({ routes }) {
  const navigate = useNavigate();
  const { vulnerabilitiesUserWorkloadsPath } = routes;
  const totalAging = agingImagesData.reduce((s, d) => s + d.count, 0);
  const maxCount = Math.max(...agingImagesData.map(d => d.count));

  return (
    <Card isFullHeight>
      <CardHeader
        actions={{ actions: <Button variant="link" isInline onClick={() => navigate(vulnerabilitiesUserWorkloadsPath)}>View all</Button>, hasNoOffset: true }}
      >
        <CardTitle>{totalAging} Aging images</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '140px' }}>
          {agingImagesData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {d.count > 0 ? d.count : ''}
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '48px',
                  height: maxCount > 0 ? `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 8 : 2)}%` : '2%',
                  backgroundColor: i === agingImagesData.length - 1 ? 'var(--pf-t--global--color--status--danger--default)' : 'var(--pf-t--global--color--status--info--default)',
                  borderRadius: '2px 2px 0 0',
                }}
              />
              <span style={{ fontSize: '11px', marginTop: '4px', color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center' }}>
                {d.range}
              </span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
          Image age (days)
        </div>
      </CardBody>
    </Card>
  );
}

const policyViolationCategories = [
  { name: 'NIST 800-190', low: 80, medium: 120, high: 200, critical: 60 },
  { name: 'CIS Docker', low: 60, medium: 100, high: 180, critical: 50 },
  { name: 'HIPAA', low: 30, medium: 50, high: 80, critical: 20 },
  { name: 'PCI', low: 10, medium: 20, high: 40, critical: 10 },
  { name: 'Container Runtime', low: 5, medium: 10, high: 15, critical: 5 },
];

function PolicyViolationsByCategoryCard({ routes }) {
  const navigate = useNavigate();
  const maxTotal = Math.max(...policyViolationCategories.map(c => c.low + c.medium + c.high + c.critical));

  return (
    <Card isFullHeight>
      <CardHeader
        actions={{ actions: <></>, hasNoOffset: true }}
      >
        <CardTitle>Policy violations by category</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {policyViolationCategories.map((cat) => {
            const total = cat.low + cat.medium + cat.high + cat.critical;
            const pct = (total / maxTotal) * 100;
            return (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ minWidth: '120px', fontSize: '13px' }}>{cat.name}</span>
                <div style={{ flex: 1, display: 'flex', height: '18px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(cat.low / total) * pct}%`, backgroundColor: 'var(--pf-t--global--text--color--subtle)' }} />
                  <div style={{ width: `${(cat.medium / total) * pct}%`, backgroundColor: 'var(--pf-t--global--color--status--warning--default)' }} />
                  <div style={{ width: `${(cat.high / total) * pct}%`, backgroundColor: 'var(--pf-t--global--color--status--warning--default)' }} />
                  <div style={{ width: `${(cat.critical / total) * pct}%`, backgroundColor: 'var(--pf-t--global--color--status--danger--default)' }} />
                </div>
              </div>
            );
          })}
        </div>
        <Flex gap={{ default: 'gapMd' }} style={{ marginTop: '16px', fontSize: '12px' }}>
          <FlexItem><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--text--color--subtle)', marginRight: '4px' }} />Low</FlexItem>
          <FlexItem><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--color--status--warning--default)', marginRight: '4px' }} />Medium</FlexItem>
          <FlexItem><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--color--status--warning--default)', marginRight: '4px' }} />High</FlexItem>
          <FlexItem><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--color--status--danger--default)', marginRight: '4px' }} />Critical</FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
}

function ComplianceByStandardCard({ routes }) {
  const navigate = useNavigate();
  const profiles = COMPLIANCE_PROFILES.map((p) => ({
    name: p.name,
    compliance: p.compliance,
  }));

  return (
    <Card isFullHeight>
      <CardHeader
        actions={{ actions: <Button variant="link" isInline onClick={() => navigate(routes.complianceCoveragePath)}>View all</Button>, hasNoOffset: true }}
      >
        <CardTitle>Compliance by standard</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {profiles.map((p) => (
            <div key={p.name}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginBottom: '4px' }}>
                <FlexItem><span style={{ fontSize: '13px' }}>{p.name}</span></FlexItem>
                <FlexItem><span style={{ fontSize: '13px', fontWeight: 600 }}>{p.compliance}%</span></FlexItem>
              </Flex>
              <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${p.compliance}%`, height: '100%', backgroundColor: 'var(--pf-t--global--color--status--info--default)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
          0%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100%
        </div>
      </CardBody>
    </Card>
  );
}

export default function DashboardPage({ routePrefix }) {
  useLiveSync();
  const routes = prefixRoutes(routePrefix);
  return (
    <>
      <PageSection padding={{ default: 'noPadding' }}>
        <SummaryCounts routes={routes} />
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Flex
          direction={{ default: 'column', lg: 'row' }}
          alignItems={{ default: 'alignItemsFlexStart', lg: 'alignItemsCenter' }}
        >
          <FlexItem>
            <Title headingLevel="h1">Dashboard</Title>
            <Content component="p">
              Review security metrics across all or select resources
            </Content>
          </FlexItem>
          <FlexItem
            grow={{ default: 'grow' }}
            className="pf-v6-u-display-flex pf-v6-u-justify-content-flex-end"
          >
            <ScopeBar />
          </FlexItem>
        </Flex>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <div
          id="main-dashboard-widget-gallery"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          <ViolationsBySeverityCard routes={routes} />
          <ImagesAtMostRiskCard routes={routes} />
          <DeploymentsAtMostRiskCard routes={routes} />
          <AgingImagesCard routes={routes} />
          <PolicyViolationsByCategoryCard routes={routes} />
          <ComplianceByStandardCard routes={routes} />
        </div>
      </PageSection>
    </>
  );
}
