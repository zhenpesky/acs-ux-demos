import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  Nav,
  NavList,
  NavItem,
  PageSection,
  Pagination,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

import { prefixRoutes } from '../routes';
import { CVES, PLATFORM_CVES, NODE_CVES, DEPLOYMENTS, deriveCveSeverity } from '../mockData';
import { useLiveSync } from '../api/hooks';

const severityMeta = {
  CRITICAL: { color: 'var(--pf-t--global--color--status--danger--default)', icon: ExclamationCircleIcon, label: 'Critical', pfColor: 'red' },
  IMPORTANT: { color: 'var(--pf-t--global--color--status--warning--default)', icon: ExclamationTriangleIcon, label: 'Important', pfColor: 'orange' },
  MODERATE: { color: 'var(--pf-t--global--color--status--warning--default)', icon: InfoCircleIcon, label: 'Moderate', pfColor: 'gold' },
  LOW: { color: 'var(--pf-t--global--text--color--subtle)', icon: InfoCircleIcon, label: 'Low', pfColor: 'blue' },
  Critical: { color: 'var(--pf-t--global--color--status--danger--default)', icon: ExclamationCircleIcon, label: 'Critical', pfColor: 'red' },
  Important: { color: 'var(--pf-t--global--color--status--warning--default)', icon: ExclamationTriangleIcon, label: 'Important', pfColor: 'orange' },
  Moderate: { color: 'var(--pf-t--global--color--status--warning--default)', icon: InfoCircleIcon, label: 'Moderate', pfColor: 'gold' },
  Low: { color: 'var(--pf-t--global--text--color--subtle)', icon: InfoCircleIcon, label: 'Low', pfColor: 'blue' },
};

function cveDisplayId(cve) {
  return cve.cve ?? cve.id;
}

function workloadCveSummary(cve) {
  return cve.distroTuples?.[0]?.summary || '';
}

function findCve(cveId) {
  const workload = CVES.find((c) => c.cve === cveId);
  if (workload) {
    const sum = workload.distroTuples?.[0]?.summary?.trim();
    return {
      ...workload,
      source: 'Workload',
      normalizedSeverity: deriveCveSeverity(workload),
      affectedComponents: sum ? [sum.split(/\s+/)[0]] : [],
    };
  }

  const platform = PLATFORM_CVES.find((c) => c.cve === cveId);
  if (platform) return {
    id: platform.cve, summary: `${platform.type}: ${platform.affectedComponents}`,
    severity: platform.severity, cvss: platform.cvss, scoreVersion: 'V3',
    isFixable: platform.fixedIn && platform.fixedIn !== '—',
    fixedByVersion: platform.fixedIn, publishedOn: platform.firstDiscovered,
    affectedComponents: [platform.affectedComponents],
    deploymentCount: 0, imageCount: 0, source: 'Platform',
    normalizedSeverity: platform.severity.toUpperCase(),
  };

  const node = NODE_CVES.find((c) => c.cve === cveId);
  if (node) return {
    id: node.cve, summary: `Node vulnerability in ${node.os}`,
    severity: node.severity, cvss: node.cvss, scoreVersion: 'V3',
    isFixable: node.fixable === 'Yes',
    fixedByVersion: node.fixable === 'Yes' ? 'Available' : undefined,
    publishedOn: node.firstDiscovered,
    affectedComponents: [node.os],
    deploymentCount: 0, imageCount: 0, source: 'Node',
    normalizedSeverity: node.severity.toUpperCase(),
  };

  return null;
}

