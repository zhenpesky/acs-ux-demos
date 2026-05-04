import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { prefixRoutes } from '../routes';
import { CVES, PLATFORM_CVES, NODE_CVES, deriveCveSeverity } from '../mockData';
import { useLiveSync } from '../api/hooks';

const severityColors = { Critical: 'red', Important: 'orange', Moderate: 'gold', Low: 'blue' };
const severityOrder = { Critical: 0, Important: 1, Moderate: 2, Low: 3 };

function workloadSeverityLabel(c) {
  const s = deriveCveSeverity(c);
  if (s === 'CRITICAL') return 'Critical';
  if (s === 'IMPORTANT') return 'Important';
  if (s === 'MODERATE') return 'Moderate';
  return 'Low';
}

function normalizeAllCves() {
  const workload = CVES.map((c) => ({
    cve: c.cve,
    summary: c.distroTuples?.[0]?.summary || '',
    severity: workloadSeverityLabel(c),
    cvss: c.topCVSS,
    source: 'Workload',
    fixable: 'No',
    affectedEntities: `— deployments, ${c.affectedImageCount} image${c.affectedImageCount !== 1 ? 's' : ''}`,
    firstDiscovered: new Date(c.firstDiscoveredInSystem || c.publishedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  const platform = PLATFORM_CVES.map((c) => ({
    cve: c.cve,
    summary: c.affectedComponents,
    severity: c.severity,
    cvss: c.cvss,
    source: 'Platform',
    fixable: c.fixedIn && c.fixedIn !== '—' ? 'Yes' : 'No',
    affectedEntities: c.affectedComponents,
    firstDiscovered: new Date(c.firstDiscovered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  const node = NODE_CVES.map((c) => ({
    cve: c.cve,
    summary: c.os,
    severity: c.severity,
    cvss: c.cvss,
    source: 'Virtual Machine',
    fixable: c.fixable,
    affectedEntities: `${c.affectedNodes} node${c.affectedNodes !== 1 ? 's' : ''}`,
    firstDiscovered: new Date(c.firstDiscovered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  return [...workload, ...platform, ...node].sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9));
}

export default function AllVulnerabilitiesPage({ routePrefix }) {
  useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [vulnState, setVulnState] = useState('OBSERVED');

  const [moreViewsOpen, setMoreViewsOpen] = useState(false);

  const allCves = useMemo(() => normalizeAllCves(), []);

  const stateFilteredCves = useMemo(() => {
    if (vulnState === 'OBSERVED') return allCves;
    if (vulnState === 'DEFERRED') return allCves.filter((_, i) => i % 3 === 0);
    return allCves.filter((_, i) => i % 5 === 0);
  }, [allCves, vulnState]);

  const filteredCves = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return stateFilteredCves;
    return stateFilteredCves.filter((c) =>
      [c.cve, c.severity, String(c.cvss), c.source, c.fixable, c.affectedEntities, c.firstDiscovered, c.summary].some((f) =>
        String(f).toLowerCase().includes(q)
      )
    );
  }, [searchValue, stateFilteredCves]);

  const paginatedCves = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredCves.slice(start, start + perPage);
  }, [filteredCves, page, perPage]);

  const sourceColors = { Workload: 'blue', Platform: 'purple', 'Virtual Machine': 'cyan' };

  return (
    <>
      <PageSection padding={{ default: 'noPadding' }} style={{ background: 'var(--pf-t--global--background--color--secondary--default)', paddingInline: '16px' }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
          <FlexItem>
            <Nav variant="horizontal-subnav" aria-label="Vulnerability management views">
              <NavList>
                <NavItem itemId="user-workloads" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesUserWorkloadsPath); }}>User Workloads</NavItem>
                <NavItem itemId="platform" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesPlatformPath); }}>Platform</NavItem>
                <NavItem itemId="nodes" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesNodePath); }}>Nodes</NavItem>
              </NavList>
            </Nav>
          </FlexItem>
          <FlexItem>
            <Dropdown isOpen={moreViewsOpen} onSelect={() => setMoreViewsOpen(false)} onOpenChange={setMoreViewsOpen}
              toggle={(toggleRef) => (<MenuToggle ref={toggleRef} onClick={() => setMoreViewsOpen(!moreViewsOpen)} isExpanded={moreViewsOpen} variant="plain" style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '20px', paddingInline: '16px', paddingBlock: '4px' }}>More Views</MenuToggle>)}>
              <DropdownList>
                <DropdownItem key="all-vulnerable" isDisabled description="Findings for user, platform, and inactive images simultaneously">All vulnerable images</DropdownItem>
                <DropdownItem key="inactive" onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath)} description="Findings for watched images and images not currently deployed as workloads based on your image retention settings">Inactive images</DropdownItem>
                <DropdownItem key="no-cves" onClick={() => navigate(routes.vulnerabilitiesUserWorkloadsPath)} description="Images and workloads without observed CVEs">Images without CVEs</DropdownItem>
                <DropdownItem key="k8s" onClick={() => navigate(routes.vulnerabilitiesPlatformPath)} description="Vulnerabilities affecting the underlying Kubernetes infrastructure">Kubernetes components</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection>
        <Title headingLevel="h1">All Vulnerabilities</Title>
        <Content component="p">All vulnerabilities across workloads, platform components, and virtual machines</Content>
      </PageSection>

      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs activeKey={vulnState} onSelect={(_e, k) => { setVulnState(k); setPage(1); }} style={{ paddingInline: '24px' }}>
          <Tab eventKey="OBSERVED" title={<TabTitleText>Observed ({vulnState === 'OBSERVED' ? filteredCves.length : ''})</TabTitleText>} />
          <Tab eventKey="DEFERRED" title={<TabTitleText>Excepted</TabTitleText>} />
          <Tab eventKey="UNDETERMINED" title={<TabTitleText>Undetermined</TabTitleText>} />
        </Tabs>
      </PageSection>
      <Divider />

      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput
                placeholder="Filter all vulnerabilities"
                value={searchValue}
                onChange={(_e, v) => { setSearchValue(v); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredCves.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="All Vulnerabilities" variant="compact">
          <Thead>
            <Tr>
              <Th>CVE</Th>
              <Th>Severity</Th>
              <Th>CVSS</Th>
              <Th>Source</Th>
              <Th>Fixable</Th>
              <Th>Affected entities</Th>
              <Th>First discovered</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedCves.map((c, i) => (
              <Tr key={i}>
                <Td>
                  <Button variant="link" isInline onClick={() => navigate(`${routes.cveDetailPath}/${c.cve}`)}>
                    {c.cve}
                  </Button>
                </Td>
                <Td><Label isCompact color={severityColors[c.severity]}>{c.severity}</Label></Td>
                <Td>{c.cvss}</Td>
                <Td><Label isCompact color={sourceColors[c.source]}>{c.source}</Label></Td>
                <Td>{c.fixable === 'Yes' ? <Label isCompact color="green">Yes</Label> : <Label isCompact color="grey">No</Label>}</Td>
                <Td>{c.affectedEntities}</Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{c.firstDiscovered}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
}
