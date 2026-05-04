import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
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
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Card,
  CardBody,
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  FilterIcon,
} from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td, ExpandableRowContent } from '@patternfly/react-table';

import { prefixRoutes } from '../routes';
import { DEPLOYMENTS, CVES, CLUSTERS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const severityOrder = { CRITICAL: 0, IMPORTANT: 1, MODERATE: 2, LOW: 3 };
const severityColors = { CRITICAL: 'var(--pf-t--global--color--status--danger--default)', IMPORTANT: 'var(--pf-t--global--color--status--warning--default)', MODERATE: 'var(--pf-t--global--color--status--warning--default)', LOW: 'var(--pf-t--global--text--color--subtle)' };

function generateDeploymentCves(deployment) {
  if (!deployment) return [];
  const sev = deployment.imageCVECountBySeverity || {};
  const allCves = [];
  const severities = [
    { key: 'critical', label: 'CRITICAL', count: sev.critical?.total || 0, fixable: 0 },
    { key: 'important', label: 'IMPORTANT', count: sev.important?.total || 0, fixable: 0 },
    { key: 'moderate', label: 'MODERATE', count: sev.moderate?.total || 0, fixable: 0 },
    { key: 'low', label: 'LOW', count: sev.low?.total || 0, fixable: 0 },
  ];

  let cveIdx = 0;
  for (const s of severities) {
    for (let i = 0; i < s.count; i++) {
      const baseCve = CVES[cveIdx % CVES.length];
      const year = 2025 + Math.floor(cveIdx / 20);
      allCves.push({
        id: `CVE-${year}-${(22695 + cveIdx).toString()}`,
        operatingSystem: 'alpine:3.20',
        severity: s.label,
        cvss: baseCve?.cvss ?? baseCve?.topCVSS ?? (7 + Math.random() * 3).toFixed(1),
        cveStatus: i < s.fixable ? 'Fixable' : 'Not fixable',
        epss: (Math.random() * 0.1).toFixed(3) + '%',
        affectedComponents: baseCve?.affectedComponents?.[0] || baseCve?.distroTuples?.[0]?.summary || 'unknown',
        firstDiscovered: '20 days ago',
        published: i < 3 ? '2 months ago' : (i < 6 ? '1 month ago' : '7 months ago'),
      });
      cveIdx++;
    }
  }
  return allCves;
}

export default function DeploymentDetailPage({ routePrefix = '/v1' }) {
  const syncState = useLiveSync();
  const { deploymentId } = useParams();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);

  const deployment = useMemo(() =>
    DEPLOYMENTS.find((d) => d.id === deploymentId || d.name === deploymentId),
    [deploymentId, syncState]
  );

  const cluster = useMemo(() =>
    deployment ? CLUSTERS.find((c) => c.id === (deployment.clusterId || '') || c.name === deployment.clusterName) : null,
    [deployment, syncState]
  );

  const cves = useMemo(() => generateDeploymentCves(deployment), [deployment]);

  const [mainTab, setMainTab] = useState('vulnerabilities');
  const [subTab, setSubTab] = useState('observed');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSevOpen, setIsSevOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [moreViewsOpen, setMoreViewsOpen] = useState(false);
  const [expandedCveIds, setExpandedCveIds] = useState([]);
  const setCveExpanded = (cveId, isExpanding = true) =>
    setExpandedCveIds((prev) => {
      const filtered = prev.filter((id) => id !== cveId);
      return isExpanding ? [...filtered, cveId] : filtered;
    });
  const isCveExpanded = (cveId) => expandedCveIds.includes(cveId);

  

  if (!deployment) {
    if (syncState && syncState.status === 'syncing') {
      return (
        <PageSection>
          <Title headingLevel="h1">Loading deployment...</Title>
          <Content component="p">Fetching deployment data from StackRox Central.</Content>
        </PageSection>
      );
    }
    return (
      <PageSection>
        <Title headingLevel="h1">Deployment not found</Title>
        <Content component="p">The deployment "{deploymentId}" could not be found.</Content>
        <Button variant="link" onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath)}>Back to Results</Button>
      </PageSection>
    );
  }

  const totalCves = cves.length;
  const v = deployment.imageCVECountBySeverity || {};
  const fixableCount = 0;
  const notFixableCount = totalCves - fixableCount;

  const filteredCves = cves.filter((c) => {
    if (searchValue && !c.id.toLowerCase().includes(searchValue.toLowerCase())) return false;
    if (severityFilter && c.severity !== severityFilter.toUpperCase()) return false;
    if (statusFilter && c.cveStatus !== statusFilter) return false;
    return true;
  });

  const clusterName = cluster?.name || deployment?.clusterName || '';
  const clusterLabel = clusterName ? `${clusterName}/${deployment.namespace}` : deployment.namespace;
  const createdDate = new Date(deployment.created).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
  });

  return (
    <>
      <PageSection padding={{ default: 'noPadding' }} style={{ background: 'var(--pf-t--global--background--color--secondary--default)', paddingInline: '16px' }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
          <FlexItem>
            <Nav variant="horizontal-subnav" aria-label="Vulnerability management views">
              <NavList>
                <NavItem isActive itemId="user-workloads" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesUserWorkloadsPath); }}>User Workloads</NavItem>
                <NavItem itemId="platform" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesPlatformPath); }}>Platform</NavItem>
                <NavItem itemId="nodes" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesNodePath); }}>Nodes</NavItem>
              </NavList>
            </Nav>
          </FlexItem>
          <FlexItem>
            <Dropdown isOpen={moreViewsOpen} onSelect={() => setMoreViewsOpen(false)} onOpenChange={setMoreViewsOpen}
              toggle={(toggleRef) => (<MenuToggle ref={toggleRef} onClick={() => setMoreViewsOpen(!moreViewsOpen)} isExpanded={moreViewsOpen} variant="plain" style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '20px', paddingInline: '16px', paddingBlock: '4px' }}>More Views</MenuToggle>)}>
              <DropdownList>
                <DropdownItem key="all-vulnerable" onClick={() => navigate(routes.vulnerabilitiesAllPath)} description="Findings for user, platform, and inactive images simultaneously">All vulnerable images</DropdownItem>
                <DropdownItem key="inactive" onClick={() => navigate(routes.vulnerabilitiesAllPath)} description="Findings for watched images and images not currently deployed as workloads based on your image retention settings">Inactive images</DropdownItem>
                <DropdownItem key="no-cves" onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath)} description="Images and workloads without observed CVEs">Images without CVEs</DropdownItem>
                <DropdownItem key="k8s" onClick={() => navigate(routes.vulnerabilitiesPlatformPath)} description="Vulnerabilities affecting the underlying Kubernetes infrastructure">Kubernetes components</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>
      <Divider component="div" />

      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" isInline onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath + '?view=Deployments')}>Deployments</Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{deployment.name}</BreadcrumbItem>
        </Breadcrumb>

        <Title headingLevel="h1" style={{ marginTop: '12px' }}>{deployment.name}</Title>

        <Flex gap={{ default: 'gapSm' }} style={{ marginTop: '8px', marginBottom: '16px' }}>
          <FlexItem>
            <Label isCompact color="blue">In: {clusterLabel}</Label>
          </FlexItem>
          <FlexItem>
            <Label isCompact>Images: {deployment.imageCount}</Label>
          </FlexItem>
          <FlexItem>
            <Label isCompact>Created: {createdDate}</Label>
          </FlexItem>
        </Flex>

        <Tabs activeKey={mainTab} onSelect={(_e, k) => setMainTab(k)}>
          <Tab eventKey="vulnerabilities" title={<TabTitleText>Vulnerabilities</TabTitleText>} />
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="resources" title={<TabTitleText>Resources</TabTitleText>} />
        </Tabs>
      </PageSection>
      <Divider component="div" />

      {mainTab === 'vulnerabilities' && (
        <>
          <PageSection variant="light">
            <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              Review and triage vulnerability data scanned for images within this deployment
            </Content>
          </PageSection>
          <PageSection padding={{ default: 'noPadding' }} style={{ paddingInline: '24px' }}>
            <Tabs activeKey={subTab} onSelect={(_e, k) => setSubTab(k)} style={{ borderBottom: 'none' }}>
              <Tab eventKey="observed" title={<TabTitleText>Observed</TabTitleText>} />
              <Tab eventKey="deferred" title={<TabTitleText>Deferred</TabTitleText>} />
              <Tab eventKey="false-positives" title={<TabTitleText>False positives</TabTitleText>} />
            </Tabs>
          </PageSection>
          <Divider component="div" />

          <PageSection>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <Select
                    isOpen={false}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} variant="plain" style={{ fontWeight: 600 }}>CVE &#9662;</MenuToggle>
                    )}
                  >
                    <SelectList><SelectOption value="CVE">CVE</SelectOption></SelectList>
                  </Select>
                </ToolbarItem>
                <ToolbarItem>
                  <Select
                    isOpen={false}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} variant="plain" style={{ fontWeight: 600 }}>Name &#9662;</MenuToggle>
                    )}
                  >
                    <SelectList><SelectOption value="Name">Name</SelectOption></SelectList>
                  </Select>
                </ToolbarItem>
                <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
                  <SearchInput
                    placeholder="Filter results by Image CVE"
                    value={searchValue}
                    onChange={(_e, v) => setSearchValue(v)}
                    onClear={() => setSearchValue('')}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Select
                    isOpen={isSevOpen}
                    onOpenChange={setIsSevOpen}
                    selected={severityFilter}
                    onSelect={(_e, val) => { setSeverityFilter(val === severityFilter ? '' : val); setIsSevOpen(false); }}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsSevOpen(!isSevOpen)} isExpanded={isSevOpen}>
                        CVE severity {severityFilter && `(${severityFilter})`}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Critical">Critical</SelectOption>
                      <SelectOption value="Important">Important</SelectOption>
                      <SelectOption value="Moderate">Moderate</SelectOption>
                      <SelectOption value="Low">Low</SelectOption>
                    </SelectList>
                  </Select>
                </ToolbarItem>
                <ToolbarItem>
                  <Select
                    isOpen={isStatusOpen}
                    onOpenChange={setIsStatusOpen}
                    selected={statusFilter}
                    onSelect={(_e, val) => { setStatusFilter(val === statusFilter ? '' : val); setIsStatusOpen(false); }}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsStatusOpen(!isStatusOpen)} isExpanded={isStatusOpen}>
                        CVE status {statusFilter && `(${statusFilter})`}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Fixable">Fixable</SelectOption>
                      <SelectOption value="Not fixable">Not fixable</SelectOption>
                    </SelectList>
                  </Select>
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isActionsOpen}
                    onOpenChange={setIsActionsOpen}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsActionsOpen(!isActionsOpen)} isExpanded={isActionsOpen}>
                        Create report
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="create" onClick={() => navigate(routes.vulnerabilityReportsCreatePath)}>Create report</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            <Flex gap={{ default: 'gapMd' }} style={{ marginBottom: '24px' }}>
              <FlexItem>
                <Card isCompact isFlat>
                  <CardBody>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>CVEs by severity</div>
                    <Flex gap={{ default: 'gapLg' }}>
                      <FlexItem><span style={{ color: severityColors.CRITICAL }}><ExclamationCircleIcon /> {v.critical?.total || 0} Critical</span></FlexItem>
                      <FlexItem><span style={{ color: severityColors.IMPORTANT }}><ExclamationTriangleIcon /> {v.important?.total || 0} Important</span></FlexItem>
                      <FlexItem><span style={{ color: severityColors.MODERATE }}><InfoCircleIcon /> {v.moderate?.total || 0} Moderate</span></FlexItem>
                      <FlexItem><span style={{ color: severityColors.LOW }}>{v.low?.total || 0} Low</span></FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </FlexItem>
              <FlexItem>
                <Card isCompact isFlat>
                  <CardBody>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>CVEs by status</div>
                    <div><CheckCircleIcon style={{ color: 'var(--pf-t--global--color--status--success--default)' }} /> {fixableCount} vulnerabilities with available fixes</div>
                    <div style={{ marginTop: '4px' }}>— {notFixableCount} vulnerabilities without fixes</div>
                  </CardBody>
                </Card>
              </FlexItem>
            </Flex>

            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '8px' }}>
              <FlexItem><strong>{filteredCves.length} results found</strong></FlexItem>
              <FlexItem>
                <Pagination
                  itemCount={filteredCves.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_e, p) => setPage(p)}
                  onPerPageSelect={(_e, pp) => setPerPage(pp)}
                  isCompact
                />
              </FlexItem>
            </Flex>

            <Table aria-label="Deployment CVEs" variant="compact" isExpandable>
              <Thead>
                <Tr>
                  <Th />
                  <Th sort={{ columnIndex: 0 }}>CVE</Th>
                  <Th>Operating system</Th>
                  <Th sort={{ columnIndex: 2 }}>CVE severity</Th>
                  <Th>CVE status</Th>
                  <Th sort={{ columnIndex: 4 }}>EPSS probability</Th>
                  <Th>Affected components</Th>
                  <Th>First discovered</Th>
                  <Th>Published</Th>
                </Tr>
              </Thead>
              {filteredCves.slice((page - 1) * perPage, page * perPage).map((cve, rowIndex) => (
                <Tbody key={cve.id} isExpanded={isCveExpanded(cve.id)}>
                  <Tr isContentExpanded={isCveExpanded(cve.id)}>
                    <Td
                      expand={{
                        rowIndex,
                        isExpanded: isCveExpanded(cve.id),
                        onToggle: () => setCveExpanded(cve.id, !isCveExpanded(cve.id)),
                        expandId: `cve-expand-${cve.id}`,
                      }}
                    />
                    <Td><Button variant="link" isInline onClick={() => navigate(`${routes.cveDetailPath}/${cve.id}`)}>{cve.id}</Button></Td>
                    <Td>{cve.operatingSystem}</Td>
                    <Td>
                      <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                        {cve.severity === 'CRITICAL' && <ExclamationCircleIcon style={{ color: severityColors.CRITICAL }} />}
                        {cve.severity === 'IMPORTANT' && <ExclamationTriangleIcon style={{ color: severityColors.IMPORTANT }} />}
                        {cve.severity === 'MODERATE' && <InfoCircleIcon style={{ color: severityColors.MODERATE }} />}
                        <span>{cve.severity.charAt(0) + cve.severity.slice(1).toLowerCase()}</span>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                        {cve.cveStatus === 'Fixable' ? <CheckCircleIcon style={{ color: 'var(--pf-t--global--color--status--success--default)' }} /> : <span>—</span>}
                        <span>{cve.cveStatus}</span>
                      </Flex>
                    </Td>
                    <Td>{cve.epss}</Td>
                    <Td>{cve.affectedComponents}</Td>
                    <Td>{cve.firstDiscovered}</Td>
                    <Td>{cve.published}</Td>
                  </Tr>
                  <Tr isExpanded={isCveExpanded(cve.id)}>
                    <Td />
                    <Td colSpan={8}>
                      <ExpandableRowContent>
                        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
                          <span style={{ fontWeight: 600 }}>CVE:</span>
                          <span>{cve.id}</span>
                          <span style={{ fontWeight: 600 }}>Severity:</span>
                          <span>{cve.severity.charAt(0) + cve.severity.slice(1).toLowerCase()}</span>
                          <span style={{ fontWeight: 600 }}>CVSS:</span>
                          <span>{cve.cvss}</span>
                          <span style={{ fontWeight: 600 }}>EPSS probability:</span>
                          <span>{cve.epss}</span>
                          <span style={{ fontWeight: 600 }}>Status:</span>
                          <span>{cve.cveStatus}</span>
                          <span style={{ fontWeight: 600 }}>Affected component:</span>
                          <span>{cve.affectedComponents}</span>
                          <span style={{ fontWeight: 600 }}>Operating system:</span>
                          <span>{cve.operatingSystem}</span>
                          <span style={{ fontWeight: 600 }}>First discovered:</span>
                          <span>{cve.firstDiscovered}</span>
                          <span style={{ fontWeight: 600 }}>Published:</span>
                          <span>{cve.published}</span>
                        </div>
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                </Tbody>
              ))}
            </Table>
          </PageSection>
        </>
      )}

      {mainTab === 'details' && (
        <PageSection>
          <Card isFlat>
            <CardBody>
              <Title headingLevel="h3">Deployment details</Title>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', marginTop: '16px' }}>
                <span style={{ fontWeight: 600 }}>Name:</span><span>{deployment.name}</span>
                <span style={{ fontWeight: 600 }}>Namespace:</span><span>{deployment.namespace}</span>
                <span style={{ fontWeight: 600 }}>Cluster:</span><span>{cluster?.name || deployment.clusterName}</span>
                <span style={{ fontWeight: 600 }}>Replicas:</span><span>{deployment.replicas || '—'}</span>
                <span style={{ fontWeight: 600 }}>Created:</span><span>{createdDate}</span>
                <span style={{ fontWeight: 600 }}>State:</span><span>{deployment.inactive === true ? 'Inactive' : 'Active'}</span>
                <span style={{ fontWeight: 600 }}>Risk score:</span><span>{deployment.riskScore ?? 0}</span>
                <span style={{ fontWeight: 600 }}>Images:</span>
                <span>{(deployment.images || []).map((img) => img.name.fullName).join(', ') || '—'}</span>
                <span style={{ fontWeight: 600 }}>Labels:</span>
                <span>{Object.entries(deployment.labels || {}).map(([k, val]) => `${k}=${val}`).join(', ')}</span>
              </div>
            </CardBody>
          </Card>
        </PageSection>
      )}

      {mainTab === 'resources' && (
        <PageSection>
          <Card isFlat>
            <CardBody>
              <Title headingLevel="h3">Resources</Title>
              <Table aria-label="Deployment resources" variant="compact" style={{ marginTop: '16px' }}>
                <Thead>
                  <Tr>
                    <Th>Image</Th>
                    <Th>Tag</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(deployment.images || []).map((img) => (
                    <Tr key={img.id}>
                      <Td>{img.name.remote}</Td>
                      <Td>{img.name.tag}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </PageSection>
      )}
    </>
  );
}
