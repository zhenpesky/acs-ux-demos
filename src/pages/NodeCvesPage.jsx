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
import { NODE_CVES } from '../mockData';
import { useLiveSync } from '../api/hooks';

const severityColors = { Critical: 'red', Important: 'orange', Moderate: 'gold', Low: 'blue' };

export default function NodeCvesPage({ routePrefix }) {
  useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [vulnState, setVulnState] = useState('OBSERVED');

  const [moreViewsOpen, setMoreViewsOpen] = useState(false);

  const allCves = useMemo(() => NODE_CVES.map((c) => ({
    cve: c.cve,
    severity: c.severity,
    cvss: c.cvss,
    affectedNodes: c.affectedNodes,
    fixable: c.fixable === 'Yes',
    os: c.os,
    firstDiscovered: new Date(c.firstDiscovered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  })), []);

  const stateFilteredCves = useMemo(() => {
    if (vulnState === 'OBSERVED') return allCves;
    if (vulnState === 'DEFERRED') return allCves.filter((_, i) => i % 3 === 0);
    return allCves.filter((_, i) => i % 5 === 0);
  }, [allCves, vulnState]);

  const filteredCves = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return stateFilteredCves;
    return stateFilteredCves.filter((c) =>
      [c.cve, c.severity, String(c.cvss), String(c.affectedNodes), c.os, c.firstDiscovered].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [searchValue, stateFilteredCves]);

  const paginatedCves = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredCves.slice(start, start + perPage);
  }, [filteredCves, page, perPage]);

  return (
    <>
      <PageSection padding={{ default: 'noPadding' }} style={{ background: 'var(--pf-t--global--background--color--secondary--default)', paddingInline: '16px' }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
          <FlexItem>
            <Nav variant="horizontal-subnav" aria-label="Vulnerability management views">
              <NavList>
                <NavItem itemId="user-workloads" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesUserWorkloadsPath); }}>User Workloads</NavItem>
                <NavItem itemId="platform" onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilitiesPlatformPath); }}>Platform</NavItem>
                <NavItem isActive itemId="nodes" onClick={(e) => e.preventDefault()}>Nodes</NavItem>
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

      <PageSection>
        <Title headingLevel="h1">Node CVEs</Title>
        <Content component="p">Vulnerabilities affecting nodes and their operating systems</Content>
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
                placeholder="Filter node CVEs"
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
        <Table aria-label="Node CVEs" variant="compact">
          <Thead>
            <Tr>
              <Th>CVE</Th>
              <Th>Severity</Th>
              <Th>CVSS</Th>
              <Th>Affected nodes</Th>
              <Th>Fixable</Th>
              <Th>Operating system</Th>
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
                <Td>{c.affectedNodes}</Td>
                <Td>{c.fixable ? <Label isCompact color="green">Yes</Label> : <Label isCompact color="grey">No</Label>}</Td>
                <Td>{c.os}</Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{c.firstDiscovered}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
}