export default function CveDetailPage({ routePrefix = '/v1' }) {
  const syncState = useLiveSync();
  const { cveId } = useParams();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);

  const cve = useMemo(() => findCve(cveId), [cveId, syncState]);

  const [activeTab, setActiveTab] = useState('affected');
  const [page, setPage] = useState(1);
  const perPage = 20;

  const affectedDeployments = useMemo(() => {
    if (!cve || !cve.affectedComponents) return [];
    return DEPLOYMENTS.filter((d) => {
      const v = d.vulnerabilities;
      return v && (v.critical?.total > 0 || v.important?.total > 0 || v.moderate?.total > 0 || v.low?.total > 0);
    }).slice(0, 20);
  }, [cve, syncState]);

  if (!cve) {
    return (
      <PageSection>
        <Title headingLevel="h1">CVE not found</Title>
        <Content component="p">The CVE "{cveId}" could not be found.</Content>
        <Button variant="link" onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath)}>Back to Results</Button>
      </PageSection>
    );
  }

  const severityKey = cve.source === 'Workload' ? deriveCveSeverity(cve) : (cve.normalizedSeverity || String(cve.severity || '').toUpperCase());
  const sev = severityMeta[severityKey] || severityMeta[cve.severity] || severityMeta.LOW;
  const SevIcon = sev.icon;
  const publishDate = cve.publishedOn ? new Date(cve.publishedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';
  const summaryText = cve.source === 'Workload' ? workloadCveSummary(cve) : cve.summary;
  const cvssScore = cve.source === 'Workload' ? cve.topCVSS : cve.cvss;
  const scoreVer = cve.source === 'Workload' ? (cve.distroTuples?.[0]?.scoreVersion || 'V3') : (cve.scoreVersion || 'V3');
  const componentList = cve.affectedComponents || [];

  return (
    <>
      <PageSection padding={{ default: 'noPadding' }} style={{ background: 'var(--pf-t--global--background--color--secondary--default)', paddingInline: '16px' }}>
        <Nav variant="horizontal-subnav" aria-label="Vulnerability management views">
          <NavList>
            <NavItem isActive itemId="user-workloads" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesUserWorkloadsPath); }}>User Workloads</NavItem>
            <NavItem itemId="platform" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesPlatformPath); }}>Platform</NavItem>
            <NavItem itemId="nodes" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesNodePath); }}>Nodes</NavItem>
          </NavList>
        </Nav>
      </PageSection>
      <Divider component="div" />

      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" isInline onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath)}>Results</Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{cveDisplayId(cve)}</BreadcrumbItem>
        </Breadcrumb>

        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} style={{ marginTop: '16px' }}>
          <FlexItem>
            <Title headingLevel="h1">{cveDisplayId(cve)}</Title>
          </FlexItem>
          <FlexItem>
            <Button variant="link" isInline component="a" href={`https://nvd.nist.gov/vuln/detail/${cveDisplayId(cve)}`} target="_blank" icon={<ExternalLinkAltIcon />} iconPosition="end">
              View in NVD
            </Button>
          </FlexItem>
        </Flex>

        <Content component="p" style={{ marginTop: '8px', maxWidth: '800px' }}>{summaryText}</Content>

        <Flex gap={{ default: 'gapMd' }} style={{ marginTop: '16px', marginBottom: '16px' }}>
          <FlexItem>
            <Label isCompact color={sev.pfColor} icon={<SevIcon />}>{sev.label}</Label>
          </FlexItem>
          <FlexItem>
            <Label isCompact>{cvssScore} CVSS ({scoreVer})</Label>
          </FlexItem>
          <FlexItem>
            {cve.source === 'Workload'
              ? <Label isCompact color="grey">Not fixable</Label>
              : cve.isFixable
                ? <Label isCompact color="green" icon={<CheckCircleIcon />}>Fixable{cve.fixedByVersion ? ` (${cve.fixedByVersion})` : ''}</Label>
                : <Label isCompact color="grey">Not fixable</Label>
            }
          </FlexItem>
          <FlexItem>
            <Label isCompact>Published: {publishDate}</Label>
          </FlexItem>
        </Flex>

        <Flex gap={{ default: 'gapLg' }} style={{ marginBottom: '16px' }}>
          {cve.source !== 'Workload' && cve.deploymentCount > 0 && (
            <FlexItem>
              <Card isCompact isFlat><CardBody>{cve.deploymentCount} affected deployment{cve.deploymentCount !== 1 ? 's' : ''}</CardBody></Card>
            </FlexItem>
          )}
          {cve.source === 'Workload' && (
            <FlexItem>
              <Card isCompact isFlat><CardBody>Deployments: —</CardBody></Card>
            </FlexItem>
          )}
          {(cve.source === 'Workload' ? (cve.affectedImageCount ?? 0) > 0 : cve.imageCount > 0) && (
            <FlexItem>
              <Card isCompact isFlat><CardBody>{cve.source === 'Workload' ? cve.affectedImageCount : cve.imageCount} affected image{(cve.source === 'Workload' ? cve.affectedImageCount : cve.imageCount) !== 1 ? 's' : ''}</CardBody></Card>
            </FlexItem>
          )}
          {componentList.length > 0 && (
            <FlexItem>
              <Card isCompact isFlat><CardBody>Components: {componentList.join(', ')}</CardBody></Card>
            </FlexItem>
          )}
        </Flex>

        <Tabs activeKey={activeTab} onSelect={(_e, k) => setActiveTab(k)}>
          <Tab eventKey="affected" title={<TabTitleText>Affected deployments ({affectedDeployments.length})</TabTitleText>} />
          <Tab eventKey="details" title={<TabTitleText>CVE details</TabTitleText>} />
        </Tabs>
      </PageSection>
      <Divider component="div" />

      {activeTab === 'affected' && (
        <PageSection>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem variant="pagination">
                <Pagination itemCount={affectedDeployments.length} perPage={perPage} page={page}
                  onSetPage={(_e, p) => setPage(p)} isCompact />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          <Table aria-label="Affected deployments" variant="compact">
            <Thead>
              <Tr>
                <Th>Deployment</Th>
                <Th>Cluster</Th>
                <Th>Namespace</Th>
                <Th>Images</Th>
              </Tr>
            </Thead>
            <Tbody>
              {affectedDeployments.slice((page - 1) * perPage, page * perPage).map((d) => (
                <Tr key={d.id}>
                  <Td>
                    <Button variant="link" isInline onClick={() => navigate(`${routes.deploymentDetailPath}/${d.id}`)}>
                      {d.name}
                    </Button>
                  </Td>
                  <Td>{d.clusterName}</Td>
                  <Td>{d.namespace || d.namespaceName}</Td>
                  <Td>{d.imageCount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>
      )}

      {activeTab === 'details' && (
        <PageSection>
          <Card isFlat>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px' }}>
                <span style={{ fontWeight: 600 }}>CVE ID:</span><span>{cveDisplayId(cve)}</span>
                <span style={{ fontWeight: 600 }}>Summary:</span><span>{summaryText}</span>
                <span style={{ fontWeight: 600 }}>Severity:</span><span><Label isCompact color={sev.pfColor}>{sev.label}</Label></span>
                <span style={{ fontWeight: 600 }}>CVSS Score:</span><span>{cvssScore} ({scoreVer})</span>
                <span style={{ fontWeight: 600 }}>Fixable:</span><span>{cve.source === 'Workload' ? 'No' : (cve.isFixable ? `Yes${cve.fixedByVersion ? ` — fixed in ${cve.fixedByVersion}` : ''}` : 'No')}</span>
                <span style={{ fontWeight: 600 }}>Published:</span><span>{publishDate}</span>
                <span style={{ fontWeight: 600 }}>Affected components:</span><span>{componentList.join(', ') || '—'}</span>
                <span style={{ fontWeight: 600 }}>Source:</span><span>{cve.source}</span>
                {cve.source !== 'Workload' && cve.deploymentCount > 0 && <><span style={{ fontWeight: 600 }}>Affected deployments:</span><span>{cve.deploymentCount}</span></>}
                {cve.source === 'Workload' && <><span style={{ fontWeight: 600 }}>Affected deployments:</span><span>—</span></>}
                {(cve.source === 'Workload' ? (cve.affectedImageCount ?? 0) : cve.imageCount) > 0 && (
                  <><span style={{ fontWeight: 600 }}>Affected images:</span><span>{cve.source === 'Workload' ? cve.affectedImageCount : cve.imageCount}</span></>
                )}
              </div>
            </CardBody>
          </Card>
        </PageSection>
      )}
    </>
  );
}
